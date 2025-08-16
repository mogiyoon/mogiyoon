import React from 'react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
    setModalOpen: () => void;
}

const PageHeader: React.FC <PageHeaderProps> = ({setModalOpen}) => {

    return (
        <header className="fixed top-0 left-0 right-0 z-10 p-4 bg-white bg-opacity-80 backdrop-blur-sm shadow-md h-20 flex items-center">
            <div className="max-w-6xl w-full mx-auto flex justify-between items-center">
                <Link to="/" className="text-black-600 flex items-center group">
                    <img
                        src="/logo.svg"
                        alt="Mogiyoon"
                        className="h-10 w-10 mr-2 rounded-xl"
                    />
                    <span className="text-xl font-bold font-display">
                        {'Mogiyoon'.split('').map((char, index) => (
                            <span
                                key={index}
                                className="inline-block transition-all duration-300 opacity-0 translate-y-[-0.5em] group-hover:opacity-100 group-hover:translate-y-0"
                                style={{ transitionDelay: `${index * 25}ms` }}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                    </span>
                </Link>
                <button
                    onClick={setModalOpen}
                    className={`
                        text-white px-5 py-2 rounded-lg transition-colors duration-300 
                        flex items-center shadow-md bg-gray-400 hover:bg-gray-500
                    `}
                >
                    Contact
                </button>
            </div>
        </header>
    );
};

export default PageHeader;