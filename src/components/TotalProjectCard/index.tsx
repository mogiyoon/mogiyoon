import React from 'react';
import { Link } from 'react-router-dom'; // Link 임포트
import { ProjectData } from '../../types';

interface TotalProjectCardProps {
    project: ProjectData;
    className?: string;
}

const TotalProjectCard: React.FC<TotalProjectCardProps> = ({ project, className }) => {
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "https://placehold.co/400x600/cccccc/333333?text=Image+Not+Found";
    };

    return (
        // ✅ 카드 전체를 Link로 감싸줍니다.
        <Link to={`/project/${project.id}`} className={`block ${className || ''}`}>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col md:flex-row">
                
                {/* 이미지 섹션 */}
                <img
                    src={project.screenshots.length > 0 ? project.screenshots[0].src : "https://placehold.co/400x600/cccccc/333333?text=Project+Image"}
                    alt={`${project.title} Thumbnail`}
                    className="w-full h-48 object-cover flex-shrink-0 md:w-2/5 md:h-full"
                    onError={handleImageError}
                />

                {/* 콘텐츠 섹션 */}
                <div className="w-full p-6 sm:p-8 flex flex-col flex-grow">
                    <div className="mb-6">
                        <h3 className="text-3xl font-bold text-indigo-800 mb-2">
                            {project.title}
                        </h3>
                        <p className="text-gray-600 text-lg">
                            {project.subtitle}
                        </p>
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed flex-grow">
                        {project.description}
                    </p>
                    {/* <div className="mt-auto">
                        <h4 className="font-semibold text-gray-700 mb-3">주요 기술 스택</h4>
                        <div className="flex flex-wrap gap-2">
                            {project.techStack.map((stack, index) => (
                                <span key={index} className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full">
                                    {stack.category}
                                </span>
                            ))}
                        </div>
                    </div> */}
                </div>
            </div>
        </Link>
    );
};

export default TotalProjectCard;