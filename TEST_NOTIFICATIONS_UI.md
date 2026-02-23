# How to Test Notifications on UI

## Method 1: Browser Console (Quick Test)

### Step 1: Login to Application
1. Open http://localhost:3000
2. Login with your credentials
3. Check browser console - should see: `✅ WebSocket connected`

### Step 2: Open Browser Console
- Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- Go to **Console** tab

### Step 3: Send Test Notification

Copy and paste this in console:

```javascript
// Get your token
const token = localStorage.getItem('token');

// Send test notification
fetch('http://localhost:5000/api/notifications/test', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => {
  console.log('✅ Notification sent:', data);
  console.log('📬 Check notification bell (top right) - should see notification!');
})
.catch(err => console.error('❌ Error:', err));
```

### Step 4: Check UI
1. Look at **notification bell** (top right corner)
2. You should see:
   - **Red badge** with number (unread count)
   - **Click bell** to see notification panel
   - **Notification appears** in the panel

## Method 2: Create Test Button (Better UX)

I'll add a test button to Dashboard for easy testing.

## Method 3: Using Postman/Thunder Client

### Request:
- **URL**: `http://localhost:5000/api/notifications/test`
- **Method**: `POST`
- **Headers**:
  ```
  Authorization: Bearer <your-token>
  Content-Type: application/json
  ```
- **Body**: (empty)

### Get Token:
1. Login to app
2. Open browser console
3. Run: `localStorage.getItem('token')`
4. Copy the token

## What You Should See

### In Browser Console:
```
✅ WebSocket connected: <socket-id>
📬 Received notification: {id: "...", title: "...", message: "..."}
```

### In UI:
1. **Notification Bell** (top right):
   - Red badge appears with number
   - Badge shows unread count

2. **Click Bell**:
   - Panel opens
   - Shows notification with:
     - Title: "Test Notification"
     - Message: "This is a test notification from Event Hub POC"
     - Timestamp: "Just now"
     - Blue dot (unread indicator)

3. **Click Notification**:
   - Marks as read
   - Blue dot disappears
   - Badge count decreases

## Troubleshooting

### No Notification Appears?

1. **Check WebSocket Connection**:
   ```javascript
   // In browser console
   // Should see: ✅ WebSocket connected
   ```

2. **Check Backend Logs**:
   - Should see: `✅ Notification event sent to Event Hub`
   - Should see: `✅ Received notification from partition`

3. **Check Event Hub**:
   - Verify Event Hub "rfq-changes" exists
   - Check backend logs for errors

4. **Check User ID**:
   - Make sure logged-in user ID matches notification userId

### WebSocket Not Connecting?

1. Check backend server is running
2. Check CORS settings
3. Check browser console for errors
4. Try refreshing page

## Advanced: Send Custom Notification

```javascript
const token = localStorage.getItem('token');
const userId = JSON.parse(localStorage.getItem('user')).id;

fetch('http://localhost:5000/api/notifications/me', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    type: 'success',
    title: 'Custom Notification',
    message: 'This is a custom test notification!',
    data: { customField: 'test value' }
  })
})
.then(res => res.json())
.then(data => console.log('✅ Custom notification sent:', data));
```

