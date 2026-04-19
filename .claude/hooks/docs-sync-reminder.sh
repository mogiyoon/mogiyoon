#!/usr/bin/env bash
# docs-sync-reminder.sh
#
# PostToolUse hook — 포트폴리오 데이터/로케일 파일(Edit/Write/MultiEdit) 수정 시
# 대응되는 docs/ 하위 MD 갱신 리마인더를 Claude에게 전달함.
#
# 입력: stdin JSON (Claude Code hook 규격)
#   { "tool_name": "...", "tool_input": { "file_path": "..." , ... }, ... }
# 출력: stderr 리마인더 + exit code 2 (Claude에 피드백 전달)

set -euo pipefail

# stdin에서 file_path 추출 (python3 사용; macOS 기본 제공)
FILE_PATH="$(python3 -c 'import json, sys
try:
    d = json.load(sys.stdin)
    ti = d.get("tool_input") or {}
    print(ti.get("file_path") or "")
except Exception:
    print("")' 2>/dev/null || true)"

# file_path가 없거나 docs/ 내부 파일을 Claude가 편집한 경우는 리마인더 불필요
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

case "$FILE_PATH" in
  */docs/*)
    exit 0
    ;;
esac

# 매칭 테이블
DOC_TARGET=""
case "$FILE_PATH" in
  */public/data/projects-list.json|*/public/locales/*/projects.json)
    DOC_TARGET="docs/projects/README.md"
    ;;
  */public/data/preparing-projects-list.json|*/public/locales/*/prepareProjects.json)
    DOC_TARGET="docs/projects/preparing.md"
    ;;
  */public/data/introduction.json|*/public/locales/*/introduction.json)
    DOC_TARGET="docs/profile/ (work-experience.md, education.md, awards.md, certificates.md, skills.md 중 관련 파일)"
    ;;
  */public/data/projects/project-schema.json)
    DOC_TARGET="docs/projects/README.md §'프로젝트 MD 공통 구조' (스키마 변경 시 공통 구조 재검토)"
    ;;
  */public/data/projects/*.json)
    BASE="$(basename "$FILE_PATH" .json)"
    DOC_TARGET="docs/projects/${BASE}.md"
    ;;
  */public/locales/*/projects/project-*.json)
    BASE="$(basename "$FILE_PATH" .json)"
    ID="${BASE#project-}"
    DOC_TARGET="docs/projects/${ID}.md"
    ;;
  *)
    exit 0
    ;;
esac

# exit 2 + stderr → Claude에 피드백으로 전달됨
{
  echo ""
  echo "[docs-sync-reminder]"
  echo "변경 파일: $FILE_PATH"
  echo "대응 문서: $DOC_TARGET"
  echo "이력서용 MD 문서가 데이터와 동기화되어야 함. 내용이 바뀌었다면 위 문서도 함께 갱신할 것."
} >&2

exit 2
