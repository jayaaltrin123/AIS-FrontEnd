# AIS OilGuard Dashboard

A modern, professional web dashboard for AIS-Based Oil Spill Detection & Monitoring System. Built with React, TypeScript, and a maritime-inspired design.

## 🌊 Features

### Core Functionality
- **Real-time Ship Tracking**: Interactive map showing vessel positions, trajectories, and status
- **Alert Management**: Live alerts feed with collision risks, illegal discharge, loitering, and grounding detection
- **Statistics Dashboard**: KPI cards showing total ships, active alerts, oil spill risks, and incidents
- **Reports & Analytics**: Comprehensive charts and data visualization for risk patterns

### User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Maritime Theme**: Deep blues, ocean gradients, and alert colors (red/orange for risks)
- **Modern UI Components**: Glass morphism effects, smooth animations, and intuitive navigation
- **Interactive Map**: World map with zoom, ship icons, and risk zone markers

### Advanced Features
- **Dark/Light Mode**: Theme toggle with system preference detection
- **Voice Alerts**: Text-to-speech notifications for critical events
- **Real-time Updates**: Simulated live data updates every 5 seconds
- **Export Functionality**: Download reports in PDF/CSV format (UI ready)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ais-oilguard-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Top navigation bar
│   ├── Sidebar.tsx     # Collapsible sidebar menu
│   ├── StatisticsCards.tsx # KPI statistics display
│   ├── AlertsPanel.tsx # Real-time alerts feed
│   ├── InteractiveMap.tsx # Map with ship tracking
│   ├── ReportsSection.tsx # Analytics and charts
│   └── ThemeToggle.tsx # Dark/light mode switcher
├── pages/              # Main application pages
│   └── Dashboard.tsx   # Main dashboard page
├── hooks/              # Custom React hooks
│   └── useVoiceAlerts.ts # Voice notification system
├── types/              # TypeScript type definitions
│   └── index.ts        # Interface definitions
├── styles/             # Global styles and themes
│   └── globals.css     # CSS variables and utilities
└── utils/              # Utility functions
```

## 🎨 Design System

### Color Palette
- **Navy Dark**: `#0a1a2f` - Primary background
- **Navy Medium**: `#1a2a3f` - Secondary background
- **Aqua Blue**: `#3baed9` - Primary accent
- **Danger Red**: `#e63946` - Critical alerts
- **Warning Orange**: `#f77f00` - High priority alerts
- **Success Green**: `#06d6a0` - Resolved/safe status

### Typography
- **Font Family**: Inter, system fonts
- **Weights**: 400 (regular), 600 (semibold), 700 (bold)

### Components
- **Cards**: Glass morphism with subtle borders and shadows
- **Buttons**: Rounded corners with hover animations
- **Icons**: Lucide React icon library
- **Animations**: Framer Motion for smooth transitions

## 📊 Data Visualization

### Charts & Graphs
- **Area Charts**: Daily risk trends over time
- **Pie Charts**: Alert type distribution
- **Bar Charts**: Risk zones and vessel rankings
- **Interactive Maps**: Real-time ship positions with popups

### Real-time Features
- **Live Updates**: Ship positions update every 5 seconds
- **Alert Notifications**: New alerts appear with animations
- **Voice Alerts**: Critical alerts trigger text-to-speech
- **Status Indicators**: Color-coded ship and alert statuses

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=your_api_endpoint
REACT_APP_MAP_API_KEY=your_map_api_key
REACT_APP_VOICE_ALERTS_ENABLED=true
```

### Customization
- **Colors**: Modify CSS variables in `src/styles/globals.css`
- **Data Sources**: Update mock data generators in `src/pages/Dashboard.tsx`
- **Map Tiles**: Change tile layer in `src/components/InteractiveMap.tsx`

## 🚢 Maritime Features

### Ship Tracking
- **MMSI Identification**: Unique vessel identifiers
- **Position Data**: Latitude, longitude, speed, course
- **Status Monitoring**: Normal, warning, danger states
- **Trajectory History**: Ship movement patterns

### Alert Types
- **Collision Risk**: Vessels on collision course
- **Illegal Discharge**: Suspected oil dumping
- **Loitering**: Vessels in restricted areas
- **Grounding**: Risk of vessel grounding
- **Anomaly Detection**: Unusual behavior patterns

### Risk Assessment
- **Severity Levels**: Low, medium, high, critical
- **Geographic Zones**: Risk heatmaps by region
- **Time-based Analysis**: Historical risk patterns
- **Vessel Rankings**: Top risk vessels by alert count

## 🔒 Security & Performance

### Security Features
- **Type Safety**: Full TypeScript implementation
- **Input Validation**: Sanitized user inputs
- **Secure Headers**: CSP and security headers ready

### Performance Optimizations
- **Code Splitting**: Lazy loading of components
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: Efficient large data rendering
- **Image Optimization**: Optimized map tiles and icons

## 🌐 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 📱 Mobile Responsiveness

- **Breakpoints**: Mobile (320px), Tablet (768px), Desktop (1024px+)
- **Touch Support**: Swipe gestures and touch interactions
- **Adaptive Layout**: Responsive grid system
- **Mobile Navigation**: Collapsible sidebar and touch-friendly controls

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect your GitHub repository
- **AWS S3**: Upload build files to S3 bucket
- **Docker**: Use the included Dockerfile

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Leaflet**: Interactive map functionality
- **Recharts**: Data visualization components
- **Framer Motion**: Animation library
- **Lucide React**: Icon library
- **OpenStreetMap**: Map tile provider

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation wiki

---

**AIS OilGuard Dashboard** - Protecting our oceans through advanced maritime monitoring technology. 🌊⚓