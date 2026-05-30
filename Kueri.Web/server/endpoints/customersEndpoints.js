import xmlrpc from 'xmlrpc';

const toValue = (...keys) => keys.map((key) => process.env[key]).find(Boolean);

function getConfig() {
  return {
    prestashop: {
      baseUrl: toValue('PRESTASHOP_BASE_URL'),
      apiKey: toValue('PRESTASHOP_API_KEY', 'VITE_PRESTASHOP_API_KEY'),
      languageId: Number(toValue('PRESTASHOP_LANGUAGE_ID') || 1),
    },
    wordpress: {
      baseUrl: toValue('WORDPRESS_BASE_URL'),
      username: toValue('WORDPRESS_USERNAME'),
      appPassword: toValue('WORDPRESS_APP_PASSWORD'),
      consumerKey: toValue('WORDPRESS_CLIENT_KEY'),
      consumerSecret: toValue('WORDPRESS_CLIENT_SECRET'),
    },
    odoo: {
      baseUrl: toValue('ODOO_BASE_URL'),
      apiKey: toValue('ODOO_PASSWORD', 'ODOO_API_KEY', 'VITE_ODOO_API_KEY'),
      db: toValue('ODOO_DB'),
      username: toValue('ODOO_USERNAME', 'ODOO_LOGIN'),
    },
  };
}

const localCustomers = [];
let sequenceId = 100;

function normalizeCustomer(input, fallbackId = undefined) {
  return {
    id: Number(input.id || fallbackId || Date.now()),
    nombre: String(input.nombre || input.name || input.first_name || '').trim(),
    email: String(input.email || '').trim(),
    telefono: String(input.telefono || input.phone || '').trim(),
    direccion: String(input.direccion || input.street || input.address_1 || '').trim(),
    ciudad: String(input.ciudad || input.city || '').trim(),
    fecha_registro: input.fecha_registro || new Date().toISOString(),
  };
}

async function safeJson(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const payload = await safeJson(response);

  if (!response.ok) {
    const details = typeof payload === 'object' ? JSON.stringify(payload) : String(payload);
    throw new Error(`HTTP ${response.status}: ${details}`);
  }

  return payload;
}

function createXmlRpcClient(url) {
  return xmlrpc.createClient({ url });
}

function xmlRpcMethodCall(client, method, params) {
  return new Promise((resolve, reject) => {
    client.methodCall(method, params, (error, value) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(value);
    });
  });
}

function odooHasXmlRpcConfig(config) {
  return Boolean(config.odoo.baseUrl && config.odoo.apiKey && config.odoo.db && config.odoo.username);
}

async function odooAuthenticate(config) {
  const base = config.odoo.baseUrl.replace(/\/$/, '');
  const commonClient = createXmlRpcClient(`${base}/xmlrpc/2/common`);

  const uid = await xmlRpcMethodCall(commonClient, 'authenticate', [
    config.odoo.db,
    config.odoo.username,
    config.odoo.apiKey,
    {},
  ]);

  if (!uid) {
    throw new Error('Odoo XML-RPC autenticacion fallida.');
  }

  return uid;
}

