import { CommunityIcon, MarketIcon, ShortFormIcon, VideoIcon } from '../../assets/icons';
import type { ProjectData } from '../../types';

const mrnsgImageLink = "/images/mrnsg";

export const projectMrnsg: ProjectData = {
  id: "mrnsg",
  title: "mrnsg.title",
  subtitle: "mrnsg.subtitle",
  demoGifSrc: mrnsgImageLink + "/appGif.gif",
  description: "mrnsg.description",

  overview: {
    projectType: "mrnsg.overview.projectType",
    period: "2025.01",
    introduction: "mrnsg.overview.introduction",
    features: "mrnsg.overview.features",
    techStack: [
      "TypeScript",
    ],
    links: {
      github: "https://github.com/mogiyoon/mogiyoon-react-native-simple-grid",
      demo: "https://www.npmjs.com/package/mogiyoon-react-native-simple-grid",
      notion: undefined,
    },
  },

  summaries: [
    {
      id: "development",
      title: "mrnsg.summaries.development.title",
      parts: [
        [
          { type: "image", alt: "비디오 편집 로직", src: mrnsgImageLink + `/overview/videoLogic.png` },
          { type: "text", content: `mrnsg.summaries.development.parts.0.0` },
          { type: "text", content: `mrnsg.summaries.development.parts.0.1` },
          { type: "text", content: `mrnsg.summaries.development.parts.0.2` },
        ],
        [
          { type: "image", alt: "컴포넌트 리팩토링 및 로그인 정보 전역 상태 관리", src: mrnsgImageLink + "/overview/componentRefactoring.png" },
          { type: "text", content: `mrnsg.summaries.development.parts.1.0` },
          { type: "text", content: `mrnsg.summaries.development.parts.1.1` },
          { type: "text", content: `mrnsg.summaries.development.parts.1.2` },
        ],
        [
          { type: "image", alt: "CRUD 구현", src: mrnsgImageLink + "/overview/crudImplement.png" },
          { type: "text", content: `mrnsg.summaries.development.parts.2.0` },
          { type: "text", content: `mrnsg.summaries.development.parts.2.1` },
          { type: "text", content: `mrnsg.summaries.development.parts.2.2` },
        ],
        [
          { type: "image", alt: "좋아요, 댓글 리팩토링", src: mrnsgImageLink + "/overview/likeReply.png" },
          { type: "text", content: `mrnsg.summaries.development.parts.3.0` },
          { type: "text", content: `mrnsg.summaries.development.parts.3.1` },
          { type: "text", content: `mrnsg.summaries.development.parts.3.2` },
        ],
        [
          { type: "image", alt: "서버 구축", src: mrnsgImageLink + "/overview/changedArchitecture.png" },
          { type: "text", content: `mrnsg.summaries.development.parts.4.0` },
          { type: "text", content: `mrnsg.summaries.development.parts.4.1` },
          { type: "text", content: `mrnsg.summaries.development.parts.4.2` },
        ],
        [
          { type: "image", alt: "이슈 클로즈", src: mrnsgImageLink + "/overview/issueClose.png" },
          { type: "text", content: `mrnsg.summaries.development.parts.5.0` },
          { type: "text", content: `mrnsg.summaries.development.parts.5.1` },
        ],
      ],
    },
    {
      id: "troubleshooting",
      title: "mrnsg.summaries.troubleshooting.title",
      parts: [
        [{ type: "image", src: mrnsgImageLink + "/overview/TroubleShooting1.png", alt: "프로젝트 아키텍처 다이어그램" }],
        [
          { type: "text", content: `mrnsg.summaries.troubleshooting.parts.1.0` },
          { type: "text", content: `mrnsg.summaries.troubleshooting.parts.1.1` },
          { type: "text", content: `mrnsg.summaries.troubleshooting.parts.1.2` },
        ],
        [{ type: "image", src: mrnsgImageLink + "/overview/TroubleShooting2.png", alt: "프로젝트 아키텍처 다이어그램" }],
        [
          { type: "text", content: `mrnsg.summaries.troubleshooting.parts.3.0` },
          { type: "text", content: `mrnsg.summaries.troubleshooting.parts.3.1` },
          { type: "text", content: `mrnsg.summaries.troubleshooting.parts.3.2` },
        ],
      ],
    },
    {
      id: "results",
      title: "mrnsg.summaries.results.title",
      parts: [
        [
          { type: "text", content: `mrnsg.summaries.results.parts.0.0` },
          { type: "text", content: `mrnsg.summaries.results.parts.0.1` },
          { type: "text", content: `mrnsg.summaries.results.parts.0.2` },
          { type: "text", content: `mrnsg.summaries.results.parts.0.3` },
          { type: "text", content: `mrnsg.summaries.results.parts.0.4` },
          { type: "text", content: `mrnsg.summaries.results.parts.0.5` },
        ],
        [
          { type: "text", content: `mrnsg.summaries.results.parts.1.0` },
          { type: "text", content: `mrnsg.summaries.results.parts.1.1` },
          { type: "text", content: `mrnsg.summaries.results.parts.1.2` },
          { type: "text", content: `mrnsg.summaries.results.parts.1.3` },
          { type: "text", content: `mrnsg.summaries.results.parts.1.4` },
          { type: "text", content: `mrnsg.summaries.results.parts.1.5` },
          { type: "text", content: `mrnsg.summaries.results.parts.1.6` },
        ],
      ],
    },
    {
      id: "blank",
      title: "mrnsg.summaries.blank.title",
      parts: [],
    },
  ],

  features: [
    { name: "mrnsg.features.0.name", description: "mrnsg.features.0.description", icon: CommunityIcon },
    { name: "mrnsg.features.1.name", description: "mrnsg.features.1.description", icon: VideoIcon },
    { name: "mrnsg.features.2.name", description: "mrnsg.features.2.description", icon: ShortFormIcon },
    { name: "mrnsg.features.3.name", description: "mrnsg.features.3.description", icon: MarketIcon },
  ],

  screenshots: [{ title: "mrnsg 앱 로고", src: mrnsgImageLink + "/Icon.svg" }],

  developmentProcess: [
    { title: "mrnsg.developmentProcess.0.title", content: "mrnsg.developmentProcess.0.content" },
    { title: "mrnsg.developmentProcess.1.title", content: "mrnsg.developmentProcess.1.content" },
    { title: "mrnsg.developmentProcess.2.title", content: "mrnsg.developmentProcess.2.content" },
  ],

  license: {
    name: "MIT",
    url: "https://opensource.org/licenses/MIT",
  },
};
