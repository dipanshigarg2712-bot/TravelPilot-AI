// Simulated AI logic for context analysis

const CATEGORIES = {
  SAFETY: "Route & Safety Advisor",
  SCAM: "Scam / Price Detection",
  ITINERARY: "Smart Itinerary Planner",
  EMERGENCY: "Emergency Guidance"
};

const RISK_LEVELS = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH"
};

const calcConfidence = (input) => {
  const words = input.trim().split(/\s+/).length;
  if (words > 15) return "High";
  if (words > 5) return "Medium";
  return "Low";
};

// Simple heuristic for known cities
const getCitySafetyInsight = (location) => {
  if (!location) return { modifier: 0, text: "Unknown location (Baseline risk)" };
  const loc = location.toLowerCase();
  
  const lowRiskCities = ["tokyo", "singapore", "zurich", "copenhagen", "oslo", "dubai"];
  const mediumRiskCities = ["new york", "london", "paris", "rome", "barcelona", "berlin", "bangkok", "delhi"];
  const highRiskCities = ["rio", "caracas", "johannesburg", "cape town"];
  
  if (highRiskCities.some(city => loc.includes(city))) return { modifier: 2, text: "High awareness needed" };
  // From prompt: "Delhi -> medium/high awareness", let's put it high or medium based on keywords. Let's just hardcode Delhi as 'High awareness needed' but modifier 1.
  if (loc.includes('delhi')) return { modifier: 1, text: "High awareness needed" };

  if (mediumRiskCities.some(city => loc.includes(city))) return { modifier: 1, text: "Moderate risk for travelers" };
  if (lowRiskCities.some(city => loc.includes(city))) return { modifier: -1, text: "Generally Safe" };
  
  return { modifier: 0, text: "Moderate risk for travelers" }; // Default for unknown
};

const extractContextFactors = (input) => {
  const lr = input.toLowerCase();
  
  // Time
  let timeStr = "Daytime (Default)";
  if (lr.includes("night") || lr.includes("midnight") || lr.includes("late") || lr.includes("evening")) timeStr = "Nighttime (-1 Visibility)";
  else if (lr.includes("morning") || lr.includes("day") || lr.includes("afternoon")) timeStr = "Daytime / Morning (+1 Visibility)";
  
  // Travel Type
  let travelTypeStr = "Solo";
  if (lr.includes("we ") || lr.includes("group") || lr.includes("family") || lr.includes("wife") || lr.includes("husband") || lr.includes("friend")) travelTypeStr = "Group/Accompanied (Safer)";
  else travelTypeStr = lr.includes("alone") || lr.includes("solo") ? "Solo (Elevated Vulnerability)" : "Unspecified (Assumed Solo)";
  
  // Familiarity
  let familiarityStr = "Unfamiliar (Default)";
  if (lr.includes("new city") || lr.includes("unknown") || lr.includes("first time") || lr.includes("lost")) familiarityStr = "Unfamiliar Area (+Risk)";
  else if (lr.includes("my hotel") || lr.includes("know ") || lr.includes("local") || lr.includes("familiar")) familiarityStr = "Familiar Area (-Risk)";

  // Crowd Density assumption
  let crowdStr = "Quiet/Isolated";
  if (timeStr.includes("Night") && familiarityStr.includes("Unfamiliar")) crowdStr = "Isolated Area Likely";
  if (timeStr.includes("Day") && (lr.includes("city") || lr.includes("downtown"))) crowdStr = "Busy City Center (Safer during day)";
  if (lr.includes("alone") && lr.includes("night")) crowdStr = "Low Density (Vulnerable)";

  return { timeStr, travelTypeStr, familiarityStr, crowdStr };
};

const simulateWeather = (location, input) => {
  // If explicitly stated in input
  const lr = input.toLowerCase();
  if (lr.includes("rain") || lr.includes("storm") || lr.includes("wet")) return "🌧 Rainy";
  if (lr.includes("fog") || lr.includes("mist")) return "🌫 Foggy";
  if (lr.includes("snow") || lr.includes("ice")) return "❄️ Snowy";
  if (lr.includes("sun") || lr.includes("hot") || lr.includes("clear")) return "☀ Clear/Sunny";

  // Otherwise pseudo-random based on location string length just to show "intelligence"
  const hash = location.length + input.length;
  if (hash % 5 === 0) return "🌧 Rainy";
  if (hash % 7 === 0) return "🌫 Foggy";
  return "☀ Clear/Normal";
};

