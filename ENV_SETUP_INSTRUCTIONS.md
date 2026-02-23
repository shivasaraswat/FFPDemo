# Environment Variables Setup

## Current Status

You have:
- ✅ `EVENT_HUB_CONN_STRING`
- ✅ `EVENT_HUB_KEY`
- ❌ `EVENT_HUB_NAME` (Missing - needs to be added)

## Quick Fix

### Step 1: Check Azure Portal

1. Go to **Azure Portal**: https://portal.azure.com
2. Navigate to **Service Bus** → **fieldfix** namespace
3. Click on **"Event Hubs"** in left menu
4. **Check if any Event Hub exists**

### Step 2A: If Event Hub Exists

If you see an Event Hub (e.g., "my-events", "messages", etc.):

1. Note the **exact name**
2. Add to `backend/.env`:
   ```env
   EVENT_HUB_NAME=<existing-event-hub-name>
   ```

### Step 2B: If No Event Hub Exists

Create a new Event Hub:

1. In Azure Portal → Service Bus → Event Hubs
2. Click **"+ Event Hub"** or **"+ Add"**
3. Fill in:
   - **Name**: `notifications`
   - **Partition Count**: `2` (default)
   - **Message Retention**: `1` day (default)
   - **Capture**: `Off`
4. Click **"Create"**
5. Wait 10-30 seconds
6. Add to `backend/.env`:
   ```env
   EVENT_HUB_NAME=notifications
   ```

## Final .env File Should Have

```env
EVENT_HUB_CONN_STRING=Endpoint=sb://fieldfix.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=jxqO6lhfE03xFyBkw+pDaQQVqGDup/aFR+AEhAKEpTo=
EVENT_HUB_KEY=jxqO6lhfE03xFyBkw+pDaQQVqGDup/aFR+AEhAKEpTo=
EVENT_HUB_NAME=notifications
```

## After Adding EVENT_HUB_NAME

1. **Restart backend server**
2. Check logs - should see:
   ```
   ✅ Event Hub Consumer Client initialized
   ✅ Found 2 partitions
   ✅ Event Hub Consumer started for Event Hub: notifications
   ```

## Troubleshooting

### Still Getting "Not Found" Error?

1. **Verify Event Hub name** - Check Azure Portal for exact name (case-sensitive)
2. **Check permissions** - Make sure connection string has proper access
3. **Wait a bit** - Sometimes takes 30-60 seconds after creation

### Want to Use Different Name?

Just change `EVENT_HUB_NAME` in `.env` to match your Event Hub name in Azure.

