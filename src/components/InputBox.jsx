import React, { useState, useEffect } from 'react';
import { Send, Loader2, MapPin } from 'lucide-react';

const SUGGESTIONS = [
  "Traveling alone at night",
  "Taxi overcharging",
  "1 day itinerary",
  "Lost wallet"
];

const InputBox = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState("");
  const [location, setLocation] = useState("");
  const [loadingDots, setLoadingDots] = useState("");

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingDots(prev => prev.length >= 3 ? "" : prev + ".");
      }, 400);
    } else {
      setLoadingDots("");
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onAnalyze(text, location);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 z-20 animate-slide-up mt-6 mb-8">
      <form onSubmit={handleSubmit} className="relative group flex flex-col gap-5">
        
        {/* Glow behind main input container */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] blur-md opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-300"></div>
        
        {/* Main Input Container */}
        <div className="relative flex flex-col glass-card rounded-[2rem] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] focus-within:ring-2 focus-within:ring-indigo-500/70 transition-all bg-gray-900/60 backdrop-blur-2xl">
          
          {/* Location Bar Input */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-800/60 bg-gray-950/20">
            <MapPin className="w-5 h-5 text-indigo-400" />
            <input 
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or location (e.g., Tokyo, Delhi, New York)"
              className="w-full bg-transparent text-gray-200 placeholder-gray-500 outline-none sm:text-lg font-medium tracking-wide"
              disabled={isLoading}
            />
          </div>

          {/* Main Situation TextArea */}
          <div className="flex flex-col sm:flex-row relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe your travel situation... (e.g., 'Taxi driver wants 100 EUR from airport')"
              className="w-full min-h-[140px] sm:min-h-[120px] bg-transparent text-gray-100 placeholder-gray-500 p-6 pt-5 outline-none resize-none sm:text-xl font-medium tracking-wide leading-relaxed"
              disabled={isLoading}
            />
            
            {/* Analyze Button */}
            <div className="flex items-end justify-end p-4 sm:p-5 bg-gray-950/40 sm:bg-transparent absolute bottom-0 right-0 sm:relative sm:w-auto">
              <button
                type="submit"
                disabled={isLoading || !text.trim()}
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 hover:from-indigo-400 to-purple-600 hover:to-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 py-4 sm:py-3 rounded-2xl font-bold tracking-wide transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] active:scale-95 whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5 text-indigo-200" />
                    <span className="hidden sm:inline w-[220px] text-left">
                      Analyzing situation{loadingDots}
                    </span>
                    <span className="sm:hidden">Analyzing{loadingDots}</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline text-lg">Analyze Location</span>
                    <span className="sm:hidden text-lg">Analyze</span>
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="relative flex flex-wrap items-center gap-3 px-2">
          <span className="text-gray-400 text-sm font-semibold tracking-wider uppercase mr-1">Suggestions:</span>
          {SUGGESTIONS.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setText(suggestion)}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-800/80 hover:bg-indigo-600/20 text-gray-300 hover:text-indigo-300 border border-gray-700/50 hover:border-indigo-500/50 rounded-full text-sm font-medium transition-all active:scale-95 backdrop-blur-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>

      </form>
    </div>
  );
};

export default InputBox;
