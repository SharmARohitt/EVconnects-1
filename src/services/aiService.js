// AI Service for EVconnects - Handles all AI-powered features
import stationsData from '../data/mockStations.json';
import bookingsData from '../data/mockBookings.json';
import batteryData from '../data/mockBatteryData.json';
import carbonData from '../data/mockCarbonData.json';
import analyticsData from '../data/mockAnalytics.json';

// Simulate AI processing delay
const simulateAIDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// AI Chatbot Service
export const aiChatService = {
  async processMessage(message) {
    await simulateAIDelay();
    
    const lowerMessage = message.toLowerCase();
    
    // Intent: Find charging stations
    if (lowerMessage.includes('find') || lowerMessage.includes('locate') || lowerMessage.includes('near')) {
      if (lowerMessage.includes('fast')) {
        const fastStations = stationsData.stations.filter(s => 
          s.chargerTypes.includes('CCS') || s.chargerTypes.includes('CHAdeMO')
        );
        return {
          intent: 'find_stations',
          response: `I found ${fastStations.length} fast charging stations near you:\n\n` +
            fastStations.slice(0, 3).map(s => 
              `🔌 ${s.name}\n📍 ${s.address}\n⚡ Available: ${s.availableChargers}/${s.totalChargers}\n⏱️ Avg wait: ${s.averageWaitTime} min`
            ).join('\n\n'),
          data: fastStations
        };
      }
      return {
        intent: 'find_stations',
        response: `Here are charging stations near you:\n\n` +
          stationsData.stations.slice(0, 3).map(s => 
            `🔌 ${s.name}\n📍 ${s.address}\n💰 From ₹${Math.min(...Object.values(s.pricing))}/hr\n⚡ ${s.availableChargers}/${s.totalChargers} available`
          ).join('\n\n'),
        data: stationsData.stations
      };
    }
    
    // Intent: Book a station
    if (lowerMessage.includes('book') || lowerMessage.includes('reserve')) {
      return {
        intent: 'book_station',
        response: `I can help you book a charging slot! 📅\n\nPlease tell me:\n1. Which station? (or say "recommend one")\n2. What date and time?\n3. How long do you need?\n\nFor example: "Book TATA Power station tomorrow at 3 PM for 2 hours"`,
        action: 'request_booking_details'
      };
    }
    
    // Intent: Show bookings
    if (lowerMessage.includes('booking') || lowerMessage.includes('history') || lowerMessage.includes('recent')) {
      const recentBookings = bookingsData.bookings.slice(0, 3);
      return {
        intent: 'show_bookings',
        response: `Here are your recent bookings:\n\n` +
          recentBookings.map(b => 
            `📋 ${b.id}\n🔌 ${b.stationName}\n📅 ${b.date} at ${b.time}\n💰 ₹${b.cost}\n✅ ${b.status}`
          ).join('\n\n'),
        data: recentBookings
      };
    }
    
    // Intent: Compare costs
    if (lowerMessage.includes('compare') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
      const comparison = stationsData.stations.slice(0, 3).map(s => ({
        name: s.name,
        pricing: s.pricing,
        avgCost: Math.round(Object.values(s.pricing).reduce((a, b) => a + b, 0) / Object.values(s.pricing).length)
      }));
      
      return {
        intent: 'compare_costs',
        response: `Here's a cost comparison:\n\n` +
          comparison.map(c => 
            `🏢 ${c.name}\n💰 Average: ₹${c.avgCost}/hr\n` +
            Object.entries(c.pricing).map(([type, price]) => `   ${type}: ₹${price}/hr`).join('\n')
          ).join('\n\n'),
        data: comparison
      };
    }
    
    // Intent: Battery estimate
    if (lowerMessage.includes('battery') || lowerMessage.includes('range') || lowerMessage.includes('estimate')) {
      const match = message.match(/(\d+)\s*(km|miles)/);
      const distance = match ? parseInt(match[1]) : 100;
      const batteryNeeded = (distance * 0.2).toFixed(1); // 0.2 kWh per km
      const chargingTime = (batteryNeeded / 50).toFixed(1); // 50 kW charging speed
      
      return {
        intent: 'battery_estimate',
        response: `For a ${distance} km trip:\n\n` +
          `🔋 Battery needed: ~${batteryNeeded} kWh\n` +
          `⏱️ Charging time: ~${chargingTime} hours (at 50kW)\n` +
          `💰 Estimated cost: ₹${Math.round(batteryNeeded * 12)}\n` +
          `🌱 CO₂ saved: ${(distance * 0.2).toFixed(1)} kg vs petrol`,
        data: { distance, batteryNeeded, chargingTime }
      };
    }
    
    // Intent: Best time to charge
    if (lowerMessage.includes('best time') || lowerMessage.includes('when') && lowerMessage.includes('charge')) {
      return {
        intent: 'best_time',
        response: `⏰ Best times to charge (low demand, lower cost):\n\n` +
          `🌙 Night: 11 PM - 6 AM (20% discount)\n` +
          `🌅 Early morning: 6 AM - 8 AM\n` +
          `☀️ Mid-afternoon: 2 PM - 4 PM\n\n` +
          `❌ Avoid: 8-10 AM, 6-9 PM (peak hours)\n\n` +
          `💡 Charging now saves ₹15-30 per hour vs peak times!`,
        data: stationsData.demandPatterns
      };
    }
    
    // Intent: Station recommendations
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('best station')) {
      const topStation = stationsData.stations
        .filter(s => s.isAvailable)
        .sort((a, b) => b.rating - a.rating)[0];
      
      return {
        intent: 'recommend_station',
        response: `🌟 I recommend: ${topStation.name}\n\n` +
          `⭐ Rating: ${topStation.rating}/5\n` +
          `📍 Distance: ${topStation.distance} km away\n` +
          `⚡ ${topStation.availableChargers} chargers available\n` +
          `⏱️ Wait time: ~${topStation.averageWaitTime} min\n` +
          `💰 Starting at ₹${Math.min(...Object.values(topStation.pricing))}/hr\n\n` +
          `Would you like to book here?`,
        data: topStation
      };
    }
    
    // Intent: Help
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you')) {
      return {
        intent: 'help',
        response: `Hi! I'm your EVconnects AI assistant 🤖\n\nI can help you with:\n\n` +
          `🔍 Find charging stations near you\n` +
          `📅 Book charging slots\n` +
          `💰 Compare pricing\n` +
          `🔋 Estimate battery & range\n` +
          `⏰ Suggest best charging times\n` +
          `📊 View your booking history\n` +
          `🌟 Recommend stations\n\n` +
          `Just ask me anything! For example:\n` +
          `"Find fast chargers near me"\n` +
          `"When is the best time to charge?"\n` +
          `"Show my recent bookings"`
      };
    }
    
    // Default response
    return {
      intent: 'general',
      response: `I understand you're asking about "${message}". ` +
        `I can help you find stations, book slots, compare costs, and more!\n\n` +
        `Try asking:\n` +
        `• "Find charging stations near me"\n` +
        `• "What's the best time to charge?"\n` +
        `• "Show my bookings"\n` +
        `• Say "help" to see all features!`
    };
  }
};

