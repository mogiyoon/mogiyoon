import React from 'react';
import '../../pages/HomePage.css';
import { HeroHook } from '../../components/AboutMe/HeroHook';
import { IntroLine } from '../../components/AboutMe/IntroLine';
import { MainPhrase1to4 } from '../../components/AboutMe/MainPhrase1to4';
import { MainPhrase5to8 } from '../../components/AboutMe/MainPhrase5to8';
import { DeveloperIntro } from '../../components/AboutMe/DeveloperIntro';

const AboutSection: React.FC = () => {
  return (
    // html.about-active 의 orange→white gradient (index.css) 가 섹션 간 sub-pixel
    // 경계로 새지 않도록, About 컨텐츠 컨테이너 자체에 흰 배경을 깐다.
    // 각 섹션이 자체 bg 를 가지므로 wrapper 의 white 는 그대로 가려진다.
    <div className="w-full bg-white">
      <HeroHook/>
      <IntroLine/>
      <MainPhrase1to4/>
      <MainPhrase5to8/>
      <DeveloperIntro/>
    </div>
  );
};

export default AboutSection;
