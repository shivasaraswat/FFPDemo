# Azure Event Hub Setup Guide

## Problem
Error: `The messaging entity 'sb://fieldfix.servicebus.windows.net/notifications/$management' could not be found`

This means the Event Hub "notifications" doesn't exist in your Service Bus namespace.

## Solution: Create Event Hub in Azure Portal

### Step 1: Go to Azure Portal
1. Login to https://portal.azure.com
2. Search for "Service Bus" or navigate to your Service Bus namespace: `fieldfix`

### Step 2: Create Event Hub
1. In your Service Bus namespace, click on **"Event Hubs"** in the left menu
2. Click **"+ Event Hub"** or **"Create"** button
3. Fill in the details:
   - **Name**: `notifications` (or any name you want)
   - **Partition Count**: 2 (default, can be 1-32)
   - **Message Retention**: 1 day (default, can be 1-7 days)
   - **Capture**: Off (for POC, can enable later)
4. Click **"Create"**

### Step 3: Update Environment Variable
After creating, update your `.env` file:

```env
EVENT_HUB_NAME=notifications
```

(Or whatever name you gave to the Event Hub)

### Step 4: Restart Server
Restart your backend server after creating the Event Hub.

## Alternative: Use Existing Event Hub

If you already have an Event Hub with a different name:

1. Go to Azure Portal → Service Bus → Event Hubs
2. Check what Event Hubs exist
3. Update `.env`:
   ```env
   EVENT_HUB_NAME=<your-existing-event-hub-name>
   ```

## Verify Event Hub Exists

You can verify by:
1. Azure Portal → Service Bus → Event Hubs (should show your Event Hub)
2. Or use Azure CLI:
   ```bash
   az eventhubs eventhub list --namespace-name fieldfix --resource-group <your-resource-group>
   ```

## Quick Fix: Make Consumer More Resilient

If you want the server to start even if Event Hub doesn't exist (for development), we can update the consumer to handle this gracefully.

