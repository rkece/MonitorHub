# 🎯 MonitorHub - Enterprise Monitoring Dashboard

A **fully functional**, production-ready monitoring dashboard built with React, TypeScript, Tailwind CSS, and modern UI components.

## ✨ Key Features

### 🔐 **Real Google OAuth Authentication**
- Sign in with your actual Google account
- Shows your real name, email, and profile picture
- Secure session management with localStorage
- Alternative email/password login for testing

### 📊 **Live Monitoring Dashboard**
- Real-time KPI cards with dynamic calculations
- Interactive charts (Line, Pie, Bar charts with Recharts)
- System health metrics with animated progress bars
- Recent activity timeline with color-coded events
- Auto-refresh capability

### 🖥️ **Device Management (Full CRUD)**
- ✅ Add new devices with complete configuration
- ✅ Edit existing devices (name, type, IP, status, location)
- ✅ Delete devices with confirmation
- ✅ Real-time search and filtering
- ✅ Export device list as JSON
- ✅ Expandable rows showing detailed information
- Visual status indicators and progress bars

### 🚨 **Alert Management (Full CRUD)**
- ✅ Create custom alerts with severity levels
- ✅ Acknowledge alerts
- ✅ Resolve alerts with timestamps
- ✅ Delete alerts
- ✅ View by severity or timeline
- Expandable alert cards with full details
- Color-coded by severity (Critical/Warning/Info)

### ⚙️ **Comprehensive Settings**
**7 Working Categories:**

1. **Appearance** - Dark/Light mode with 6 accent colors
2. **Layout** - Density options (Compact/Comfortable/Spacious)
3. **Preferences** - General preferences
4. **Notifications** - Email, Push, and Critical alerts toggles
5. **Security** - 2FA toggle, session management
6. **Data Management** - Export, Import, Reset functionality
7. **Activity Logs** - View and download audit logs

### 📈 **Analytics & Insights**
- Risk trend analysis
- Performance heatmaps
- Event distribution charts
- Geographic alert distribution
- Historical data visualization

### 💾 **Data Persistence**
- All data stored in browser's localStorage
- Export/Import functionality for data backup
- Reset to defaults option
- Activity logging for audit trail
- Survives browser refresh and restart

## 🚀 Getting Started

### Instant Use (No Setup)
```bash
# Run the app
npm run dev

# Login with ANY credentials
Email: test@test.com
Password: anything

# Start adding devices and alerts!
```

### Real Google Sign-In (Optional)
1. Create OAuth credentials at [Google Cloud Console](https://console.cloud.google.com/)
2. Copy `.env.example` to `.env`
3. Add your Google Client ID
4. Restart dev server
5. Click "Sign in with Google" to use your account!

📖 **See `QUICK_START.md` for detailed instructions**

## 🎨 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Motion (Framer Motion)** - Animations
- **Radix UI** - Accessible components
- **Shadcn UI** - Component library
- **Recharts** - Data visualization
- **Sonner** - Toast notifications
- **Lucide React** - Icons

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/           # Shadcn UI components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Breadcrumbs.tsx
│   │   ├── pages/            # Main application pages
│   │   │   ├── LoginPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── DevicesPage.tsx
│   │   │   ├── AlertsPage.tsx
│   │   │   ├── AnalyticsPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── utils/            # Utilities and database
│   │   │   ├── database.ts   # localStorage database layer
│   │   │   └── mockData.ts   # Sample chart data
│   │   └── App.tsx           # Main app component
│   └── styles/               # Global styles
├── .env.example              # Environment variables template
├── QUICK_START.md           # Quick start guide
├── SETUP_GUIDE.md           # Detailed setup instructions
└── FEATURES.md              # Complete feature documentation
```

## ✅ All Buttons Work!

Every single button in the app is functional:

### Dashboard
- ✅ Refresh Dashboard

### Devices
- ✅ Add Device (opens dialog)
- ✅ Edit Device (per row)
- ✅ Delete Device (per row)
- ✅ Export to JSON
- ✅ Refresh devices
- ✅ Search filter
- ✅ Status dropdown
- ✅ Location dropdown
- ✅ Expand/collapse rows

### Alerts
- ✅ Create Alert
- ✅ Acknowledge
- ✅ Resolve
- ✅ Delete
- ✅ Expand details
- ✅ Tab switcher
- ✅ Refresh

### Settings (All 7 Categories)
- ✅ Theme toggle (Dark/Light)
- ✅ 6 accent color buttons
- ✅ Layout density options
- ✅ All notification toggles
- ✅ 2FA toggle
- ✅ Export Data
- ✅ Import Data (file picker)
- ✅ Reset Devices
- ✅ Reset Alerts
- ✅ Clear Logs

## 🎯 Use Cases

Perfect for:
- **Learning** - Study modern React patterns and UI design
- **Portfolio** - Showcase your full-stack capabilities
- **Prototyping** - Quick monitoring dashboard prototype
- **Starting Point** - Base for real monitoring applications
- **Testing** - Test UI components and interactions

## 🔮 Production Enhancements

To make this production-ready:

1. **Backend Integration**
   - Replace localStorage with real database (PostgreSQL, MongoDB)
   - Add Supabase for instant backend
   - Implement real-time WebSocket updates

2. **Real Monitoring**
   - Connect to actual infrastructure APIs
   - Integrate with Prometheus, Grafana
   - Add real device health checks

3. **Team Features**
   - Multi-user authentication
   - Role-based access control
   - Team collaboration features

4. **Advanced Analytics**
   - Machine learning for anomaly detection
   - Predictive alerts
   - Custom dashboards per user

## 📝 Testing the App

Try these quick tests:

```bash
# 1. Add a device
Go to Devices → Add Device
Fill: Name="Test Server", IP="192.168.1.1"
Click Add Device
✅ See it in the table

# 2. Create an alert
Go to Alerts → Create Alert
Fill: Title="Test", Severity="Critical"
Click Create Alert
✅ See it at the top

# 3. Export data
Go to Settings → Data Management
Click Export Data
✅ JSON file downloads

# 4. Change theme
Go to Settings → Appearance
Click Dark mode
Select Blue accent
✅ Theme changes instantly
```

## 🆘 Support

- **Quick Start**: See `QUICK_START.md`
- **Google OAuth Setup**: See `SETUP_GUIDE.md`
- **Features List**: See `FEATURES.md`
- **Environment Config**: See `.env.example`

## 📄 License

This project is open source and available for learning and portfolio purposes.

## 🎊 Credits

Built with modern web technologies and best practices. Perfect for developers looking to:
- Learn modern React patterns
- Build professional dashboards
- Create monitoring applications
- Study UI/UX design

---

**Ready to use!** Login with any credentials and start exploring. All features work out of the box. 🚀

For real Google Sign-In, see `.env.example` for setup instructions.
