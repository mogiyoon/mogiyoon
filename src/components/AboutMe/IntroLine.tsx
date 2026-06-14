import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useScrollLatch } from "./useScrollLatch";

interface CardData {
  label: string;
  title: string;
  desc: string;
  image: string;
}

interface IntroPanelData {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  card01: CardData;
  card02: CardData;
}

interface PanelReveal {
  eyebrow: boolean;
  title: boolean;
  card01: boolean;
  card02: boolean;
}

const REVEAL_TRANSITION = { duration: 0.5, ease: "easeOut" } as const;

// 섹션 안에서 요소가 순차 등장하는 스크롤 임계값 (각 섹션 0→1 기준)
const REVEAL_THRESHOLDS = {
  eyebrow: 0.05,
  title: 0.12,
  card01: 0.22,
  card02: 0.34,
} as const;

export const IntroLine: React.FC = () => {
  const { t } = useTranslation();

  const startPanel: IntroPanelData = {
    eyebrow: t("introStart.eyebrow"),
    titleLine1: t("introLine1"),
    titleLine2: t("introLine1-1"),
    card01: {
      label: "01",
      title: t("introStart.card01Title"),
      desc: t("introStart.card01Desc"),
      image: "/images/aboutMe/introLine1/1.png",
    },
    card02: {
      label: "02",
      title: t("introStart.card02Title"),
      desc: t("introStart.card02Desc"),
      image: "/images/aboutMe/introLine1/2.png",
    },
  };

  const endPanel: IntroPanelData = {
    eyebrow: t("introEnd.eyebrow"),
    titleLine1: t("introLine2"),
    titleLine2: t("introLine2-1"),
    card01: {
      label: "01",
      title: t("introEnd.card01Title"),
      desc: t("introEnd.card01Desc"),
      image: "/images/aboutMe/introLine2/1.png",
    },
    card02: {
      label: "02",
      title: t("introEnd.card02Title"),
      desc: t("introEnd.card02Desc"),
      image: "/images/aboutMe/introLine2/2.png",
    },
  };

  // 두 패널을 각각 독립된 sticky 섹션으로 분리한다.
  // 한 패널이 등장한 뒤 사라지지 않고, 다음 섹션으로 자연 스크롤되며 넘어간다.
  return (
    <>
      <IntroPanelSection data={startPanel} connector="arrow" />
      <IntroPanelSection data={endPanel} connector="plus" />
    </>
  );
};

type ConnectorVariant = "arrow" | "plus";

interface IntroPanelSectionProps {
  data: IntroPanelData;
  connector: ConnectorVariant;
}

const IntroPanelSection = ({ data, connector }: IntroPanelSectionProps) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  // 임계점 통과 시 latch — 한 번 등장하면 섹션이 스크롤로 넘어갈 때까지 유지
  const reveal: PanelReveal = {
    eyebrow: useScrollLatch(scrollYProgress, REVEAL_THRESHOLDS.eyebrow),
    title: useScrollLatch(scrollYProgress, REVEAL_THRESHOLDS.title),
    card01: useScrollLatch(scrollYProgress, REVEAL_THRESHOLDS.card01),
    card02: useScrollLatch(scrollYProgress, REVEAL_THRESHOLDS.card02),
  };

  return (
    <section ref={targetRef} className="relative h-[200vh] bg-white">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-white">
        <IntroPanel {...data} reveal={reveal} connector={connector} />
      </div>
    </section>
  );
};

interface IntroPanelProps extends IntroPanelData {
  reveal: PanelReveal;
  connector: ConnectorVariant;
}

const IntroPanel = ({
  eyebrow,
  titleLine1,
  titleLine2,
  card01,
  card02,
  reveal,
  connector,
}: IntroPanelProps) => (
  <div className="mx-auto h-full w-full max-w-7xl px-3 py-10 md:px-5 lg:px-8 lg:py-14">
    <div className="grid h-full w-full grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
      {/* Left column */}
      <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: reveal.eyebrow ? 1 : 0, y: reveal.eyebrow ? 0 : 24 }}
          transition={REVEAL_TRANSITION}
          className="flex items-center gap-3"
        >
          <span className="w-2 h-2 rounded-full bg-accent-500" />
          <span className="font-latin text-xs sm:text-sm font-semibold tracking-[0.2em] text-accent-700 uppercase">
            {eyebrow}
          </span>
          <div className="flex-1 h-px bg-accent-100 max-w-[120px]" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: reveal.title ? 1 : 0, y: reveal.title ? 0 : 24 }}
          transition={REVEAL_TRANSITION}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold leading-[1.35] tracking-tight"
        >
          <span className="block text-content-strong">{titleLine1}</span>
          <span className="block text-accent-600">{titleLine2}</span>
        </motion.h2>
      </div>

      {/* Right column — desktop only */}
      <div className="hidden lg:flex relative flex-col gap-5 w-full max-h-[80vh] justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: reveal.card01 ? 1 : 0, y: reveal.card01 ? 0 : 30 }}
          transition={REVEAL_TRANSITION}
        >
          <NumberedCard {...card01} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: reveal.card01 ? 1 : 0, y: reveal.card01 ? 0 : 30 }}
          transition={REVEAL_TRANSITION}
        >
          <Connector variant={connector} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: reveal.card02 ? 1 : 0, y: reveal.card02 ? 0 : 30 }}
          transition={REVEAL_TRANSITION}
        >
          <NumberedCard {...card02} />
        </motion.div>
      </div>
    </div>
  </div>
);

const NumberedCard = ({ label, title, desc, image }: CardData) => (
  <motion.div
    className="bg-white rounded-3xl border border-line shadow-xl p-4 lg:p-5 relative overflow-hidden flex flex-col gap-2.5 max-h-[35vh] min-h-0"
    whileHover={{ y: -3 }}
    transition={{ duration: 0.25 }}
  >
    <div className="flex items-center gap-3 shrink-0">
      <span className="bg-accent-500 text-white w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold tracking-wider font-latin shrink-0">
        {label}
      </span>
      <h3 className="text-base lg:text-lg font-bold text-content-strong">
        {title}
      </h3>
    </div>
    <p className="text-xs lg:text-sm text-content-secondary whitespace-pre-line leading-relaxed shrink-0">
      {desc}
    </p>
    <div className="rounded-xl overflow-hidden border border-line bg-surface-muted flex-1 min-h-0">
      <img src={image} alt={title} className="w-full h-full object-cover" />
    </div>
  </motion.div>
);

const Connector = ({ variant }: { variant: ConnectorVariant }) =>
  variant === "plus" ? (
    <div className="flex items-center justify-center">
      <span className="text-accent-500 text-2xl font-light leading-none">+</span>
    </div>
  ) : (
    <div className="flex flex-col items-center -my-1">
      <div className="w-px h-3 lg:h-4 border-l-2 border-dashed border-accent-500/40" />
      <span className="text-accent-500 text-xs leading-none">▼</span>
    </div>
  );
