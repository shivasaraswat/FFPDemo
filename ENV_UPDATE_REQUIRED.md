# Environment Variables Update Required

## Your Event Hub Details

- **Namespace**: `fieldfix`
- **Event Hub Name**: `rfq-changes`

## Update Your `.env` File

Add this line to your `backend/.env` file:

```env
EVENT_HUB_NAME=rfq-changes
```

## Complete `.env` Should Have

```env
EVENT_HUB_CONN_STRING=Endpoint=sb://fieldfix.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=jxqO6lhfE03xFyBkw+pDaQQVqGDup/aFR+AEhAKEpTo=
EVENT_HUB_KEY=jxqO6lhfE03xFyBkw+pDaQQVqGDup/aFR+AEhAKEpTo=
EVENT_HUB_NAME=rfq-changes
```

## After Updating

1. **Restart your backend server**
2. You should see:
   ```
   ✅ Event Hub Consumer Client initialized
   ✅ Found X partitions
   ✅ Event Hub Consumer started for Event Hub: rfq-changes
   ```

## Note

- `EVENT_HUB_NAMESPACE` is not needed - namespace is already in connection string
- `EVENT_HUB_KEY` is optional - key is already in connection string
- `EVENT_HUB_NAME` is **required** - this tells code which Event Hub to use

