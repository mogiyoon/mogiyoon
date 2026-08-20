#!/usr/bin/env bash
# 프로젝트별 Open Graph 이미지(1200x630 PNG) 생성.
# 데모 GIF 는 6~36MB 라 og:image 로 쓸 수 없고(공유 크롤러 용량 제한), SVG 아이콘은
# 대부분의 크롤러가 지원하지 않으므로 GIF 첫 프레임을 1200x630 캔버스에 맞춰 PNG 로 뽑는다.
# 스플래시·로그인 화면을 피하려고 기본 3초 지점 프레임을 쓴다 (프로젝트별 SEEK 로 조정).
# 결과는 public/images/<dir>/og.png 로 커밋한다. (CI 에서는 실행하지 않음 — ffmpeg 필요)
#
# 사용법: scripts/generate-og-images.sh
set -euo pipefail
cd "$(dirname "$0")/.."

python3 - <<'PY'
import json, glob, subprocess, os
# 프로젝트별 프레임 시점(초). 기본 3초. 홈 화면이 더 늦게 나오는 데모는 따로 지정한다.
SEEK = {'recho': 5, 'test-maker': 20}
for path in sorted(glob.glob('public/data/projects/*.json')):
    if path.endswith('project-schema.json'):
        continue
    data = json.load(open(path))
    gif = data.get('demoGifSrc')
    if not gif:
        print(f'skip {data["id"]}: no demoGifSrc'); continue
    src = 'public' + gif
    out = os.path.join(os.path.dirname(src), 'og.png')
    vf = ("scale=1200:630:force_original_aspect_ratio=decrease:flags=lanczos,"
          "pad=1200:630:(ow-iw)/2:(oh-ih)/2:color=0xF8FAFC")
    seek = str(SEEK.get(data['id'], 3))
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', seek, '-i', src, '-frames:v', '1',
                    '-vf', vf, out], check=True)
    print(f'{data["id"]}: {out} ({os.path.getsize(out)//1024} KB)')
PY
