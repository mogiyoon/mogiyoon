// ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // 경로가 바뀔 때마다 스크롤을 맨 위로!
  }, [pathname]);

  return null;
}

export default ScrollToTop;