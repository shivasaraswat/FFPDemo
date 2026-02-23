# Quick Fix: Event Hub Not Found Error

## Problem
```
MessagingEntityNotFoundError: The messaging entity 'sb://fieldfix.servicebus.windows.net/notifications/$management' could not be found
```

## Solution: Create Event Hub in Azure Portal

### Method 1: Azure Portal (Recommended)

1. **Go to Azure Portal**: https://portal.azure.com
2. **Search for "Service Bus"** or navigate to your namespace: `fieldfix`
3. **Click on "Event Hubs"** in the left menu
4. **Click "+ Event Hub"** or **"+ Add"** button
5. **Fill in details:**
   - **Name**: `notifications`
   - **Partition Count**: `2` (default)
   - **Message Retention**: `1` day (default)
   - **Capture**: `Off` (for now)
6. **Click "Create"**
7. **Wait for creation** (takes 10-30 seconds)
8. **Restart your backend server**

### Method 2: Azure CLI

```bash
# Login to Azure
az login

# Create Event Hub
az eventhubs eventhub create \
  --resource-group <your-resource-group> \
  --namespace-name fieldfix \
  --name notifications \
  --partition-count 2 \
  --message-retention 1
```

### Method 3: Use Existing Event Hub

If you already have an Event Hub with a different name:

1. Go to Azure Portal → Service Bus → Event Hubs
2. Check what Event Hubs exist
3. Update `backend/.env`:
   ```env
   EVENT_HUB_NAME=<your-existing-event-hub-name>
   ```

## Verify Event Hub Created

After creating, verify:
1. Azure Portal → Service Bus → Event Hubs → Should see "notifications"
2. Or check backend logs - should see: `✅ Event Hub Consumer started`

## Current Status

✅ **Server will start even if Event Hub doesn't exist** (updated code)
⚠️ **Notifications won't work until Event Hub is created**

## After Creating Event Hub

1. Restart backend server
2. You should see:
   ```
   ✅ Event Hub Consumer Client initialized
   ✅ Found 2 partitions
   ✅ Subscribed to partition 0
   ✅ Subscribed to partition 1
   ✅ Event Hub Consumer started for Event Hub: notifications
   ```

## Test Notification

After Event Hub is created and server restarted:

```javascript
// In browser console (after login)
fetch('http://localhost:5000/api/notifications/test', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(res => res.json())
.then(data => console.log('Notification sent:', data));
```

You should see notification appear in real-time in the notification bell!

