const { EventHubConsumerClient } = require('@azure/event-hubs');
const webSocketService = require('../services/websocketService');
const Notification = require('../models/Notification');
require('dotenv').config();

class EventHubConsumer {
  constructor() {
    this.connectionString = process.env.EVENT_HUB_CONN_STRING;
    this.eventHubName = process.env.EVENT_HUB_NAME || 'notifications';
    this.consumerGroup = process.env.EVENT_HUB_CONSUMER_GROUP || '$Default';
    this.consumerClient = null;
    this.isRunning = false;
  }

  async start() {
    if (!this.connectionString) {
      console.warn('⚠️ EVENT_HUB_CONN_STRING is not set. Event Hub Consumer will not start.');
      return;
    }

    if (this.isRunning) {
      console.log('⚠️ Event Hub Consumer is already running');
      return;
    }

    try {
      this.consumerClient = new EventHubConsumerClient(
        this.consumerGroup,
        this.connectionString,
        this.eventHubName
      );

      console.log('✅ Event Hub Consumer Client initialized');

      // Get partition IDs
      const partitionIds = await this.consumerClient.getPartitionIds();
      console.log(`✅ Found ${partitionIds.length} partitions`);

      // Subscribe to all partitions
      for (const partitionId of partitionIds) {
        this.subscribeToPartition(partitionId);
      }

      this.isRunning = true;
      console.log(`✅ Event Hub Consumer started for Event Hub: ${this.eventHubName}`);
    } catch (error) {
      if (error.code === 'MessagingEntityNotFoundError') {
        console.error(`❌ Event Hub "${this.eventHubName}" not found in Service Bus namespace.`);
        console.error(`   Please create the Event Hub in Azure Portal:`);
        console.error(`   1. Go to Azure Portal → Service Bus → fieldfix`);
        console.error(`   2. Click "Event Hubs" → "+ Event Hub"`);
        console.error(`   3. Name: "${this.eventHubName}"`);
        console.error(`   4. Create and restart server`);
        console.error(`   Server will continue running, but notifications won't be consumed until Event Hub is created.`);
      } else {
        console.error('❌ Failed to start Event Hub Consumer:', error.message);
      }
      // Don't throw error - let server continue running
      // Consumer can be started later when Event Hub is created
    }
  }

  async subscribeToPartition(partitionId) {
    const subscription = this.consumerClient.subscribe(partitionId, {
      processEvents: async (events, context) => {
        for (const event of events) {
          try {
            const notificationData = event.body;
            console.log(`✅ Received notification from partition ${partitionId}:`, notificationData);

            // Save to database
            if (notificationData.userId) {
              try {
                // Ensure data is a plain object, not already stringified
                let dataToSave = notificationData.data || {};
                if (typeof dataToSave === 'string') {
                  try {
                    dataToSave = JSON.parse(dataToSave);
                  } catch (e) {
                    dataToSave = {};
                  }
                }
                
                const savedNotification = await Notification.create({
                  userId: notificationData.userId,
                  type: notificationData.type || 'info',
                  title: notificationData.title,
                  message: notificationData.message,
                  data: dataToSave,
                  isRead: false,
                  emailSent: false
                });
                console.log(`✅ Notification saved to database with ID: ${savedNotification.id}`);
                
                // Send to WebSocket if user is connected
                webSocketService.sendToUser(notificationData.userId, savedNotification);
              } catch (dbError) {
                console.error('❌ Error saving notification to database:', dbError);
                // Still try to send via WebSocket even if DB save fails
                webSocketService.sendToUser(notificationData.userId, notificationData);
              }
            } else {
              // Broadcast to all if no specific user
              webSocketService.broadcast(notificationData);
            }
          } catch (error) {
            console.error('❌ Error processing event:', error);
          }
        }
      },
      processError: async (error, context) => {
        console.error(`❌ Error in partition ${partitionId}:`, error);
      }
    });

    console.log(`✅ Subscribed to partition ${partitionId}`);
  }

  async stop() {
    if (this.consumerClient) {
      await this.consumerClient.close();
      this.isRunning = false;
      console.log('✅ Event Hub Consumer stopped');
    }
  }
}

// Singleton instance
const eventHubConsumer = new EventHubConsumer();

module.exports = eventHubConsumer;

