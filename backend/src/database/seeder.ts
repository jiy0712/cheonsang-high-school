import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../users/user.entity';
import { Post, PostCategory } from '../boards/post.entity';
import { Schedule } from '../schedules/schedule.entity';

//테스트 개발 당시에 사용한 테스트 샘플 데이터
export async function runSeed(dataSource: DataSource): Promise<void> {
  await seedUsers(dataSource);
  await seedPosts(dataSource);
  await removeLegacyBoardSamples(dataSource);
  await removeLegacyScheduleSamples(dataSource);
}

async function removeLegacyBoardSamples(ds: DataSource): Promise<void> {
  const repo = ds.getRepository(Post);
  const legacyTitles = [
    '2학기 방과후학교 수강 신청 안내',
    '학교 도서관 이용 시간 변경 안내',
    '교복 공동구매 신청 안내',
    '학생 예방접종 및 보건교육 안내',
    '2026학년도 2학기 학사일정 변경 안내',
    '9월 전국연합학력평가 시행 안내',
    '방과후학교 2기 수강 신청 접수',
    '교내 무선망 점검에 따른 일시 중단 안내',
    '2학기 학교급식 운영 안내 가정통신문',
    '가을 현장체험학습 참가 동의서 제출 안내',
    '학생 건강검진 실시 안내',
    '고교학점제 수강신청 학부모 설명회',
  ];
  const rows = await repo.find();
  const toRemove = rows.filter(
    (p) =>
      (p.category === PostCategory.NOTICE ||
        p.category === PostCategory.LETTER) &&
      legacyTitles.includes(p.title),
  );
  if (toRemove.length > 0) {
    await repo.remove(toRemove);
    console.log(`[seed] 구 공지/가정통신문 샘플 ${toRemove.length}건 정리`);
  }
}

async function removeLegacyScheduleSamples(ds: DataSource): Promise<void> {
  const repo = ds.getRepository(Schedule);
  const legacyTitles = [
    '2학기 학력평가 대비 자율학습',
    '3학년 진로진학 상담주간',
    '방과후학교 심화수학 A반',
    '전국연합학력평가',
    '동아리 발표회',
    '학부모 상담주간',
    '체육대회',
    '추석 연휴',
  ];
  const legacy = await repo.find();
  const toRemove = legacy.filter(
    (s) => s.date.startsWith('2026-09') && legacyTitles.includes(s.title),
  );
  if (toRemove.length > 0) {
    await repo.remove(toRemove);
    console.log(`[seed] 구 학사일정 샘플 ${toRemove.length}건 정리`);
  }
}

async function seedUsers(ds: DataSource): Promise<void> {
  const repo = ds.getRepository(User);

  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@cheonsang.hs.kr';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin1234!';
  const adminName = process.env.ADMIN_NAME ?? '관리자';

  const existingAdmin = await repo.findOne({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await repo.save(
      repo.create({
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 10),
        name: adminName,
        role: UserRole.ADMIN,
      }),
    );
    console.log(`[seed] 관리자 계정 생성: ${adminEmail} / ${adminPassword}`);
  }

  const demoEmail = 'student@cheonsang.hs.kr';
  const existingDemo = await repo.findOne({ where: { email: demoEmail } });
  if (!existingDemo) {
    await repo.save(
      repo.create({
        email: demoEmail,
        password: await bcrypt.hash('student1234!', 10),
        name: '김천상',
        role: UserRole.USER,
      }),
    );
    console.log(`[seed] 데모 학생 계정 생성: ${demoEmail} / student1234!`);
  }
}

async function seedPosts(ds: DataSource): Promise<void> {
  const repo = ds.getRepository(Post);
  if ((await repo.count()) > 0) return;

  const news: Array<Partial<Post>> = [
    {
      category: PostCategory.NEWS,
      title: '융합과학 탐구 프로젝트 발표회',
      content: '학생들이 한 학기 동안 진행한 융합과학 탐구 프로젝트 결과를 발표했습니다.',
      author: '과학부',
      tag: '학생활동',
      image: '/images/news-science.png',
    },
    {
      category: PostCategory.NEWS,
      title: '2학기 개학식 및 학년별 학급 활동',
      content: '2학기 개학식을 진행하고 학년별 학급 활동을 실시했습니다.',
      author: '학생부',
      tag: '학교행사',
      image: '/images/news-ceremony.png',
    },
    {
      category: PostCategory.NEWS,
      title: '도서관 독서 마라톤 시즌 시작',
      content: '가을을 맞아 도서관 독서 마라톤 프로그램을 시작했습니다.',
      author: '도서관',
      tag: '학교앨범',
      image: '/images/news-library.png',
    },
    {
      category: PostCategory.NEWS,
      title: '천상 어울림 음악 동아리 정기 연주',
      content: '음악 동아리 어울림이 정기 ���주회를 성황리에 마쳤습니다.',
      author: '동아리부',
      tag: '동아리',
      image: '/images/news-music.png',
    },
  ];

  for (const data of news) {
    await repo.save(repo.create(data));
  }
  console.log(`[seed] 학교소식 ${news.length}건 생성`);
}


