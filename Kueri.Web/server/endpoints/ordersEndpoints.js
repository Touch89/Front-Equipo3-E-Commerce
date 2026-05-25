import { randomBytes } from 'node:crypto';

function getPrestashopConfig() {
  return {
    baseUrl: process.env.PRESTASHOP_BASE_URL,
    apiKey: process.env.PRESTASHOP_API_KEY ?? process.env.VITE_PRESTASHOP_API_KEY,
    languageId: Number(process.env.PRESTASHOP_LANGUAGE_ID || 1),
    countryId: Number(process.env.PRESTASHOP_COUNTRY_ID || 138), // 138 = México
    currencyId: Number(process.env.PRESTASHOP_CURRENCY_ID || 1),
    carrierId: Number(process.env.PRESTASHOP_CARRIER_ID || 1),
  };
}

const localOrders = [];
let orderSequence = 1000;

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
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

function xmlEscape(value) {
  return String(value ?? '')
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

function buildCustomerXml(firstName, lastName, email, langId) {
  const passwd = randomBytes(8).toString('hex');
  return `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
  <customer>
    <id_default_group><![CDATA[3]]></id_default_group>
    <id_lang><![CDATA[${langId}]]></id_lang>
    <id_gender><![CDATA[1]]></id_gender>
    <firstname><![CDATA[${xmlEscape(firstName)}]]></firstname>
    <lastname><![CDATA[${xmlEscape(lastName)}]]></lastname>
    <email><![CDATA[${xmlEscape(email)}]]></email>
    <passwd><![CDATA[${passwd}]]></passwd>
    <active><![CDATA[1]]></active>
    <newsletter><![CDATA[0]]></newsletter>
    <optin><![CDATA[0]]></optin>
  </customer>
</prestashop>`;
}

function buildAddressXml(customerId, firstName, lastName, orderData, config) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
  <address>
    <id_customer><![CDATA[${customerId}]]></id_customer>
    <id_country><![CDATA[${config.countryId}]]></id_country>
    <alias><![CDATA[Dirección de envío]]></alias>
    <firstname><![CDATA[${xmlEscape(firstName)}]]></firstname>
    <lastname><![CDATA[${xmlEscape(lastName)}]]></lastname>
    <address1><![CDATA[${xmlEscape(orderData.direccion)}]]></address1>
    <city><![CDATA[${xmlEscape(orderData.ciudad)}]]></city>
    <phone><![CDATA[${xmlEscape(orderData.telefono)}]]></phone>
    <deleted><![CDATA[0]]></deleted>
    <active><![CDATA[1]]></active>
  </address>
</prestashop>`;
}

function buildCartXml(customerId, addressId, items, config) {
  const rowsXml = items
    .map(
      (item) => `
      <cart_row>
        <id_product><![CDATA[${item.productId}]]></id_product>
        <id_product_attribute><![CDATA[0]]></id_product_attribute>
        <id_address_delivery><![CDATA[${addressId}]]></id_address_delivery>
        <quantity><![CDATA[${item.cantidad}]]></quantity>
      </cart_row>`,
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
  <cart>
    <id_currency><![CDATA[${config.currencyId}]]></id_currency>
    <id_lang><![CDATA[${config.languageId}]]></id_lang>
    <id_customer><![CDATA[${customerId}]]></id_customer>
    <id_address_delivery><![CDATA[${addressId}]]></id_address_delivery>
    <id_address_invoice><![CDATA[${addressId}]]></id_address_invoice>
    <associations>
      <cart_rows>${rowsXml}
      </cart_rows>
    </associations>
  </cart>
</prestashop>`;
}

