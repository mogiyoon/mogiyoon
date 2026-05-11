import { useEffect } from 'react';

/**
 * prerenderer 가 기다리는 `render-event` 를 공통으로 디스패치한다.
 *
 * - `ready=true` 가 되는 시점마다 이벤트를 한 번 보낸다.
 * - 기본값은 true 이므로 마운트 직후 신호만 필요할 때도 그대로 쓸 수 있다.
 */
export function usePrerenderReadyEvent(ready = true) {
  useEffect(() => {
    if (!ready) return;

    document.dispatchEvent(new Event('render-event'));
  }, [ready]);
}
