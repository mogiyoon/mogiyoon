# Test Maker

> 나만의 단어장, 나만의 시험지

*소스: [public/data/projects/test-maker.json](../../public/data/projects/test-maker.json) + [public/locales/ko/projects/project-test-maker.json](../../public/locales/ko/projects/project-test-maker.json)*

## Overview

| 항목 | 내용 |
|---|---|
| 구분 | 개인 프로젝트 |
| 기간 | 2024.11 ~ 2025.02 |
| 기술 스택 | React Native, Google Vision API, Redux |
| GitHub | https://github.com/mogiyoon/Test_Maker |
| Demo | https://play.google.com/store/apps/details?id=com.test_maker |

학생이나 어학 공부를 하는 사람들은 종종 책의 단어를 노트에 옮겨 적고, 외우고, 스스로 시험 보는 과정을 반복함. Test Maker는 이 지루하고 비효율적인 과정을 기술로 해결함. 카메라로 찍기만 하면 텍스트가 단어장으로, 단어장은 다시 시험지로 자동 변환되어 사용자는 '학습'에만 집중할 수 있음.

**주요 기능**: OCR 단어 추출, 단어장 관리, 객관식/주관식 시험지 자동 생성 및 내보내기

## Features

- **스마트 OCR 단어 추출** — 카메라로 책·문서를 촬영하면 광학 문자 인식을 통해 원하는 단어와 의미를 자동으로 추출하여 단어장에 추가함.

## Development

### 단어장 제작 및 관리 기능

단어장을 만들기 위해 OCR API 데이터 추출, 추출 데이터의 상태 관리, 단어장 저장 기능이 필요함. OCR API 중에서는 한글·영문 인식률이 높고 변환 속도가 빠른 모델을 선택함. API 응답 데이터는 타입 안정성이 우수하고 디버깅이 용이한 Redux로 관리함. 저장 시에는 단어·의미·카테고리·오답횟수 등 정보 관리에 용이한 Realm을 사용함.

### 단어 카테고리 관리

단어를 대/중/소분류로 나누어 카테고리를 관리하기에는 유연성·확장성이 떨어짐. 폴더 구조가 적합하다고 판단하여 트리 구조 및 재귀 함수를 활용하여 카테고리 기능을 구현함.

### 카테고리/단어 선택 기능

단어장을 생성한 뒤 테스트하거나 피드백을 받을 수 있는 기능이 필요함. 단어를 선택하고, 선택한 단어를 객관식·주관식으로 테스트한 뒤, 오답을 확인하는 기능을 구현함. 단어 선택 과정에서 재귀 함수를 사용하고, 선택된 단어는 전역 상태로 관리됨. 테스트 시 큐에 랜덤으로 단어들을 넣고, 큐 마지막에 마커를 추가하여 지속적으로 테스트가 진행됨. 틀린 단어는 Realm으로 관리하여 단어 선택부터 테스트·오답 확인까지 이어지는 학습 구조를 구현함.

### 단어 테스트 기능

객관식 테스트의 보기를 그리드 형태로 렌더링해야 했음. NPM에 등록된 React Native 그리드 라이브러리의 마지막 업데이트가 오래 전이라 호환성이 떨어졌고, 다른 라이브러리는 설명이 부족함. 따라서 FlatList를 참고하여 그리드 컴포넌트를 구현하고 Create React Library의 도움을 받아 NPM에 직접 배포함. 이를 통해 NPM 생태계·node_modules 라이브러리 작동 방식을 학습함.

별도 라이브러리: [mogiyoon-react-native-simple-grid](mrnsg.md)

## Troubleshooting

### 카테고리의 트리 구조화

- **문제**: 카테고리에 위계를 추가하여 카테고리가 중첩되는 자료 형태로 변경되어 기존의 자료 탐색 구조를 사용할 수 없었음.
- **해결**: 폴더 구조에서 착안한 트리 구조를 적용함. 단어 탐색 함수를 재귀 함수로 구현함.
- **결과**: 하위 카테고리의 깊이에 관계없이 탐색이 가능해짐.

## Results

### 결과

- React Native 활용하여 안드로이드·iOS 모두 구현
- 단어 데이터는 트리, 오답 데이터는 힙 자료구조를 사용하여 구현
- Google Vision API를 활용

### 회고

- NPM에서 필요한 컴포넌트 라이브러리(그리드)를 찾지 못해 직접 구현 후 NPM에 배포함 ([mogiyoon-react-native-simple-grid](https://www.npmjs.com/package/mogiyoon-react-native-simple-grid))
- 자료구조를 활용한 프로그램 구현
- TypeScript에 대한 이해도 향상
- 전역 상태 관리 및 로컬 스토리지·로컬 DB에 대한 이해 및 적용

## Development Process

1. **문제 파악** — 기존 단어 암기 방식의 비효율성을 발견하고, 이를 기술로 자동화하여 학습 효율을 높이는 것을 목표로 설정함.

## License

MIT License — https://opensource.org/licenses/MIT
