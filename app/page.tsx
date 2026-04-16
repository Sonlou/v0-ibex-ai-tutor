'use client';

import { useRef, useState } from 'react';
import Header from '@/components/header';
import SearchBox from '@/components/search-box';
import ExplanationBox from '@/components/explanation-box';

export default function Home() {
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const explanationRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (message: string, imageBase64: string | null) => {
    setIsLoading(true);
    setExplanation('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          imageBase64,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
        setExplanation(fullResponse);

        // Auto-scroll to bottom
        if (explanationRef.current) {
          explanationRef.current.scrollTop = explanationRef.current.scrollHeight;
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setExplanation(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-start pt-8 px-4 pb-16">
        {/* Search Box Section */}
        <div className="w-full max-w-2xl mb-8">
          <SearchBox
            onSearch={handleSearch}
            isLoading={isLoading}
            onImageUpload={setUploadedImage}
          />
        </div>

        {/* Explanation Box Section */}
        {explanation && (
          <div className="w-full max-w-2xl">
            <ExplanationBox explanation={explanation} ref={explanationRef} />
          </div>
        )}
      </main>
    </div>
  );
}
