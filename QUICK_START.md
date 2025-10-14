# EVconnects - Quick Start Guide 🚀

## Start the Application

```bash
# Start both frontend and backend
npm run dev:full

# Or start separately:
npm run server    # Backend: http://localhost:5000
npm start         # Frontend: http://localhost:3000
```

## Access AI Features

### 1. Login
- Navigate to http://localhost:3000
- Click "Login" button
- Enter any credentials (mock authentication)
- Complete vehicle selection if prompted

### 2. AI Features Menu
Click **"🤖 AI Features"** in the navigation bar to access:

#### ⚡ Smart Charging Advisor (`/smart-advisor`)
- View 24-hour demand patterns
- Get optimal charging time recommendations
- See top 5 recommended stations
- AI-powered predictions with confidence scores

#### 🔋 Battery Health Insights (`/battery-health`)
- Check overall battery health (92%)
- View 10-month health trend
- Calculate trip battery requirements
- Get AI maintenance recommendations
- See 1-3 year health predictions

#### 🗺️ Route Optimizer (`/route-optimizer`)
- Enter start and end locations
- Set current battery level
- Get optimized route with charging stops
- View stop details (time, cost, battery level)
- See alternative route options

#### 🌍 Carbon Footprint (`/carbon-footprint`)
- Track CO₂ savings (996kg)
- See tree planting equivalents (41 trees)
- Unlock achievement badges
- View sustainability trends
- Compare EV vs gasoline emissions
- Check community leaderboard

#### 📊 Analytics Dashboard (`/admin/analytics`)
- View AI executive summary
- Monitor revenue (₹425,000)
- Track active users (1,247)
- Analyze top performing stations
- See peak demand hours
- Get AI predictions and action items

### 3. AI Chatbot (Always Available)
Click the floating **🤖 button** (bottom-right corner) on any page:
- Type queries naturally
- Use quick action buttons
- Get instant AI responses
- Ask about stations, battery, routes, bookings

## Theme Toggle 🌓

Click the **☀️ Sun** or **🌙 Moon** icon in the navbar to switch between light and dark modes.

## Mobile Navigation 📱

Tap the **☰ Menu** icon to access:
- Home, About, Services
- AI Features section (all 5 modules)
- User profile and logout

## Quick Tips 💡

✅ **All features work with mock data** - No real backend required
✅ **Dark mode available** - Toggle in navbar
✅ **Responsive design** - Works on all devices
✅ **Protected routes** - Login required for AI features
✅ **Chatbot always accessible** - Floating button on every page

## Navigation URLs

Direct links to AI features:
- http://localhost:3000/smart-advisor
- http://localhost:3000/battery-health
- http://localhost:3000/route-optimizer
- http://localhost:3000/carbon-footprint
- http://localhost:3000/admin/analytics

## Common Actions

### Find Charging Stations
1. Go to Home page
2. Enter location in search
3. Click "Find Stations"
4. View results on map and list

### Check Battery Health
1. Navigate to Battery Health Insights
2. View current health score
3. Scroll to trip calculator
4. Enter trip distance
5. Click "Calculate"

### Plan a Route
1. Open Route Optimizer
2. Enter start location (e.g., "Mumbai")
3. Enter end location (e.g., "Pune")
4. Adjust battery slider
5. Click "Optimize Route with AI"
6. View charging stops on timeline

### Track Carbon Savings
1. Go to Carbon Footprint Analyzer
2. Select time period (week/month/year)
3. View CO₂ savings and achievements
4. Check leaderboard ranking

### Ask the Chatbot
1. Click floating 🤖 button
2. Type question or use quick actions:
   - "Find stations near me"
   - "What's the best time to charge?"
   - "Show my bookings"
   - "Help"

## Keyboard Shortcuts

- `Esc` - Close chatbot
- `Enter` - Send chatbot message
- Scroll anywhere - Smooth scrolling enabled

## Demo Data Overview

- **6 Charging Stations**: Downtown, Airport, Mall, Highway, Tech Park, Residential
- **47 Bookings**: Oct 2023 - Jun 2024, 996kg CO₂ saved
- **Battery Health**: 92%, 145 cycles, 68 kWh capacity
- **Revenue**: ₹425,000 total, 1,247 active users
- **Achievements**: 6 badges (3 unlocked: Eco Warrior, Early Adopter, Green Champion)

## Troubleshooting

**App won't start?**
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (v14+ required)

**Charts not displaying?**
- Ensure recharts is installed: `npm install recharts`
- Clear browser cache

**Dark mode not working?**
- Check LocalStorage is enabled in browser
- Toggle theme manually in Navbar

**Routes not working?**
- Ensure you're logged in
- Check browser console for errors

## Documentation Files 📚

- **AI_FEATURES_README.md** - Complete feature documentation
- **PROJECT_SUMMARY.md** - Full implementation summary
- **AI_IMPLEMENTATION_GUIDE.md** - Technical implementation details
- **DARK_MODE_README.md** - Theme configuration guide

## Support 💬

For questions:
1. Check the documentation files
2. Review component code comments
3. Inspect mock data in `src/data/` folder
4. Use browser dev tools (F12) for debugging

---

**🎉 Enjoy using EVconnects! Happy charging! ⚡🚗**

*All AI features are fully functional with comprehensive mock data*