function xmlEscape(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function splitName(fullName) {
  const parts = String(fullName || '').trim().split(/\s+/);
  return {
    firstName: parts[0] || 'Cliente',
    lastName: parts.slice(1).join(' ') || '-',
  };
}

// ── WordPress (WooCommerce) ──────────────────────────────────────────────────

async function listWordpressCustomers() {
  const config = getConfig();
  const { baseUrl, username, appPassword, consumerKey, consumerSecret } = config.wordpress;
  if (!baseUrl) return [];

  let endpoint = `${baseUrl.replace(/\/$/, '')}/wp-json/wc/v3/customers?per_page=100`;
  const headers = {};

  if (username && appPassword) {
    headers.Authorization = `Basic ${Buffer.from(`${username}:${appPassword}`).toString('base64')}`;
  } else if (consumerKey && consumerSecret) {
    endpoint += `&consumer_key=${encodeURIComponent(consumerKey)}&consumer_secret=${encodeURIComponent(consumerSecret)}`;
  } else {
    return [];
  }

  const data = await requestJson(endpoint, { headers });
  return (Array.isArray(data) ? data : []).map((item) =>
    normalizeCustomer({
      id: item.id,
      nombre: `${item.first_name} ${item.last_name}`.trim(),
      email: item.email,
      telefono: item.billing?.phone,
      direccion: item.billing?.address_1,
      fecha_registro: item.date_created,
    })
  );
}

async function createWordpressCustomer(customer) {
  const config = getConfig();
  const { baseUrl, username, appPassword, consumerKey, consumerSecret } = config.wordpress;
  if (!baseUrl) return null;

  const { firstName, lastName } = splitName(customer.nombre);
  const endpoint = `${baseUrl.replace(/\/$/, '')}/wp-json/wc/v3/customers`;
  const payload = {
    email: customer.email,
    first_name: firstName,
    last_name: lastName,
    billing: {
      first_name: firstName,
      last_name: lastName,
      email: customer.email,
      phone: customer.telefono,
      address_1: customer.direccion,
    },
    shipping: {
      first_name: firstName,
      last_name: lastName,
      address_1: customer.direccion,
    },
  };

  const headers = { 'Content-Type': 'application/json' };
  let url = endpoint;

  if (username && appPassword) {
    headers.Authorization = `Basic ${Buffer.from(`${username}:${appPassword}`).toString('base64')}`;
  } else if (consumerKey && consumerSecret) {
    url = `${endpoint}?consumer_key=${encodeURIComponent(consumerKey)}&consumer_secret=${encodeURIComponent(consumerSecret)}`;
  } else {
    return null;
  }

  return requestJson(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
}

// ── Odoo ─────────────────────────────────────────────────────────────────────

async function listOdooCustomers() {
  const config = getConfig();
  const { baseUrl, apiKey } = config.odoo;
  if (!baseUrl || !apiKey || !odooHasXmlRpcConfig(config)) return [];

  const base = baseUrl.replace(/\/$/, '');
  const uid = await odooAuthenticate(config);
  const objectClient = createXmlRpcClient(`${base}/xmlrpc/2/object`);

  const records = await xmlRpcMethodCall(objectClient, 'execute_kw', [
    config.odoo.db,
    uid,
    config.odoo.apiKey,
    'res.partner',
    'search_read',
    [[['customer_rank', '>', 0]]],
    {
      fields: ['id', 'name', 'email', 'phone', 'street', 'city', 'create_date'],
      limit: 200,
    },
  ]);

  return (Array.isArray(records) ? records : []).map((item) =>
    normalizeCustomer({
      id: item.id,
      nombre: item.name,
      email: item.email,
      telefono: item.phone,
      direccion: item.street,
      ciudad: item.city,
      fecha_registro: item.create_date,
    })
  );
}

async function createOdooCustomer(customer) {
  const config = getConfig();
  const { baseUrl, apiKey } = config.odoo;
  if (!baseUrl || !apiKey || !odooHasXmlRpcConfig(config)) return null;

  const base = baseUrl.replace(/\/$/, '');
  const uid = await odooAuthenticate(config);
  const objectClient = createXmlRpcClient(`${base}/xmlrpc/2/object`);

  return xmlRpcMethodCall(objectClient, 'execute_kw', [
    config.odoo.db,
    uid,
    config.odoo.apiKey,
    'res.partner',
    'create',
    [
      {
        name: customer.nombre,
        email: customer.email,
        phone: customer.telefono,
        street: customer.direccion,
        city: customer.ciudad,
        customer_rank: 1,
      },
    ],
  ]);
}

// ── PrestaShop ───────────────────────────────────────────────────────────────

function buildPrestashopCustomerXml(customer, langId) {
  const { firstName, lastName } = splitName(customer.nombre);
  return `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
  <customer>
    <id_default_group><![CDATA[3]]></id_default_group>
    <id_lang><![CDATA[${langId}]]></id_lang>
    <firstname><![CDATA[${xmlEscape(firstName)}]]></firstname>
    <lastname><![CDATA[${xmlEscape(lastName)}]]></lastname>
    <email><![CDATA[${xmlEscape(customer.email)}]]></email>
    <passwd><![CDATA[password123]]></passwd>
    <active><![CDATA[1]]></active>
  </customer>
</prestashop>`;
}

async function listPrestashopCustomers() {
  const config = getConfig();
  const { baseUrl, apiKey } = config.prestashop;
  if (!baseUrl || !apiKey) return [];

  const endpoint = `${baseUrl.replace(/\/$/, '')}/api/customers?output_format=JSON&display=full`;
  const auth = `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;
  
  try {
    const data = await requestJson(endpoint, { headers: { Authorization: auth } });
    const customers = Array.isArray(data?.customers) ? data.customers : [];
    return customers.map((item) =>
      normalizeCustomer({
        id: item.id,
        nombre: `${item.firstname} ${item.lastname}`.trim(),
        email: item.email,
        fecha_registro: item.date_add,
      })
    );
  } catch {
    return [];
  }
}

async function createPrestashopCustomer(customer) {
  const config = getConfig();
  const { baseUrl, apiKey, languageId } = config.prestashop;
  if (!baseUrl || !apiKey) return null;

  const endpoint = `${baseUrl.replace(/\/$/, '')}/api/customers`;
  const auth = `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;

  return requestJson(endpoint, {
    method: 'POST',
    headers: {
      Authorization: auth,
      'Content-Type': 'application/xml',
    },
    body: buildPrestashopCustomerXml(customer, languageId),
  });
}

// ── Merge & Register ─────────────────────────────────────────────────────────

function mergeByEmail(groups) {
  const merged = new Map();

  for (const group of groups) {
    for (const item of group) {
      if (!item.email) continue;
      const key = item.email.toLowerCase();
      if (!merged.has(key)) {
        merged.set(key, item);
      }
    }
  }

  return [...merged.values()];
}

export function registerCustomersEndpoints(app) {
  app.get('/clientes', async (_req, res) => {
    const settled = await Promise.allSettled([
      listWordpressCustomers(),
      listOdooCustomers(),
      listPrestashopCustomers(),
    ]);

    const externalGroups = settled
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value);

    const merged = mergeByEmail([localCustomers, ...externalGroups]);
    res.json(merged);
  });

  app.post('/clientes', async (req, res) => {
    const { nombre, email, telefono, direccion } = req.body;

    if (!nombre || !email) {
      res.status(400).json({ error: 'Nombre y email son obligatorios.' });
      return;
    }

    const customer = normalizeCustomer({ nombre, email, telefono, direccion }, sequenceId++);
    localCustomers.unshift(customer);

    const results = await Promise.allSettled([
      createWordpressCustomer(customer),
      createOdooCustomer(customer),
      createPrestashopCustomer(customer),
    ]);

    const sync = {
      wordpress: results[0].status === 'fulfilled' ? { ok: true } : { ok: false },
      odoo: results[1].status === 'fulfilled' ? { ok: true } : { ok: false },
      prestashop: results[2].status === 'fulfilled' ? { ok: true } : { ok: false },
    };

    res.status(201).json({ ...customer, sync });
  });

  app.get('/clientes/:id', (req, res) => {
    const id = Number(req.params.id);
    const found = localCustomers.find((c) => c.id === id);
    if (!found) {
      res.status(404).json({ error: 'Cliente no encontrado localmente.' });
      return;
    }
    res.json(found);
  });
}
