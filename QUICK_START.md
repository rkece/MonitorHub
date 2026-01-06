# 🚀 MonitorHub - QUICK START GUIDE

## ⚡ INSTANT USE (No Setup Required)

The app works **immediately** with these features:

1. **Login**: Use ANY email/password (e.g., `test@test.com` / `password`)
2. **Add Devices**: Click "Add Device" button in Devices page
3. **Create Alerts**: Click "Create Alert" button in Alerts page
4. **Export Data**: Settings → Data Management → Export Data
5. **Change Theme**: Settings → Appearance → Toggle Dark/Light

✅ All data saves to your browser automatically!

---

## 🔐 REAL GOOGLE SIGN-IN (Optional - 5 Minutes)

Want to sign in with YOUR Google account?

### Quick Setup:

1. Open: https://console.cloud.google.com/
2. Create project or select existing
3. Enable "Google+ API"
4. Create "OAuth 2.0 Client ID" (Web application)
5. Add origin: `http://localhost:5173`
6. Copy your Client ID (looks like: `123456-abc...xyz.apps.googleusercontent.com`)
7. Create `.env` file in project root:
   ```bash
   VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
   ```
8. Restart dev server

Now "Sign in with Google" will open Google's real login! ✨

---

## ✅ WORKING FEATURES CHECKLIST

### All Pages Have Working Buttons:

#### 📊 Dashboard
- [x] Refresh button updates live data
- [x] All charts show real device/alert stats

#### 🖥️ Devices
- [x] Add Device button (opens form dialog)
- [x] Edit button (pencil icon) per device
- [x] Delete button (trash icon) per device
- [x] Search bar (real-time filter)
- [x] Status dropdown (filter by online/offline/warning)
- [x] Location dropdown (filter by region)
- [x] Export button (downloads JSON)
- [x] Refresh button
- [x] Expand rows (click chevron for details)

#### 🚨 Alerts
- [x] Create Alert button (opens form)
- [x] Acknowledge button per alert
- [x] Resolve button per alert
- [x] Delete button per alert
- [x] Expand alert (click chevron for details)
- [x] Tab switcher (By Severity / Timeline)
- [x] Refresh button

#### ⚙️ Settings (7 Categories)
- [x] Appearance: Dark/Light toggle + 6 accent colors
- [x] Layout: Density options, sidebar toggle
- [x] Notifications: Email/Push/Critical toggles
- [x] Security: 2FA toggle, session management
- [x] Data Management: Export, Import, Reset buttons
- [x] Activity Logs: View/Download buttons
- [x] All navigation buttons work

#### 📈 Analytics
- [x] Interactive charts with real data

---

## 🎯 TESTING THE APP

### Try These Actions:

1. **Add a Device**:
   - Go to Devices page
   - Click "Add Device"
   - Fill: Name = "My Server", IP = "192.168.1.1"
   - Click "Add Device"
   - ✅ See it appear in the table!

2. **Create an Alert**:
   - Go to Alerts page
   - Click "Create Alert"
   - Fill: Title = "Test Alert", Message = "Testing"
   - Click "Create Alert"
   - ✅ See it appear at the top!

3. **Export Your Data**:
   - Go to Settings → Data Management
   - Click "Export Data"
   - ✅ JSON file downloads!

4. **Change Theme**:
   - Go to Settings → Appearance
   - Click Dark theme card
   - Click Blue accent color
   - ✅ Theme changes instantly!

---

## 📦 DATA PERSISTENCE

- ✅ All data saves to browser's localStorage
- ✅ Survives page refresh and browser restart
- ✅ Export as JSON backup anytime
- ✅ Import to restore data
- ✅ Reset to defaults if needed

---

## 🆘 TROUBLESHOOTING

### Google Sign-In not working?
- Check `.env` file has correct Client ID
- Verify `http://localhost:5173` added to Google Console origins
- Restart dev server after adding .env
- Try clearing browser cache

### Buttons not responding?
- Check browser console (F12) for errors
- Refresh the page
- All buttons ARE working - see checklist above

### Data not saving?
- Check localStorage isn't disabled
- Not in incognito/private mode
- Try another browser

---

## 💡 PRO TIPS

1. **Backup Regularly**: Export data from Settings → Data Management
2. **Use Google Sign-In**: Get your real profile pic in the app
3. **Explore Settings**: 7 categories with working features
4. **Activity Logs**: Track all your actions (Settings → Activity Logs)
5. **Dark Mode**: Better for eyes (Settings → Appearance)

---

## 🎊 YOU'RE READY!

Everything works out of the box. No backend needed. Just:

1. Login (any credentials)
2. Start adding devices and alerts
3. Enjoy the professional monitoring dashboard!

**Need Google Sign-In?** See ".env.example" file for detailed instructions.

---

## 📚 Full Documentation

- `FEATURES.md` - Complete feature list
- `SETUP_GUIDE.md` - Detailed Google OAuth setup
- `.env.example` - Environment configuration