// Smart Advisor Service
export const smartAdvisorService = {
  async predictOptimalCharging(stationId, currentTime, dayOfWeek) {
    await simulateAIDelay(1000);
    
    const station = stationsData.stations.find(s => s.id === stationId);
    if (!station) return null;
    
    const hour = new Date().getHours();
    const isPeakHour = station.peakHours.includes(hour);
    const demandMultiplier = isPeakHour ? 1.5 : 0.8;
    const predictedWaitTime = Math.round(station.averageWaitTime * demandMultiplier);
    
    // Find optimal slot (next non-peak hour)
    const nextOptimalHour = Array.from({length: 24}, (_, i) => i)
      .filter(h => !station.peakHours.includes(h))
      .find(h => h > hour) || station.peakHours[0];
    
    return {
      stationId,
      stationName: station.name,
      currentWaitTime: predictedWaitTime,
      demandLevel: station.demandLevel,
      recommendedSlot: `${nextOptimalHour}:00`,
      savings: isPeakHour ? Math.round(station.pricing.CCS * 0.2) : 0,
      confidence: 87,
      insights: [
        isPeakHour 
          ? `⚠️ Peak hour detected. Waiting ${predictedWaitTime} min. Consider booking at ${nextOptimalHour}:00 to save ₹${Math.round(station.pricing.CCS * 0.2)}`
          : `✅ Good time to charge! Low demand, minimal wait time.`,
        `💡 ${station.availableChargers} out of ${station.totalChargers} chargers available`,
        `📊 This station typically has ${station.demandLevel} demand at this hour`
      ]
    };
  },
  
  async getChargingRecommendations() {
    await simulateAIDelay();
    
    const hour = new Date().getHours();
    const availableStations = stationsData.stations.filter(s => s.isAvailable);
    
    const recommendations = availableStations
      .map(station => {
        const isPeak = station.peakHours.includes(hour);
        const score = (station.rating * 20) + 
                     (station.availableChargers / station.totalChargers * 30) +
                     (!isPeak ? 25 : 0) +
                     (25 / (station.distance + 1));
        
        return {
          ...station,
          score: Math.round(score),
          isPeakHour: isPeak,
          estimatedCost: Object.values(station.pricing)[0] * (isPeak ? 1.3 : 1.0)
        };
      })
      .sort((a, b) => b.score - a.score);
    
    return {
      currentHour: hour,
      recommendations: recommendations.slice(0, 5),
      insights: [
        `🎯 Found ${recommendations.length} available stations`,
        hour >= 18 && hour <= 21 
          ? `⚠️ Peak evening hours - consider charging after 9 PM for 20% savings`
          : `✅ Good time to charge with lower demand`,
        `💰 Best value: ${recommendations[0].name} at ₹${Math.round(recommendations[0].estimatedCost)}/hr`
      ]
    };
  }
};

