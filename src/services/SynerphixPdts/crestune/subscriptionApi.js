import axios from 'axios';
import useAuthStore from '../../../stores/shared/useAuthStore';

const SubscriptionApi = axios.create({
  baseURL: import.meta.env.VITE_SUBSCRIPTION_API_SUPER,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

SubscriptionApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

SubscriptionApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Subscription API authentication failed');
    }
    return Promise.reject(error);
  }
);

export const subscriptionApi = {

  // PLANS
  getPlans: async () => {
    const response = await SubscriptionApi.get('/api/subscription-plans');
    return response.data;
  },

  createPlan: async (data) => {
    const response = await SubscriptionApi.post(
      '/api/subscription-plans',
      data
    );
    return response.data;
  },

  updatePlan: async (id, data) => {
    const response = await SubscriptionApi.put(
      `/api/subscription-plans/${id}`,
      data
    );
    return response.data;
  },

  deletePlan: async (id) => {
    const response = await SubscriptionApi.delete(
      `/api/subscription-plans/${id}`
    );
    return response.data;
  },

  // SUBSCRIPTIONS
  getSubscriptions: async (params = {}) => {
    const response = await SubscriptionApi.get(
      '/api/subscriptions',
      { params }
    );
    return response.data;
  },

  getSubscription: async (id) => {
    const response = await SubscriptionApi.get(
      `/api/subscriptions/${id}`
    );
    return response.data;
  },

  updateSubscriptionStatus: async (id, status) => {
    const response = await SubscriptionApi.put(
      `/api/subscriptions/${id}/status`,
      { status }
    );
    return response.data;
  },

  cancelSubscription: async (id) => {
    const response = await SubscriptionApi.post(
      `/api/subscriptions/${id}/cancel`
    );
    return response.data;
  },

  // PAYMENTS
  getPayments: async (params = {}) => {
    const response = await SubscriptionApi.get(
      '/api/payments',
      { params }
    );
    return response.data;
  },

  getPayment: async (id) => {
    const response = await SubscriptionApi.get(
      `/api/payments/${id}`
    );

    return response.data;
  },

};

export default SubscriptionApi;