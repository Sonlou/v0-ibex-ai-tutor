'use client';

import { forwardRef } from 'react';

interface ExplanationBoxProps {
  explanation: string;
}

const ExplanationBox = forwardRef<HTMLDivElement, ExplanationBoxProps>(
  ({ explanation }, ref) => {
    const formatText = (text: string) => {
      return text
        .split('\n')
        .map((line, idx) => {
          // Handle bold text (marked with **)
          const boldFormatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          
          // Handle bullet points
          if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
            return (
              <li key={idx} className="ml-4">
                <span dangerouslySetInnerHTML={{ __html: boldFormatted.replace(/^[-•]\s*/, '') }} />
              </li>
            );
          }

          // Handle numbered lists
          if (/^\d+\.\s/.test(line.trim())) {
            return (
              <li key={idx} className="ml-4" style={{ listStyleType: 'decimal' }}>
                <span dangerouslySetInnerHTML={{ __html: boldFormatted.replace(/^\d+\.\s*/, '') }} />
              </li>
            );
          }

          // Regular paragraphs
          if (line.trim()) {
            return (
              <p key={idx} className="mb-3">
                <span dangerouslySetInnerHTML={{ __html: boldFormatted }} />
              </p>
            );
          }

          return <div key={idx} className="h-2" />;
        });
    };

    return (
      <div
        ref={ref}
        className="bg-blue-50/50 border border-blue-100 rounded-lg p-6 max-h-96 overflow-y-auto"
      >
        <div className="space-y-2 text-gray-900 leading-relaxed">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Explanation</h2>
          
          <div className="prose prose-sm max-w-none">
            <ul className="list-none">
              {formatText(explanation).map((item) => {
                // Extract li items
                if (item && item.type === 'li') {
                  return item;
                }
                return item;
              })}
            </ul>
          </div>

          {/* Simple text rendering as fallback */}
          <div className="text-sm text-gray-700 whitespace-pre-wrap amharic-text font-medium">
            {explanation}
          </div>
        </div>
      </div>
    );
  }
);

ExplanationBox.displayName = 'ExplanationBox';

export default ExplanationBox;
