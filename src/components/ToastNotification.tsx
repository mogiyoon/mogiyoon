
import React from 'react';

interface ToastNotificationProps {
  message: string;
  isSuccess: boolean
  show: boolean;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ message, isSuccess, show }) => {
  // show 상태가 false이면 아무것도 렌더링하지 않습니다.
  if (!show) {
    return null;
  }

  return (
    // 화면 오른쪽 하단에 고정되는 스타일
    <div 
      className={`fixed bottom-5 right-5 text-gray-600 py-3 px-6 rounded-lg shadow-xl animate-toast-in-out z-50 ${
        isSuccess ? `bg-green-200` : `bg-red-200`
      }`}
    >
      {message}
    </div>
  );
};

export default ToastNotification;