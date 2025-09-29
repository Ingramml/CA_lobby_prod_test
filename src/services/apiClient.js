import { useSearchStore } from '../stores/searchStore';
import { useUserStore } from '../stores/userStore';
import { useAppStore } from '../stores/appStore';

class CALobbyAPIClient {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/v1';
    this.cache = new Map();
    this.requestQueue = [];
    this.isOnline = navigator.onLine;

    // Mobile-specific configurations
    this.mobileConfig = {
      timeout: 10000, // 10s timeout for mobile
      retryAttempts: 3,
      cacheExpiry: 5 * 60 * 1000, // 5 minutes
      batchDelay: 100 // Batch requests for mobile
    };

    this.setupNetworkListeners();
  }

  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processQueuedRequests();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = `${endpoint}:${JSON.stringify(options)}`;

    // Check cache first (mobile optimization)
    if (options.method === 'GET' && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.mobileConfig.cacheExpiry) {
        return cached.data;
      }
    }

    // Queue request if offline
    if (!this.isOnline) {
      return this.queueRequest(endpoint, options);
    }

    const config = {
      timeout: this.mobileConfig.timeout,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    try {
      const response = await this.fetchWithTimeout(url, config);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      // Cache successful GET requests
      if (options.method === 'GET' || !options.method) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
      }

      return data;
    } catch (error) {
      return this.handleError(error, endpoint, options);
    }
  }

  async fetchWithTimeout(url, config) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async handleError(error, endpoint, options, attempt = 1) {
    const { addNotification } = useAppStore.getState();

    // Retry logic for mobile networks
    if (attempt < this.mobileConfig.retryAttempts &&
        (error.name === 'AbortError' || error.message.includes('network'))) {

      addNotification({
        type: 'warning',
        message: `Retrying request (${attempt}/${this.mobileConfig.retryAttempts})...`
      });

      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      return this.request(endpoint, options);
    }

    // Final error handling
    addNotification({
      type: 'error',
      message: 'Network error. Please check your connection and try again.'
    });

    throw error;
  }

  async queueRequest(endpoint, options) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        endpoint,
        options,
        resolve,
        reject
      });
    });
  }

  async processQueuedRequests() {
    const queue = [...this.requestQueue];
    this.requestQueue = [];

    for (const request of queue) {
      try {
        const result = await this.request(request.endpoint, request.options);
        request.resolve(result);
      } catch (error) {
        request.reject(error);
      }
    }
  }

  // Search API methods
  async searchLobbyData(filters, page = 1) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '25',
      ...filters
    });

    return this.request(`/search?${params}`);
  }

  async getAnalyticsTrends(timeframe = 'month', category = null) {
    const params = new URLSearchParams({ timeframe });
    if (category) params.append('category', category);

    return this.request(`/analytics/trends?${params}`);
  }

  async getOrganizationAnalytics(limit = 10, timeframe = 'year') {
    const params = new URLSearchParams({
      limit: limit.toString(),
      timeframe
    });

    return this.request(`/analytics/organizations?${params}`);
  }

  // User API methods (with authentication)
  async getSavedSearches() {
    const { userProfile } = useUserStore.getState();
    if (!userProfile) throw new Error('Authentication required');

    return this.request('/user/searches', {
      headers: {
        'Authorization': `Bearer ${userProfile.token}`
      }
    });
  }

  async saveSearch(name, filters) {
    const { userProfile } = useUserStore.getState();
    if (!userProfile) throw new Error('Authentication required');

    return this.request('/user/searches', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userProfile.token}`
      },
      body: JSON.stringify({ name, filters })
    });
  }

  // Export functionality
  async exportData(format, filters, columns = []) {
    return this.request('/export', {
      method: 'POST',
      body: JSON.stringify({
        format,
        filters,
        columns
      })
    });
  }

  // System status
  async getSystemStatus() {
    return this.request('/system/status');
  }
}

export const apiClient = new CALobbyAPIClient();