// Battery Health Service
export const batteryHealthService = {
  async analyzeBatteryHealth() {
    await simulateAIDelay(1200);
    
    const health = batteryData.batteryHealth;
    const trends = batteryData.batteryTrends;
    
    const healthStatus = health.currentHealth >= 90 ? 'Excellent' :
                        health.currentHealth >= 80 ? 'Good' :
                        health.currentHealth >= 70 ? 'Fair' : 'Poor';
    
    return {
      ...health,
      status: healthStatus,
      trends,
      aiInsights: [
        `🔋 Your battery health is ${healthStatus} at ${health.currentHealth}%`,
        `📊 Degradation rate of ${health.degradationRate}% per year is better than average`,
        `♻️ You've completed ${health.totalCycles} charging cycles`,
        `⏳ Estimated ${health.remainingLifespan} years of optimal performance remaining`,
        batteryData.chargingPatterns.fastCharging > 40
          ? `⚠️ High fast-charging usage (${batteryData.chargingPatterns.fastCharging}%) - consider more slow charging`
          : `✅ Good charging habits with balanced fast/slow charging`,
        `💡 Tip: ${batteryData.recommendations[0]}`
      ],
      predictions: batteryData.predictions,
      recommendations: batteryData.recommendations
    };
  },
  
  async predictBatteryForTrip(distance) {
    await simulateAIDelay();
    
    const health = batteryData.batteryHealth;
    const efficiencyFactor = health.currentHealth / 100;
    const energyPerKm = 0.2; // kWh per km
    const energyNeeded = distance * energyPerKm;
    const actualEnergyNeeded = energyNeeded / efficiencyFactor;
    const batteryPercentNeeded = (actualEnergyNeeded / health.capacity) * 100;
    
    return {
      distance,
      energyNeeded: energyNeeded.toFixed(1),
      actualEnergyNeeded: actualEnergyNeeded.toFixed(1),
      batteryPercentNeeded: Math.round(batteryPercentNeeded),
      canComplete: batteryPercentNeeded <= 80,
      recommendedChargingStops: Math.ceil(batteryPercentNeeded / 70),
      insights: [
        `📏 Trip distance: ${distance} km`,
        `🔋 Energy required: ${actualEnergyNeeded.toFixed(1)} kWh (${Math.round(batteryPercentNeeded)}% of battery)`,
        batteryPercentNeeded <= 80
          ? `✅ You can complete this trip with current battery health`
          : `⚠️ Recommended to charge during trip - plan ${Math.ceil(batteryPercentNeeded / 70)} charging stop(s)`,
        `💡 With ${health.currentHealth}% battery health, efficiency is slightly reduced`
      ]
    };
  }
};

