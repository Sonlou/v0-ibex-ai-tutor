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
    console.log('[v0] Starting search with message:', message);
    setIsLoading(true);
    setExplanation('');

    try {
      console.log('[v0] Sending request to /api/chat');
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
      console.log('[v0] Response received, status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Failed to get response';
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch {
          const text = await response.text();
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      console.log('[v0] Starting to read stream');
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('[v0] Stream complete');
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        console.log('[v0] Chunk received:', chunk.substring(0, 50));
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
