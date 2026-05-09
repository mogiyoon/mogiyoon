import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

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

interface FadeUpStyle {
  y: MotionValue<number>;
  opacity: MotionValue<number>;
}

interface PanelReveal {
  eyebrow: FadeUpStyle;
  title: FadeUpStyle;
  card01: FadeUpStyle;
  card02: FadeUpStyle;
}

function useScrollFadeUp(
  progress: MotionValue<number>,
  start: number,
  duration = 0.05,
  distance = 24
): FadeUpStyle {
  const y = useTransform(progress, [start, start + duration], [distance, 0]);
  const opacity = useTransform(progress, [start, start + duration], [0, 1]);
  return { y, opacity };
}

export const IntroLine: React.FC = () => {
  const { t } = useTranslation();
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const startPanelOpacity = useTransform(
    scrollYProgress,
    [0, 0.4, 0.5],
    [1, 1, 0]
  );
  const startPanelY = useTransform(
    scrollYProgress,
    [0, 0.1, 0.4, 0.5],
    [16, 0, 0, -24]
  );
  const endPanelOpacity = useTransform(
    scrollYProgress,
    [0.45, 0.55, 0.9, 1],
    [0, 1, 1, 0]
  );
  const endPanelY = useTransform(
    scrollYProgress,
    [0.45, 0.6, 0.9, 1],
    [24, 0, 0, -16]
  );

  // Per-element scroll reveals — startPanel (active 0 → 0.4)
  const startEyebrow = useScrollFadeUp(scrollYProgress, 0.0, 0.08);
  const startTitle = useScrollFadeUp(scrollYProgress, 0.04, 0.08);
  const startCard1 = useScrollFadeUp(scrollYProgress, 0.09, 0.1, 30);
  const startCard2 = useScrollFadeUp(scrollYProgress, 0.14, 0.1, 30);

  // Per-element scroll reveals — endPanel (active 0.5 → 0.9)
  const endEyebrow = useScrollFadeUp(scrollYProgress, 0.5, 0.08);
  const endTitle = useScrollFadeUp(scrollYProgress, 0.54, 0.08);
  const endCard1 = useScrollFadeUp(scrollYProgress, 0.59, 0.1, 30);
  const endCard2 = useScrollFadeUp(scrollYProgress, 0.64, 0.1, 30);

  const startReveal: PanelReveal = {
    eyebrow: startEyebrow,
    title: startTitle,
    card01: startCard1,
    card02: startCard2,
  };

  const endReveal: PanelReveal = {
    eyebrow: endEyebrow,
    title: endTitle,
    card01: endCard1,
    card02: endCard2,
  };

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

  return (
    <section ref={targetRef} className="relative h-[1000vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-white">
        <PanelLayer
          opacity={startPanelOpacity}
          y={startPanelY}
          reveal={startReveal}
          data={startPanel}
          connector="arrow"
        />
        <PanelLayer
          opacity={endPanelOpacity}
          y={endPanelY}
          reveal={endReveal}
          data={endPanel}
          connector="plus"
        />
      </div>
    </section>
  );
};

type ConnectorVariant = "arrow" | "plus";

interface PanelLayerProps {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  reveal: PanelReveal;
  data: IntroPanelData;
  connector: ConnectorVariant;
}

const PanelLayer = ({ opacity, y, reveal, data, connector }: PanelLayerProps) => (
  <motion.div style={{ opacity, y }} className="absolute inset-0">
    <IntroPanel {...data} reveal={reveal} connector={connector} />
  </motion.div>
);

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
          style={reveal.eyebrow}
          className="flex items-center gap-3"
        >
          <span className="w-2 h-2 rounded-full bg-accent-500" />
          <span className="font-latin text-xs sm:text-sm font-semibold tracking-[0.2em] text-accent-700 uppercase">
            {eyebrow}
          </span>
          <div className="flex-1 h-px bg-accent-100 max-w-[120px]" />
        </motion.div>

        <motion.h2
          style={reveal.title}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold leading-[1.35] tracking-tight"
        >
          <span className="block text-content-strong">{titleLine1}</span>
          <span className="block text-accent-600">{titleLine2}</span>
        </motion.h2>
      </div>

      {/* Right column — desktop only */}
      <div className="hidden lg:flex relative flex-col gap-5 w-full max-h-[80vh] justify-center">
        <motion.div style={reveal.card01}>
          <NumberedCard {...card01} />
        </motion.div>
        <motion.div style={reveal.card01}>
          <Connector variant={connector} />
        </motion.div>
        <motion.div style={reveal.card02}>
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
