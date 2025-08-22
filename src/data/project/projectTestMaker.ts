import { CameraIcon } from '../../assets/icons';
import type { ProjectData } from '../../types';

const testMakerImageLink = "/images/testMaker";

export const projectTestMaker: ProjectData = {
  id: "test-maker",
  title: "test-maker.title",
  subtitle: "test-maker.subtitle",
  demoGifSrc: testMakerImageLink + "/appGif.gif",
  description: "test-maker.description",

  overview: {
    projectType: "test-maker.overview.projectType",
    period: "2024.11 ~ 2025.02",
    introduction: "test-maker.overview.introduction",
    features: "test-maker.overview.features",
    techStack: ["React Native", "Google Vision API", "Redux"],
    links: {
      github: "https://github.com/mogiyoon/Test_Maker",
    },
  },

  summaries: [
    {
      id: "development",
      title: "test-maker.summaries.development.title",
      parts: [
        [
          { type: "image", src: testMakerImageLink + "/overview/MakerOcr.png", alt: "OCR 기능" },
          { type: "text", content: "test-maker.summaries.development.parts.0.0" },
        ],
        [
          { type: "image", src: testMakerImageLink + "/overview/MakerWordEdit.png", alt: "단어 편집" },
          { type: "text", content: "test-maker.summaries.development.parts.1.0" },
          { type: "text", content: "test-maker.summaries.development.parts.1.1" },
        ],
        [
          { type: "image", src: testMakerImageLink + "/overview/TestWordPage.png", alt: "단어장" },
          { type: "text", content: "test-maker.summaries.development.parts.2.0" },
        ],
        [
          { type: "image", src: testMakerImageLink + "/overview/TestTesting.png", alt: "시험 기능" },
          { type: "text", content: "test-maker.summaries.development.parts.3.0" },
          { type: "text", content: "test-maker.summaries.development.parts.3.1" },
        ],
      ],
    },
    {
      id: "troubleshooting",
      title: "test-maker.summaries.troubleshooting.title",
      parts: [
        [
          { type: "image", src: testMakerImageLink + "/overview/TroubleShooting.png", alt: "트러블슈팅" },
        ],
        [
          { type: "text", content: "test-maker.summaries.troubleshooting.parts.1.0" },
          { type: "text", content: "test-maker.summaries.troubleshooting.parts.1.1" },
          { type: "text", content: "test-maker.summaries.troubleshooting.parts.1.2" },
        ],
      ],
    },
    {
      id: "results",
      title: "test-maker.summaries.results.title",
      parts: [
        [
          { type: "text", content: "test-maker.summaries.results.parts.0.0" },
          { type: "text", content: "test-maker.summaries.results.parts.0.1" },
          { type: "text", content: "test-maker.summaries.results.parts.0.2" },
          { type: "text", content: "test-maker.summaries.results.parts.0.3" },
        ],
        [
          { type: "text", content: "test-maker.summaries.results.parts.1.0" },
          { type: "link", label: "mogiyoon-react-native-simple-grid", href: `https://www.npmjs.com/package/mogiyoon-react-native-simple-grid` },
          { type: "text", content: "test-maker.summaries.results.parts.1.1" },
          { type: "text", content: "test-maker.summaries.results.parts.1.2" },
          { type: "text", content: "test-maker.summaries.results.parts.1.3" },
        ],
      ],
    },
    {
      id: "blank",
      title: "test-maker.summaries.blank.title",
      parts: [],
    },
  ],

  features: [
    { name: "test-maker.features.0.name", description: "test-maker.features.0.description", icon: CameraIcon },
  ],
  screenshots: [{ title: "Icon", src: testMakerImageLink + "/Icon.png" }],
  developmentProcess: [
    { title: "test-maker.developmentProcess.0.title", content: "test-maker.developmentProcess.0.content" },
  ],
  license: { name: "MIT", url: "https://opensource.org/licenses/MIT" },
};
