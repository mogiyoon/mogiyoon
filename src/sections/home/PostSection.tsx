import React from 'react';
import { useTranslation } from 'react-i18next';

//TODO: 백서버 만들게되면 구현하거나, 벨로그 스크래핑


const PostsSection: React.FC = () => {
    const { t } = useTranslation();
    const velogUrl = 'https://velog.io/@mogiyoon/posts';

    return (
        <div className="animate-fade-in text-center text-lg text-gray-400 space-y-6">
            <p>{t('postsPreparingMessage')}</p>

            <a
                href={velogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                    inline-block px-8 py-3 
                    font-semibold text-white bg-gray-800 
                    border border-gray-700 rounded-lg 
                    hover:bg-gray-700 hover:border-gray-600
                    focus:outline-none focus:ring-2 focus:ring-gray-500
                    transition-all duration-300 ease-in-out
                    transform hover:scale-105
                "
            >
                {t('visitVelog')}
            </a>
        </div>
    );
};

export default PostsSection;