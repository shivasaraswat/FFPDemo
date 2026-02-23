# Notification Persistence Fix

## Problem
Notifications were disappearing on page refresh because they were only stored in React state (in-memory).

## Solution
Added database persistence so notifications are saved and loaded from database.

## Changes Made

### 1. Database Migration
- Created `019_create_notifications_table.sql`
- Stores: id, userId, type, title, message, data, isRead, emailSent, timestamps

### 2. Backend Changes
- **Notification Model** (`backend/src/models/Notification.js`)
  - CRUD operations for notifications
  - Methods: create, findByUserId, getUnreadCount, markAsRead, markAllAsRead

- **Event Hub Consumer** (`backend/src/workers/eventHubConsumer.js`)
  - Now saves notifications to database when received from Event Hub
  - Then sends via WebSocket

- **Notification Controller** (`backend/src/controllers/notificationController.js`)
  - Added GET endpoints:
    - `GET /api/notifications` - Get user's notifications
    - `GET /api/notifications/unread-count` - Get unread count
  - Added PUT endpoints:
    - `PUT /api/notifications/:id/read` - Mark as read
    - `PUT /api/notifications/read-all` - Mark all as read

### 3. Frontend Changes
- **Notification Service** (`frontend/src/services/notificationService.js`)
  - API methods to fetch and update notifications

- **Notification Context** (`frontend/src/context/NotificationContext.jsx`)
  - Loads notifications from database on mount
  - Real-time updates via WebSocket
  - Persists read status to database

## How It Works Now

1. **On Page Load:**
   - Frontend loads notifications from database via API
   - Shows existing notifications

2. **New Notification:**
   - Event Hub → Consumer → Saves to DB → WebSocket → Frontend
   - Notification appears in real-time AND is saved

3. **On Refresh:**
   - Notifications load from database
   - No data loss!

## Setup Required

### Run Migration
```bash
cd backend
npm run migrate
```

This will create the `notifications` table.

## Testing

1. Send a notification
2. Refresh the page
3. Notification should still be there! ✅

