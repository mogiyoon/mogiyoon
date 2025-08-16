import React, { useEffect, useRef, useState } from "react";
import PortfolioCard from "../components/PortfolioCard";
import { projects } from "../data/projects";
import "./HomePage.css";

const HomePage: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const projectsSectionRef = useRef<HTMLDivElement>(null);

  const [isProjectsVisible, setProjectsVisible] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const savedSectionIndex = sessionStorage.getItem("homeScrollSectionIndex");
    if (savedSectionIndex) {
      const index = parseInt(savedSectionIndex, 10);
      container.scrollTo({
        top: index * container.clientHeight,
        behavior: "auto",
      });
    }

    const handleScroll = () => {
      if (!container) return;
      const currentSectionIndex = Math.round(
        container.scrollTop / container.clientHeight
      );
      sessionStorage.setItem(
        "homeScrollSectionIndex",
        currentSectionIndex.toString()
      );
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer 로직
  useEffect(() => {
    const createObserver = (
      setter: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      return new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setter(true);
          }
        },
        { root: scrollContainerRef.current, threshold: 0.2 }
      );
    };

    const projectsObserver = createObserver(setProjectsVisible);

    const currentProjectsRef = projectsSectionRef.current;

    if (currentProjectsRef) projectsObserver.observe(currentProjectsRef);

    return () => {
      if (currentProjectsRef) projectsObserver.unobserve(currentProjectsRef);
    };
  }, []);

  return (
    <div ref={scrollContainerRef}>
      {/* --- 자기소개 섹션 --- */}
      <section>
        <div className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* 1, 2, 3번: 순서대로 한 줄씩 등장 */}
            <div className="text-lg sm:text-2xl lg:text-3xl text-gray-600 mb-8 leading-relaxed">
              <span className="fade-in-text delay-1 block">
                초등 시절 게임 에디터 활용부터
              </span>
              <span className="fade-in-text delay-2 block">
                임용시험 합격을 함께한 퀴즈 앱까지,
              </span>
            </div>

            {/* 4번: 한 번에 등장하는 핵심 문구 */}
            <div className="fade-in-text delay-3 mb-12">
              <p className="text-lg sm:text-2xl lg:text-3xl text-gray-600">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
                  아이디어
                </span>
                를{" "}
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
                  실현
                </span>
                하고{" "}
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
                  문제
                </span>
                를{" "}
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
                  해결
                </span>
              </p>
              <p className="text-lg sm:text-2xl lg:text-3xl text-gray-600 mt-2">
                하는 풀스택 개발자 <span className="font-bold">노기윤</span>
                입니다.
              </p>
            </div>

            {/* 5번: 다섯 번째로 나타날 문장 */}
            <p className="text-xs sm:text-base lg:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto fade-in-text delay-4">
              이곳은 제가 열정을 담아 개발한 프로젝트들을 소개하는 공간입니다.
            </p>

            {/* 6번: 여섯 번째로 나타날 문장 (문제가 발생했던 부분) */}
            <p className="text-xs sm:text-base lg:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto fade-in-text delay-5">
              각 프로젝트를 통해 저의 기술 스택과 문제 해결 능력을 확인해
              보세요!
            </p>
          </div>
        </div>
      </section>

      {/* --- 나의 프로젝트 섹션 --- */}
      <section className={` ${isProjectsVisible ? "section-is-visible" : ""}`}>
        <div
          ref={projectsSectionRef}
          className="min-h-screen flex items-center justify-center p-4 sm:p-8"
        >
          <div className="my-projects-box content-to-animate w-full h-full max-w-6xl flex flex-col p-2 md:p-4">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center flex-shrink-0">
              Project
            </h2>
            <div className="flex-grow overflow-y-auto p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="flex">
                    <PortfolioCard project={project} className="w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
