
import React, { useState, useRef, useEffect } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { runAICoach } from '../services/geminiService';

const AICoach: React.FC = () => {
  const { t } = useLocalization();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const responseRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setResponse('');
    const result = await runAICoach(prompt);
    setResponse(result);
    setLoading(false);
  };

  useEffect(() => {
    if (responseRef.current) {
        responseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response]);
  
  const formatResponse = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <h3 key={index} className="text-lg font-bold mt-4 mb-2 text-gray-800">{line.replace(/\*\*/g, '')}</h3>;
        }
        if (line.startsWith('* ')) {
          return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
        }
        return <p key={index} className="mb-2">{line}</p>;
      });
  };

  return (
    <div>
      <div className="text-center">
        <i className="fas fa-robot text-5xl text-emerald-500 mb-4"></i>
        <h1 className="text-3xl font-bold text-gray-800">{t('ai_coach_title')}</h1>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">{t('ai_coach_subtitle')}</p>
      </div>

      <div className="mt-8 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t('ai_coach_prompt_placeholder')}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            rows={4}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-emerald-600 text-white py-3 rounded-md font-semibold hover:bg-emerald-700 disabled:bg-emerald-300 transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                {t('ai_coach_thinking')}
              </>
            ) : (
                t('ai_coach_button')
            )}
          </button>
        </form>
      </div>

      {(loading || response) && (
        <div ref={responseRef} className="mt-10 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-gray-700 mb-4">{t('ai_coach_response_title')}</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg min-h-[100px]">
                {loading && (
                    <div className="flex justify-center items-center h-full">
                         <i className="fas fa-spinner fa-spin text-3xl text-emerald-500"></i>
                    </div>
                )}
                {response && (
                    <div className="prose prose-emerald max-w-none text-gray-700">{formatResponse(response)}</div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default AICoach;