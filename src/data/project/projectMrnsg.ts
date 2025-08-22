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
          { type: "image", alt: "동기", src: mrnsgImageLink + `/overview/testMakerExample.png`, caption: "Test Maker 단어 테스트 화면" },
          { type: "text", content: `mrnsg.summaries.development.parts.0.0` },
          { type: "text", content: `mrnsg.summaries.development.parts.0.1` },
          { type: "text", content: `mrnsg.summaries.development.parts.0.2` },
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
        ],
        [
          { type: "text", content: `mrnsg.summaries.results.parts.1.0` },
          { type: "text", content: `mrnsg.summaries.results.parts.1.1` },
          { type: "text", content: `mrnsg.summaries.results.parts.1.2` },
          { type: "text", content: `mrnsg.summaries.results.parts.1.3` },
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

  techStack: [
    {
      category: "Backend",
      items: ["Nest.js", "PostgreSQL", "ffmpeg", "AWS"],
    },
    { category: "Frontend", items: ["React", "React Native", "웹뷰"] },
  ],

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
