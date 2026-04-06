# Team Manager - Setup Guide

This guide will walk you through setting up and running the Team Manager application step by step.

## 📋 Prerequisites

Before you begin, make sure you have the following installed on your computer:

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - To check if installed, open terminal and run: `node --version`

2. **npm** (comes with Node.js)
   - To check if installed, run: `npm --version`

3. **Git** (for cloning the repository)
   - Download from: https://git-scm.com/
   - To check if installed, run: `git --version`

4. **A code editor** (recommended: VS Code)
   - Download from: https://code.visualstudio.com/

## 🚀 Step-by-Step Setup

### Step 1: Get the Code

If you have the code as a ZIP file:
```bash
# Extract the ZIP file to a folder
# Open terminal/command prompt in that folder
cd team-manager-app
```

If you're cloning from a repository:
```bash
git clone <repository-url>
cd team-manager-app
```

### Step 2: Install Dependencies

Open your terminal in the project folder and run:

```bash
npm install
```

This will:
- Download all required packages
- Set up the project dependencies
- Take 2-5 minutes depending on your internet speed

### Step 3: Start the Development Server

After installation completes, run:

```bash
npm run dev
```

You should see output like:
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 4: Open the Application

1. Open your web browser
2. Navigate to: `http://localhost:5173`
3. You should see the login page!

### Step 5: Login

Use these default credentials:
- **Email**: manager@example.com
- **Password**: password123

## 🎮 Using the Application

### First Time Setup

1. **Update Team Settings**:
   - Click on "Team Settings" in the sidebar
   - Change your team name
   - Choose your preferred formation
   - Set team colors
   - Click "Save Changes"

2. **Add Players**:
   - Go to "Players" page
   - Click "Add Player"
   - Fill in player details (name, age, nationality, etc.)
   - Select player positions
   - Click "Add Player"

3. **Schedule Matches**:
   - Go to "Calendar" page
   - Click "Schedule Match"
   - Enter opponent, date, location, and match type
   - Click "Schedule Match"

4. **Record Match Results**:
   - Go to "Calendar" page
   - Find a scheduled match
   - Click "Record Result"
   - Enter the score
   - Select players who played
   - Add individual player statistics
   - Click "Save Result"

5. **View Dashboard**:
   - Go to "Dashboard" to see:
     - Top performers
     - Upcoming fixtures
     - Season statistics
     - Discipline records

## 🛠️ Building for Production

To create a production build:

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

To preview the production build locally:

```bash
npm run preview
```

## 🐛 Troubleshooting

### Port Already in Use

If you see "Port 5173 is already in use":
```bash
# Kill the process on that port, then restart
npm run dev -- --port 3000
```

### Module Not Found Errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Make sure TypeScript is installed
npm install --save-dev typescript
```

### Build Fails

```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## 📁 Project Structure Quick Reference

```
team-manager-app/
├── src/
│   ├── pages/              # Main page components
│   ├── components/         # Reusable components
│   ├── lib/               # Utilities and storage
│   ├── types/             # TypeScript definitions
│   └── constants/         # App constants
├── public/                # Static files
└── index.html            # Entry HTML
```

## 💾 Data Storage

- All data is stored in browser localStorage
- Data persists between sessions
- Clearing browser data will delete all information
- No backend server required

## 🔧 Development Tips

1. **Hot Reload**: The app automatically reloads when you save files
2. **Console**: Press F12 to open browser developer tools
3. **React DevTools**: Install browser extension for better debugging
4. **Check Errors**: Look at terminal and browser console for errors

## 📱 Browser Compatibility

Works best on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Minimum requirements:
- Modern browser with ES6 support
- JavaScript enabled
- LocalStorage enabled

## 🔒 Security Notes

This is a demo application for local use:
- Passwords are NOT encrypted
- Data is stored in plain text in browser
- Not suitable for production without proper backend
- Use only for personal/learning purposes

## 🆘 Getting Help

If you encounter issues:

1. Check the error messages in:
   - Terminal where `npm run dev` is running
   - Browser console (F12)

2. Common issues and solutions:
   - **Can't login**: Use email: manager@example.com, password: password123
   - **Blank page**: Check browser console for errors
   - **Styles missing**: Ensure Tailwind CSS is properly configured

## ✅ Verification Checklist

Before considering setup complete, verify:
- [ ] Node.js and npm are installed
- [ ] Dependencies installed successfully
- [ ] Dev server starts without errors
- [ ] Can access http://localhost:5173
- [ ] Can login with default credentials
- [ ] Can navigate between pages
- [ ] Can add a test player
- [ ] Can schedule a test match

## 🎓 Next Steps

Once set up, explore:
1. Add your real team players
2. Set up your match schedule
3. Record match results
4. Customize team settings
5. Review dashboard analytics

## 📚 Additional Resources

- React Documentation: https://react.dev/
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- Tailwind CSS: https://tailwindcss.com/docs
- Vite Guide: https://vitejs.dev/guide/

---

**Happy Team Managing! ⚽**
