// src/components/ScrollToTop.tsx

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // pathname과 함께 hash 값도 가져옵니다.
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // 애니메이션이 끝날 시간을 벌어주기 위한 setTimeout은 그대로 유지합니다.
    const timer = setTimeout(() => {
      // 만약 URL에 #해시가 있다면, 해당 요소로 스크롤합니다.
      if (hash) {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // #해시가 없다면, 페이지 맨 위로 스크롤합니다.
        window.scrollTo(0, 0);
      }
    }, 300); // 300ms 딜레이는 AnimatePresence 애니메이션을 위해 유지하는 것이 좋습니다.

    return () => clearTimeout(timer);
  }, [pathname, hash]); // pathname 또는 hash가 변경될 때마다 이 로직을 실행합니다.

  return null;
};

export default ScrollToTop;