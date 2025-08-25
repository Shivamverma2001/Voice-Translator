const mongoose = require('mongoose');
const gemini = require('../gemini/gemini');
const socketConnection = require('../socket');

class HealthController {
  // Basic health check
  async getHealth(req, res) {
    try {
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
      };

      res.status(200).json({
        success: true,
        data: health
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          message: 'Health check failed',
          details: error.message
        }
      });
    }
  }

  // Detailed health check
  async getDetailedHealth(req, res) {
    try {
      const checks = {
        database: await this.checkDatabase(),
        gemini: await this.checkGemini(),
        socket: this.checkSocket(),
        memory: this.checkMemory(),
        timestamp: new Date().toISOString()
      };

      const allHealthy = Object.values(checks).every(check => 
        check && check.status === 'healthy'
      );

      const status = allHealthy ? 'healthy' : 'unhealthy';
      const statusCode = allHealthy ? 200 : 503;

      res.status(statusCode).json({
        success: allHealthy,
        status,
        data: checks
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          message: 'Detailed health check failed',
          details: error.message
        }
      });
    }
  }

  // Check database connection
  async checkDatabase() {
    try {
      const state = mongoose.connection.readyState;
      const isConnected = state === 1;
      
      return {
        status: isConnected ? 'healthy' : 'unhealthy',
        connection: isConnected ? 'connected' : 'disconnected',
        state: state,
        details: {
          host: mongoose.connection.host,
          port: mongoose.connection.port,
          name: mongoose.connection.name
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  // Check Gemini AI service
  async checkGemini() {
    try {
      const status = gemini.getStatus();
      const isConnected = status === 'connected';
      
      return {
        status: isConnected ? 'healthy' : 'unhealthy',
        service: 'Gemini AI',
        connection: isConnected ? 'connected' : 'disconnected',
        details: status
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  // Check socket connection
  checkSocket() {
    try {
      const isReady = socketConnection.isReady();
      
      return {
        status: isReady ? 'healthy' : 'unhealthy',
        service: 'Socket.IO',
        connection: isReady ? 'ready' : 'not ready',
        details: socketConnection.getStats()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  // Check memory usage
  checkMemory() {
    try {
      const memUsage = process.memoryUsage();
      
      return {
        status: 'healthy',
        service: 'Memory',
        details: {
          rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
          heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
          heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
          external: `${Math.round(memUsage.external / 1024 / 1024)} MB`
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }
}

const healthController = new HealthController();
module.exports = healthController;
