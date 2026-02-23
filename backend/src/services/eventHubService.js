const { EventHubProducerClient } = require('@azure/event-hubs');
require('dotenv').config();

class EventHubService {
  constructor() {
    this.connectionString = process.env.EVENT_HUB_CONN_STRING;
    this.eventHubName = process.env.EVENT_HUB_NAME || 'notifications';
    this.producerClient = null;
  }

  async initialize() {
    if (!this.connectionString) {
      throw new Error('EVENT_HUB_CONN_STRING is not set in environment variables');
    }

    try {
      this.producerClient = new EventHubProducerClient(
        this.connectionString,
        this.eventHubName
      );
      console.log('✅ Event Hub Producer Client initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Event Hub Producer Client:', error);
      throw error;
    }
  }

  async sendNotificationEvent(notificationData) {
    if (!this.producerClient) {
      await this.initialize();
    }

    try {
      const eventData = {
        body: notificationData,
        contentType: 'application/json'
      };

      const batch = await this.producerClient.createBatch();
      batch.tryAdd(eventData);

      await this.producerClient.sendBatch(batch);
      console.log('✅ Notification event sent to Event Hub:', notificationData);
      return true;
    } catch (error) {
      console.error('❌ Failed to send notification event:', error);
      throw error;
    }
  }

  async close() {
    if (this.producerClient) {
      await this.producerClient.close();
      console.log('✅ Event Hub Producer Client closed');
    }
  }
}

// Singleton instance
const eventHubService = new EventHubService();

module.exports = eventHubService;

