import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
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
    transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

const PostsSection: React.FC = () => {
  useBodyScrollLock(true);
  const { t } = useTranslation();
  const velogUrl = 'https://velog.io/@mogiyoon/posts';

  return (
    <motion.div
      className="
        fixed inset-0
        flex items-center justify-center
        text-center text-lg text-gray-400
        overflow-clip
      "
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.5, delayChildren: 0.1 } },
      }}
      style={{ contain: 'layout paint size style' }}
    >
      {/* 배경 이미지 레이어: 레이아웃에 영향 없도록 fixed + overflow-clip */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-clip"
      >
        <motion.img
          src="/images/postSection/image2.png"
          alt=""
          variants={imageVariants}
          custom={{ x: -36, y: -20 }}
          className="
            absolute
            bottom-[55vh] right-[35vw] lg:right-[45vw]
            w-[min(70vmin,600px)] lg:w-[min(50vmin,560px)]
            scale-[1.15]
            rounded-xl
            shadow-[0_10px_30px_rgba(0,0,0,0.35)]
            brightness-[1.02] contrast-[1.03]
            will-change-transform
          "
          style={{ transformOrigin: 'center' }}
        />

        <motion.img
          src="/images/postSection/image1.png"
          alt=""
          variants={imageVariants}
          custom={{ x: 36, y: 36 }}
          className="
            absolute
            top-[52vh] left-[67vw]
            w-[min(70vmin,600px)] lg:w-[min(50vmin,560px)]
            scale-[1.25]
            rounded-xl
            shadow-[0_8px_24px_rgba(0,0,0,0.30)]
            opacity-95
            will-change-transform
          "
          style={{ transformOrigin: 'center' }}
        />

        <motion.img
          src="/images/postSection/image3.png"
          alt=""
          variants={imageVariants}
          custom={{ x: -36, y: 36 }}
          className="
            absolute
            top-[65vh] right-[55vw] lg:right-[60vw]
            w-[min(70vmin,600px)] lg:w-[min(50vmin,560px)]
            scale-[1.25]
            rounded-xl
            shadow-[0_8px_24px_rgba(0,0,0,0.28)]
            opacity-95
            will-change-transform
          "
          style={{ transformOrigin: 'center' }}
        />
      </div>

      {/* 앞 레이어: 텍스트 & 버튼 */}
      <div className="relative z-10 space-y-6">
        <p
          className="
            px-5 py-2 font-bold text-black text-xl
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