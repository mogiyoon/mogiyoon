// src/data/projects.ts

import { ProjectData } from "../types";
// 아이콘 경로는 실제 프로젝트에 맞게 수정해주세요.
import { CameraIcon } from "../assets/icons";

export const projects: ProjectData[] = [
  {
    id: "test-maker",
    title: "Test Maker",
    subtitle: "나만의 단어장, 나만의 시험지",
    demoGifSrc: "/images/TestMakerGif.gif",
    description: `학생이나 어학 공부를 하는 사람들은 종종 책에 있는 단어를 노트에 옮겨 적고, 외우고, 스스로 시험 보는 과정을 반복합니다. Test Maker는 이 지루하고 비효율적인 과정을 기술로 해결합니다.\n\n카메라로 찍기만 하면 텍스트가 단어장으로, 단어장은 다시 시험지로 자동 변환되어 사용자는 오롯이 '학습'에만 집중할 수 있습니다.`,
    
    overview: {
        projectType: "개인 프로젝트",
        period: "2024.11 ~ 2025.02",
        introduction: "문제를 직접 만들고 테스트할 수 있는 프로그램",
        features: "OCR 단어 추출, 단어장 관리, 객관식/주관식 시험지 자동 생성 및 내보내기",
        techStack: ["React Native", "Google Vision API", "Redux",],
        links: {
            github: "https://github.com/mogiyoon/Test_Maker"
        }
    },
    
    summaries: [
        {
            id: 'development',
            title: '구현 기능 및 개발 과정',
            // ✅ 변경된 부분: parts를 2차원 배열로 수정
            parts: [
                // PDF 왼쪽 컬럼에 들어갈 내용
                [
                    { type: 'image', src: '/images/overview/MakerOcr.png', alt: '프로젝트 아키텍처 다이어그램' },
                    { type: 'text', content: `React Native를 기반으로 Google Vision API를 연동하여 핵심 기능인 OCR 단어 추출을 구현했습니다. Redux로 상태를 관리하고, Realm과 AsyncStorage를 사용해 사용자의 단어장 데이터를 로컬에 안전하게 저장합니다.` },
                ],
                // PDF 오른쪽 컬럼에 들어갈 내용
                [
                    { type: 'image', src: '/images/overview/MakerWordEdit.png', alt: '프로젝트 아키텍처 다이어그램' },
                    { type: 'text', content: `설정해둔 특수 기호를 활용하여 텍스트를 순회하며 낱말과 뜻을 추출합니다.` },
                    { type: 'text', content: `'-' 기호를 사용하여 단어의 카테고리 위계를 구분합니다.` },
                ],
                [
                    { type: 'image', src: '/images/overview/TestWordPage.png', alt: '프로젝트 아키텍처 다이어그램' },
                    { type: 'text', content: `특정 카테고리에 포함된 단어를 선택하면 전역 변수에 저장되며 테스트 가능합니다.` },
                ],
                [
                    { type: 'image', src: '/images/overview/TestTesting.png', alt: '프로젝트 아키텍처 다이어그램' },
                    { type: 'text', content: `테스트는 객관식과 주관식 두 방식으로 선택 가능합니다.` },
                    { type: 'text', content: `틀린 단어에 대해 오답 목록이 제공되며, 객관식 형태로 단어시험 내보내기가 가능합니다.` },
                ]
            ]
        },
        {
            id: 'troubleshooting',
            title: '트러블 슈팅',
            // ✅ 변경된 부분: 홑 컬럼만 사용할 경우에도 2차원 배열 구조를 유지
            parts: [
                [
                    { type: 'image', src: '/images/overview/TroubleShooting.png', alt: '프로젝트 아키텍처 다이어그램' },
                ],
                [
                    { type: 'text', content: `문제 상황: 카테고리에 위계를 추가하여 카테고리가 중첩되는 자료 형태로 변경됐고,  따라서 기존의 자료 탐색 구조를 사용할 수 없었습니다.` },
                    { type: 'text', content: `해결 과정: 폴더 구조에서 착안한 트리 구조를 적용했고, 단어 탐색 함수를 재귀 함수로 구현했습니다.` },
                    { type: 'text', content: `결과:  하위 카테고리의 깊이에 관련없이 탐색이 가능합니다.` },
                ]
            ]
        },
        {
            id: 'results',
            title: '결과 및 회고',
            parts: [
                [
                    { type: 'text', content: `결과` },
                    { type: 'text', content: `\tReact Native 활용하여 안드로이드, IOS 모두 구현` },
                    { type: 'text', content: `\t단어 데이터는 트리, 오답 데이터는 힙 자료 구조를 사용하여 구현` },
                    { type: 'text', content: `\tGoogle Vision Api를 활용` },
                ],
                [
                    { type: 'text', content: `회고` },
                    { type: 'text', content: `\tNPM에서 필요한 컴포넌트 라이브러리(그리드)를 찾지 못해 직접 구현하고 NPM에 배포` },
                    { type: 'link', label: 'mogiyoon-react-native-simple-grid', href: `https://www.npmjs.com/package/mogiyoon-react-native-simple-grid` },
                    { type: 'text', content: `\t자료구조를 활용한 프로그램 구현` },
                    { type: 'text', content: `\tType Script에 대한 이해도 향상` },
                    { type: 'text', content: `\t전역 상태 관리 및 로컬 스토리지, 로컬 DB에 대한 이해 및 적용` },
                ],
            ]
        },
        {
            id: 'blank',
            title: '감사합니다.',
            parts: [
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