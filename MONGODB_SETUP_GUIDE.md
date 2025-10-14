# MongoDB Setup Guide for EVconnects

## Current Status: ✅ Running with Mock Data (No MongoDB Required)

The EVconnects application is configured to run **without MongoDB** for development purposes. All data is served from mock JSON files.

---

## 🎯 Three Options for Database Setup

### Option 1: Continue with Mock Data (Current Setup) ✅ RECOMMENDED

**Status**: ✅ Already configured  
**Best For**: Development, testing, demo purposes

**What's Working**:
- ✅ All API endpoints return mock data
- ✅ No database installation needed
- ✅ Fast development iteration
- ✅ All AI features work perfectly

**Configuration**:
```env
# .env file
MONGO_URI=
```

**No action needed** - Your app is already set up this way!

---

### Option 2: Install MongoDB Locally

**Best For**: Learning MongoDB, local development with real database

#### Step 1: Install MongoDB Community Server

**Windows**:
1. Download from: https://www.mongodb.com/try/download/community
2. Choose version: 8.0.x (Windows x64)
3. Run installer, select "Complete" installation
4. ✅ Check "Install MongoDB as a Service"
5. ✅ Check "Install MongoDB Compass" (GUI tool)
6. Complete installation

**Verify Installation**:
```powershell
# Check MongoDB version
mongod --version

# Start MongoDB service (if not auto-started)
net start MongoDB
```

#### Step 2: Update Configuration

**.env file**:
```env
MONGO_URI=mongodb://localhost:27017/evconnects
```

**Restart server**:
```bash
npm run server
```

---

### Option 3: Use MongoDB Atlas (Cloud Database)

**Best For**: Production, team collaboration, no local install

#### Step 1: Create Free Atlas Account

1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free tier includes 512MB storage)
3. Create a new cluster (choose FREE tier)
4. Wait 3-5 minutes for cluster creation

#### Step 2: Configure Database Access

1. **Database Access** → Add New Database User
   - Username: `evconnects_user`
   - Password: Generate secure password (save it!)
   - User Privileges: Read and write to any database

2. **Network Access** → Add IP Address
   - Click "Add Current IP Address" OR
   - Add `0.0.0.0/0` (allow from anywhere - dev only!)

#### Step 3: Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like):
   ```
   mongodb+srv://evconnects_user:<password>@cluster0.xxxxx.mongodb.net/evconnects?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password

#### Step 4: Update Configuration

**.env file**:
```env
MONGO_URI=mongodb+srv://evconnects_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/evconnects?retryWrites=true&w=majority
```

**Restart server**:
```bash
npm run server
```

---

## 🔧 Troubleshooting

### Error: "MongooseServerSelectionError: connect ECONNREFUSED"

**Cause**: MongoDB is not running or connection string is incorrect

**Solutions**:

1. **Using Mock Data** (Recommended):
   ```env
   # Set MONGO_URI to empty in .env
   MONGO_URI=
   ```

2. **Local MongoDB Not Running**:
   ```powershell
   # Start MongoDB service
   net start MongoDB
   
   # Check if running
   tasklist | findstr mongod
   ```

3. **Wrong Connection String**:
   - Local: `mongodb://localhost:27017/evconnects`
   - Atlas: Get from cluster dashboard

### Error: "Cannot find module 'mongoose'"

**Solution**:
```bash
npm install mongoose
```

### MongoDB Compass Can't Connect

**Solution**:
1. Check MongoDB service is running
2. Use connection string: `mongodb://localhost:27017`
3. No authentication needed for local development

---

## 📊 Mock Data vs Real Database Comparison

| Feature | Mock Data (Current) | Real Database |
|---------|-------------------|---------------|
| Setup Time | ✅ 0 minutes | ⏱️ 15-30 minutes |
| Internet Required | ❌ No | ✅ Yes (Atlas) / No (Local) |
| Data Persistence | ❌ Resets on restart | ✅ Persists |
| Multi-user Support | ❌ No | ✅ Yes |
| Best For | Development, Demo | Production, Teams |

---

## 🚀 Current Application Status

### What's Working Now (With Mock Data):

✅ **Backend API** (`http://localhost:5000`)
- `/api/stations` - Returns 6 mock stations
- `/api/bookings` - Returns 47 mock bookings
- `/api/battery` - Returns battery health data
- `/api/carbon` - Returns carbon footprint data
- `/api/analytics` - Returns business analytics

✅ **Frontend** (`http://localhost:3000`)
- All pages load correctly
- AI features work perfectly
- Charts display mock data
- Chatbot responds to queries

✅ **AI Features**
- 🤖 AI Chatbot
- ⚡ Smart Charging Advisor
- 🔋 Battery Health Insights
- 🗺️ Route Optimizer
- 🌍 Carbon Footprint Analyzer
- 📊 Analytics Dashboard

---

## 🎯 Recommended Workflow

### For Development (Current Setup) ✅
```bash
# No MongoDB needed!
npm run dev:full
# Access app at http://localhost:3000
```

### For Production (Future)
1. Set up MongoDB Atlas (free tier)
2. Update MONGO_URI in .env
3. Migrate mock data to real database
4. Deploy to hosting platform

---

## 📝 Migration Path: Mock Data → Real Database

When you're ready to use a real database:

### Step 1: Set up MongoDB (Option 2 or 3 above)

### Step 2: Create Seed Script

**Create**: `server/seeds/seedData.js`
```javascript
const mongoose = require('mongoose');
const Station = require('../models/Station');
const mockStations = require('../../src/data/mockStations.json');

async function seedDatabase() {
  await mongoose.connect(process.env.MONGO_URI);
  await Station.deleteMany({});
  await Station.insertMany(mockStations.stations);
  console.log('✅ Database seeded!');
  process.exit(0);
}

seedDatabase();
```

### Step 3: Run Seed Script
```bash
node server/seeds/seedData.js
```

### Step 4: Update API Routes

**Modify**: `server/routes/api.js`
```javascript
// Replace mock data with database queries
router.get('/stations', async (req, res) => {
  const stations = await Station.find();
  res.json(stations);
});
```

---

## 💡 Pro Tips

1. **Development**: Use mock data (current setup)
2. **Testing**: Use local MongoDB
3. **Production**: Use MongoDB Atlas
4. **Backup**: Export mock data regularly
5. **Security**: Never commit real database passwords

---

## 🔗 Useful Resources

- **MongoDB Docs**: https://docs.mongodb.com
- **MongoDB Atlas**: https://www.mongodb.com/atlas
- **Mongoose Docs**: https://mongoosejs.com
- **MongoDB Compass**: https://www.mongodb.com/products/compass

---

## ✅ Current Configuration Summary

**Database Mode**: Mock Data (No MongoDB)  
**Status**: ✅ Working Perfectly  
**Server**: Running on port 5000  
**Frontend**: Running on port 3000  
**Data Source**: JSON files in `src/data/`

**No action required - your app is ready to use!** 🎉

---

## 🆘 Need Help?

If you see any errors:
1. Check this guide first
2. Verify .env file has `MONGO_URI=` (empty)
3. Restart server: `npm run server`
4. Check console for error messages

**Your EVconnects app is running perfectly with mock data!** ⚡🚗💚
