# MonitorHub Setup Guide

## 🚀 Quick Start

MonitorHub works out-of-the-box with localStorage persistence. Just run the app and you can:
- ✅ Login with email/password (any credentials work for testing)
- ✅ Add, edit, and delete devices
- ✅ Create, acknowledge, and resolve alerts
- ✅ Export and import data
- ✅ All data persists in your browser's localStorage

## 🔐 Setting Up Real Google Sign-In

To enable **real Google OAuth** (sign in with your actual Google account):

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the **Google+ API**:
   - Click "Enable APIs and Services"
   - Search for "Google+ API"
   - Click "Enable"

### Step 2: Configure OAuth Consent Screen

1. Go to "OAuth consent screen" in the left sidebar
2. Select "External" user type
3. Fill in the required fields:
   - App name: `MonitorHub`
   - User support email: Your email
   - Developer contact: Your email
4. Click "Save and Continue"
5. Skip scopes (click "Save and Continue")
6. Add test users (your Google account email)
7. Click "Save and Continue"

### Step 3: Create OAuth 2.0 Client ID

1. Go to "Credentials" in the left sidebar
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   ```
   http://localhost:5173
   http://localhost:3000
   ```
5. You can leave redirect URIs empty for now
6. Click "Create"
7. **Copy your Client ID** (it looks like: `123456789-abc...xyz.apps.googleusercontent.com`)

### Step 4: Configure MonitorHub

1. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and paste your Client ID:
   ```env
   VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
   ```

3. Restart the development server

### Step 5: Test Google Sign-In

1. Open MonitorHub in your browser
2. Click "Sign in with Google"
3. Google will open a popup/redirect asking you to choose your account
4. Select your Google account
5. You'll be logged in with your real name, email, and profile picture!

## 📊 Features

### Working Features

#### ✅ **Devices Page**
- **Add Device**: Click "Add Device" button to create new devices
- **Edit Device**: Click edit icon on any device to update details
- **Delete Device**: Click trash icon to remove devices
- **Search & Filter**: Search by name/IP, filter by status and location
- **Export**: Download all devices as JSON
- **Expand Rows**: Click chevron to see device details

#### ✅ **Alerts Page**
- **Create Alert**: Click "Create Alert" to add new alerts
- **Acknowledge**: Mark alerts as acknowledged
- **Resolve**: Mark alerts as resolved
- **Delete**: Remove alerts permanently
- **Timeline View**: See all alerts in chronological order
- **By Severity**: View alerts grouped by critical/warning/info

#### ✅ **Settings Page**
- **Appearance**: Toggle dark/light mode, change accent colors
- **Layout**: Adjust density and sidebar preferences
- **Notifications**: Configure notification settings
- **Security**: Manage 2FA and sessions
- **Data Management**:
  - Export all data as JSON
  - Import data from JSON file
  - Reset devices to defaults
  - Reset alerts to defaults
  - Clear activity logs

#### ✅ **Dashboard Page**
- Real-time KPI cards
- System health charts
- Device status overview
- Recent alerts timeline

#### ✅ **Analytics Page**
- Risk trend charts
- Performance heatmaps
- Detailed insights
- Historical data visualization

## 🗄️ Data Persistence

### localStorage (Default)
All data is automatically saved to your browser's localStorage:
- User session
- Devices
- Alerts
- Settings
- Activity logs

**Note**: Data is stored per browser. Clearing browser data will reset the app.

### Export/Import
- **Export**: Settings → Data Management → Export Data
- **Import**: Settings → Data Management → Import Data

## 🎨 Theme Customization

1. Go to Settings → Appearance
2. Click light/dark theme cards to switch
3. Select accent color (purple, blue, green, orange, pink, red)
4. All changes are saved automatically

## 🔄 Resetting Data

If you want to start fresh:

1. **Settings → Data Management**:
   - Reset Devices: Restores default devices
   - Reset Alerts: Restores default alerts
   - Clear Activity Logs: Removes all logs

2. **Complete Reset** (via browser):
   - Open DevTools (F12)
   - Go to Application → Storage
   - Click "Clear site data"

## 🆘 Troubleshooting

### Google Sign-In Not Working
- Check that you've created `.env` file with correct Client ID
- Verify authorized JavaScript origins include `http://localhost:5173`
- Make sure you've enabled Google+ API
- Try clearing browser cache

### Data Not Persisting
- Check browser's localStorage isn't disabled
- Make sure you're not in incognito/private mode
- Some browsers block localStorage - try another browser

### Buttons Not Working
- All buttons now work! If you find one that doesn't:
  - Check browser console (F12) for errors
  - Try refreshing the page
  - Clear localStorage and restart

## 💡 Tips

1. **Test Accounts**: For testing, you can use any email/password on the login form
2. **Real Google**: Use the "Sign in with Google" button for real OAuth
3. **Export Regularly**: Export your data to backup important configurations
4. **Activity Logs**: Check Settings → (future feature) for audit trail

## 📝 Default Credentials

### Email/Password Login
- Any email and password combination works for testing
- Example: `admin@monitorhub.com` / `password123`

### Default Data
- 5 sample devices across multiple locations
- 5 sample alerts with different severities
- Mix of online, offline, and warning states

## 🔮 Future Enhancements

To make this a production app, consider:
- **Supabase Integration**: Real database backend
- **Real-time Sync**: WebSocket connections
- **Team Collaboration**: Multi-user support
- **API Integration**: Connect to real monitoring systems
- **Advanced Analytics**: ML-powered insights

---

**Need Help?** Check the browser console (F12) for detailed error messages.
