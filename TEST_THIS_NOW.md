# 🧪 TEST MONITORHUB NOW - 2 MINUTE CHECKLIST

## ⚡ INSTANT TESTS (No Setup Needed)

### ✅ Test 1: Login (30 seconds)
```
1. Open the app
2. Enter ANY email: test@test.com
3. Enter ANY password: password
4. Click "Sign In"
✅ SUCCESS: You're in the dashboard!
```

### ✅ Test 2: Add a Device (30 seconds)
```
1. Click "Devices" in sidebar
2. Click "Add Device" button (top right)
3. Fill:
   - Name: "My Test Server"
   - IP Address: "192.168.1.100"
4. Click "Add Device"

✅ SUCCESS: 
- Device appears in the table
- Toast notification shows "Device added successfully"
- You see it in the list with status badges
```

### ✅ Test 3: Edit That Device (20 seconds)
```
1. Find your "My Test Server" in the table
2. Click the pencil (edit) icon
3. Change name to "Updated Server"
4. Click "Save Changes"

✅ SUCCESS:
- Name updates in the table
- Toast shows "Device updated successfully"
```

### ✅ Test 4: Create an Alert (30 seconds)
```
1. Click "Alerts" in sidebar
2. Click "Create Alert" button (top right)
3. Fill:
   - Title: "Test Alert"
   - Message: "This is a test"
   - Severity: "Critical" (dropdown)
4. Click "Create Alert"

✅ SUCCESS:
- Alert appears at the top
- Red critical badge visible
- Toast notification shows
- Critical count increased in stats
```

### ✅ Test 5: Data Persists (10 seconds)
```
1. Press F5 (refresh page)
2. Login again

✅ SUCCESS:
- Your test device is still there
- Your test alert is still there
- All data survived the refresh!
```

### ✅ Test 6: Change Theme (20 seconds)
```
1. Click "Settings" in sidebar
2. Click "Appearance" category
3. Click the "Dark" theme card
4. Click the "Blue" color button

✅ SUCCESS:
- App switches to dark mode instantly
- Accent color changes to blue
- Toast shows "Accent color changed to blue"
```

### ✅ Test 7: Export Data (15 seconds)
```
1. In Settings, click "Data Management"
2. Click "Export Data" button

✅ SUCCESS:
- JSON file downloads
- Filename includes today's date
- Toast shows "Data exported successfully"
```

### ✅ Test 8: All Buttons Work (30 seconds)
```
Go through each page and click:

Dashboard:
- ✅ Click "Refresh Dashboard" → Toast appears

Devices:
- ✅ Click search → Type "test" → Filters work
- ✅ Click status dropdown → Select "Online" → Filters
- ✅ Click chevron on a row → Details expand

Alerts:
- ✅ Click an alert chevron → Details expand
- ✅ Click "Acknowledge" → Badge appears
- ✅ Click "Resolve" → Green badge appears

Settings:
- ✅ Click each category (7 total) → Content changes
- ✅ Click any toggle → Toast notification
```

## 🔐 GOOGLE SIGN-IN TEST (5 minutes setup)

### IF You Want Real Google Account:

```
1. Open: https://console.cloud.google.com/
2. Create new project or select existing
3. Search for "Google+ API" → Enable it
4. Go to "Credentials" → "Create Credentials"
5. Select "OAuth 2.0 Client ID"
6. Application type: "Web application"
7. Add Authorized JavaScript origin:
   http://localhost:5173
8. Click "Create"
9. Copy the Client ID (looks like: 123456-abc...xyz.apps.googleusercontent.com)

10. In your project root, create .env file:
    VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE

11. Restart dev server

12. Click "Sign in with Google"

✅ SUCCESS:
- Google popup appears
- You choose YOUR Google account
- App shows YOUR name, email, profile picture
- No more generic user!
```

## 🎯 COMPLETE FEATURE TEST (5 minutes)

### Full Workflow Test:

```
1. LOGIN
   ✅ Email/password works

2. DASHBOARD
   ✅ See 4 KPI cards with real numbers
   ✅ See charts with data
   ✅ Click refresh → Data updates

3. DEVICES
   ✅ Add device → Appears in table
   ✅ Edit device → Changes save
   ✅ Delete device → Confirm → Removed
   ✅ Search "test" → Filters
   ✅ Export → JSON downloads

4. ALERTS
   ✅ Create alert → Appears
   ✅ Acknowledge → Badge changes
   ✅ Resolve → Green badge
   ✅ Delete → Removed
   ✅ Switch tabs → View changes

5. SETTINGS (Test All 7 Categories)
   ✅ Appearance → Dark/Light toggle works
   ✅ Appearance → Color buttons work
   ✅ Layout → Density options work
   ✅ Notifications → Toggles work
   ✅ Security → 2FA toggle works
   ✅ Data Management → Export works
   ✅ Data Management → Import works (upload JSON)
   ✅ Activity Logs → Buttons visible

6. PERSISTENCE
   ✅ Add device
   ✅ Refresh page (F5)
   ✅ Device still there!

7. LOGOUT
   ✅ Click user dropdown → Logout
   ✅ Returns to login page
```

## 🆘 TROUBLESHOOTING QUICK FIXES

### Button Not Working?
```
1. Check browser console (F12)
2. Refresh page
3. Clear browser cache
4. Try different browser
```

### Data Not Saving?
```
1. Not in incognito mode?
2. LocalStorage enabled?
3. Check browser console for errors
```

### Google Sign-In Not Working?
```
1. .env file created?
2. Correct Client ID?
3. Added http://localhost:5173 to Google Console?
4. Restarted dev server?
5. Cleared browser cache?
```

## ✅ SUCCESS CRITERIA

You know everything works when:

- ✅ Can login with any email/password
- ✅ Can add a device and see it in the table
- ✅ Can edit that device and see changes
- ✅ Can delete that device
- ✅ Can create an alert and see it appear
- ✅ Can refresh page and data persists
- ✅ Can change theme and see it update
- ✅ Can export data and get JSON file
- ✅ All buttons show toast notifications
- ✅ No errors in browser console

## 🎊 WHAT TO EXPECT

### After Each Action:
- ✅ Toast notification appears (top right)
- ✅ Data updates in the UI immediately
- ✅ Changes persist after page refresh
- ✅ Smooth animations and transitions

### What You Can Do:
- ✅ Manage unlimited devices
- ✅ Create unlimited alerts
- ✅ Export/import all data
- ✅ Customize theme
- ✅ Everything saves automatically

## 📝 NOTES

- **No backend needed** - Uses localStorage
- **All features work offline** - No API calls required
- **Real Google Sign-In optional** - App works without it
- **Data persists** - Survives page refresh and browser restart
- **Professional UI** - Dark mode, animations, toast notifications

---

## 🚀 START TESTING NOW!

1. Open the app
2. Login with: test@test.com / password
3. Click "Devices" → "Add Device"
4. Fill name and IP → Click "Add Device"
5. **See it appear immediately!** ✅

**That's it! Everything works!** 🎉

For detailed docs, see:
- `README.md` - Full documentation
- `QUICK_START.md` - Quick start guide
- `FEATURES.md` - Complete feature list
- `STATUS.md` - Implementation status