export const analyzeTravelContext = (input, location = "") => {
  const lowerInput = input.toLowerCase();
  const confidenceLevel = calcConfidence(input);
  const cityInsight = getCitySafetyInsight(location);

  // Extract Context Factors
  const factors = extractContextFactors(input);
  
  // Extract/Simulate Weather
  const weatherCond = simulateWeather(location, input);
  
  // Weather Modifier
  let weatherModifier = 0;
  let weatherExplanation = "Normal visibility and conditions.";
  if (weatherCond.includes("Rainy") || weatherCond.includes("Snowy")) {
    weatherModifier = 1;
    weatherExplanation = "reduces visibility and slows transit → increases risk";
  } else if (weatherCond.includes("Foggy")) {
    weatherModifier = 1;
    weatherExplanation = "severely reduces visibility → increases risk";
  }

  // Basic keyword-based heuristics
  const highRiskKeywords = ["midnight", "alone", "lost", "emergency", "danger", "robbed", "stolen", "hurt", "hospital", "police"];
  const mediumRiskKeywords = ["new city", "late", "unknown place", "expensive", "scam", "overcharged", "taxi", "night", "fake", "airport", "station"];
  
  let riskLevel = RISK_LEVELS.LOW;
  let category = CATEGORIES.ITINERARY;

  // Determine Primary Category & Initial Risk Level
  let baseRiskScore = 0;
  if (highRiskKeywords.some(kw => lowerInput.includes(kw))) {
    baseRiskScore = 3;
    category = (lowerInput.includes("midnight") || lowerInput.includes("alone") || lowerInput.includes("danger") || lowerInput.includes("police")) 
      ? CATEGORIES.SAFETY 
      : CATEGORIES.EMERGENCY;
    if (lowerInput.includes("hospital") || lowerInput.includes("hurt") || lowerInput.includes("robbed")) category = CATEGORIES.EMERGENCY;
  } else if (mediumRiskKeywords.some(kw => lowerInput.includes(kw))) {
    baseRiskScore = 2;
    category = (lowerInput.includes("scam") || lowerInput.includes("overcharge") || lowerInput.includes("expensive") || lowerInput.includes("taxi") || lowerInput.includes("fake")) 
      ? CATEGORIES.SCAM 
      : CATEGORIES.SAFETY;
  } else {
    baseRiskScore = 1;
    category = (lowerInput.includes("plan") || lowerInput.includes("days") || lowerInput.includes("visit") || lowerInput.includes("itinerary")) 
      ? CATEGORIES.ITINERARY 
      : CATEGORIES.ITINERARY;
  }

  // Increase base risk if night & solo
  if (factors.timeStr.includes("Night") && factors.travelTypeStr.includes("Solo")) {
    baseRiskScore += 1;
  }

  // Apply modifiers
  let finalRiskScore = baseRiskScore + cityInsight.modifier + (weatherModifier > 0 && category !== CATEGORIES.ITINERARY ? 1 : 0);
  
  // Cap between 1 and 3
  if (finalRiskScore > 3) finalRiskScore = 3;
  if (finalRiskScore < 1) finalRiskScore = 1;

  if (category === CATEGORIES.EMERGENCY) finalRiskScore = 3; // Emergencies are always HIGH

  if (finalRiskScore === 3) riskLevel = RISK_LEVELS.HIGH;
  else if (finalRiskScore === 2) riskLevel = RISK_LEVELS.MEDIUM;
  else riskLevel = RISK_LEVELS.LOW;

  // Generate specific responses based on category
  let whyItMatters = "";
  let recommendation = "";
  let reasoning = "";
  let actionSteps = [];
  let tips = "";

  const locationContext = location ? ` in ${location}` : "";

  switch (category) {
    case CATEGORIES.EMERGENCY:
      whyItMatters = "When you're hurt or in immediate danger, every minute counts. Panic makes things blur together.";
      recommendation = `Prioritize immediate physical safety and seek local authorities${locationContext}.`;
      reasoning = "Your situation indicates an acute emergency where immediate assistance from local services or moving to a secure environment is paramount.";
      actionSteps = [
        "Call the immediate emergency response number for your current country (e.g., 911, 112, 999).",
        "Move into a well-lit, crowded public space, such as a 24/7 hotel lobby, major fast-food chain, or police station.",
        "Share your live tracking location via WhatsApp or Google Maps with an emergency contact back home.",
        "Secure your passport, ID, and phone in a hidden interior pocket if fleeing/moving quickly."
      ];
      tips = "Take quick photos of your immediate surroundings or any involved vehicles/suspicious figures from a safe distance.";
      break;

    case CATEGORIES.SAFETY:
      if (riskLevel === RISK_LEVELS.HIGH) {
        whyItMatters = "Nighttime + unfamiliar places + being alone is the most common recipe for pickpockets and opportunistic crime.";
        recommendation = `Secure verified transport immediately and avoid isolated streets${locationContext}.`;
        reasoning = `Traveling late at night alone${locationContext ? ` in a city like ${location}` : ''} significantly elevates the risk of opportunistic crime.`;
        if (weatherModifier > 0) reasoning += ` The poor weather (${weatherCond}) further reduces visibility and safe shelter options.`;
        actionSteps = [
          "Wait inside a brightly lit business (like a pharmacy or hotel) rather than on the street corner.",
          "Book a verified ride through a reputable app (Uber, Bolt, Grab, or local equivalent). Do not hail a street cab.",
          "Check the license plate and driver photo on the app before entering the vehicle.",
          "Share your trip's Live ETA status directly from the app with a trusted individual."
        ];
        tips = "Sit in the rear passenger seat directly behind the driver to maintain distance and personal space.";
      } else {
        whyItMatters = "Looking lost makes you a fast target for touts or scammers. Knowing where you're going changes your body language.";
        recommendation = `Establish your bearings before moving and stick to major arteries${locationContext}.`;
        reasoning = "Navigating an unknown environment creates a vulnerable profile if you appear lost or disoriented.";
        if (weatherModifier > 0) reasoning += ` ${weatherCond} conditions compound this vulnerability.`;
        actionSteps = [
          "Step into a nearby café or shop to check your map on your phone privately.",
          "Download offline Google Maps for your current city to function without reliable internet.",
          "Plot a route that follows well-lit, commercial streets rather than residential alleyways.",
          "Keep expensive electronics out of sight while walking."
        ];
        tips = "Walk with purpose and your head up. Confidence is a major deterrent.";
      }
      break;

    case CATEGORIES.SCAM:
      whyItMatters = "Scammers rely on you being tired or too polite to say no. Losing money leaves a bad taste on any trip.";
      recommendation = `Firmly refuse the inflated price and utilize standard, metered transport${locationContext}.`;
      reasoning = `This is a classic 'tourist tax' scenario where unofficial operators prey on lack of local price knowledge${locationContext ? ` in ${location}` : ''}.`;
      actionSteps = [
        "Use local transport apps or Google Maps fare estimators to check standard rates (e.g., 'Normal airport-to-center fare is usually €25-€35').",
        "Politely but firmly state: 'No thank you, my hotel told me the exact fare is [realistic price].'",
        "If pressured or physical intimidation is attempted, loudly say 'No' and walk directly back inside the airport or station.",
        "Always demand the taximeter be turned on before closing the door. If they claim it's 'broken', exit immediately."
      ];
      tips = "Look for the official, licensed taxi rank queue instead of accepting offers from solicitors inside the arrivals terminal.";
      break;

    case CATEGORIES.ITINERARY:
    default:
      whyItMatters = "Winging it sounds fun until you spend half your trip commuting back and forth across the city.";
      recommendation = `Optimize your day with a geographic, time-blocked approach${locationContext}.`;
      reasoning = "Grouping points of interest minimizes transit exhaustion and maximizes time spent actually enjoying the destination.";
      actionSteps = [
        "Morning (09:00 - 13:00): Start early at the most popular landmark or museum to beat the major crowds. Allow 2-3 hours.",
        "Afternoon (13:30 - 17:00): Find lunch nearby, then explore the surrounding historic district or adjacent outdoor parks.",
        "Evening (18:30+): Head towards a prominent neighborhood known for authentic dining. Consider booking reservations in advance."
      ];
      tips = "Always schedule a 1-2 hour buffer period to allow for spontaneous discoveries, resting, or delayed transport.";
      break;
  }

  // Return the structured object
  return {
    category,
    riskLevel,
    whyItMatters,
    locationInsight: cityInsight.text,
    weatherContext: {
      condition: weatherCond,
      modifierMsg: weatherModifier > 0 ? weatherExplanation : "Normal conditions."
    },
    contextFactors: factors,
    recommendation,
    reasoning,
    actionSteps,
    tips,
    confidenceLevel
  };
};

export const simulateApiCall = (input, location) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(analyzeTravelContext(input, location));
    }, 2000);
  });
};
