import { CommunityIcon, MarketIcon, ShortFormIcon, VideoIcon } from '../../assets/icons';
import type { ProjectData } from '../../types';

const rechoImageLink = "/images/recho";

export const projectRecho: ProjectData = {
  id: "recho",
  title: "recho.title",
  subtitle: "recho.subtitle",
  demoGifSrc: rechoImageLink + "/appGif.gif",
  description: "recho.description",

  overview: {
    projectType: "recho.overview.projectType",
    period: "2025.06 ~ 2025.07",
    introduction: "recho.overview.introduction",
    features: "recho.overview.features",
    architecture: rechoImageLink + "/overview/architecture.png",
    techStack: [
      "Nest.js",
      "React",
      "React Native",
      "ffmpeg",
      "AWS",
      "PostgreSQL",
    ],
    role: "recho.overview.role",
    links: {
      github: "https://github.com/JungleTeam5/Recho",
      demo: "https://recho.cloud",
      notion: undefined,
    },
  },

  summaries: [
    {
      id: "development",
      title: "recho.summaries.development.title",
      parts: [
        [
          { type: "image", alt: "비디오 편집 로직", src: rechoImageLink + `/overview/videoLogic.png` },
          { type: "text", content: `recho.summaries.development.parts.0.0` },
          { type: "text", content: `recho.summaries.development.parts.0.1` },
          { type: "text", content: `recho.summaries.development.parts.0.2` },
        ],
        [
          { type: "image", alt: "컴포넌트 리팩토링 및 로그인 정보 전역 상태 관리", src: rechoImageLink + "/overview/componentRefactoring.png" },
          { type: "text", content: `recho.summaries.development.parts.1.0` },
          { type: "text", content: `recho.summaries.development.parts.1.1` },
          { type: "text", content: `recho.summaries.development.parts.1.2` },
        ],
        [
          { type: "image", alt: "CRUD 구현", src: rechoImageLink + "/overview/crudImplement.png" },
          { type: "text", content: `recho.summaries.development.parts.2.0` },
          { type: "text", content: `recho.summaries.development.parts.2.1` },
          { type: "text", content: `recho.summaries.development.parts.2.2` },
        ],
        [
          { type: "image", alt: "좋아요, 댓글 리팩토링", src: rechoImageLink + "/overview/likeReply.png" },
          { type: "text", content: `recho.summaries.development.parts.3.0` },
          { type: "text", content: `recho.summaries.development.parts.3.1` },
          { type: "text", content: `recho.summaries.development.parts.3.2` },
        ],
        [
          { type: "image", alt: "서버 구축", src: rechoImageLink + "/overview/changedArchitecture.png" },
          { type: "text", content: `recho.summaries.development.parts.4.0` },
          { type: "text", content: `recho.summaries.development.parts.4.1` },
          { type: "text", content: `recho.summaries.development.parts.4.2` },
        ],
        [
          { type: "image", alt: "이슈 클로즈", src: rechoImageLink + "/overview/issueClose.png" },
          { type: "text", content: `recho.summaries.development.parts.5.0` },
          { type: "text", content: `recho.summaries.development.parts.5.1` },
        ],
      ],
    },
    {
      id: "troubleshooting",
      title: "recho.summaries.troubleshooting.title",
      parts: [
        [{ type: "image", src: rechoImageLink + "/overview/TroubleShooting1.png", alt: "프로젝트 아키텍처 다이어그램" }],
        [
          { type: "text", content: `recho.summaries.troubleshooting.parts.1.0` },
          { type: "text", content: `recho.summaries.troubleshooting.parts.1.1` },
          { type: "text", content: `recho.summaries.troubleshooting.parts.1.2` },
        ],
        [{ type: "image", src: rechoImageLink + "/overview/TroubleShooting2.png", alt: "프로젝트 아키텍처 다이어그램" }],
        [
          { type: "text", content: `recho.summaries.troubleshooting.parts.3.0` },
          { type: "text", content: `recho.summaries.troubleshooting.parts.3.1` },
          { type: "text", content: `recho.summaries.troubleshooting.parts.3.2` },
        ],
      ],
    },
    {
      id: "results",
      title: "recho.summaries.results.title",
      parts: [
        [
          { type: "text", content: `recho.summaries.results.parts.0.0` },
          { type: "text", content: `recho.summaries.results.parts.0.1` },
          { type: "text", content: `recho.summaries.results.parts.0.2` },
          { type: "text", content: `recho.summaries.results.parts.0.3` },
          { type: "text", content: `recho.summaries.results.parts.0.4` },
          { type: "text", content: `recho.summaries.results.parts.0.5` },
        ],
        [
          { type: "text", content: `recho.summaries.results.parts.1.0` },
          { type: "text", content: `recho.summaries.results.parts.1.1` },
          { type: "text", content: `recho.summaries.results.parts.1.2` },
          { type: "text", content: `recho.summaries.results.parts.1.3` },
          { type: "text", content: `recho.summaries.results.parts.1.4` },
          { type: "text", content: `recho.summaries.results.parts.1.5` },
          { type: "text", content: `recho.summaries.results.parts.1.6` },
        ],
      ],
    },
    {
      id: "blank",
      title: "recho.summaries.blank.title",
      parts: [],
    },
  ],

  features: [
    { name: "recho.features.0.name", description: "recho.features.0.description", icon: CommunityIcon },
    { name: "recho.features.1.name", description: "recho.features.1.description", icon: VideoIcon },
    { name: "recho.features.2.name", description: "recho.features.2.description", icon: ShortFormIcon },
    { name: "recho.features.3.name", description: "recho.features.3.description", icon: MarketIcon },
  ],

  screenshots: [{ title: "Recho 앱 로고", src: rechoImageLink + "/Icon.svg" }],

  developmentProcess: [
    { title: "recho.developmentProcess.0.title", content: "recho.developmentProcess.0.content" },
    { title: "recho.developmentProcess.1.title", content: "recho.developmentProcess.1.content" },
    { title: "recho.developmentProcess.2.title", content: "recho.developmentProcess.2.content" },
  ],

  license: {
    name: "MIT",
    url: "https://opensource.org/licenses/MIT",
  },
};
