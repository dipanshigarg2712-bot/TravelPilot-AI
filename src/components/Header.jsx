import React from 'react';
import { Compass } from 'lucide-react';

const Header = () => {
  return (
    <header className="flex flex-col items-center justify-center pt-20 pb-8 animate-fade-in text-center px-4">
      <div className="flex items-center gap-4 mb-5">
        <div className="bg-gradient-to-br from-blue-600/30 to-purple-600/30 p-4 rounded-3xl border border-blue-400/40 text-blue-300 shadow-[0_0_30px_rgba(59,130,246,0.3)] backdrop-blur-md">
          <Compass size={44} className="animate-[spin_8s_linear_infinite]" />
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-blue-300 via-indigo-400 to-purple-500 drop-shadow-sm pb-1">
          TravelPilot AI
        </h1>
      </div>
      <p className="text-indigo-200/80 text-xl md:text-2xl max-w-2xl font-semibold tracking-wide">
        Your Smart Travel Decision Assistant
      </p>
    </header>
  );
};

export default Header;
