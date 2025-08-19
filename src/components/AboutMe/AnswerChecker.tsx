import React, { useState, useRef } from 'react';

// 정답 비교 결과를 담을 객체의 타입 정의
interface ResultCharacter {
  char: string;
  isCorrect: boolean;
}

const AnswerChecker: React.FC = () => {
  // 정답 비교 결과를 저장할 state
  const [result, setResult] = useState<ResultCharacter[]>([]);
  // contentEditable div 요소에 직접 접근하기 위한 ref 생성
  const editableDivRef = useRef<HTMLDivElement>(null);

  // 비교할 정답
  const correctAnswer = '교육과정의 성격';

  // '확인' 버튼 클릭 시 실행될 함수
  const handleCheck = () => {
    // ref를 사용해 '현재 시점'의 실제 입력 텍스트를 직접 가져옵니다.
    const currentValue = editableDivRef.current?.innerText || '';
    
    // 입력 값이 비어있으면 함수를 즉시 종료합니다.
    if (currentValue.trim() === '') {
      return;
    }
    
    const newResult = currentValue.split('').map((char, index) => {
      const isCorrect = char === correctAnswer[index];
      return { char, isCorrect };
    });
    setResult(newResult);
  };

  // 버튼 위에 마우스를 올렸을 때 실행될 함수
  const handleMouseEnter = () => {
    const currentValue = editableDivRef.current?.innerText || '';
    
    // 입력 값이 비어있지 않을 때만 포커스를 제거합니다.
    if (currentValue.trim() !== '') {
      editableDivRef.current?.blur();
    }
  };

  // '지우기' 버튼 클릭 시 실행될 함수
  const handleClear = () => {
    setResult([]);
    // div 내부의 텍스트도 직접 지워줍니다.
    if (editableDivRef.current) {
      editableDivRef.current.innerText = '';
    }
  };

  // 레트로 버튼 스타일을 위한 Tailwind CSS 클래스
  const retroButtonClasses = "px-1 py-1 text-base text-gray-800 bg-gray-200 border-2 border-t-gray-100 border-l-gray-100 border-b-4 border-r-4 border-gray-400 rounded-md transition-all duration-100 active:border-b-2 active:border-r-2 active:translate-x-1 active:translate-y-1";

  return (
    // 전체 컴포넌트를 감싸는 컨테이너
    <div className="w-[400px] mx-auto p-2 border-2 bg-white shadow-lg font-sans sm:shadow-[7px_7px_7px_1px_rgba(0,0,0,0.5)]">
      
      {/* 문제 섹션 */}
      <div className="mb-2">
        <h2 className="text-base text-gray-800 mb-2">문제: 교육과정의 성격</h2>
      </div>

      {/* 정답 입력 섹션 */}
      <div className="flex items-center mb-2">
        <label htmlFor="answer-input" className="text-base font-medium text-gray-800 mr-2 whitespace-nowrap">정답:</label>
        {/* input 대신 contentEditable div 사용 */}
        <div
          ref={editableDivRef}
          id="answer-input"
          contentEditable="true"
          className="flex-grow px-1 py-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          style={{ minHeight: '2.25rem', lineHeight: '1.5rem', cursor: 'text' }}
          data-placeholder="여기에 정답을 입력하세요..."
        ></div>
      </div>

      {/* 버튼 섹션 */}
      <div className="flex items-center gap-3 mb-1">
        {/* onMouseEnter와 onClick 이벤트를 분리하여 사용합니다. */}
        <button 
          type="button" 
          onMouseEnter={handleMouseEnter} 
          onClick={handleCheck} 
          className={retroButtonClasses}
        >
          확인
        </button>
        {/* 지우기 버튼에도 onMouseEnter 이벤트를 추가합니다. */}
        <button 
          type="button" 
          onMouseEnter={handleMouseEnter} 
          onClick={handleClear} 
          className={retroButtonClasses}
        >
          삭제
        </button>
      </div>

      {/* 결과 표시 섹션 */}
      <div>
        <h3 className="text-base font-medium text-gray-700 mb-2">결과:</h3>
        <div className="p-2 border border-gray-200 bg-gray-50 min-h-[3.5rem] flex items-center flex-wrap gap-1">
          {result.map((item, index) => (
            <span
              key={index}
              className={`px-2 py-1 text-lg font-bold transition-all duration-300 ${
                item.isCorrect 
                  ? 'bg-green-200 text-green-800'
                  : 'bg-red-200 text-red-800'
              }`}
            >
              {item.char}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnswerChecker;