// Route Optimizer Service
export const routeOptimizerService = {
  async optimizeRoute(start, destination, currentBatteryPercent) {
    await simulateAIDelay(1500);
    
    // Mock route data
    const totalDistance = Math.floor(Math.random() * 300) + 100;
    const batteryNeeded = totalDistance * 0.2;
    const availableBattery = (currentBatteryPercent / 100) * batteryData.batteryHealth.capacity;
    const needsCharging = batteryNeeded > availableBattery * 0.8;
    
    const chargingStops = needsCharging
      ? stationsData.stations
          .filter(s => s.isAvailable)
          .slice(0, Math.ceil(batteryNeeded / 40))
          .map((s, i) => ({
            ...s,
            stopNumber: i + 1,
            distanceFromStart: Math.round(totalDistance * (i + 1) / (Math.ceil(batteryNeeded / 40) + 1)),
            recommendedChargeDuration: 30,
            estimatedCost: Math.round(s.pricing.CCS * 0.5)
          }))
      : [];
    
    return {
      start,
      destination,
      totalDistance,
      estimatedDuration: Math.round(totalDistance / 60 * 60), // minutes
      currentBattery: currentBatteryPercent,
      batteryNeeded: Math.round(batteryNeeded),
      needsCharging,
      chargingStops,
      totalChargingTime: chargingStops.reduce((sum, stop) => sum + stop.recommendedChargeDuration, 0),
      totalChargingCost: chargingStops.reduce((sum, stop) => sum + stop.estimatedCost, 0),
      finalBatteryPercent: needsCharging ? 75 : Math.round(currentBatteryPercent - (batteryNeeded / batteryData.batteryHealth.capacity * 100)),
      insights: [
        `📍 Route: ${start} → ${destination} (${totalDistance} km)`,
        needsCharging
          ? `⚡ ${chargingStops.length} charging stop(s) recommended`
          : `✅ No charging needed - sufficient battery range`,
        `⏱️ Total time: ${Math.round(totalDistance / 60 * 60)} min (including ${chargingStops.reduce((sum, stop) => sum + stop.recommendedChargeDuration, 0)} min charging)`,
        `💰 Estimated charging cost: ₹${chargingStops.reduce((sum, stop) => sum + stop.estimatedCost, 0)}`
      ]
    };
  }
};

