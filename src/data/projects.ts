import { ProjectData } from "../types"; // types 폴더에서 ProjectData 임포트
import {
  CameraIcon,
  PenIcon,
  BookIcon,
  LightbulbIcon,
  DownloadIcon,
} from "../assets/icons"; // 아이콘 임포트

export const projects: ProjectData[] = [
  {
    id: "test-maker",
    title: "Test Maker",
    subtitle: "나만의 단어장, 나만의 시험지",
    demoGifSrc: "https://placehold.co/300x500/cccccc/333333?text=App+Demo+GIF",
    introduction:
      "Test Maker는 책이나 노트를 사진으로 찍어 단어를 추출하고, 나만의 단어장을 만들어 학습하며, 터치 몇 번으로 암기용 시험지까지 자동으로 생성해주는 스마트 학습 앱입니다.",
    
    // --- 요약 탭에 들어갈 내용 ---
    summary_overview: `학생과 어학 학습자를 위한 스마트 학습 보조 앱입니다. OCR 기술을 활용해 책 속의 단어를 디지털 단어장으로 만들고, 이를 기반으로 자동 생성된 시험지를 통해 효율적인 암기를 돕습니다. 반복적이고 비효율적인 수기 학습 과정을 자동화하여 사용자가 '학습' 자체에만 집중할 수 있도록 설계되었습니다.`,
    summary_development: `React Native를 기반으로 Google Vision API를 연동하여 핵심 기능인 OCR 단어 추출을 구현했습니다. Redux로 상태를 관리하고, Realm과 AsyncStorage를 사용해 사용자의 단어장 데이터를 로컬에 안전하게 저장합니다. Vision Camera로 카메라 기능을 제어하고, 사용자가 직접 단어를 편집하고 시험 유형을 선택하는 등 다양한 커스텀 기능을 제공합니다.`,
    summary_troubleshooting: `개발 초기, OCR 인식률이 낮고 특히 한글과 영어가 혼용된 텍스트에서 오류가 잦았습니다. 이를 해결하기 위해 이미지 전처리 로직(흑백 전환, 대비 강화)을 추가하고, Google Vision API의 언어 힌트 옵션을 동적으로 설정하여 인식 정확도를 85% 이상으로 끌어올렸습니다. 또한, 대량의 단어장을 관리할 때 발생하던 성능 저하 문제는 데이터베이스 쿼리를 최적화하고 가상화 리스트(VirtualizedList)를 적용하여 해결했습니다.`,
    summary_results: `앱 출시 후 구글 플레이 스토어에서 1,000회 이상의 다운로드를 기록했으며, 사용자 평점 4.5점을 달성했습니다. 특히 중/고등학생 및 공무원 시험 준비생 커뮤니티에서 '단어 암기에 드는 시간을 획기적으로 줄여준다'는 긍정적인 피드백을 받았습니다. PDF 내보내기 기능은 선생님들이 시험지를 만드는 데 유용하게 사용된다는 리뷰도 있었습니다.`,
    summary_retrospective: `이번 프로젝트를 통해 React Native 환경에서 네이티브 모듈(카메라, 로컬 DB)과 외부 API를 연동하는 실무 경험을 쌓을 수 있었습니다. 사용자 피드백을 반영하여 기능을 개선하는 과정에서 빠른 프로토타이핑과 점진적 배포의 중요성을 깨달았습니다. 다음 프로젝트에서는 CI/CD 파이프라인을 구축하여 개발 및 배포 과정을 자동화하고, 서버와 연동하여 단어장 동기화 기능을 추가해보고 싶습니다.`,
    // ---------------------------------

    description: `학생이나 어학 공부를 하는 사람들은 종종 책에 있는 단어를 노트에 옮겨 적고, 외우고, 스스로 시험 보는 과정을 반복합니다. Test Maker는 이 지루하고 비효율적인 과정을 기술로 해결합니다.\n\n카메라로 찍기만 하면 텍스트가 단어장으로, 단어장은 다시 시험지로 자동 변환되어 사용자는 오롯이 '학습'에만 집중할 수 있습니다.`,
    features: [
      {
        name: "📸 스마트 OCR 단어 추출",
        description: "카메라로 책이나 문서를 촬영하면, 광학 문자 인식(OCR) 기술을 통해 원하는 단어와 그 의미를 자동으로 추출하여 단어장에 추가합니다.",
        icon: CameraIcon,
      },
      {
        name: "✍️ 단어/의미 직접 추가",
        description: "OCR뿐만 아니라 사용자가 직접 단어와 뜻을 입력하여 자신만의 사전을 손쉽게 구축할 수 있습니다.",
        icon: PenIcon,
      },
      {
        name: "📚 나만의 의미 사전 구축",
        description: "추가된 단어들은 주제별, 중요도별로 그룹화하여 체계적으로 관리할 수 있는 개인 맞춤형 사전을 제공합니다.",
        icon: BookIcon,
      },
      {
        name: "🧠 자동 문제 생성",
        description: "단어장에 저장된 데이터를 기반으로 객관식, 주관식(단어 쓰기) 등 다양한 유형의 학습 문제를 자동으로 생성합니다.",
        icon: LightbulbIcon,
      },
      {
        name: "📄 시험지 형태로 내보내기",
        description: "생성된 문제들을 실제 시험지와 같은 형태로 이미지 파일(.jpg, .png)이나 PDF로 저장하고, 친구들과 공유하거나 인쇄할 수 있습니다.",
        icon: DownloadIcon,
      },
    ],
    screenshots: [
        { title: "Main Screen", src: "https://placehold.co/300x550/f0f0f0/333?text=Main" },
        { title: "My Test", src: "https://placehold.co/300x550/f0f0f0/333?text=My+Test" },
        { title: "Camera", src: "https://placehold.co/300x550/f0f0f0/333?text=Camera" },
        { title: "Text Input", src: "https://placehold.co/300x550/f0f0f0/333?text=Input" },
        { title: "Test Result", src: "https://placehold.co/300x550/f0f0f0/333?text=Result" },
    ],
    techStack: [
      { category: "Core", items: ["React Native"] },
      { category: "State Management", items: ["Redux"] },
      { category: "Navigation", items: ["React Navigation"] },
      { category: "OCR", items: ["Google Vision API"] },
      { category: "Camera", items: ["react-native-vision-camera"] },
      { category: "Local Storage", items: ["AsyncStorage", "Realm"] },
      { category: "UI/Component", items: ["Styled-components"] },
    ],
    developmentProcess: [
      {
        title: "문제 파악",
        content: "기존 단어 암기 방식의 비효율성(수기 작성, 직접 채점)을 발견하고, 이를 기술로 자동화하여 학습 효율을 높이는 것을 목표로 설정했습니다.",
      },
      {
        title: "접근 방식/가설",
        content: "모바일 카메라의 OCR 기능을 활용하면 텍스트를 쉽게 디지털화할 수 있을 것이라 가설을 세웠습니다. 추출된 텍스트를 기반으로 단어장을 만들고, 이를 활용해 자동으로 시험지를 생성하는 앱을 구현하기로 결정했습니다.",
      },
      {
        title: "구현/해결",
        content: "React Native를 사용하여 크로스플랫폼 앱으로 개발을 시작했습니다. Google Vision API를 연동하여 OCR 기능을 구현했고, Redux로 앱의 전체 상태를 관리했습니다. 데이터의 영속성을 위해 Realm DB를 도입하여 사용자의 단어장 데이터를 관리하도록 했습니다.",
      },
      {
        title: "트러블 슈팅/회고",
        content: "한글과 영어가 섞인 텍스트에서 OCR 인식률이 저하되는 문제가 있었습니다. 이미지 전처리 과정을 추가하고 API의 언어 옵션을 조정하여 정확도를 개선했습니다. 이 과정을 통해 외부 API 사용 시 예외 처리와 최적화의 중요성을 깨달았습니다.",
      },
    ],
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
];
