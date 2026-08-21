import axios from 'axios';

const SubscriptionApi = axios.create({
  baseURL: import.meta.env.VITE_SUBSCRIPTION_API_SUPER,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});
// REQUEST INTERCEPTOR
SubscriptionApi.interceptors.request.use(
  (config) => {
    //same key used by Logiphix authentication.
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization =
        `Bearer ${token}`;
    } else {
      console.warn(
        'No Logiphix authentication token found'
      );
    }

    console.log('Crestune API Request:', {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      hasToken: !!token,
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
SubscriptionApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Crestune API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      data: error.response?.data,
      url: error.config?.url,
    });
    if (error.response?.status === 401) {
      console.error(
        'Crestune API authentication failed'
      );
    }

    if (error.response?.status === 403) {
      console.error(
        'Crestune API authorization failed'
      );
    }
    return Promise.reject(error);
  }
);

// SUBSCRIPTION API
export const subscriptionApi = {
  // PLANS
  getPlans: async (params = {}) => {
    const response = await SubscriptionApi.get(
      '/subscription-plans',
      { params }
    );
    return response.data;
  },

  getPlan: async (id) => {
    const response = await SubscriptionApi.get(
      `/subscription-plans/${id}`
    );
    return response.data;
  },

  createPlan: async (data) => {
    const response = await SubscriptionApi.post(
      '/subscription-plans',
      data
    );
    return response.data;
  },

  updatePlan: async (id, data) => {
    const response = await SubscriptionApi.put(
      `/subscription-plans/${id}`,
      data
    );
    return response.data;
  },

  deletePlan: async (id) => {
    const response = await SubscriptionApi.delete(
      `/subscription-plans/${id}`
    );
    return response.data;
  },

  togglePlan: async (id) => {
    const response = await SubscriptionApi.patch(
      `/subscription-plans/${id}/toggle`
    );
    return response.data;
  },

  // SUBSCRIPTIONS
  getSubscriptions: async (params = {}) => {
    const response = await SubscriptionApi.get(
      '/subscriptions',
      { params }
    );
    return response.data;
  },

  getSubscription: async (id) => {
    const response = await SubscriptionApi.get(
      `/subscriptions/${id}`
    );
    return response.data;
  },

  getMySubscription: async () => {
    const response = await SubscriptionApi.get(
      '/subscriptions/me'
    );
    return response.data;
  },

  updateSubscriptionStatus: async (id, status) => {
    const response = await SubscriptionApi.put(
      `/subscriptions/${id}/status`,
      { status }
    );
    return response.data;
  },

  cancelSubscription: async (id) => {
    const response = await SubscriptionApi.post(
      `/subscriptions/${id}/cancel`
    );
    return response.data;
  },

  // PAYMENTS
  getPayments: async (params = {}) => {
    const response = await SubscriptionApi.get(
      '/payments',
      { params }
    );
    return response.data;
  },

  getPayment: async (id) => {
    const response = await SubscriptionApi.get(
      `/payments/${id}`
    );
    return response.data;
  },

  getMyPayments: async (params = {}) => {
    const response = await SubscriptionApi.get(
      '/payments/me',
      { params }
    );
    return response.data;
  },
};

export default SubscriptionApi;



// import axios from 'axios';
// import useAuthStore from '../../../stores/shared/useAuthStore';

// const SubscriptionApi = axios.create({
//   baseURL: import.meta.env.VITE_SUBSCRIPTION_API_SUPER,
//   timeout: 30000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// SubscriptionApi.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// SubscriptionApi.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.error('Subscription API authentication failed');
//     }
//     return Promise.reject(error);
//   }
// );

// export const subscriptionApi = {

//   // PLANS
//   getPlans: async () => {
//     const response = await SubscriptionApi.get('/api/subscription-plans');
//     return response.data;
//   },

//   createPlan: async (data) => {
//     const response = await SubscriptionApi.post(
//       '/api/subscription-plans',
//       data
//     );
//     return response.data;
//   },

//   updatePlan: async (id, data) => {
//     const response = await SubscriptionApi.put(
//       `/api/subscription-plans/${id}`,
//       data
//     );
//     return response.data;
//   },

//   deletePlan: async (id) => {
//     const response = await SubscriptionApi.delete(
//       `/api/subscription-plans/${id}`
//     );
//     return response.data;
//   },

//   // SUBSCRIPTIONS
//   getSubscriptions: async (params = {}) => {
//     const response = await SubscriptionApi.get(
//       '/api/subscriptions',
//       { params }
//     );
//     return response.data;
//   },

//   getSubscription: async (id) => {
//     const response = await SubscriptionApi.get(
//       `/api/subscriptions/${id}`
//     );
//     return response.data;
//   },

//   updateSubscriptionStatus: async (id, status) => {
//     const response = await SubscriptionApi.put(
//       `/api/subscriptions/${id}/status`,
//       { status }
//     );
//     return response.data;
//   },

//   cancelSubscription: async (id) => {
//     const response = await SubscriptionApi.post(
//       `/api/subscriptions/${id}/cancel`
//     );
//     return response.data;
//   },

//   // PAYMENTS
//   getPayments: async (params = {}) => {
//     const response = await SubscriptionApi.get(
//       '/api/payments',
//       { params }
//     );
//     return response.data;
//   },

//   getPayment: async (id) => {
//     const response = await SubscriptionApi.get(
//       `/api/payments/${id}`
//     );

//     return response.data;
//   },

// };

// export default SubscriptionApi;
