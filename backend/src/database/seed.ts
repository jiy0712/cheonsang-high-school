import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { buildDataSourceOptions } from './data-source-options';
import { runSeed } from './seeder';

async function main() {
  const dataSource = new DataSource(buildDataSourceOptions());
  await dataSource.initialize();
  console.log('[seed] 데이터베이스 연결됨. 시딩을 시작합니다...');
  await runSeed(dataSource);
  await dataSource.destroy();
  console.log('[seed] 완료.');
  process.exit(0);
}

main().catch((err) => {
  console.error('[seed] 실패:', err);
  process.exit(1);
});
