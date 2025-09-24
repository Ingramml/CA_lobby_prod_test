"""
CA Lobby Web API - Main Flask Application

This module provides the core Flask application for the CA Lobby system,
integrating existing Phase 1.1 data infrastructure with new API endpoints.

Based on:
- Phase 1.1 database connection patterns (Bigquery_connection.py)
- Phase 1.1 environment variable management (.env patterns)
- Phase 1.2 deployment pipeline capabilities
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import logging
from datetime import datetime

# Load environment variables
load_dotenv()

def create_app():
    """
    Application factory pattern for Flask app creation.
    Follows Phase 1.1 established patterns for configuration management.
    """
    app = Flask(__name__)

    # Apply configuration from environment
    app.config['DEBUG'] = os.getenv('DEBUG', 'True').lower() == 'true'
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-key-change-in-production')

    # CORS configuration for frontend integration
    cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')
    CORS(app, origins=cors_origins)

    # Configure logging using Phase 1.1 patterns
    configure_logging(app)

    # Register health check endpoint
    register_health_check(app)

    # Register API routes
    register_api_routes(app)

    return app

def configure_logging(app):
    """
    Configure logging following existing Phase 1.1 patterns.
    Uses same logging structure as data processing scripts.
    """
    log_level = os.getenv('LOG_LEVEL', 'INFO').upper()
    log_file = os.getenv('LOG_FILE', 'api.log')

    # Create logs directory if it doesn't exist
    os.makedirs('logs', exist_ok=True)
    log_path = os.path.join('logs', log_file)

    logging.basicConfig(
        level=getattr(logging, log_level),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_path),
            logging.StreamHandler()
        ]
    )

    app.logger.info(f"✅ Logging configured: {log_level} level, file: {log_path}")

def register_health_check(app):
    """
    Register health check endpoint using Phase 1.1 validation patterns.
    Provides system status information for monitoring.
    """
    @app.route('/health', methods=['GET'])
    def health_check():
        """
        Health check endpoint for system monitoring.
        Returns API status and basic system information.
        """
        try:
            health_data = {
                'status': 'healthy',
                'timestamp': datetime.utcnow().isoformat(),
                'service': 'ca-lobby-api',
                'version': '1.3.0',
                'environment': os.getenv('FLASK_ENV', 'development')
            }

            app.logger.info("Health check requested - system healthy")
            return jsonify(health_data), 200

        except Exception as e:
            app.logger.error(f"Health check failed: {str(e)}")
            return jsonify({
                'status': 'unhealthy',
                'error': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }), 500

def register_api_routes(app):
    """
    Register basic API routes structure.
    Placeholder for Phase 1.3b data access layer integration.
    """
    @app.route('/api/status', methods=['GET'])
    def api_status():
        """Basic API status endpoint."""
        return jsonify({
            'message': 'CA Lobby API is running',
            'phase': '1.3a - Backend API Foundation',
            'timestamp': datetime.utcnow().isoformat()
        })

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5000))

    app.logger.info(f"🚀 Starting CA Lobby API on port {port}")
    app.run(host='0.0.0.0', port=port, debug=app.config['DEBUG'])