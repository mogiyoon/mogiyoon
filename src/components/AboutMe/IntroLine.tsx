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

// title 등장 이후 카드가 시차를 두고 순차적으로 나타나는 간격 (초)
const SEQUENTIAL_DELAY = {
  title: 0,
  card01: 0.2,
  card02: 0.4,
} as const;

// 섹션 안에서 요소가 등장하는 스크롤 임계값 (각 섹션 0→1 기준).
// title 임계점을 통과하면 title → card01 → card02 가 delay 로 순차 등장한다.
const REVEAL_THRESHOLDS = {
  eyebrow: 0.05,
  title: 0.12,
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

  // 임계점 통과 시 latch — 한 번 등장하면 섹션이 스크롤로 넘어갈 때까지 유지.
  // title 임계점 하나로 title·card01·card02 를 함께 트리거하고,
  // 실제 순차 등장은 각 요소의 transition delay 로 만든다.
  const titleRevealed = useScrollLatch(scrollYProgress, REVEAL_THRESHOLDS.title);
  const reveal: PanelReveal = {
    eyebrow: useScrollLatch(scrollYProgress, REVEAL_THRESHOLDS.eyebrow),
    title: titleRevealed,
    card01: titleRevealed,
    card02: titleRevealed,
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
}: IntroPanelProps) => {
  const eyebrowBlock = (
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
  );

  const titleBlock = (
    <motion.h2
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: reveal.title ? 1 : 0, y: reveal.title ? 0 : 24 }}
      transition={{ ...REVEAL_TRANSITION, delay: reveal.title ? SEQUENTIAL_DELAY.title : 0 }}
      className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold leading-[1.35] tracking-tight"
    >
      <span className="block text-content-strong">{titleLine1}</span>
      <span className="block text-accent-600">{titleLine2}</span>
    </motion.h2>
  );

  return (
    <div className="mx-auto h-full w-full max-w-7xl px-3 py-10 md:px-5 lg:px-8 lg:py-14">
      {/* Mobile / tablet layout — 사진을 타이틀 위·아래로 배치 */}
      <div className="flex h-full w-full flex-col items-stretch justify-center gap-4 sm:gap-5 lg:hidden">
        {eyebrowBlock}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: reveal.card01 ? 1 : 0, y: reveal.card01 ? 0 : 24 }}
          transition={{ ...REVEAL_TRANSITION, delay: reveal.card01 ? SEQUENTIAL_DELAY.card01 : 0 }}
        >
          <MobileImageCard {...card01} />
        </motion.div>
        {titleBlock}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: reveal.card02 ? 1 : 0, y: reveal.card02 ? 0 : 24 }}
          transition={{ ...REVEAL_TRANSITION, delay: reveal.card02 ? SEQUENTIAL_DELAY.card02 : 0 }}
        >
          <MobileImageCard {...card02} />
        </motion.div>
      </div>

      {/* Desktop layout — 2-column grid */}
      <div className="hidden h-full w-full grid-cols-2 items-center gap-12 lg:grid xl:gap-16">
        {/* Left column */}
        <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
          {eyebrowBlock}
          {titleBlock}
        </div>

        {/* Right column */}
        <div className="relative flex w-full max-h-[80vh] flex-col justify-center gap-5">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: reveal.card01 ? 1 : 0, y: reveal.card01 ? 0 : 30 }}
            transition={{ ...REVEAL_TRANSITION, delay: reveal.card01 ? SEQUENTIAL_DELAY.card01 : 0 }}
          >
            <NumberedCard {...card01} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: reveal.card01 ? 1 : 0, y: reveal.card01 ? 0 : 30 }}
            transition={{ ...REVEAL_TRANSITION, delay: reveal.card01 ? SEQUENTIAL_DELAY.card01 : 0 }}
          >
            <Connector variant={connector} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: reveal.card02 ? 1 : 0, y: reveal.card02 ? 0 : 30 }}
            transition={{ ...REVEAL_TRANSITION, delay: reveal.card02 ? SEQUENTIAL_DELAY.card02 : 0 }}
          >
            <NumberedCard {...card02} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// 모바일/태블릿 전용 컴팩트 카드 — 타이틀 위·아래에 들어가도록 높이를 뷰포트로 제한.
const MobileImageCard = ({ label, title, image }: CardData) => (
  <div className="relative w-full overflow-hidden rounded-2xl border border-line bg-surface-muted shadow-lg">
    <img
      src={image}
      alt={title}
      className="h-[22vh] w-full object-cover sm:h-[24vh]"
    />
    <div className="absolute left-2 top-2 flex items-center gap-2">
      <span className="bg-accent-500 text-white w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold tracking-wider font-latin">
        {label}
      </span>
      <span className="rounded-md bg-white/85 px-2 py-1 text-xs font-bold text-content-strong backdrop-blur-sm">
        {title}
      </span>
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
