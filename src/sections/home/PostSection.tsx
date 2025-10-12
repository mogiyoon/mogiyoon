import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; // ✅ 페이지 스크롤 막기
    return () => {
      document.body.style.overflow = original;
    };
  }, [active]);
}

const imageVariants = {
  hidden: (custom: { x: number; y: number }) => ({
    opacity: 0,
    x: custom.x,
    y: custom.y,
  }),
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 1.0,
      ease: [0.22, 1, 0.36, 1],
    },
  },
} as const;

const PostsSection: React.FC = () => {
  useBodyScrollLock(true);

  const { t } = useTranslation();
  const velogUrl = 'https://velog.io/@mogiyoon/posts';

  return (
    <motion.div
      className="
        text-center text-lg text-gray-400
        w-screen h-screen flex items-center justify-center
      "
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.5, delayChildren: 0.1} },
      }}
    >
      {/* 배경 이미지 레이어 */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <motion.img
          src="/images/postSection/image2.png"
          alt=""
          variants={imageVariants}
          custom={{ x: -36, y: -20 }}
          className="
            absolute
            bottom-[55vh] right-[35vw]
            lg:right-[45vw]
            w-[70vw] lg:w-[50vw]
            scale-[1.2]
            rounded-xl
            shadow-[0_10px_30px_rgba(0,0,0,0.35)]
            brightness-[1.02] contrast-[1.03]
            will-change-transform"
        />

        <motion.img
          src="/images/postSection/image1.png"
          alt=""
          variants={imageVariants}
          custom={{ x: 36, y: 36 }}
          className="
            absolute
            top-[52vh] left-[67vw]
            w-[70vw] lg:w-[50vw]
            scale-[1.4]
            rounded-xl
            shadow-[0_8px_24px_rgba(0,0,0,0.30)]
            opacity-95
            will-change-transform"
        />

        {/* 왼쪽 아래: 이미지 3 */}
        <motion.img
          src="/images/postSection/image3.png"
          alt=""
          variants={imageVariants}
          custom={{ x: -36, y: 36 }}
          className="
            absolute
            top-[65vh] right-[55vw]
            lg:right-[60vw]
            w-[70vw] lg:w-[50vw]
            scale-[1.4]
            rounded-xl
            shadow-[0_8px_24px_rgba(0,0,0,0.28)]
            opacity-95
            will-change-transform"
        />
      </div>

      {/* 앞 레이어: 텍스트 & 버튼 */}
      <div
        className="relative z-10 space-y-6"
      >
        <p
          className="
            px-5 py-2
            font-bold text-black text-xl
            rounded-lg bg-white/50 backdrop-blur-sm
            shadow-[0_0_15px_rgba(255,255,255,0.2)]
          "
        >
          {t('postsPreparingMessage2')}
        </p>

        <a
          href={velogUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-block px-8 py-3 
            font-semibold text-white bg-gray-800 
            border border-gray-700 rounded-lg 
            hover:bg-gray-700 hover:border-gray-600
            focus:outline-none focus:ring-2 focus:ring-gray-500
            transition-all duration-300 ease-in-out
            transform hover:scale-105
          "
        >
          {t('visitVelog')}
        </a>
      </div>
    </motion.div>
  );
};

export default PostsSection;