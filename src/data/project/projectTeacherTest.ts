import { CommunityIcon, QuizIcon, NoteIcon, StatsIcon } from '../../assets/icons';
import type { ProjectData } from '../../types';

const teacherTestImageLink = "/images/teacherTest";

export const projectTeacherTest: ProjectData = {
  id: "teacher_test",
  title: "teacher_test.title",
  subtitle: "teacher_test.subtitle",
  demoGifSrc: teacherTestImageLink + "/appGif.gif",
  description: "teacher_test.description",

  overview: {
    projectType: "teacher_test.overview.projectType",
    period: "2024.01 ~ 2024.02",
    introduction: "teacher_test.overview.introduction",
    features: "teacher_test.overview.features",
    techStack: ["Flutter", "Provider", "Material Design", "Firebase"],
    links: {
      github: undefined,
    },
  },

  summaries: [
    {
      id: "development",
      title: "teacher_test.summaries.development.title",
      parts: [
        [
          { type: "image", alt: "메인 화면", src: teacherTestImageLink + "/overview/main.png" },
          { type: "text", content: "teacher_test.summaries.development.parts.0.0" },
        ],
        [
          { type: "image", alt: "목록", src: teacherTestImageLink + "/overview/menu.png" },
          { type: "text", content: "teacher_test.summaries.development.parts.1.0" },
        ],
        [
          { type: "image", alt: "내용체계표", src: teacherTestImageLink + "/overview/curriculum.png" },
          { type: "text", content: "teacher_test.summaries.development.parts.2.0" },
        ],
        [
          { type: "image", alt: "시험 모드", src: teacherTestImageLink + "/overview/testMode.png" },
          { type: "text", content: "teacher_test.summaries.development.parts.3.0" },
        ],
        [
          { type: "image", alt: "정답 확인", src: teacherTestImageLink + "/overview/checkAnswer.png" },
          { type: "text", content: "teacher_test.summaries.development.parts.4.0" },
        ],
        [
          { type: "image", alt: "메인 화면 정답 확인", src: teacherTestImageLink + "/overview/compareAnswer.png" },
          { type: "text", content: "teacher_test.summaries.development.parts.5.0" },
        ],
        [
          { type: "image", alt: "교육과정 성취기준", src: teacherTestImageLink + "/overview/achieve.png" },
          { type: "text", content: "teacher_test.summaries.development.parts.6.0" },
        ],
        [
          { type: "image", alt: "총론", src: teacherTestImageLink + "/overview/general.png" },
          { type: "text", content: "teacher_test.summaries.development.parts.7.0" },
        ],
      ],
    },
    {
      id: "results",
      title: "teacher_test.summaries.results.title",
      parts: [
        [
          { type: "text", content: "teacher_test.summaries.results.parts.0.0" },
          { type: "text", content: "teacher_test.summaries.results.parts.0.1" },
          { type: "text", content: "teacher_test.summaries.results.parts.0.2" },
          { type: "text", content: "teacher_test.summaries.results.parts.0.3" },
        ],
        [
          { type: "text", content: "teacher_test.summaries.results.parts.1.0" },
          { type: "text", content: "teacher_test.summaries.results.parts.1.1" },
          { type: "text", content: "teacher_test.summaries.results.parts.1.2" },
        ],
      ],
    },
    {
      id: "blank",
      title: "teacher_test.summaries.blank.title",
      parts: [],
    },
  ],

  features: [
    { name: "teacher_test.features.0.name", description: "teacher_test.features.0.description", icon: QuizIcon },
    { name: "teacher_test.features.1.name", description: "teacher_test.features.1.description", icon: CommunityIcon },
    { name: "teacher_test.features.2.name", description: "teacher_test.features.2.description", icon: NoteIcon },
    { name: "teacher_test.features.3.name", description: "teacher_test.features.3.description", icon: StatsIcon },
  ],

  screenshots: [
    { title: "Icon", src: teacherTestImageLink + "/Icon.png" },
    { title: "메인 화면", src: teacherTestImageLink + "/screens/main.png" },
    { title: "오답노트", src: teacherTestImageLink + "/screens/wrong_note.png" },
    { title: "통계 화면", src: teacherTestImageLink + "/screens/stats.png" },
  ],

  techStack: [
    { category: "Framework", items: ["Flutter", "Dart"] },
    { category: "State Management / UI", items: ["Provider", "Material Design"] },
  ],

  developmentProcess: [
    { title: "teacher_test.developmentProcess.0.title", content: "teacher_test.developmentProcess.0.content" },
    { title: "teacher_test.developmentProcess.1.title", content: "teacher_test.developmentProcess.1.content" },
    { title: "teacher_test.developmentProcess.2.title", content: "teacher_test.developmentProcess.2.content" },
  ],

  license: {
    name: "MIT",
    url: "https://opensource.org/licenses/MIT",
  },
};