function buildOrderXml(customerId, addressId, cartId, total, items, config) {
  const totalStr = toNumber(total).toFixed(6);
  const rowsXml = items
    .map(
      (item) => `
        <order_row>
          <id_product><![CDATA[${item.productId}]]></id_product>
          <id_product_attribute><![CDATA[0]]></id_product_attribute>
          <id_shop><![CDATA[1]]></id_shop>
          <product_quantity><![CDATA[${item.cantidad}]]></product_quantity>
          <product_name><![CDATA[${xmlEscape(item.nombre)}]]></product_name>
          <product_reference><![CDATA[]]></product_reference>
          <product_ean13><![CDATA[]]></product_ean13>
          <product_isbn><![CDATA[]]></product_isbn>
          <product_upc><![CDATA[]]></product_upc>
          <product_price><![CDATA[${toNumber(item.precio).toFixed(6)}]]></product_price>
          <unit_price_tax_incl><![CDATA[${toNumber(item.precio).toFixed(6)}]]></unit_price_tax_incl>
          <unit_price_tax_excl><![CDATA[${toNumber(item.precio).toFixed(6)}]]></unit_price_tax_excl>
        </order_row>`,
    )
    .join('');

  const secureKey = randomBytes(16).toString('hex');

  return `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
  <order>
    <id_address_delivery><![CDATA[${addressId}]]></id_address_delivery>
    <id_address_invoice><![CDATA[${addressId}]]></id_address_invoice>
    <id_cart><![CDATA[${cartId}]]></id_cart>
    <id_currency><![CDATA[${config.currencyId}]]></id_currency>
    <id_lang><![CDATA[${config.languageId}]]></id_lang>
    <id_customer><![CDATA[${customerId}]]></id_customer>
    <id_carrier><![CDATA[${config.carrierId}]]></id_carrier>
    <current_state><![CDATA[1]]></current_state>
    <module><![CDATA[ps_checkpayment]]></module>
    <payment><![CDATA[Tarjeta]]></payment>
    <conversion_rate><![CDATA[1.000000]]></conversion_rate>
    <secure_key><![CDATA[${secureKey}]]></secure_key>
    <total_discounts><![CDATA[0.000000]]></total_discounts>
    <total_discounts_tax_incl><![CDATA[0.000000]]></total_discounts_tax_incl>
    <total_discounts_tax_excl><![CDATA[0.000000]]></total_discounts_tax_excl>
    <total_paid><![CDATA[${totalStr}]]></total_paid>
    <total_paid_tax_incl><![CDATA[${totalStr}]]></total_paid_tax_incl>
    <total_paid_tax_excl><![CDATA[${totalStr}]]></total_paid_tax_excl>
    <total_paid_real><![CDATA[0.000000]]></total_paid_real>
    <total_products><![CDATA[${totalStr}]]></total_products>
    <total_products_wt><![CDATA[${totalStr}]]></total_products_wt>
    <total_shipping><![CDATA[0.000000]]></total_shipping>
    <total_shipping_tax_incl><![CDATA[0.000000]]></total_shipping_tax_incl>
    <total_shipping_tax_excl><![CDATA[0.000000]]></total_shipping_tax_excl>
    <total_wrapping><![CDATA[0.000000]]></total_wrapping>
    <total_wrapping_tax_incl><![CDATA[0.000000]]></total_wrapping_tax_incl>
    <total_wrapping_tax_excl><![CDATA[0.000000]]></total_wrapping_tax_excl>
    <round_mode><![CDATA[2]]></round_mode>
    <round_type><![CDATA[1]]></round_type>
    <associations>
      <order_rows>${rowsXml}
      </order_rows>
    </associations>
  </order>
</prestashop>`;
}

async function syncToPrestashop(orderData, items) {
  const config = getPrestashopConfig();
  if (!config.baseUrl || !config.apiKey) {
    throw new Error('PrestaShop no configurado (PRESTASHOP_BASE_URL / PRESTASHOP_API_KEY).');
  }

  const base = config.baseUrl.replace(/\/$/, '');
  const auth = `Basic ${Buffer.from(`${config.apiKey}:`).toString('base64')}`;
  const xmlHeaders = { Authorization: auth, 'Content-Type': 'application/xml' };

  const post = (resource, body) =>
    requestJson(`${base}/api/${resource}?output_format=JSON`, {
      method: 'POST',
      headers: xmlHeaders,
      body,
    });

  const { firstName, lastName } = splitName(orderData.nombre);

  const customerRes = await post(
    'customers',
    buildCustomerXml(firstName, lastName, orderData.email, config.languageId),
  );
  const customerId = customerRes?.customer?.id;
  if (!customerId) throw new Error('PrestaShop no devolvió ID de cliente.');

  const addressRes = await post(
    'addresses',
    buildAddressXml(customerId, firstName, lastName, orderData, config),
  );
  const addressId = addressRes?.address?.id;
  if (!addressId) throw new Error('PrestaShop no devolvió ID de dirección.');

  const cartRes = await post('carts', buildCartXml(customerId, addressId, items, config));
  const cartId = cartRes?.cart?.id;
  if (!cartId) throw new Error('PrestaShop no devolvió ID de carrito.');

  const orderRes = await post(
    'orders',
    buildOrderXml(customerId, addressId, cartId, orderData.total, items, config),
  );
  const prestashopId = orderRes?.order?.id;
  if (!prestashopId) throw new Error('PrestaShop no devolvió ID de pedido.');

  return { prestashopId, customerId, addressId, cartId };
}

export function registerOrdersEndpoints(app) {
  app.post('/pedidos', async (req, res) => {
    const { nombre, email, direccion, ciudad, telefono, metodoPago, items, total } = req.body;

    const required = { nombre, email, direccion, ciudad, telefono, metodoPago };
    const missing = Object.entries(required)
      .filter(([, v]) => !v)
      .map(([k]) => k);

    if (missing.length > 0) {
      res.status(400).json({ error: `Campos obligatorios faltantes: ${missing.join(', ')}` });
      return;
    }
    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'El carrito está vacío.' });
      return;
    }

    const id = ++orderSequence;
    const order = {
      id,
      fecha: new Date().toISOString(),
      estado: 'pendiente',
      usuario: { nombre, email },
      envio: { direccion, ciudad, telefono },
      metodoPago,
      items,
      total: toNumber(total),
    };
    localOrders.unshift(order);

    let sync = { prestashop: { ok: false, error: null, id: null } };
    try {
      const result = await syncToPrestashop({ nombre, email, direccion, ciudad, telefono, total }, items);
      sync.prestashop = { ok: true, id: result.prestashopId, error: null };
    } catch (err) {
      sync.prestashop = {
        ok: false,
        id: null,
        error: err instanceof Error ? err.message : 'Error desconocido',
      };
    }

    res.status(201).json({ ...order, sync });
  });

  app.get('/pedidos', (_req, res) => {
    res.json(localOrders);
  });
}
