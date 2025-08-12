import { CommunityIcon, QuizIcon, NoteIcon, StatsIcon } from '../../assets/icons';
import type { ProjectData } from '../../types';

const teacherTestImageLink = "/images/teacherTest";

export const projectTeacherTest: ProjectData = {
  id: "teacher_test",
  title: "Tea Time",
  subtitle: "초등교사 임용 시험 준비를 위한 모바일 학습 앱",
  demoGifSrc: teacherTestImageLink + "/appGif.gif",
  description: `대한민국 초등교사 임용 시험을 준비하는 예비 교사들을 위한 모바일 학습 앱입니다. 방대한 교육과정 내용을 언제 어디서든 퀴즈 형태로 학습하고, 틀린 문제를 체계적으로 관리하여 합격에 한 걸음 더 다가갈 수 있도록 돕습니다. Flutter로 제작된 앱으로, 이동 시간이나 자투리 시간에도 핵심 내용을 효율적으로 학습할 수 있도록 설계되었습니다.`,

  overview: {
    projectType: "개인 프로젝트",
    period: "2024.01 ~ 2024.02",
    introduction: "초등교사 임용 시험 대비를 목표로, 교육과정 기반 문제와 오답 관리를 제공하는 모바일 학습 도구",
    features: "교육과정/총론 기반 테스트, 오답노트",
    techStack: [
      "Flutter",
      "Provider",
      "Material Design",
      "Firebase",
    ],
    links: {
      github: undefined,
    },
  },

  summaries: [
    {
      id: "development",
      title: "구현 기능 및 개발 과정",
      parts: [
        [
          {
            type: "image",
            alt: "메인 화면",
            src: teacherTestImageLink + "/overview/main.png",
          },
          {
            type: "text",
            content: `메인 화면에서는 남은 시험 일수, 오답 목록 및 오답 확인 기능을 제공함.`,
          },
        ],
        [
          {
            type: "image",
            alt: "목록",
            src: teacherTestImageLink + "/overview/menu.png",
          },
          {
            type: "text",
            content: `교육과정 내용체계표, 성취기준, 총론 학습 기능 제공`,
          },
        ],
        [
          {
            type: "image",
            alt: "내용체계표",
            src: teacherTestImageLink + "/overview/curriculum.png",
          },
          {
            type: "text",
            content: `학년군별 내용체계표 및 시험 기능 제공`,
          },
        ],
        [
          {
            type: "image",
            alt: "시험 모드",
            src: teacherTestImageLink + "/overview/testMode.png",
          },
          {
            type: "text",
            content: `학년군별 시험 모드 제공`,
          },
        ],
        [
          {
            type: "image",
            alt: "정답 확인",
            src: teacherTestImageLink + "/overview/checkAnswer.png",
          },
          {
            type: "text",
            content: `시험 모드에서는 자신의 정답을 확인해볼 수 있음.`,
          },
        ],
        [
          {
            type: "image",
            alt: "메인 화면 정답 확인",
            src: teacherTestImageLink + "/overview/compareAnswer.png",
          },
          {
            type: "text",
            content: `원문 및 자신의 정답을 복사하면 메인 화면에서 자신의 답과 정답의 다른 부분을 확인할 수 있음`,
          },
        ],
        [
          {
            type: "image",
            alt: "교육과정 성취기준",
            src: teacherTestImageLink + "/overview/achieve.png",
          },
          {
            type: "text",
            content: `교육과정 성취기준 학습 제공`,
          },
        ],
        [
          {
            type: "image",
            alt: "총론",
            src: teacherTestImageLink + "/overview/general.png",
          },
          {
            type: "text",
            content: `교육과정 총론 학습 기능 제공`,
          },
        ],
      ],
    },
//     {
//       id: "troubleshooting",
//       title: "트러블 슈팅",
//       parts: [
//         [
//           {
//             type: "text",
//             content: `문제 상황: 교육과정(성취기준)과 문항을 연동하는 메타데이터 설계의 복잡성.`,
//           },
//           {
//             type: "text",
//             content: `해결 과정:
// \t1. 성취기준을 계층화하여 도메인 모델 설계(대단원 → 중단원 → 소단원).
// \t2. 각 문항에 성취기준 ID를 연결하여 검색 및 통계 집계의 일관성 확보.
// \t3. 성취기준 변경에 대비해 버전 관리 필드(version)를 추가하여 향후 업데이트 용이성 확보.`,
//           },
//           {
//             type: "text",
//             content: `결과: 검색 정확도 향상 및 과목/단원별 통계 집계의 신뢰성 확보.`,
//           },
//         ],
//         [
//           {
//             type: "text",
//             content: `문제 상황: 모바일 환경에서 많은 문항을 다룰 때 성능(로딩/메모리) 문제.`,
//           },
//           {
//             type: "text",
//             content: `해결 과정:
// \t- 페이징 및 필요 시 로컬 캐시(예: sqlite, shared_preferences 등) 사용으로 초기 로드 최소화.
// \t- 이미지/미디어는 CDN 또는 압축된 리소스로 제공하여 앱 패키지 용량 최소화.`,
//           },
//           {
//             type: "text",
//             content: `결과: 초기 로딩 속도 개선 및 메모리 사용 안정화.`,
//           },
//         ],
//       ],
//     },
    {
      id: "results",
      title: "결과 및 회고",
      parts: [
        [
          { type: "text", content: `결과` },
          { type: "text", content: `\t교육과정 기반 문제 풀기 기능 구현` },
          { type: "text", content: `\t오답노트 자동 기록 및 재학습 흐름 제공` },
          { type: "text", content: `\tFirebase를 활용한 오답 목록 백업` },
        ],
        [
          { type: "text", content: `회고` },
          {
            type: "text",
            content: `\t데이터 세분화 및 다차원 배열 활용의 복잡성 이해`,
          },
          {
            type: "text",
            content: `\t크로스 플랫폼 앱 설계에 대한 이해`,
          },
        ],
      ],
    },
    {
      id: "blank",
      title: "감사합니다.",
      parts: [],
    },
  ],

  features: [
    {
      name: "📚 교육과정 기반 문제",
      description: "초등 전 학년·전 과목의 교육과정(성취기준) 기반 문제 제공",
      icon: QuizIcon,
    },
    {
      name: "✍️ 다양한 학습 모드",
      description: "과목별·학년별·랜덤 등 다양한 학습 모드로 실력 점검",
      icon: CommunityIcon,
    },
    {
      name: "❌ 체계적인 오답노트",
      description: "틀린 문제를 자동으로 기록하고 해설과 함께 재학습 가능",
      icon: NoteIcon,
    },
    {
      name: "📊 학습 통계",
      description: "전체 정답률·과목별 정답률 등을 시각화하여 학습 현황 파악",
      icon: StatsIcon,
    },
  ],

  screenshots: [
    { title: "Icon", src: teacherTestImageLink + "/Icon.png" },
    { title: "메인 화면", src: teacherTestImageLink + "/screens/main.png" },
    { title: "오답노트", src: teacherTestImageLink + "/screens/wrong_note.png" },
    { title: "통계 화면", src: teacherTestImageLink + "/screens/stats.png" },
  ],

  techStack: [
    {
      category: "Framework",
      items: ["Flutter", "Dart"],
    },
    {
      category: "State Management / UI",
      items: ["Provider", "Material Design"],
    },
  ],

  developmentProcess: [
    {
      title: "기획 및 구조 설계",
      content: "교육과정 기반 문항 구조 설계 및 DB/메타데이터 모델링",
    },
    {
      title: "기능 구현",
      content: "문항 풀기, 오답노트, 검색, 통계 등 핵심 학습 기능 구현",
    },
    {
      title: "배포 및 운영",
      content: "앱 스토어 제출 준비, 리소스 최적화 및 사용자 피드백 반영",
    },
  ],

  license: {
    name: "MIT",
    url: "https://opensource.org/licenses/MIT",
  },
};