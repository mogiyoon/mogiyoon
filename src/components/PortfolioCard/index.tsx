import React from "react";
import { useTranslation } from "react-i18next";
import { useDisclosure } from "../../hooks/useDisclosure";
import type { ProjectSummary } from "../../types";
import { createImageFallbackHandler } from "../../utils/imageFallback";
import {
  PLACEHOLDER_NOT_FOUND_300x200,
  PLACEHOLDER_PROJECT_IMAGE_300x300,
} from "../../utils/placeholders";
import { Chip } from "../primitives/Chip";
import { FlippableCard } from "../primitives/FlippableCard";

interface PortfolioCardProps {
  project: ProjectSummary;
  className?: string;
  onClick: () => void;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({
  project,
  className,
  onClick,
}) => {
  const { t } = useTranslation("projects");

  // 1. 카드의 뒤집힘 상태를 관리하기 위한 state 추가
  const { isOpen: isFlipped, open, close } = useDisclosure(false);

  const handleImageError = createImageFallbackHandler({
    fallbackSrc: PLACEHOLDER_NOT_FOUND_300x200,
  });

  const handleCardClick = () => {
    onClick();
    close();
  };

  const front = (
    <div className="bg-surface rounded-card shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      <div className="p-3 sm:p-4">
        <img
          src={
            project.screenshots.length > 0
              ? project.screenshots[0].src
              : PLACEHOLDER_PROJECT_IMAGE_300x300
          }
          alt={`${t(project.title || "")} Thumbnail`}
          className="w-full aspect-square object-contain rounded-card-chunky"
          onError={handleImageError}
        />
      </div>
      <div className="px-5 pb-4 flex flex-col flex-grow overflow-y-auto sm:px-6">
        <h3 className="mb-2 truncate text-lg font-bold leading-snug sm:text-[1.35rem]">
          {t(project.title || "")}
        </h3>
        <p
          className="
                                mb-2 min-h-[3.3rem]
                                text-sm leading-relaxed text-content-secondary
                                line-clamp-2
                                sm:min-h-[3.8rem] sm:text-[0.95rem]
                            "
        >
          {t(project.subtitle || "")}
        </p>
        <div className="flex flex-wrap mt-auto">
          <Chip tone="accentSoft" size="sm" weight="medium">
            {t(project.projectType || "")}
          </Chip>
        </div>
      </div>
      {project.stickerText && (
        <div
          className={`
                                    pointer-events-none select-none
                                    absolute bottom-4 right-4
                                    w-8 h-8
                                    flex items-center justify-center
                                    rounded-full shadow-lg
                                    bg-gradient-to-br from-amber-300 via-yellow-300 to-amber-500
                                    `}
          aria-hidden
        >
          {/* 하이라이트(광택) */}
          <span
            className="
                                            absolute -top-1 -left-1 w-10 h-10 rounded-full
                                            bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.7),rgba(255,255,255,0)_60%)]
                                        "
          />

          <div className="flex flex-col items-center justify-center leading-none">
            <span className="text-white font-extrabold [text-shadow:0_0_1px_#000,0.5px_0.5px_0.5px_#000]">
              {project.stickerText}
            </span>
          </div>

          {/* 리본 꼬리 (좌/우) */}
          <span
            className="
                                        absolute -bottom-1.5 left-1.5 w-2.5 h-3
                                        [clip-path:polygon(0%_0%,100%_0%,50%_100%)]
                                        rotate-[-90deg]
                                        bg-gradient-to-l from-red-400 via-red-500 to-red-700
                                    "
          />
          <span
            className="
                                        absolute -bottom-1.5 right-1.5 w-2.5 h-3
                                        [clip-path:polygon(0%_0%,100%_0%,50%_100%)]
                                        rotate-[90deg]
                                        bg-gradient-to-r from-red-400 via-red-500 to-red-700
                                    "
          />
        </div>
      )}
    </div>
  );

  const back = (
    <div className="bg-slate-800 text-white rounded-card shadow-lg flex flex-col items-center justify-center p-5 w-full h-full sm:p-6">
      <h4 className="text-lg font-bold mb-4 sm:text-xl">Tech Stack</h4>
      <div className="flex flex-wrap justify-center gap-2">
        {project.techStack?.map((tech) => (
          <Chip
            key={tech}
            tone="accentSolid"
            size="md"
            weight="medium"
            className="sm:text-sm sm:px-3"
          >
            {tech}
          </Chip>
        ))}
      </div>
    </div>
  );

  return (
    <div
      onClick={handleCardClick}
      className={`relative block cursor-pointer ${className || ""}`}
    >
      <FlippableCard
        isFlipped={isFlipped}
        onMouseEnter={open}
        onMouseLeave={close}
        className="w-full aspect-[24/41]"
        front={front}
        back={back}
      />
      {project.claudeInfo && (
        <div
          className="
                                        pointer-events-none select-none
                                        absolute top-3 right-3 z-10
                                        flex items-center gap-1.5
                                        pl-2 pr-2.5 py-1
                                        rounded-full
                                        border border-white/40
                                        bg-gradient-to-r from-indigo-500/20 via-violet-500/15 to-indigo-400/20
                                        backdrop-blur-md
                                        shadow-glow-accent
                                    "
          aria-hidden
        >
          {/* sparkle icon */}
          <svg
            className="w-3.5 h-3.5 shrink-0 drop-shadow-glow-accent-sm"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 2L13.5 9.5L20 8L14.5 12L20 16L13.5 14.5L12 22L10.5 14.5L4 16L9.5 12L4 8L10.5 9.5L12 2Z"
              fill="white"
            />
          </svg>
          <span
            className="
                                            text-[10px] font-bold tracking-wide
                                            bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-500
                                            bg-clip-text text-transparent
                                        "
          >
            Vibe
          </span>
          {/* secondary sparkle dot */}
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-white shadow-glow-accent-xs" />
        </div>
      )}
    </div>
  );
};

export default PortfolioCard;
