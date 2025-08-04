import React from 'react';
import { Link } from 'react-router-dom';

// 1. isPdfLoading prop 추가
interface PageHeaderProps {
    onExportPdf: () => void;
    isPdfLoading?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onExportPdf, isPdfLoading = false }) => {
    
    // 로딩 스피너 아이콘
    const SpinnerIcon = () => (
        <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );

    // 다운로드 아이콘
    const DownloadIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414zM10 3a1 1 0 011 1v7a1 1 0 11-2 0V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
    );

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
                    disabled={isPdfLoading} // 2. 로딩 중일 때 버튼 비활성화
                    // 3. 로딩 상태에 따라 스타일 변경
                    className={`
                        text-white px-5 py-2 rounded-lg transition-colors duration-300 
                        flex items-center shadow-md
                        ${isPdfLoading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-700'
                        }
                    `}
                >
                    {/* 4. 로딩 상태에 따라 아이콘과 텍스트 변경 */}
                    {isPdfLoading ? <SpinnerIcon /> : <DownloadIcon />}
                    {isPdfLoading ? '생성 중...' : 'PDF로 내보내기'}
                </button>
            </div>
        </header>
    );
};

export default PageHeader;