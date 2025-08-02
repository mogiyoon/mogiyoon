import React from 'react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
    onExportPdf: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onExportPdf }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-10 p-4 bg-white bg-opacity-80 backdrop-blur-sm shadow-md h-20 flex items-center">
            <div className="max-w-6xl w-full mx-auto flex justify-between items-center">
                <Link to="/" className="text-indigo-600 hover:underline flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    메인으로
                </Link>
                <button
                    onClick={onExportPdf}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center shadow-md"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414zM10 3a1 1 0 011 1v7a1 1 0 11-2 0V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    PDF로 내보내기
                </button>
            </div>
        </header>
    );
};

export default PageHeader;