// Carbon Analyzer Service
export const carbonAnalyzerService = {
  async analyzeCarbonFootprint() {
    await simulateAIDelay();
    
    return {
      ...carbonData.carbonData,
      aiSummary: carbonData.carbonData.insights.join('\n\n'),
      globalImpact: carbonData.globalImpact
    };
  },

  async calculateCarbonSavings(period = 'month') {
    await simulateAIDelay();
    
    const data = carbonData.carbonData;
    
    // Generate different data based on period
    let trendsData, totalSaved, sessions, treesEquivalent;
    
    if (period === 'week') {
      trendsData = data.weeklyTrends.map(item => ({
        period: item.week,
        carbonSaved: item.co2Saved
      }));
      totalSaved = 133;
      sessions = 28;
      treesEquivalent = 7;
    } else if (period === 'year') {
      trendsData = [
        { period: '2023', carbonSaved: 856 },
        { period: '2024', carbonSaved: 924 },
        { period: '2025', carbonSaved: 996 }
      ];
      totalSaved = 2776;
      sessions = 512;
      treesEquivalent = 139;
    } else {
      // month (default)
      trendsData = data.monthlyTrends.map(item => ({
        period: item.month.split(' ')[0],
        carbonSaved: item.co2Saved
      }));
      totalSaved = data.totalCO2Saved;
      sessions = 157;
      treesEquivalent = Math.round(data.equivalentTrees);
    }
    
    // Transform data to match component expectations
    return {
      totalSaved,
      treesEquivalent,
      totalChargingSessions: sessions,
      comparisonText: `You've prevented ${totalSaved}kg of CO₂ emissions this ${period} - that's like planting ${treesEquivalent} trees! 🌱`,
      percentageSaved: Math.round(((data.comparisonWithPetrol.savings / data.comparisonWithPetrol.petrolEmissions) * 100)),
      
      achievements: data.achievements.map(achievement => ({
        ...achievement,
        progress: achievement.unlocked ? 100 : Math.floor(Math.random() * 80) + 20
      })),
      
      trends: trendsData,
      
      comparison: [
        { type: 'Your EV', emissions: period === 'year' ? 692 : period === 'week' ? 33 : data.comparisonWithPetrol.evEmissions },
        { type: 'Gasoline Car', emissions: period === 'year' ? 3468 : period === 'week' ? 311 : data.comparisonWithPetrol.petrolEmissions }
      ],
      
      energyMix: [
        { name: 'Solar', value: 35 },
        { name: 'Wind', value: 25 },
        { name: 'Hydro', value: 20 },
        { name: 'Grid', value: 20 }
      ],
      
      impactMetrics: [
        { icon: '🌍', value: `${totalSaved}kg`, label: 'CO₂ Prevented' },
        { icon: '🌳', value: `${treesEquivalent}`, label: 'Trees Equivalent' },
        { icon: '🚗', value: period === 'year' ? '6,940' : period === 'week' ? '665' : `${data.equivalentMiles}`, label: 'Miles Offset' },
        { icon: '💰', value: period === 'year' ? '₹25,020' : period === 'week' ? '₹1,197' : '₹8,970', label: 'Money Saved' }
      ],
      
      insights: period === 'year' ? [
        "Outstanding year! You've saved 2,776 kg of CO₂ - equivalent to planting 139 trees! 🌳",
        "Your annual green choices prevented pollution equal to 6,940 miles of petrol car driving",
        "You've saved ₹25,020 in fuel costs this year compared to petrol vehicles",
        "You're in the top 5% of eco-friendly drivers nationwide!"
      ] : period === 'week' ? [
        "Great week! You've saved 133 kg of CO₂ - equivalent to planting 7 trees! 🌱",
        "This week you avoided emitting pollution equal to 665 miles of petrol car driving",
        "Your weekly green choices saved ₹1,197 in fuel costs",
        "You're maintaining excellent eco-friendly driving habits!"
      ] : data.insights,
      
      leaderboard: [
        { name: 'EcoDriver99', carbonSaved: period === 'year' ? 3250 : period === 'week' ? 156 : 1250, badge: '🌟', isYou: false },
        { name: 'GreenWarrior', carbonSaved: period === 'year' ? 2890 : period === 'week' ? 142 : 1120, badge: '🍃', isYou: false },
        { name: 'You', carbonSaved: totalSaved, badge: '⚡', isYou: true },
        { name: 'CleanEnergy', carbonSaved: period === 'year' ? 2340 : period === 'week' ? 118 : 890, badge: '🔋', isYou: false },
        { name: 'NatureLover', carbonSaved: period === 'year' ? 2120 : period === 'week' ? 108 : 780, badge: '🌱', isYou: false }
      ].sort((a, b) => b.carbonSaved - a.carbonSaved)
    };
  }
};

// Analytics Service
export const analyticsService = {
  async getAdminInsights() {
    await simulateAIDelay(1000);
    
    const data = analyticsData.analytics;
    
    return {
      ...data,
      aiGeneratedSummary: `📊 EVconnects Platform Analysis\n\n` +
        `Our network is performing exceptionally well with ${data.overview.totalStations} stations ` +
        `serving ${data.overview.activeUsers} active users. Revenue has grown to ₹${(data.overview.totalRevenue / 100000).toFixed(1)}L ` +
        `with a ${data.overview.growthRate}% growth rate.\n\n` +
        `Top performer: ${data.topStations[0].name} with ${data.topStations[0].bookings} bookings ` +
        `and ${data.topStations[0].utilizationRate}% utilization. Peak demand occurs during ` +
        `evening hours (6-9 PM), suggesting opportunities for dynamic pricing.\n\n` +
        `Customer satisfaction remains strong at ${data.customerSatisfaction.excellent}% excellent ratings. ` +
        `The ${data.profitableZones[0].zone} zone is the most profitable with ${data.profitableZones[0].margin}% margin.`,
      recommendations: [
        `Expand CCS charging infrastructure (highest demand at 42%)`,
        `Implement dynamic pricing during 6-9 PM peak hours`,
        `Add 2 new stations in ${data.predictions.recommendedExpansion}`,
        `Optimize weekend operations (18% higher bookings)`,
        `Replicate ${data.topStations[0].name}'s best practices across network`
      ]
    };
  }
};

export default {
  aiChatService,
  smartAdvisorService,
  batteryHealthService,
  routeOptimizerService,
  carbonAnalyzerService,
  analyticsService
};
