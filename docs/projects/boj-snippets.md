# BOJ Snippets Mogiyoon

> 백준 문제풀이용 코드 스니펫 자동 삽입 크롬 확장프로그램

*소스: [public/data/projects/boj-snippets.json](../../public/data/projects/boj-snippets.json) + [public/locales/ko/projects/project-boj-snippets.json](../../public/locales/ko/projects/project-boj-snippets.json)*

## Overview

| 항목 | 내용 |
|---|---|
| 구분 | 개인 프로젝트 |
| 기간 | 2025.04 |
| 기술 스택 | Chrome Extension, Manifest V3, JavaScript |
| GitHub | https://github.com/mogiyoon/boj-snippets |
| Demo | https://chromewebstore.google.com/detail/boj-snippets-mogiyoon/omehpjefcoebjfcbiegjaaklfeelkpam |

백준(BOJ) 문제 풀이 시 반복적으로 작성해야 하는 보일러플레이트 코드의 자동 삽입을 위해 개발한 Chrome Extension임. 언어 선택 시 해당 언어에 맞는 기본 코드가 에디터에 자동 삽입되며, 옵션 페이지를 통해 스니펫과 매칭 규칙을 자유롭게 커스터마이징할 수 있음.

**주요 기능**: 언어별 스니펫 자동 삽입, 수동 삽입 버튼, 스니펫/규칙 커스터마이징, 크롬 계정 동기화

## Features

- **자동 삽입** — 언어 선택 시 해당 언어에 맞는 보일러플레이트 코드를 에디터에 자동 삽입
- **커스터마이징** — 옵션 페이지에서 스니펫과 언어 매칭 규칙의 추가/수정/삭제 지원
- **크롬 동기화** — `chrome.storage.sync`를 활용하여 크롬 계정 기반의 다중 기기 간 설정 동기화
- **CSP 우회** — Background Service Worker를 통해 CSP가 적용된 사이트에서도 안정적으로 동작

## Development

### 개발 동기

백준에서 문제를 풀 때마다 C++의 `ios::sync_with_stdio(false)`, Python의 `sys.stdin.readline`, Java의 `BufferedReader`, JavaScript의 `readline` 등 동일한 보일러플레이트 코드를 반복 작성해야 함. 풀이와 무관하나 필수적인 코드를 매번 타이핑하는 과정에서 비효율과 휴먼 에러가 발생함.

### CodeMirror 에디터 코드 주입

백준의 코드 에디터는 단순 `textarea`가 아닌 CodeMirror 라이브러리로 구현되어 있어, CodeMirror가 제공하는 `setValue()` 함수를 통해서만 코드 삽입이 가능함.

크롬 확장프로그램의 Content Script는 Isolated World에서 실행되어 HTML 요소는 접근 가능하나 웹페이지의 JS 객체에는 접근 불가함. Background Service Worker에서 `chrome.scripting.executeScript` API를 사용하여 브라우저가 직접 웹페이지 컨텍스트에서 코드를 실행하는 방식으로 해결함.

### 저장 구조 설계

스니펫과 언어 매칭 규칙을 `chrome.storage.sync`에 저장함. 스니펫은 키-값(언어명-코드) 형태로, 매칭 규칙은 `matchType`/`pattern`/`presetKey` 구조의 배열로 관리됨.

백준에서 'Python 3' 선택 시, 규칙을 순회하여 'python'이 포함된 규칙을 탐색하고 해당 키의 스니펫을 에디터에 삽입함. 옵션 페이지에서 규칙과 스니펫의 추가/수정/삭제가 가능하여 하드코딩 없이 새 언어 추가를 지원함.

## Troubleshooting

### 1. Isolated World + CSP 차단 문제

