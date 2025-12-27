// src/components/ContactModal.tsx

import React, { useState } from "react";
import { activeKey, type ContactHoverKey } from "../types";
import { InfoIcon } from "./InfoIcon";

// 연락처 및 링크 정보
const personalInfo = {
  email: "mogiyoon@gmail.com",
  github: "https://github.com/mogiyoon",
  blog: "https://velog.io/@mogiyoon/posts",
};

// Modal 컴포넌트의 props 타입 정의
interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [active, setActive] = useState<ContactHoverKey | null>(null);
  const [hyperlink, setHyperlink] = useState<string | undefined>(undefined);

  // isOpen이 false이면 아무것도 렌더링하지 않음
  if (!isOpen) {
    return null;
  }

  return (
    // 모달 배경 (클릭 시 닫힘)
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* 모달 컨텐츠 (이벤트 버블링 방지) */}
      <div
        className="bg-white w-full max-w-4xl rounded-2xl shadow-xl p-6 md:p-10 relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center">
          Info
        </h2>
        <div
          className="flex flex-col gap-6 text-lg"
          style={{ flexDirection: "row", justifyContent: "space-evenly" }}
        >
          {/* Email */}
          <InfoIcon
            link={personalInfo.email}
            activeKeyType={activeKey.email}
            active={active}
            setActive={setActive}
            setLink={setHyperlink}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
          </InfoIcon>
          {/* GitHub */}
          <InfoIcon
            link={personalInfo.github}
            activeKeyType={activeKey.github}
            active={active}
            setActive={setActive}
            setLink={setHyperlink}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </InfoIcon>
          {/* Blog */}
          <InfoIcon
            link={personalInfo.blog}
            activeKeyType={activeKey.blog}
            active={active}
            setActive={setActive}
            setLink={setHyperlink}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12.75 19.5v-.75a7.5 7.5 0 0 0-7.5-7.5H4.5m0-6.75h.75c7.5 0 13.5 6 13.5 13.5v.75M6 18.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          </InfoIcon>
        </div>
        <div
          className={`
    flex items-center justify-center text-center overflow-hidden
    transition-all duration-700 ease-out
    ${
      active
        ? "opacity-100 translate-y-0 max-h-[120px]"
        : "opacity-0 -translate-y-2 max-h-0"
    }
  `}
        >
          <a
            href={hyperlink}
            target="_blank"
            rel="noopener noreferrer"
            className="
      inline-flex items-center gap-2
      px-5 py-3
      rounded-2xl
      bg-white/70 backdrop-blur-md
      border border-gray-200/70
      shadow-[0_8px_30px_rgba(0,0,0,0.08)]
      text-gray-700
      hover:text-gray-900
      hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]
      hover:scale-[1.02]
      active:scale-[0.99]
      transition-all duration-300
      max-w-full
    "
          >
            {/* 링크 아이콘 */}
            <svg
              className="w-5 h-5 flex-shrink-0 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 10.5l-3 3m1.06-7.56l1.78-1.78a4.5 4.5 0 016.36 6.36l-1.78 1.78m-7.56 1.06l-1.78 1.78a4.5 4.5 0 11-6.36-6.36l1.78-1.78"
              />
            </svg>

            {/* 텍스트 */}
            <span className="truncate font-medium">{hyperlink}</span>

            {/* 새 창 아이콘 */}
            <svg
              className="w-4 h-4 flex-shrink-0 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 3h7v7"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 14L21 3"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 14v6a1 1 0 01-1 1H7a1 1 0 01-1-1V7a1 1 0 011-1h6"
              />
            </svg>
          </a>
        </div>
        <footer className="text-center pt-8 text-gray-500 text-sm">
          &copy; 2025 My Portfolio. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default ContactModal;
