import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Lightbulb, 
  FileText, 
  MapPin, 
  BrainCircuit, 
  Sparkles,
  Info,
  Activity,
  Navigation,
  Clock,
  Users,
  Compass,
  Tornado,
  CloudLightning,
  Map
} from 'lucide-react';

const ResultCard = ({ result }) => {
  if (!result) return null;

  const getRiskConfig = (level) => {
    switch (level) {
      case 'HIGH':
        return {
          color: 'text-red-400',
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          icon: <ShieldAlert className="w-8 h-8" />,
          label: 'HIGH RISK DETECTED',
          glow: 'from-red-900/60 to-orange-900/60'
        };
      case 'MEDIUM':
        return {
          color: 'text-yellow-400',
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
          icon: <AlertTriangle className="w-8 h-8" />,
          label: 'ELEVATED RISK',
          glow: 'from-yellow-900/40 to-orange-900/40'
        };
      case 'LOW':
      default:
        return {
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          icon: <ShieldCheck className="w-8 h-8" />,
          label: 'LOW RISK / NORMAL',
          glow: 'from-emerald-900/40 to-teal-900/40'
        };
    }
  };

  const riskConfig = getRiskConfig(result.riskLevel);

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 z-10 animate-fade-in relative group pb-12">
      
      {/* Top "Smart Decision Mode Activated" & "Context Awareness" Tags */}
      <div className="flex justify-center flex-wrap gap-3 -mb-4 relative z-20">
        <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-900/60 border border-indigo-500/40 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] backdrop-blur-md animate-pulse-glow">
          <Activity className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">Smart Decision Mode Activated</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-fuchsia-900/60 border border-fuchsia-500/40 rounded-full shadow-[0_0_15px_rgba(217,70,239,0.3)] backdrop-blur-md">
          <BrainCircuit className="w-4 h-4 text-fuchsia-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-200">Context Awareness: Active</span>
        </div>
      </div>

      {/* Background Glow specific to risk */}
      <div className={`absolute -inset-1 top-4 bg-gradient-to-br ${riskConfig.glow} rounded-3xl blur-2xl opacity-60 transition duration-1000`}></div>
      
      {/* Main Card */}
      <div className="relative glass-card rounded-3xl p-6 sm:p-10 flex flex-col gap-8 shadow-2xl mt-4 bg-gray-900/80 backdrop-blur-2xl border border-gray-700/50">
        
        {/* TOP: Huge Risk Badge Component */}
        <div className="flex flex-col gap-4">
          <div className={`flex items-center gap-4 p-5 rounded-2xl border ${riskConfig.bg} ${riskConfig.border} ${riskConfig.color} shadow-lg w-full`}>
            <div className="shrink-0 p-2 bg-black/20 rounded-xl">
              {riskConfig.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-widest opacity-80 font-semibold mb-1">Assessed Threat Level</span>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">{riskConfig.label}</span>
            </div>
          </div>
          
          {/* Why This Matters */}
          {result.whyItMatters && (
            <div className="flex items-start gap-3 px-2 py-1 text-gray-300 bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
              <Info className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <p className="text-sm font-medium leading-relaxed">
                <span className="text-gray-100 font-bold mr-2 block mb-1">Why This Matters:</span>
                {result.whyItMatters}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Location Safety Insight */}
          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-gray-950/40 border border-gray-800/60">
            <span className="text-gray-400 text-xs font-bold uppercase flex items-center gap-2 tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              Location Safety Insight
            </span>
            <span className="text-gray-100 font-medium">
              {result.locationInsight}
            </span>
          </div>

          {/* Environmental Conditions */}
          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-gray-950/40 border border-gray-800/60">
            <span className="text-gray-400 text-xs font-bold uppercase flex items-center gap-2 tracking-wider">
              <Tornado className="w-3.5 h-3.5" />
              Environmental Conditions
            </span>
            <span className="text-gray-100 text-sm font-medium">
              <strong className="text-indigo-400">{result.weatherContext.condition}</strong> → <span className="text-gray-300">{result.weatherContext.modifierMsg}</span>
            </span>
          </div>
        </div>

        {/* Risk Factors Considered Grid */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-gray-800">
            <Activity className="w-4 h-4 text-indigo-400" />
            Risk Factors Considered
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-gray-800/40 border border-gray-700/50">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold"><Clock className="w-3.5 h-3.5"/> Time</div>
              <div className="text-sm text-gray-200 font-medium leading-tight">{result.contextFactors.timeStr}</div>
            </div>
            <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-gray-800/40 border border-gray-700/50">
              <div className="flex items-center gap-2 text-fuchsia-400 text-xs font-semibold"><Users className="w-3.5 h-3.5"/> Travel Type</div>
              <div className="text-sm text-gray-200 font-medium leading-tight">{result.contextFactors.travelTypeStr}</div>
            </div>
            <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-gray-800/40 border border-gray-700/50">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold"><Map className="w-3.5 h-3.5"/> Location</div>
              <div className="text-sm text-gray-200 font-medium leading-tight">{result.contextFactors.familiarityStr}</div>
            </div>
            <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-gray-800/40 border border-gray-700/50">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold"><Navigation className="w-3.5 h-3.5"/> Density Assumed</div>
              <div className="text-sm text-gray-200 font-medium leading-tight">{result.contextFactors.crowdStr}</div>
            </div>
          </div>
        </div>

        {/* 1. Recommendation */}
        <div className="space-y-3 mt-4">
          <h3 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Core Recommendation
          </h3>
          <h4 className="text-xl sm:text-2xl font-semibold text-white leading-snug bg-gray-950/50 p-6 rounded-2xl border border-gray-800/80">
            {result.recommendation}
          </h4>
        </div>

        {/* 2. Reasoning */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-purple-400" />
            AI Reasoning
          </h3>
          <div className="bg-gray-800/40 rounded-2xl p-6 border border-gray-800/80 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-indigo-500"></div>
            <p className="text-gray-300 leading-relaxed text-lg">
              {result.reasoning}
            </p>
          </div>
        </div>

        {/* 3. Action Steps */}
        <div className="space-y-5">
          <h3 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Recommended Action Steps
          </h3>
          <ul className="grid grid-cols-1 gap-3">
            {result.actionSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-4 bg-gray-900/80 p-5 rounded-2xl border border-gray-800/80 hover:bg-gray-800/80 transition-colors shadow-sm">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 text-md font-bold border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                  {idx + 1}
                </div>
                <span className="text-gray-200 text-lg pt-0.5 leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 4. Travel Tips */}
        {result.tips && (
          <div className="flex items-start gap-4 bg-gradient-to-r from-indigo-900/40 to-purple-900/20 border border-indigo-500/30 p-6 rounded-2xl shadow-lg">
            <Lightbulb className="w-8 h-8 text-indigo-400 shrink-0 drop-shadow-glow" />
            <div>
              <span className="text-indigo-300 font-bold block mb-2 text-lg">Pro Travel Tip</span>
              <span className="text-indigo-100/90 text-lg leading-relaxed">{result.tips}</span>
            </div>
          </div>
        )}

      </div>

      {/* Confidence Level subtlety */}
      <div className="flex items-center justify-center gap-2 mt-6 text-gray-500 text-sm animate-fade-in opacity-80">
        <Info className="w-4 h-4" />
        <span>Analysis Confidence Level: 
          <strong className={`ml-1 font-semibold ${
            result.confidenceLevel === 'High' ? 'text-emerald-500/80' : 
            result.confidenceLevel === 'Medium' ? 'text-yellow-500/80' : 'text-red-500/80'
          }`}>
            {result.confidenceLevel}
          </strong>
        </span>
      </div>

    </div>
  );
};

export default ResultCard;
