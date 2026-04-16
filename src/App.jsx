import React, { useState } from 'react';
import Header from './components/Header';
import InputBox from './components/InputBox';
import ResultCard from './components/ResultCard';
import { simulateApiCall } from './utils/aiSimulation';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async (text, location) => {
    setIsLoading(true);
    setResult(null);
    try {
      // Simulate calling an AI API
      const response = await simulateApiCall(text, location);
      setResult(response);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans overflow-x-hidden relative selection:bg-indigo-500/30">
      {/* Background Gradients */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none"></div>
      <div className="fixed top-[40%] left-[50%] translate-x-[-50%] w-[60%] h-[20%] rounded-full bg-indigo-900/10 blur-[100px] pointer-events-none"></div>

      {/* Main Content */}
      <div className="container mx-auto px-4 min-h-screen flex flex-col pt-8 pb-20 relative z-10">
        <Header />
        
        <main className="flex-1 flex flex-col w-full mt-2">
          <InputBox onAnalyze={handleAnalyze} isLoading={isLoading} />
          
          {/* Result Area */}
          <div className="w-full transition-all duration-500 ease-out">
            <ResultCard result={result} />
          </div>
        </main>
        
        {/* Footer */}
        <footer className="mt-auto pt-24 text-center text-gray-600 text-sm font-medium tracking-wide">
          <p>© {new Date().getFullYear()} TravelPilot AI • Empowering Safe Journeys</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
