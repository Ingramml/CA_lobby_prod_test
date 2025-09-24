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

# Import Phase 1.1 integrated modules
from database import get_database
from middleware import setup_middleware, handle_api_errors

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

    # Set up middleware (error handling, request logging)
    setup_middleware(app)

    # Initialize database connection
    initialize_database(app)

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

def initialize_database(app):
    """
    Initialize database connection using Phase 1.1 patterns.
    Set up connection pooling and validate connectivity.
    """
    with app.app_context():
        db = get_database()
        client = db.initialize_connection()

        if client:
            app.logger.info("✅ Database connection initialized successfully")
        else:
            app.logger.warning("⚠️ Database connection not available - check configuration")

        # Store database instance in app context
        app.db = db

def register_health_check(app):
    """
    Register health check endpoint using Phase 1.1 validation patterns.
    Provides system status information for monitoring.
    """
    @app.route('/health', methods=['GET'])
    @handle_api_errors
    def health_check():
        """
        Health check endpoint for system monitoring.
        Returns API status, database status, and system information.
        """
        # Get database health status
        db_status = app.db.health_check()

        health_data = {
            'status': 'healthy' if db_status['status'] in ['healthy', 'mock_mode'] else 'degraded',
            'timestamp': datetime.utcnow().isoformat(),
            'service': 'ca-lobby-api',
            'version': '1.3.0',
            'environment': os.getenv('FLASK_ENV', 'development'),
            'database': db_status
        }

        status_code = 200 if health_data['status'] in ['healthy', 'degraded'] else 500
        app.logger.info(f"Health check - status: {health_data['status']}")

        return jsonify(health_data), status_code

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