import React from 'react';

/**
 * `target="_blank"` + `rel="noopener noreferrer"` 를 기본값으로 깔아둔 외부 링크 a 태그.
 *
 * 6 사이트에서 동일하게 두 속성을 반복 작성하던 보일러플레이트를 제거하기 위한 얇은 wrapper.
 * 그 외 모든 anchor 속성 (href / className / onClick / aria-* 등) 은 그대로 forward 한다.
 *
 * rel / target 을 명시적으로 override 하면 그 값이 우선한다 (예: `rel="noreferrer"`).
 *
 * @example
 * <ExternalLink href="https://example.com" className="text-accent-600">
 *   사이트 방문
 * </ExternalLink>
 */
const ExternalLink: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => (
  <a
    {...props}
    target={props.target ?? '_blank'}
    rel={props.rel ?? 'noopener noreferrer'}
  />
);

export default ExternalLink;
