# Soccer Team Manager Web App

*A comprehensive web application for managing soccer teams, players, and match performance.*

## Purpose

The Soccer Team Manager Web App is designed to streamline soccer team management for coaches, managers, and players. This application addresses the challenges of manual team administration by providing a centralized digital platform for tracking player performance, scheduling matches, and generating insightful reports.

### Problems Solved
- **Manual Record Keeping**: Eliminates the need for spreadsheets and paper records for player statistics and match results
- **Performance Tracking**: Provides automated calculation of player ratings based on goals, assists, and match consistency
- **Team Organization**: Centralizes player information, match schedules, and team settings in one accessible location
- **Data Analysis**: Offers visual dashboards and reports for better decision-making

### Target Users
- **Coaches**: Track player performance, schedule matches, and make data-driven decisions
- **Team Managers**: Manage player rosters, team settings, and generate performance reports
- **Players**: View personal statistics, match history, and performance ratings

## Features

### Core Features
- **User Authentication**: Secure login system for team managers and coaches
- **Player Management**: Add, edit, and remove players with detailed profiles including position, nationality, and physical attributes
- **Match Scheduling**: Create and manage match calendars with opponent details and venue information
- **Performance Tracking**: Automated player rating calculations based on goals, assists, minutes played, and disciplinary records
- **Match Results**: Record match outcomes and individual player statistics
- **Dashboard Analytics**: Visual overview of team performance, top performers, and key statistics
- **Player Profiles**: Detailed individual player pages with match history and career statistics
- **Team Settings**: Customize team information, colors, and themes

### Advanced Features
- **Real-time Ratings**: Dynamic player rating calculations that update after each match
- **Position-based Sorting**: Players organized by position categories (Goalkeeper, Defender, Midfielder, Forward)
- **Performance Reports**: Comprehensive reports on top scorers, assisters, and most active players
- **Dark/Light Theme**: Customizable interface themes for better user experience
- **Responsive Design**: Mobile-friendly interface that works on all devices

### Future Enhancements
- **Multi-team Support**: Manage multiple teams within one account
- **Advanced Analytics**: Detailed performance analytics with charts and trends
- **Injury Tracking**: Monitor player injuries and recovery progress
- **Training Session Management**: Schedule and track training sessions
- **Integration APIs**: Connect with external soccer data providers

## How to Use the App

### Getting Started
1. **Access the Application**: Open the web app in your browser
2. **Initial Setup**: The app automatically loads sample data for demonstration purposes
3. **Navigation**: Use the sidebar to navigate between different sections

### Step-by-Step Guide

#### 1. Managing Players
1. Navigate to the **Players** tab from the sidebar
2. View all players organized by position (Forwards, Midfielders, Defenders, Goalkeepers)
3. Click **Add Player** to create a new player profile
4. Fill in player details: name, position, age, nationality, height, weight
5. Edit existing players by clicking the edit icon next to their profile

#### 2. Scheduling Matches
1. Go to the **Calendar** page to view upcoming matches
2. Click **Add Match** to schedule a new game
3. Enter match details: opponent, date, venue, and formation
4. Matches are automatically categorized as home, away, or neutral

#### 3. Recording Match Results
1. Navigate to the **Calendar** and select a completed match
2. Click **Edit Result** to input the final score
3. Add individual player statistics for each participant
4. The system automatically updates player ratings and team statistics

#### 4. Viewing Performance Analytics
1. Visit the **Dashboard** for an overview of team performance
2. Check **Top Performers** section for highest-rated players
3. View **Match History** and individual player profiles
4. Access specialized reports: Top Scorers, Top Assisters, Most Minutes Played

#### 5. Customizing Team Settings
1. Go to **Team Settings** in the sidebar
2. Update team name, colors, and theme preferences
3. Choose between light and dark themes for the interface

### Interface Overview
```
Dashboard - Overview of team stats and recent matches
Players - Manage player roster and view profiles
Calendar - Schedule and track matches
Reports - Access performance analytics and reports
Settings - Customize team preferences
```

## Technical Details

### Frontend Technologies
- **React 18**: Modern JavaScript library for building user interfaces
- **TypeScript**: Strongly typed programming language for better code quality
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: High-quality React components built on Radix UI
- **Lucide React**: Beautiful icon library

### Backend & Data
- **Local Storage**: Browser-based data persistence (no external database required)
- **JSON Data Structure**: Structured data format for players, matches, and team information

### Architecture
```
Frontend (React/TypeScript)
├── Components (UI elements, dialogs, forms)
├── Pages (Dashboard, Players, Calendar, etc.)
├── Lib (Utilities, storage, data management)
└── Types (TypeScript interfaces)

Data Layer (Local Storage)
├── Players (profiles, statistics, ratings)
├── Matches (schedules, results, player stats)
└── Team Settings (preferences, themes)
```

### Installation & Setup

#### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

#### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd soccer-team-manager

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

#### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI elements (buttons, cards, etc.)
│   ├── layout/         # Layout components
│   └── features/       # Feature-specific components
├── pages/              # Main application pages
├── lib/                # Utilities and data management
│   ├── storage.ts      # Local storage operations
│   ├── utils.ts        # Helper functions
│   └── seedData.ts     # Sample data generation
├── types/              # TypeScript type definitions
└── constants/          # Application constants
```

## Usage Examples

### Adding a New Player
```typescript
// Example of creating a player programmatically
const newPlayer = {
  firstName: "John",
  lastName: "Doe",
  age: 25,
  nationality: "United States",
  positions: ["Forward"],
  height: 180,
  weight: 75,
  jerseyNumber: "9"
};
```

### Scheduling a Match
1. Navigate to Calendar page
2. Click "Add Match" button
3. Fill form:
   - Opponent: "Rival FC"
   - Date: "2024-12-15"
   - Venue: "Home Stadium"
   - Formation: "4-3-3"

### Viewing Player Performance
```javascript
// Access player statistics
const playerStats = {
  goals: 12,
  assists: 8,
  matchesPlayed: 25,
  rating: 8.5,
  minutesPlayed: 2100
};
```

## Screenshots / Demo

### Dashboard Overview
![Dashboard Screenshot](screenshots/dashboard.png)
*Main dashboard showing team statistics and recent performance*

### Player Management
![Players Page](screenshots/players.png)
*Player roster organized by position with detailed profiles*

### Match Calendar
![Calendar View](screenshots/calendar.png)
*Match scheduling and results tracking interface*

### Performance Analytics
![Analytics Dashboard](screenshots/analytics.png)
*Detailed performance reports and player ratings*

## Author

**Stanley L.**  
*Computer Science Student*  
*School Project - Web Application Development*

---

*This project demonstrates modern web development practices using React, TypeScript, and responsive design principles. Built as part of a computer science curriculum to showcase full-stack web application development skills.*
