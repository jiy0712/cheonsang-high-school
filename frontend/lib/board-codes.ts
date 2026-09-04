export type BoardCodeMap = Record<string, { code: string; note?: string }>

export const BOARD_CODES: BoardCodeMap = {
  press: { code: "M010305", note: "천상고등학교 공식 홈페이지 보도자료 (실시간 제공)" },

  afterschool: { code: "M010403", note: "천상고등학교 공식 홈페이지 방과후학교 (실시간 제공)" },
  club: { code: "M010404", note: "천상고등학교 공식 홈페이지 동아리 활동 (실시간 제공)" },

  curriculum: { code: "M010501", note: "천상고등학교 공식 홈페이지 교육과정 (실시간 제공)" },
  career: { code: "M010502", note: "천상고등학교 공식 홈페이지 진로·진학 (실시간 제공)" },
  steam: { code: "M010503", note: "천상고등학교 공식 홈페이지 STEAM 선도학교 (실시간 제공)" },
  creative: { code: "M010504", note: "천상고등학교 공식 홈페이지 창의적 체험활동 (실시간 제공)" },

  rules: { code: "M010601", note: "천상고등학교 공식 홈페이지 학교 규칙 (실시간 제공)" },
  "student-council": { code: "M010602", note: "천상고등학교 공식 홈페이지 학생 자치 (실시간 제공)" },
  counseling: { code: "M010603", note: "천상고등학교 공식 홈페이지 상담실 (실시간 제공)" },
  health: { code: "M010604", note: "천상고등학교 공식 홈페이지 보건실 (실시간 제공)" },

  info: { code: "M010701", note: "천상고등학교 공식 홈페이지 정보 공개 (실시간 제공)" },
  forms: { code: "M010702", note: "천상고등학교 공식 홈페이지 행정 서식 (실시간 제공)" },
  facility: { code: "M010703", note: "천상고등학교 공식 홈페이지 시설 현황 (실시간 제공)" },
  recruit: { code: "M010704", note: "천상고등학교 공식 홈페이지 채용 정보 (실시간 제공)" },
}
