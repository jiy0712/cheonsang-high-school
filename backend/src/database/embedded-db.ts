import { join } from 'path';
import { PGlite } from '@electric-sql/pglite';
import { PGLiteSocketServer } from '@electric-sql/pglite-socket';

const EMBEDDED_HOST = '127.0.0.1';
const EMBEDDED_PORT = 5433;
const DATA_DIR = join(process.cwd(), '.pglite-data');

let server: PGLiteSocketServer | null = null;
let db: PGlite | null = null;

export function isEmbeddedDb(): boolean {
  return process.env.EMBEDDED_DB === 'true';
}

export async function startEmbeddedDbIfNeeded(): Promise<void> {
  if (!isEmbeddedDb()) return;

  db = new PGlite(DATA_DIR);
  await db.waitReady;

  server = new PGLiteSocketServer({
    db,
    port: EMBEDDED_PORT,
    host: EMBEDDED_HOST,
  });
  await server.start();

  process.env.DATABASE_URL = `postgres://postgres:postgres@${EMBEDDED_HOST}:${EMBEDDED_PORT}/postgres`;

  await new Promise((r) => setTimeout(r, 300));

  console.log(
    `[embedded-db] PGlite 소켓 서버 실행됨 → ${process.env.DATABASE_URL}`,
  );

  const shutdown = async () => {
    await stopEmbeddedDb();
    process.exit(0);
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

export async function stopEmbeddedDb(): Promise<void> {
  try {
    if (server) await server.stop();
    if (db) await db.close();
  } catch {
  } finally {
    server = null;
    db = null;
  }
}
