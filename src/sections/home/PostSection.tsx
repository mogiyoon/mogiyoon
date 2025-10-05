import React from 'react';
import { useTranslation } from 'react-i18next';

const PostsSection: React.FC = () => {
  const { t } = useTranslation();
  const velogUrl = 'https://velog.io/@mogiyoon/posts';

  return (
    <div className="relative animate-fade-in text-center text-lg text-gray-400">
      {/* 배경 이미지 레이어 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        {/* 중앙 살짝 위: 메인 이미지 */}
        <img
          src="/images/postSection/image2.png"
          alt=""
          className="
            absolute left-1/2 top-1/2
            scale-[1.2]
            -translate-x-[60%] -translate-y-[125%]
            sm:-translate-x-[50%] sm:-translate-y-[125%]
            lg:-translate-x-[90%] lg:-translate-y-[135%]
            rounded-xl
            shadow-[0_10px_30px_rgba(0,0,0,0.35)]
            brightness-[1.02] contrast-[1.03]
          "
        />

        {/* 좌측 아래: 보조 이미지 2 */}
        <img
          src="/images/postSection/image1.png"
          alt=""
          className="
            absolute left-1/2 top-1/2
            scale-[1.4]
            -translate-x-[30%] -translate-y-[-40%]
            sm:-translate-x-[60%] sm:-translate-y-[-35%]
            lg:-translate-x-[130%] lg:-translate-y-[-40%]
            rounded-xl
            shadow-[0_8px_24px_rgba(0,0,0,0.30)]
            opacity-95
          "
        />

        {/* 우측 위: 보조 이미지 3 */}
        <img
          src="/images/postSection/image3.png"
          alt=""
          className="
            absolute left-1/2 top-1/2
            scale-[1.4]
            -translate-x-[-45%] -translate-y-[25%]
            sm:-translate-x-[-40%] sm:-translate-y-[25%]
            lg:translate-x-[55%] lg:-translate-y-[25%]
            rounded-xl
            shadow-[0_8px_24px_rgba(0,0,0,0.28)]
            opacity-95
          "
        />
      </div>

      {/* 앞 레이어: 텍스트 & 버튼 */}
      <div className="relative z-10 space-y-6">
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
    </div>
  );
};

export default PostsSection;