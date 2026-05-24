# Kueri Web

## Instalar dependencias

```bash
npm install
```

## Ejecutar frontend y API

```bash
npm run dev:api
```

En otra terminal:

```bash
npm run dev
```

Tambien puedes ejecutar ambos en una sola terminal (macOS/Linux):

```bash
npm run dev:all
```

## Variables de entorno

Completa en `.env.local`:

- `PRESTASHOP_BASE_URL`
- `PRESTASHOP_API_KEY`
- `WORDPRESS_BASE_URL`
- `WORDPRESS_CLIENT_KEY`
- `WORDPRESS_CLIENT_SECRET`
- `ODOO_BASE_URL`
- `ODOO_API_KEY`
- `ODOO_DB` (requerido para XML-RPC)
- `ODOO_USERNAME` (requerido para XML-RPC)
- `ODOO_PRODUCTS_PATH` (opcional, por defecto `/api/products`)
- `API_PORT` (opcional, por defecto `8000`)

El frontend ya usa `VITE_API_URL` para consumir la API local.

## Endpoints de productos

- `GET /productos`: obtiene productos (merge entre local + PrestaShop + WordPress + Odoo)
- `GET /productos/:id`: obtiene un producto por id
- `POST /productos`: crea un producto local y dispara sincronizacion a las 3 plataformas
- `PUT /productos/:id`: actualiza producto local
- `DELETE /productos/:id`: elimina producto local

### Odoo por endpoint XML-RPC

Si defines `ODOO_DB` y `ODOO_USERNAME`, el backend usa endpoints oficiales de Odoo:

- `/xmlrpc/2/common`
- `/xmlrpc/2/object`

Si no defines esos valores, usa el fallback REST configurado en `ODOO_PRODUCTS_PATH`.

## Ejemplo de payload para crear producto

```json
{
	"nombre": "Cartera ejecutiva",
	"descripcion": "Cuero premium",
	"imagen_url": "https://example.com/cartera.jpg",
	"precio": 149.9,
	"sku": "CAR-100",
	"stock": 20,
	"categoria": "Carteras"
}
```
