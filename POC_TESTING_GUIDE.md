# POC Testing Guide - Event Hub Real-time Notifications

## Setup

### Backend Environment Variables

Add these to `backend/.env`:

```env
EVENT_HUB_CONN_STRING=Endpoint=sb://fieldfix.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=jxqO6lhfE03xFyBkw+pDaQQVqGDup/aFR+AEhAKEpTo=
EVENT_HUB_NAME=notifications
EVENT_HUB_KEY=jxqO6lhfE03xFyBkw+pDaQQVqGDup/aFR+AEhAKEpTo=
```

**Note:** Make sure you have created an Event Hub named "notifications" in your Azure Service Bus namespace.

### Frontend Environment Variables (Optional)

Add to `frontend/.env` if WebSocket URL is different:

```env
REACT_APP_WS_URL=http://localhost:5000
```

## Testing Steps

### 1. Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
- ✅ Server running on port 5000
- ✅ Event Hub Producer Client initialized
- ✅ Event Hub Consumer Client initialized
- ✅ WebSocket Server initialized

### 2. Start Frontend

```bash
cd frontend
npm start
```

### 3. Login to Application

1. Open browser: http://localhost:3000
2. Login with your credentials
3. Check browser console - you should see:
   - ✅ WebSocket connected: [socket-id]

### 4. Test Notification

#### Option A: Using API Endpoint (Recommended)

Open browser console or use Postman/curl:

```javascript
// In browser console (after login)
fetch('http://localhost:5000/api/notifications/test', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(res => res.json())
.then(data => console.log('Notification sent:', data));
```

#### Option B: Using Test Button (if you add one)

Create a test button in Dashboard or any page:

```jsx
<button onClick={async () => {
  const response = await fetch('/api/notifications/test', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  const data = await response.json();
  console.log(data);
}}>
  Send Test Notification
</button>
```

### 5. Verify Real-time Delivery

1. After sending notification, check:
   - ✅ Notification appears in notification bell (top right)
   - ✅ Unread count badge shows
   - ✅ Click bell to see notification panel
   - ✅ Notification appears immediately (< 1 second)

### 6. Check Logs

**Backend Console:**
- ✅ Notification event sent to Event Hub
- ✅ Received notification from partition
- ✅ Notification sent to user [userId]

**Frontend Console:**
- ✅ WebSocket connected
- 📬 Received notification: [notification object]

## Expected Flow

```
1. API Call → POST /api/notifications/test
2. Backend → Sends message to Event Hub
3. Event Hub → Stores message
4. Consumer Worker → Consumes message
5. WebSocket Service → Pushes to connected user
6. Frontend → Receives via WebSocket
7. UI → Updates notification bell and panel
```

## Troubleshooting

### Event Hub Connection Error

**Error:** `EVENT_HUB_CONN_STRING is not set`

**Solution:** Check `.env` file has correct connection string

### Event Hub Name Error

**Error:** `Event Hub not found`

**Solution:** 
1. Go to Azure Portal
2. Navigate to your Service Bus namespace
3. Create Event Hub named "notifications" (or update EVENT_HUB_NAME in .env)

### WebSocket Not Connecting

**Error:** `WebSocket connection error`

**Solution:**
1. Check backend server is running
2. Check CORS settings in server.js
3. Check REACT_APP_WS_URL in frontend .env

### Notifications Not Appearing

**Check:**
1. User is logged in (WebSocket connects on login)
2. Check browser console for errors
3. Check backend console for Event Hub messages
4. Verify userId matches logged-in user

## API Endpoints

### POST /api/notifications/test
- **Auth:** Optional (works without auth for POC)
- **Body:** None
- **Response:** Test notification sent

### POST /api/notifications/me
- **Auth:** Required
- **Body:** 
  ```json
  {
    "type": "info",
    "title": "Notification Title",
    "message": "Notification message",
    "data": {}
  }
  ```
- **Response:** Notification created

### POST /api/notifications
- **Auth:** Required
- **Body:**
  ```json
  {
    "userId": 1,
    "type": "info",
    "title": "Notification Title",
    "message": "Notification message",
    "data": {}
  }
  ```
- **Response:** Notification created

## Success Criteria

✅ Notification sent to Event Hub
✅ Consumer worker receives message
✅ WebSocket pushes to browser
✅ UI updates in real-time (< 1 second)
✅ Notification appears in bell and panel

## Next Steps

After POC works:
1. Add database persistence
2. Add authentication for WebSocket
3. Add notification history
4. Add mark as read functionality (partially implemented)
5. Add notification types and filtering
6. Add email notifications (using Azure Communication Services)

