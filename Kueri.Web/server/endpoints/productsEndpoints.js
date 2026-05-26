import xmlrpc from 'xmlrpc';

const toValue = (...keys) => keys.map((key) => process.env[key]).find(Boolean);

function getConfig() {
  return {
    prestashop: {
      baseUrl: toValue('PRESTASHOP_BASE_URL'),
      apiKey: toValue('PRESTASHOP_API_KEY', 'VITE_PRESTASHOP_API_KEY'),
      languageId: Number(toValue('PRESTASHOP_LANGUAGE_ID') || 1),
      defaultCategoryId: Number(toValue('PRESTASHOP_DEFAULT_CATEGORY_ID') || 2),
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
      productsPath: toValue('ODOO_PRODUCTS_PATH') || '/api/products',
    },
  };
}

const localProducts = [];
let sequenceId = Number(process.env.LOCAL_PRODUCT_START_ID || 1000000);

const defaultCategory = 'Cinturones';

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeProduct(input, fallbackId = undefined) {
  return {
    id: toNumber(input.id, fallbackId ?? Date.now()),
    nombre: String(input.nombre || input.name || '').trim(),
    descripcion: String(input.descripcion || input.description || '').trim(),
    imagen_url: String(input.imagen_url || input.image_url || input.imageUrl || '').trim(),
    precio: toNumber(input.precio ?? input.price),
    sku: String(input.sku || '').trim(),
    stock: toNumber(input.stock ?? input.stock_quantity),
    categoria: String(input.categoria || defaultCategory),
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
    throw new Error('Odoo XML-RPC autenticacion fallida. Verifica ODOO_DB, ODOO_USERNAME y ODOO_API_KEY.');
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

function buildPrestashopProductXml(product, config) {
  const name = xmlEscape(product.nombre);
  const description = xmlEscape(product.descripcion || product.nombre);
  const sku = xmlEscape(product.sku || `SKU-${Date.now()}`);
  const price = xmlEscape(product.precio.toFixed(2));

  return `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
  <product>
    <id_manufacturer><![CDATA[0]]></id_manufacturer>
    <id_supplier><![CDATA[0]]></id_supplier>
    <id_category_default><![CDATA[${config.prestashop.defaultCategoryId}]]></id_category_default>
    <new><![CDATA[1]]></new>
    <cache_default_attribute><![CDATA[0]]></cache_default_attribute>
    <id_default_image notFilterable="true"></id_default_image>
    <id_default_combination notFilterable="true"></id_default_combination>
    <position_in_category notFilterable="true"><![CDATA[1]]></position_in_category>
    <type><![CDATA[standard]]></type>
    <id_shop_default><![CDATA[1]]></id_shop_default>
    <reference><![CDATA[${sku}]]></reference>
    <supplier_reference><![CDATA[]]></supplier_reference>
    <location><![CDATA[]]></location>
    <ean13><![CDATA[]]></ean13>
    <isbn><![CDATA[]]></isbn>
    <upc><![CDATA[]]></upc>
    <mpn><![CDATA[]]></mpn>
    <minimal_quantity><![CDATA[1]]></minimal_quantity>
    <low_stock_threshold></low_stock_threshold>
    <low_stock_alert><![CDATA[0]]></low_stock_alert>
    <price><![CDATA[${price}]]></price>
    <wholesale_price><![CDATA[0]]></wholesale_price>
    <unity><![CDATA[]]></unity>
    <unit_price_ratio><![CDATA[0.000000]]></unit_price_ratio>
    <additional_shipping_cost><![CDATA[0]]></additional_shipping_cost>
    <customizable><![CDATA[0]]></customizable>
    <text_fields><![CDATA[0]]></text_fields>
    <uploadable_files><![CDATA[0]]></uploadable_files>
    <active><![CDATA[1]]></active>
    <redirect_type><![CDATA[404]]></redirect_type>
    <id_type_redirected><![CDATA[0]]></id_type_redirected>
    <available_for_order><![CDATA[1]]></available_for_order>
    <available_date><![CDATA[]]></available_date>
    <show_condition><![CDATA[0]]></show_condition>
    <condition><![CDATA[new]]></condition>
    <show_price><![CDATA[1]]></show_price>
    <indexed><![CDATA[1]]></indexed>
    <visibility><![CDATA[both]]></visibility>
    <advanced_stock_management><![CDATA[0]]></advanced_stock_management>
    <date_add><![CDATA[${new Date().toISOString().slice(0, 19).replace('T', ' ')}]]></date_add>
    <date_upd><![CDATA[${new Date().toISOString().slice(0, 19).replace('T', ' ')}]]></date_upd>
    <pack_stock_type><![CDATA[3]]></pack_stock_type>
    <state><![CDATA[1]]></state>
    <product_type><![CDATA[standard]]></product_type>
    <name>
      <language id="${config.prestashop.languageId}"><![CDATA[${name}]]></language>
    </name>
    <description>
      <language id="${config.prestashop.languageId}"><![CDATA[${description}]]></language>
    </description>
    <description_short>
      <language id="${config.prestashop.languageId}"><![CDATA[${description.slice(0, 250)}]]></language>
    </description_short>
    <link_rewrite>
      <language id="${config.prestashop.languageId}"><![CDATA[${name.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replaceAll(/^-|-$/g, '') || 'producto'}]]></language>
    </link_rewrite>
    <meta_description>
      <language id="${config.prestashop.languageId}"><![CDATA[${description.slice(0, 250)}]]></language>
    </meta_description>
    <meta_keywords>
      <language id="${config.prestashop.languageId}"><![CDATA[${name}]]></language>
    </meta_keywords>
    <meta_title>
      <language id="${config.prestashop.languageId}"><![CDATA[${name}]]></language>
    </meta_title>
    <available_now>
      <language id="${config.prestashop.languageId}"><![CDATA[En stock]]></language>
    </available_now>
    <available_later>
      <language id="${config.prestashop.languageId}"><![CDATA[]]></language>
    </available_later>
    <associations>
      <categories>
        <category>
          <id><![CDATA[${config.prestashop.defaultCategoryId}]]></id>
        </category>
      </categories>
    </associations>
  </product>
</prestashop>`;
}

async function listWordpressProducts() {
  const config = getConfig();
  const { baseUrl, username, appPassword, consumerKey, consumerSecret } = config.wordpress;
  if (!baseUrl) {
    throw new Error('WordPress no esta configurado.');
  }

  const endpoint = `${baseUrl.replace(/\/$/, '')}/wp-json/wc/v3/products?per_page=100`;
  const headers = {};

  if (username && appPassword) {
    headers.Authorization = `Basic ${Buffer.from(`${username}:${appPassword}`).toString('base64')}`;
  } else if (consumerKey && consumerSecret) {
    const url = `${endpoint}&consumer_key=${encodeURIComponent(consumerKey)}&consumer_secret=${encodeURIComponent(consumerSecret)}`;
    const data = await requestJson(url);
    return (Array.isArray(data) ? data : []).map((item) =>
      normalizeProduct(
        {
          id: item.id,
          nombre: item.name,
          descripcion: item.description,
          imagen_url: item?.images?.[0]?.src,
          precio: item.regular_price || item.price,
          sku: item.sku,
          stock: item.stock_quantity,
        },
        item.id,
      ),
    );
  } else {
    throw new Error('WordPress no esta configurado.');
  }

  const data = await requestJson(endpoint, { headers });

  return (Array.isArray(data) ? data : []).map((item) =>
    normalizeProduct(
      {
        id: item.id,
        nombre: item.name,
        descripcion: item.description,
        imagen_url: item?.images?.[0]?.src,
        precio: item.regular_price || item.price,
        sku: item.sku,
        stock: item.stock_quantity,
      },
      item.id,
    ),
  );
}

async function createWordpressProduct(product) {
  const config = getConfig();
  const { baseUrl, username, appPassword, consumerKey, consumerSecret } = config.wordpress;
  if (!baseUrl) {
    throw new Error('WordPress no esta configurado.');
  }

  const endpoint = `${baseUrl.replace(/\/$/, '')}/wp-json/wc/v3/products`;
  const payload = {
    name: product.nombre,
    type: 'simple',
    regular_price: product.precio.toFixed(2),
    description: product.descripcion,
    sku: product.sku || undefined,
    manage_stock: true,
    stock_quantity: Math.max(0, Math.floor(product.stock)),
  };

  const headers = { 'Content-Type': 'application/json' };
  let url = endpoint;

  if (username && appPassword) {
    headers.Authorization = `Basic ${Buffer.from(`${username}:${appPassword}`).toString('base64')}`;
  } else if (consumerKey && consumerSecret) {
    url = `${endpoint}?consumer_key=${encodeURIComponent(consumerKey)}&consumer_secret=${encodeURIComponent(consumerSecret)}`;
  } else {
    throw new Error('WordPress no esta configurado.');
  }

  const created = await requestJson(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  return { id: created.id, source: 'wordpress' };
}

async function deleteWordpressProduct(id) {
  const config = getConfig();
  const { baseUrl, username, appPassword, consumerKey, consumerSecret } = config.wordpress;
  if (!baseUrl) {
    throw new Error('WordPress no esta configurado.');
  }

  const endpoint = `${baseUrl.replace(/\/$/, '')}/wp-json/wc/v3/products/${id}?force=true`;
  const headers = {};
  let url = endpoint;

  if (username && appPassword) {
    headers.Authorization = `Basic ${Buffer.from(`${username}:${appPassword}`).toString('base64')}`;
  } else if (consumerKey && consumerSecret) {
    url = `${endpoint}&consumer_key=${encodeURIComponent(consumerKey)}&consumer_secret=${encodeURIComponent(consumerSecret)}`;
  } else {
    throw new Error('WordPress no esta configurado.');
  }

  const deleted = await requestJson(url, { method: 'DELETE', headers });
  return { id: deleted?.id ?? id, source: 'wordpress' };
}

async function listPrestashopProducts() {
  const config = getConfig();
  const { baseUrl, apiKey } = config.prestashop;
  if (!baseUrl || !apiKey) {
    throw new Error('PrestaShop no esta configurado.');
  }

  const endpoint = `${baseUrl.replace(/\/$/, '')}/api/products?output_format=JSON&display=full`;
  const basicAuth = `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;
  const data = await requestJson(endpoint, {
    headers: { Authorization: basicAuth },
  });

  const products = Array.isArray(data?.products) ? data.products : [];
  return products.map((item) => {
    const name = Array.isArray(item.name) ? item.name[0]?.value : item.name;
    const description = Array.isArray(item.description_short)
      ? item.description_short[0]?.value
      : item.description_short;

    return normalizeProduct(
      {
        id: item.id,
        nombre: name,
        descripcion: description,
        precio: item.price,
        sku: item.reference,
      },
      item.id,
    );
  });
}

async function createPrestashopProduct(product) {
  const config = getConfig();
  const { baseUrl, apiKey } = config.prestashop;
  if (!baseUrl || !apiKey) {
    throw new Error('PrestaShop no esta configurado.');
  }

  const endpoint = `${baseUrl.replace(/\/$/, '')}/api/products`;
  const basicAuth = `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;

  const created = await requestJson(endpoint, {
    method: 'POST',
    headers: {
      Authorization: basicAuth,
      'Content-Type': 'application/xml',
    },
    body: buildPrestashopProductXml(product, config),
  });

  return { id: created?.product?.id || null, source: 'prestashop' };
}

async function deletePrestashopProduct(id) {
  const config = getConfig();
  const { baseUrl, apiKey } = config.prestashop;
  if (!baseUrl || !apiKey) {
    throw new Error('PrestaShop no esta configurado.');
  }

  const endpoint = `${baseUrl.replace(/\/$/, '')}/api/products/${id}`;
  const basicAuth = `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;

  await requestJson(endpoint, {
    method: 'DELETE',
    headers: { Authorization: basicAuth },
  });

  return { id, source: 'prestashop' };
}

async function listOdooProducts() {
  const config = getConfig();
  const { baseUrl, apiKey, productsPath } = config.odoo;
  if (!baseUrl || !apiKey) {
    throw new Error('Odoo no esta configurado.');
  }

  if (odooHasXmlRpcConfig(config)) {
    const base = baseUrl.replace(/\/$/, '');
    const uid = await odooAuthenticate(config);
    const objectClient = createXmlRpcClient(`${base}/xmlrpc/2/object`);

    const records = await xmlRpcMethodCall(objectClient, 'execute_kw', [
      config.odoo.db,
      uid,
      config.odoo.apiKey,
      'product.template',
      'search_read',
      [[]],
      {
        fields: ['id', 'name', 'description_sale', 'list_price', 'default_code'],
        limit: 200,
      },
    ]);

    return (Array.isArray(records) ? records : []).map((item) =>
      normalizeProduct(
        {
          id: item.id,
          nombre: item.name,
          descripcion: item.description_sale,
          precio: item.list_price,
          sku: item.default_code,
          stock: 0,
        },
        item.id,
      ),
    );
  }

  const endpoint = `${baseUrl.replace(/\/$/, '')}${productsPath}`;
  const data = await requestJson(endpoint, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  const products = Array.isArray(data) ? data : data?.data;
  return (Array.isArray(products) ? products : []).map((item) => normalizeProduct(item));
}

async function createOdooProduct(product) {
  const config = getConfig();
  const { baseUrl, apiKey, productsPath } = config.odoo;
  if (!baseUrl || !apiKey) {
    throw new Error('Odoo no esta configurado.');
  }

  if (odooHasXmlRpcConfig(config)) {
    const base = baseUrl.replace(/\/$/, '');
    const uid = await odooAuthenticate(config);
    const objectClient = createXmlRpcClient(`${base}/xmlrpc/2/object`);

    const productId = await xmlRpcMethodCall(objectClient, 'execute_kw', [
      config.odoo.db,
      uid,
      config.odoo.apiKey,
      'product.template',
      'create',
      [
        {
          name: product.nombre,
          default_code: product.sku || undefined,
          list_price: product.precio,
          description_sale: product.descripcion,
          detailed_type: 'consu',
        },
      ],
    ]);

    return { id: productId ?? null, source: 'odoo' };
  }

  const endpoint = `${baseUrl.replace(/\/$/, '')}${productsPath}`;
  const created = await requestJson(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });

  return { id: created?.id ?? created?.data?.id ?? null, source: 'odoo' };
}

async function deleteOdooProduct(id) {
  const config = getConfig();
  const { baseUrl, apiKey, productsPath } = config.odoo;
  if (!baseUrl || !apiKey) {
    throw new Error('Odoo no esta configurado.');
  }

  if (odooHasXmlRpcConfig(config)) {
    const base = baseUrl.replace(/\/$/, '');
    const uid = await odooAuthenticate(config);
    const objectClient = createXmlRpcClient(`${base}/xmlrpc/2/object`);

    try {
      await xmlRpcMethodCall(objectClient, 'execute_kw', [
        config.odoo.db,
        uid,
        config.odoo.apiKey,
        'product.template',
        'unlink',
        [[id]],
      ]);

      return { id, source: 'odoo' };
    } catch {
      await xmlRpcMethodCall(objectClient, 'execute_kw', [
        config.odoo.db,
        uid,
        config.odoo.apiKey,
        'product.template',
        'write',
        [[id], { active: false }],
      ]);

      return { id, source: 'odoo', archived: true };
    }
  }

  const endpoint = `${baseUrl.replace(/\/$/, '')}${productsPath}/${id}`;
  await requestJson(endpoint, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  return { id, source: 'odoo' };
}

function mergeBySkuOrName(groups) {
  const merged = new Map();

  for (const group of groups) {
    for (const item of group) {
      const key = (item.sku || item.nombre || String(item.id)).toLowerCase();
      if (!merged.has(key)) {
        merged.set(key, item);
      }
    }
  }

  return [...merged.values()];
}

function normalizeIdentityValue(value) {
  return String(value || '').trim().toLowerCase();
}

function matchesIdentity(item, identity) {
  const itemId = Number(item.id);
  const itemSku = normalizeIdentityValue(item.sku);
  const itemName = normalizeIdentityValue(item.nombre);

  if (identity.sku && itemSku === identity.sku) return true;
  if (identity.nombre && itemName === identity.nombre) return true;
  return Number.isFinite(itemId) && itemId === identity.id;
}

async function deleteProductsByIdentity(listFn, deleteFn, identity) {
  const items = await listFn();
  const matchedIds = [...new Set(
    items
      .filter((item) => matchesIdentity(item, identity))
      .map((item) => Number(item.id))
      .filter((itemId) => Number.isFinite(itemId)),
  )];

  if (matchedIds.length === 0 && Number.isFinite(identity.id)) {
    matchedIds.push(identity.id);
  }

  const settled = await Promise.allSettled(matchedIds.map((targetId) => deleteFn(targetId)));

  return {
    deletedIds: settled
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value.id),
    errors: settled
      .filter((result) => result.status === 'rejected')
      .map((result) => (result.reason instanceof Error ? result.reason.message : 'Error')),
  };
}

export function registerProductsEndpoints(app) {
  app.get('/productos', async (_req, res) => {
    const settled = await Promise.allSettled([
      listPrestashopProducts(),
      listWordpressProducts(),
      listOdooProducts(), 

    ]);

    const externalGroups = settled
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value);

    const merged = mergeBySkuOrName([localProducts, ...externalGroups]);
    res.json(merged);
  });

  app.get('/productos/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      res.status(400).json({ error: 'Id invalido.' });
      return;
    }

    const local = localProducts.find((item) => item.id === id);
    if (local) {
      res.json(local);
      return;
    }

    const settled = await Promise.allSettled([
      listPrestashopProducts(),
      listWordpressProducts(),
      listOdooProducts(),
    ]);

    const external = settled
      .filter((result) => result.status === 'fulfilled')
      .flatMap((result) => result.value);

    const found = external.find((item) => item.id === id);

    if (!found) {
      res.status(404).json({ error: 'Producto no encontrado.' });
      return;
    }

    res.json(found);
  });

  app.post('/productos', async (req, res) => {
    const newId = sequenceId++;
    const parsed = normalizeProduct(req.body, newId);

    if (!parsed.nombre || !parsed.descripcion || !parsed.imagen_url) {
      res.status(400).json({ error: 'nombre, descripcion e imagen_url son obligatorios.' });
      return;
    }

    const local = { ...parsed, id: newId };
    localProducts.unshift(local);

    const results = await Promise.allSettled([
      createPrestashopProduct(local),
      createWordpressProduct(local),
      createOdooProduct(local),
    ]);

    const sync = {
      prestashop:
        results[0].status === 'fulfilled'
          ? { ok: true, id: results[0].value.id }
          : { ok: false, error: results[0].reason instanceof Error ? results[0].reason.message : 'Error' },
      wordpress:
        results[1].status === 'fulfilled'
          ? { ok: true, id: results[1].value.id }
          : { ok: false, error: results[1].reason instanceof Error ? results[1].reason.message : 'Error' },
      odoo:
        results[2].status === 'fulfilled'
          ? { ok: true, id: results[2].value.id }
          : { ok: false, error: results[2].reason instanceof Error ? results[2].reason.message : 'Error' },
    };

    res.status(201).json({ ...local, sync });
  });

  app.put('/productos/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = localProducts.findIndex((item) => item.id === id);

    if (index === -1) {
      res.status(404).json({ error: 'Solo se pueden editar productos creados localmente en esta version.' });
      return;
    }

    const updated = { ...localProducts[index], ...normalizeProduct(req.body, id), id };
    localProducts[index] = updated;
    res.json(updated);
  });

  app.delete('/productos/:id', async (req, res) => {
    const id = Number(req.params.id);
    const identity = {
      id,
      sku: normalizeIdentityValue(req.query.sku),
      nombre: normalizeIdentityValue(req.query.nombre),
    };

    if (!Number.isFinite(id)) {
      res.status(400).json({ error: 'Id invalido.' });
      return;
    }

    const localBefore = localProducts.length;
    const remaining = localProducts.filter((item) => !matchesIdentity(item, identity));
    localProducts.length = 0;
    localProducts.push(...remaining);
    const localDeleted = localBefore - localProducts.length;

    const results = await Promise.allSettled([
      deleteProductsByIdentity(listPrestashopProducts, deletePrestashopProduct, identity),
      deleteProductsByIdentity(listWordpressProducts, deleteWordpressProduct, identity),
      deleteProductsByIdentity(listOdooProducts, deleteOdooProduct, identity),
    ]);

    const sync = {
      prestashop:
        results[0].status === 'fulfilled'
          ? { ok: results[0].value.deletedIds.length > 0, ids: results[0].value.deletedIds, errors: results[0].value.errors }
          : { ok: false, error: results[0].reason instanceof Error ? results[0].reason.message : 'Error' },
      wordpress:
        results[1].status === 'fulfilled'
          ? { ok: results[1].value.deletedIds.length > 0, ids: results[1].value.deletedIds, errors: results[1].value.errors }
          : { ok: false, error: results[1].reason instanceof Error ? results[1].reason.message : 'Error' },
      odoo:
        results[2].status === 'fulfilled'
          ? { ok: results[2].value.deletedIds.length > 0, ids: results[2].value.deletedIds, errors: results[2].value.errors }
          : { ok: false, error: results[2].reason instanceof Error ? results[2].reason.message : 'Error' },
    };

    const anyExternalDeleted =
      sync.prestashop.ok ||
      sync.wordpress.ok ||
      sync.odoo.ok;

    if (localDeleted === 0 && !anyExternalDeleted) {
      res.status(404).json({ error: 'Producto no encontrado para eliminar en origen local ni externo.', sync });
      return;
    }

    res.json({ ok: true, id, localDeleted, sync });
  });
}
