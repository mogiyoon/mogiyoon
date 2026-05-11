/**
 * 1-based 인덱스를 2자리 0-padded 문자열로 변환한다.
 *
 * 예: formatIndex(0) => "01", formatIndex(11) => "12"
 *     formatIndex(0, "AI·") => "AI·01"
 *
 * width 인자로 padding 자릿수를 조정할 수 있다 (기본 2).
 */
export const formatIndex = (index: number, prefix?: string, width: number = 2): string => {
  const padded = String(index + 1).padStart(width, '0');
  return prefix ? `${prefix}${padded}` : padded;
};
