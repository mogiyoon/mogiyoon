import React from 'react';
import '../../pages/HomePage.css';
import { IntroLine } from '../../components/AboutMe/IntroLine';
import { MainPhrase1to4 } from '../../components/AboutMe/MainPhrase1to4';
import { MainPhrase5to8 } from '../../components/AboutMe/MainPhrase5to8';
import { DeveloperIntro } from '../../components/AboutMe/DeveloperIntro';

const AboutSection: React.FC = () => {
  return (
    <div className="w-full">
      <IntroLine/>
      <MainPhrase1to4/>
      <MainPhrase5to8/>
      <DeveloperIntro/>
      {/* overscroll bounce 시 흰색 노출 방지 — 마지막 섹션 배경색과 통일 */}
      <div className="h-[50vh] bg-orange-700" />
    </div>
  );
};

export default AboutSection;