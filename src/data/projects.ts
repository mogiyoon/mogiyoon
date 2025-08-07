// src/data/projects.ts

import { ProjectData } from "../types";
// 아이콘 경로는 실제 프로젝트에 맞게 수정해주세요.
import { CameraIcon, CommunityIcon, MarketIcon, ShortFormIcon, VideoIcon } from "../assets/icons";

const testMakerImageLink = "/images/testMaker/";
const rechoImageLink = "/images/recho/";

export const projects: ProjectData[] = [
  //--------------------------------Test Maker--------------------------------
  {
    id: "test-maker",
    title: "Test Maker",
    subtitle: "나만의 단어장, 나만의 시험지",
    demoGifSrc: testMakerImageLink + "/appGif.gif",
    description: `학생이나 어학 공부를 하는 사람들은 종종 책에 있는 단어를 노트에 옮겨 적고, 외우고, 스스로 시험 보는 과정을 반복합니다. Test Maker는 이 지루하고 비효율적인 과정을 기술로 해결합니다.\n\n카메라로 찍기만 하면 텍스트가 단어장으로, 단어장은 다시 시험지로 자동 변환되어 사용자는 오롯이 '학습'에만 집중할 수 있습니다.`,

    overview: {
      projectType: "개인 프로젝트",
      period: "2024.11 ~ 2025.02",
      introduction: "문제를 직접 만들고 테스트할 수 있는 프로그램",
      features:
        "OCR 단어 추출, 단어장 관리, 객관식/주관식 시험지 자동 생성 및 내보내기",
      techStack: ["React Native", "Google Vision API", "Redux"],
      links: {
        github: "https://github.com/mogiyoon/Test_Maker",
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
              src: testMakerImageLink + "/overview/MakerOcr.png",
              alt: "프로젝트 아키텍처 다이어그램",
            },
            {
              type: "text",
              content: `React Native를 기반으로 Google Vision API를 연동하여 핵심 기능인 OCR 단어 추출을 구현했습니다. Redux로 상태를 관리하고, Realm과 AsyncStorage를 사용해 사용자의 단어장 데이터를 로컬에 안전하게 저장합니다.`,
            },
          ],
          [
            {
              type: "image",
              src: testMakerImageLink + "/overview/MakerWordEdit.png",
              alt: "프로젝트 아키텍처 다이어그램",
            },
            {
              type: "text",
              content: `설정해둔 특수 기호를 활용하여 텍스트를 순회하며 낱말과 뜻을 추출합니다.`,
            },
            {
              type: "text",
              content: `'-' 기호를 사용하여 단어의 카테고리 위계를 구분합니다.`,
            },
          ],
          [
            {
              type: "image",
              src: testMakerImageLink + "/overview/TestWordPage.png",
              alt: "프로젝트 아키텍처 다이어그램",
            },
            {
              type: "text",
              content: `특정 카테고리에 포함된 단어를 선택하면 전역 변수에 저장되며 테스트 가능합니다.`,
            },
          ],
          [
            {
              type: "image",
              src: testMakerImageLink + "/overview/TestTesting.png",
              alt: "프로젝트 아키텍처 다이어그램",
            },
            {
              type: "text",
              content: `테스트는 객관식과 주관식 두 방식으로 선택 가능합니다.`,
            },
            {
              type: "text",
              content: `틀린 단어에 대해 오답 목록이 제공되며, 객관식 형태로 단어시험 내보내기가 가능합니다.`,
            },
          ],
        ],
      },
      {
        id: "troubleshooting",
        title: "트러블 슈팅",
        parts: [
          [
            {
              type: "image",
              src: testMakerImageLink + "/overview/TroubleShooting.png",
              alt: "프로젝트 아키텍처 다이어그램",
            },
          ],
          [
            {
              type: "text",
              content: `문제 상황: 카테고리에 위계를 추가하여 카테고리가 중첩되는 자료 형태로 변경됐고,  따라서 기존의 자료 탐색 구조를 사용할 수 없었습니다.`,
            },
            {
              type: "text",
              content: `해결 과정: 폴더 구조에서 착안한 트리 구조를 적용했고, 단어 탐색 함수를 재귀 함수로 구현했습니다.`,
            },
            {
              type: "text",
              content: `결과:  하위 카테고리의 깊이에 관련없이 탐색이 가능합니다.`,
            },
          ],
        ],
      },
      {
        id: "results",
        title: "결과 및 회고",
        parts: [
          [
            { type: "text", content: `결과` },
            {
              type: "text",
              content: `\tReact Native 활용하여 안드로이드, IOS 모두 구현`,
            },
            {
              type: "text",
              content: `\t단어 데이터는 트리, 오답 데이터는 힙 자료 구조를 사용하여 구현`,
            },
            { type: "text", content: `\tGoogle Vision Api를 활용` },
          ],
          [
            { type: "text", content: `회고` },
            {
              type: "text",
              content: `\tNPM에서 필요한 컴포넌트 라이브러리(그리드)를 찾지 못해 직접 구현하고 NPM에 배포`,
            },
            {
              type: "link",
              label: "mogiyoon-react-native-simple-grid",
              href: `https://www.npmjs.com/package/mogiyoon-react-native-simple-grid`,
            },
            { type: "text", content: `\t자료구조를 활용한 프로그램 구현` },
            { type: "text", content: `\tType Script에 대한 이해도 향상` },
            {
              type: "text",
              content: `\t전역 상태 관리 및 로컬 스토리지, 로컬 DB에 대한 이해 및 적용`,
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
        name: "📸 스마트 OCR 단어 추출",
        description:
          "카메라로 책이나 문서를 촬영하면, 광학 문자 인식(OCR) 기술을 통해 원하는 단어와 그 의미를 자동으로 추출하여 단어장에 추가합니다.",
        icon: CameraIcon,
      },
    ],
    screenshots: [{ title: "Icon", src: testMakerImageLink + "/Icon.png" }],
    techStack: [{ category: "Core", items: ["React Native"] }],
    developmentProcess: [
      {
        title: "문제 파악",
        content:
          "기존 단어 암기 방식의 비효율성을 발견하고, 이를 기술로 자동화하여 학습 효율을 높이는 것을 목표로 설정했습니다.",
      },
    ],
    license: { name: "MIT", url: "https://opensource.org/licenses/MIT" },
  },

  // --------------------------------Recho--------------------------------
  {
    id: "recho",
    title: "Recho",
    subtitle: "음악으로 나를 알리는 플랫폼",
    demoGifSrc: rechoImageLink + "/appGif.gif",
    description: `음악인들이 자유롭게 교류하고, 합주를 함께하고, 악기 중고 거래와 숏폼 영상을 통해 자신을 표현할 수 있는 음악 커뮤니티 플랫폼입니다.\n\n스마트폰의 리소스를 활용하여 합주 영상을 직접 편집할 수 있도록 React Native 기반 앱과 웹뷰 구조로 제작하였습니다.`,

    overview: {
      projectType: "팀 프로젝트",
      period: "2025.06 ~ 2025.07",
      introduction: "음악인들이 소통할 수 있는 커뮤니티 플랫폼",
      features: "커뮤니티, 합주 모집, 악기 중고 거래, 숏폼 기능",
      techStack: [
        "Nest.js",
        "React",
        "React Native",
        "ffmpeg",
        "AWS",
        "PostgreSQL",
      ],
      environment: "macOS + VSCode + Node.js + PostgreSQL + AWS EC2",
      role: "백엔드, 프론트엔드, ERD 및 API 설계, ffmpeg 활용, AWS 서버 구축",
      implementationDetails:
        "웹과 앱 통합 구조를 위해 React Native와 웹뷰를 사용하고, 서버에서는 ffmpeg로 영상 처리 및 스트리밍을 구현",
      links: {
        github: undefined,
        demo: "https://recho.cloud",
        notion: undefined,
      },
    },

    summaries: [
      {
        id: "development",
        title: "구현 기능 및 개발 과정",
        parts: [
          [
            {
              type: "text",
              content: `React Native 앱에서 웹뷰를 통해 합주 편집 기능을 구현하였습니다.`,
            },
            {
              type: "text",
              content: `Nest.js와 PostgreSQL 기반 백엔드에서 사용자, 게시글, 영상 등의 데이터를 관리합니다.`,
            },
          ],
          [
            {
              type: "text",
              content: `ffmpeg를 활용해 서버에서 영상 병합, 오디오 싱크 처리 등의 미디어 처리 기능을 수행합니다.`,
            },
            {
              type: "text",
              content: `AWS EC2, S3, CloudFront 등을 활용하여 안정적인 영상 업로드 및 배포 환경을 구성했습니다.`,
            },
          ],
        ],
      },
      {
        id: "results",
        title: "결과 및 회고",
        parts: [
          [
            { type: "text", content: `결과` },
            {
              type: "text",
              content: `\t음악인을 위한 기능 중심 커뮤니티 플랫폼 완성`,
            },
            {
              type: "text",
              content: `\t웹/앱 환경을 통합한 구조로 제작`,
            },
            {
              type: "text",
              content: `\t영상 편집 기능을 클라이언트와 서버에서 효율적으로 분산 처리`,
            },
          ],
          [
            { type: "text", content: `회고` },
            {
              type: "text",
              content: `\t백엔드-프론트엔드 통합 구조 설계 및 구현 경험`,
            },
            {
              type: "text",
              content: `\tNest.js를 통한 REST API 설계와 ERD 모델링 역량 강화`,
            },
            {
              type: "text",
              content: `\tffmpeg를 활용한 실시간 미디어 처리 로직 설계 및 적용`,
            },
            {
              type: "text",
              content: `\tAWS 환경에서의 배포, 운영 경험 축적`,
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
        name: "🎵 음악 기반 커뮤니티",
        description:
          "음악인들이 자유롭게 소통하고 정보를 공유할 수 있는 게시판 제공",
        icon: CommunityIcon, // 임의 아이콘 지정 필요
      },
      {
        name: "🤝 합주 영상 공유",
        description: "합주 멤버를 모집하고, 함께 연주한 영상 클립을 공유",
        icon: VideoIcon, // 임의 아이콘 지정 필요
      },
      {
        name: "📱 숏폼 제작",
        description: "사용자의 연주나 작업물을 짧은 영상으로 제작하고 공유",
        icon: ShortFormIcon, // 임의 아이콘 지정 필요
      },
      {
        name: "🛠 악기 중고 거래",
        description:
          "음악 장비와 악기를 사용자 간 중고로 거래할 수 있는 게시판 제공",
        icon: MarketIcon, // 임의 아이콘 지정 필요
      },
    ],

    screenshots: [
      { title: "Recho 앱 로고", src: rechoImageLink + "/Icon.svg" },
    ],

    techStack: [
      {
        category: "Backend",
        items: ["Nest.js", "PostgreSQL", "ffmpeg", "AWS"],
      },
      { category: "Frontend", items: ["React", "React Native", "웹뷰"] },
    ],

    developmentProcess: [
      {
        title: "기획 및 구조 설계",
        content: "음악인 대상 기능 설계 및 전체 서비스 흐름도 및 ERD 설계",
      },
      {
        title: "기능 구현",
        content:
          "ffmpeg를 이용한 영상 편집 기능 및 사용자 커뮤니티 시스템 구현",
      },
      {
        title: "배포 및 운영",
        content: "AWS EC2, S3, Route53, CloudFront를 이용한 서비스 배포",
      },
    ],

    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },

  
];
