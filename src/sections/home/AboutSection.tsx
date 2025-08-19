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
    </div>
  );
};

export default AboutSection;