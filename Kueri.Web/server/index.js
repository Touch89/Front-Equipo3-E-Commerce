import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { registerProductsEndpoints } from './endpoints/productsEndpoints.js';
import { registerOrdersEndpoints } from './endpoints/ordersEndpoints.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(projectRoot, '.env') });
dotenv.config({ path: path.join(projectRoot, '.env.local'), override: true });

const app = express();
const PORT = Number(process.env.API_PORT || 8000);

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

registerProductsEndpoints(app);
registerOrdersEndpoints(app);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API de productos escuchando en http://localhost:${PORT}`);
});
