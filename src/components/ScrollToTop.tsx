// src/components/ScrollToTop.tsx

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 애니메이션이 끝날 시간을 벌어주기 위해 setTimeout을 사용합니다.
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;