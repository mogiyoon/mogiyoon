# mogiyoon-react-native-simple-grid

> React Native를 위한 간단하고 가벼운 그리드 컴포넌트

*소스: [public/data/projects/mrnsg.json](../../public/data/projects/mrnsg.json) + [public/locales/ko/projects/project-mrnsg.json](../../public/locales/ko/projects/project-mrnsg.json)*

## Overview

| 항목 | 내용 |
|---|---|
| 구분 | 개인 프로젝트 |
| 기간 | 2025.01 |
| 기술 스택 | TypeScript |
| GitHub | https://github.com/mogiyoon/mogiyoon-react-native-simple-grid |
| Demo | https://www.npmjs.com/package/mogiyoon-react-native-simple-grid |

'Test Maker' 프로젝트 진행 중 간단한 그리드 컴포넌트가 필요했으나 NPM에서 적합한 것을 찾지 못함. 직접 경량 그리드 라이브러리를 개발·배포함. 개발자가 데이터와 원하는 컬럼 수만 전달하면 손쉽게 그리드 레이아웃을 만들 수 있음.

**주요 기능**: 컬럼 수 지정, 데이터 매핑 렌더링, 높이 조절 옵션

## Features

- **쉬운 사용법** — `data`와 `columnNumber` 등 최소한의 props로 그리드 레이아웃 생성
- **커스터마이징** — 컬럼 수와 최대 높이를 제어할 수 있는 옵션 제공
- **경량화** — 의존성을 최소화한 간단한 컴포넌트로 프로젝트에 부담이 없음

## Development

### 개발 동기

'Test Maker' 프로젝트에서 간단한 그리드 컴포넌트의 필요성을 느껴 라이브러리를 탐색함. 그러나 NPM의 React Native Grid 컴포넌트는 6년 전 업데이트가 마지막으로 다른 라이브러리와 호환이 안 됨. 다수의 그리드 라이브러리가 있었으나 원하는 기능이 없거나 설명이 부족하여 직접 구현·배포하기로 결정함.

### 개발 과정

- 하나의 컴포넌트씩 반환하는 `renderItem` 함수를 통해 컴포넌트들의 리스트를 먼저 생성함.
- 열의 크기에 따라 컴포넌트들을 행으로 묶은 배열을 생성함.

### 배포

타입 안정성을 위해 TypeScript로 개발하고, 다른 개발자들도 사용할 수 있도록 NPM에 공개 패키지로 배포함.

## Troubleshooting

### 문서 참고 및 라이브러리 활용을 통한 문제 해결

- **문제**: 첫 NPM 배포를 위한 번들링 설정 및 의존성 구성에 어려움을 겪음.
- **해결 과정**:
  1. NPM 배포 프로세스와 TypeScript 라이브러리 번들링 관련 문서를 참고함.
  2. [Create React Native Library](https://www.npmjs.com/package/create-react-native-library)를 분석·활용하여 배포함. ([문서](https://callstack.github.io/react-native-builder-bob/create))
- **결과**: 라이브러리 배포 생태계에 대한 깊은 이해를 얻고 성공적으로 패키지를 배포함.

## Results

### 결과

- NPM에 컴포넌트 라이브러리를 성공적으로 개발·배포함
- 다른 프로젝트에서도 활용할 수 있는 재사용 가능한 컴포넌트 제작
- 확장성 있는 컴포넌트 제작을 위한 TypeScript 이해도 향상

### 회고

- 기획부터 공개까지 라이브러리 개발의 전 과정을 경험함
- 라이브러리 사용자를 위한 명확한 문서화의 중요성을 깨달음
- 하나의 프로젝트에서 마주한 문제를 별도의 모듈형 솔루션으로 만들어 해결하는 방법을 학습함

## Development Process

1. **문제 파악** — 개인 프로젝트에 필요했던 간단하고 적합한 그리드 라이브러리의 부재를 인지함.
2. **핵심 기능 구현** — TypeScript와 React Native 컴포넌트를 사용하여 컬럼 기반 아이템 렌더링 핵심 로직을 개발함.
3. **NPM 배포** — 외부에서 사용할 수 있도록 배포 설정을 완료하고 NPM 레지스트리에 공개함.

## License

MIT License — https://opensource.org/licenses/MIT
