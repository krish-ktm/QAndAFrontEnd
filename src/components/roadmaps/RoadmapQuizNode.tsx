import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

export const RoadmapQuizNode = memo(({ data, selected }: NodeProps) => {
    const style = (data.style as any) || {};
    const { question, options = [], correctAnswer, explanation } = data as any;

    const borderColor = style.borderColor || '#e2e8f0';
    const textColor = style.textColor || '#0f172a';

    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleOptionClick = (index: number) => {
        if (isSubmitted) return;
        setSelectedOption(index);
    };

    const handleSubmit = () => {
        if (selectedOption !== null) {
            setIsSubmitted(true);
        }
    };

    const isCorrect = selectedOption === correctAnswer;

    return (
        <div
            className="relative group flex flex-col w-80 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border"
            style={{
                borderColor: selected ? '#3b82f6' : borderColor,
                borderWidth: '1.5px'
            }}
        >
            <div className="p-4 bg-indigo-50 border-b border-indigo-100">
                <div className="flex items-center gap-2 mb-2 text-indigo-600">
                    <HelpCircle size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Quick Quiz</span>
                </div>
                <h3 className="font-bold text-md leading-tight" style={{ color: textColor }}>
                    {question}
                </h3>
            </div>

            <div className="p-4 space-y-2">
                {options.map((option: string, index: number) => {
                    let optionStyle = "border-gray-200 hover:bg-gray-50 hover:border-gray-300";
                    let icon = null;

                    if (isSubmitted) {
                        if (index === correctAnswer) {
                            optionStyle = "bg-green-50 border-green-200 text-green-700";
                            icon = <CheckCircle size={16} className="text-green-500" />;
                        } else if (index === selectedOption) {
                            optionStyle = "bg-red-50 border-red-200 text-red-700";
                            icon = <XCircle size={16} className="text-red-500" />;
                        } else {
                            optionStyle = "border-gray-100 text-gray-400 opacity-50";
                        }
                    } else if (selectedOption === index) {
                        optionStyle = "border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500";
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => handleOptionClick(index)}
                            disabled={isSubmitted}
                            className={`w-full text-left p-3 rounded-lg border text-sm transition-all flex items-center justify-between ${optionStyle}`}
                        >
                            <span>{option}</span>
                            {icon}
                        </button>
                    );
                })}

                {!isSubmitted && (
                    <button
                        onClick={handleSubmit}
                        disabled={selectedOption === null}
                        className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Check Answer
                    </button>
                )}

                {isSubmitted && explanation && (
                    <div className={`mt-4 p-3 rounded-lg text-sm ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-blue-50 text-blue-800'}`}>
                        <p className="font-semibold mb-1">{isCorrect ? 'Correct!' : 'Explanation:'}</p>
                        {explanation}
                    </div>
                )}
            </div>

            {/* Handles */}
            <Handle type="target" position={Position.Top} className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Handle type="source" position={Position.Bottom} className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Handle type="target" position={Position.Left} className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Handle type="source" position={Position.Right} className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
});
