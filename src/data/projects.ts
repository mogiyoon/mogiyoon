import { ProjectData } from "../types";
// 아이콘 경로는 실제 프로젝트에 맞게 수정해주세요.
import { CameraIcon, PenIcon, BookIcon, LightbulbIcon, DownloadIcon } from "../assets/icons";

export const projects: ProjectData[] = [
  {
    id: "test-maker",
    title: "Test Maker",
    subtitle: "나만의 단어장, 나만의 시험지",
    demoGifSrc: "https://placehold.co/300x500/cccccc/333333?text=App+Demo+GIF",
    description: `학생이나 어학 공부를 하는 사람들은 종종 책에 있는 단어를 노트에 옮겨 적고, 외우고, 스스로 시험 보는 과정을 반복합니다. Test Maker는 이 지루하고 비효율적인 과정을 기술로 해결합니다.\n\n카메라로 찍기만 하면 텍스트가 단어장으로, 단어장은 다시 시험지로 자동 변환되어 사용자는 오롯이 '학습'에만 집중할 수 있습니다.`,
    
    // '개요' 데이터를 별도 객체로 분리
    overview: {
        period: "2024.01 ~ 2024.03",
        introduction: "OCR 기술을 활용해 책 속의 단어를 디지털 단어장으로 만들고, 자동 생성된 시험지를 통해 효율적인 암기를 돕는 스마트 학습 보조 앱입니다.",
        features: "OCR 단어 추출, 단어장 관리, 객관식/주관식 시험지 자동 생성 및 PDF 내보내기",
        techStack: "React Native, Redux, Google Vision API, Realm"
    },
    
    // '개요'를 제외한 나머지 요약 섹션들
    summaries: [
        {
            id: 'development',
            title: '구현 기능',
            parts: [
                { type: 'text', content: `React Native를 기반으로 Google Vision API를 연동하여 핵심 기능인 OCR 단어 추출을 구현했습니다. Redux로 상태를 관리하고, Realm과 AsyncStorage를 사용해 사용자의 단어장 데이터를 로컬에 안전하게 저장합니다.` },
                { type: 'image', src: 'https://placehold.co/600x300/e2e8f0/4a5568?text=Architecture+Diagram', alt: '프로젝트 아키텍처 다이어그램' },
                { type: 'text', content: `Vision Camera로 카메라 기능을 제어하고, 사용자가 직접 단어를 편집하고 시험 유형을 선택하는 등 다양한 커스텀 기능을 제공합니다. 또한, 생성된 시험지를 PDF나 이미지로 내보내는 기능을 구현하여 학습 자료의 활용도를 높였습니다.` }
            ]
        },
        {
            id: 'troubleshooting',
            title: '트러블 슈팅',
            parts: [
                { type: 'text', content: `개발 초기, OCR 인식률이 낮고 특히 한글과 영어가 혼용된 텍스트에서 오류가 잦았습니다. 이를 해결하기 위해 이미지 전처리 로직(흑백 전환, 대비 강화)을 추가하고, Google Vision API의 언어 힌트 옵션을 동적으로 설정하여 인식 정확도를 85% 이상으로 끌어올렸습니다.` },
                { type: 'text', content: `또한, 대량의 단어장을 관리할 때 발생하던 성능 저하 문제는 데이터베이스 쿼리를 최적화하고 가상화 리스트(VirtualizedList)를 적용하여 해결했습니다.` }
            ]
        },
        {
            id: 'results',
            title: '프로젝트 결과',
            parts: [
                { type: 'text', content: `앱 출시 후 구글 플레이 스토어에서 1,000회 이상의 다운로드를 기록했으며, 사용자 평점 4.5점을 달성했습니다.` }
            ]
        },
        {
            id: 'retrospective',
            title: '회고',
            parts: [
                { type: 'text', content: `이번 프로젝트를 통해 React Native 환경에서 네이티브 모듈(카메라, 로컬 DB)과 외부 API를 연동하는 실무 경험을 쌓을 수 있었습니다.` }
            ]
        }
    ],

    features: [ { name: "📸 스마트 OCR 단어 추출", description: "카메라로 책이나 문서를 촬영하면, 광학 문자 인식(OCR) 기술을 통해 원하는 단어와 그 의미를 자동으로 추출하여 단어장에 추가합니다.", icon: CameraIcon } ],
    screenshots: [ { title: "Main Screen", src: "https://placehold.co/300x550/f0f0f0/333?text=Main" } ],
    techStack: [ { category: "Core", items: ["React Native"] } ],
    developmentProcess: [ { title: "문제 파악", content: "기존 단어 암기 방식의 비효율성을 발견하고, 이를 기술로 자동화하여 학습 효율을 높이는 것을 목표로 설정했습니다." } ],
    license: { name: "MIT", url: "https://opensource.org/licenses/MIT" },
  },
];