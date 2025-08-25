const crypto = require('crypto');
const clerkService = require('./clerkService');
const config = require('../config');

class ClerkWebhookHandler {
  constructor() {
    this.webhookSecret = config.clerk.webhookSecret;
  }

  /**
   * Verify webhook using Clerk's verifyWebhook helper
   */
  async verifyWebhook(req) {
    try {
      // For now, accept all webhooks
      // TODO: Implement proper verification using Clerk's verifyWebhook helper
      return true;
    } catch (error) {
      console.error('❌ Webhook verification error:', error);
      return false;
    }
  }

  /**
   * Process incoming webhook
   */
  async processWebhook(req, res) {
    try {
      // Extract Svix signature headers
      const signature = req.headers['svix-signature'];
      const timestamp = req.headers['svix-timestamp'];
      const id = req.headers['svix-id'];
      const body = req.body;

      if (!signature || !timestamp || !id) {
        console.error('❌ Missing required Svix webhook headers');
        return res.status(400).json({ error: 'Missing webhook headers' });
      }

      // Verify webhook
      if (!(await this.verifyWebhook(req))) {
        console.error('❌ Webhook verification failed');
        return res.status(401).json({ error: 'Verification failed' });
      }

      // Process webhook events
      const event = body;

      try {
        switch (event.type) {
          case 'user.created':
            console.log('👤 Processing user.created event for:', event.data.email_addresses?.[0]?.email_address);
            const result = await clerkService.syncUserFromClerk(event.data);
            console.log('✅ User created successfully in MongoDB');
            break;

          case 'user.updated':
            console.log('✏️ Processing user.updated event for:', event.data.email_addresses?.[0]?.email_address);
            const updateResult = await clerkService.syncUserFromClerk(event.data);
            console.log('✅ User updated successfully in MongoDB');
            break;

          case 'user.deleted':
            console.log('🗑️ Processing user.deleted event for:', event.data.id);
            const deleteResult = await clerkService.deleteUserByClerkId(event.data.id);
            console.log('✅ User deleted successfully from MongoDB');
            break;

          default:
            // Only log unknown events if they're not common ones like email.created, session.created
            if (!['email.created', 'session.created'].includes(event.type)) {
              console.log('⚠️ Unknown event type:', event.type);
            }
        }

        res.status(200).json({ success: true });

      } catch (error) {
        console.error('❌ Error processing webhook event:', error);
        res.status(500).json({ error: 'Internal server error' });
      }

    } catch (error) {
      console.error('❌ Webhook processing error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new ClerkWebhookHandler();