- **문제**: 크롬 확장프로그램과 웹페이지는 동일한 HTML을 공유하나 JS 변수는 격리되어 있음(Isolated World). CodeMirror의 JS 객체에 접근하기 위해 웹페이지 컨텍스트에서의 코드 실행이 필요했음.
- **해결 과정**:
  1. 페이지에 `<script>` 태그 직접 주입 → 백준의 CSP(Content Security Policy)에 차단됨.
  2. Manifest V3의 `world: 'MAIN'` 옵션 적용 → 내부적으로 인라인 스크립트를 생성하므로 동일하게 CSP에 차단됨.
  3. 확장프로그램 파일을 `<script src>`로 로드 → `chrome-extension://` 프로토콜 역시 CSP에 의해 차단됨.
  4. **최종 해결**: Background Service Worker에서 `chrome.scripting.executeScript`를 `world: 'MAIN'` 옵션과 함께 사용함. 크롬 브라우저 자체가 실행하는 방식이므로 CSP 제한을 회피함.

### 2. Chosen 라이브러리 이벤트 감지 문제

- **문제**: 백준은 Chosen UI 라이브러리를 적용하여 드롭다운을 렌더링함. 실제 `<select>` 태그는 숨겨진 상태에서 Chosen이 생성한 커스텀 UI가 표시되는 구조로, `change` 이벤트만으로는 언어 변경을 안정적으로 감지할 수 없었음.
- **해결**: 3중 감시 체계를 구축함.
  - (1) 기본 `change` 이벤트 리스너
  - (2) `MutationObserver`를 통한 DOM 속성 변경 감시
  - (3) 500ms 간격의 폴링을 통한 값 변경 확인
- 세 가지 방식을 병행하여 모든 상황에서 언어 변경을 감지함.

### 3. Extension Context Invalidated 에러

- **문제**: 개발 중 확장프로그램 새로고침 시 `Extension context invalidated` 에러가 발생함. 확장프로그램 재시작 시 기존 페이지의 Content Script가 이전 인스턴스에 연결된 상태로 유지되기 때문임.
- **해결**: 개발 환경에서만 발생하는 문제로, 확장프로그램 새로고침 후 백준 페이지도 함께 새로고침하여 해결함.

## Results

### 배운 점

- **확장프로그램과 웹페이지의 실행 환경 격리** — HTML은 공유하나 JS 변수는 격리되어 있으며, 페이지의 JS 객체 접근 시 `chrome.scripting.executeScript`를 통한 우회가 필요함.
- **CSP 정책의 엄격한 적용** — 3가지 스크립트 주입 방식이 모두 차단되었으며, 브라우저 자체가 실행하는 방식만이 유효함.
- **커스텀 UI 라이브러리의 이벤트 처리** — Chosen, Select2 등의 UI 라이브러리가 기본 이벤트를 가로채는 경우가 빈번하여 단일 이벤트가 아닌 다중 감지 방식의 적용이 필요함.

### 회고

- Chrome Extension의 보안 모델(Isolated World, CSP)과 서드파티 라이브러리(CodeMirror, Chosen)의 내부 동작 원리를 심층적으로 이해하는 계기가 됨.
- 다수의 시도를 통해 문제를 다각도로 접근하고 브라우저 내부 구조를 파악하는 역량을 강화함.
- 옵션 페이지를 통한 커스터마이징 기능 설계로, 하드코딩 없이 확장 가능한 구조를 설계하는 경험을 축적함.

## Development Process

1. **문제 인식** — 백준에서 동일한 보일러플레이트 코드를 반복 작성하는 비효율성 인지
2. **핵심 기능 구현** — Chrome Extension Manifest V3 기반으로 CodeMirror 에디터에 코드를 주입하는 메커니즘 개발
3. **안정화 및 배포** — Chosen 라이브러리 대응, 옵션 페이지 구현, `chrome.storage.sync` 기반 저장 구조 완성 후 Chrome Web Store 배포

## License

MIT License — https://opensource.org/licenses/MIT

## Claude 협업 정보

| 항목 | 내용 |
|---|---|
| 협업 방식 | `direct` (단일 에이전트 직접 사용) |
| 요약 | 바이브 코딩으로 개발 |
| 상세 | Claude Code CLI를 단일 에이전트로 활용하여 설계부터 구현까지 진행함. 하네스 없이 직접 대화 방식으로 개발을 수행함. |
