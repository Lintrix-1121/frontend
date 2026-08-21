import axios from 'axios';

const ApiService = axios.create({
    baseURL: import.meta.env.VITE_API_SUPER,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

//Attach authentication token
ApiService.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle authentication failures
ApiService.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error(
                'Subscription API authentication failed:',
                error.response.data
            );
        }
        return Promise.reject(error);
    }
);

const subscriptionApi = {
    // SUBSCRIPTION PLANS
    getPlans: async (params = {}) => {
        const response = await ApiService.get(
            '/subscription-plans',
            { params }
        );
        return response.data;
    },

    getActivePlans: async () => {
        const response = await ApiService.get(
            '/subscription-plans',
            {
                params: {
                    isActive: true
                }
            }
        );
        return response.data;
    },

    getPlan: async (id) => {
        const response = await ApiService.get(
            `/subscription-plans/${id}`
        );
        return response.data;
    },

    createPlan: async (data) => {
        const response = await ApiService.post(
            '/subscription-plans',
            data
        );
        return response.data;
    },

    updatePlan: async (id, data) => {
        const response = await ApiService.put(
            `/subscription-plans/${id}`,
            data
        );
        return response.data;
    },

    deletePlan: async (id) => {
        const response = await ApiService.delete(
            `/subscription-plans/${id}`
        );
        return response.data;
    },

    togglePlan: async (id) => {
        const response = await ApiService.patch(
            `/subscription-plans/${id}/toggle`
        );
        return response.data;
    },

    // SUBSCRIPTIONS
    getSubscriptions: async (params = {}) => {
        const response = await ApiService.get(
            '/subscriptions',
            { params }
        );
        return response.data;
    },

    getSubscription: async (id) => {
        const response = await ApiService.get(
            `/subscriptions/${id}`
        );
        return response.data;
    },

    getMySubscription: async () => {
        const response = await ApiService.get(
            '/subscriptions/me'
        );
        return response.data;
    },

    cancelSubscription: async (id) => {
        const response = await ApiService.post(
            `/subscriptions/${id}/cancel`
        );
        return response.data;
    },

    // PAYMENTS
    getPayments: async (params = {}) => {
        const response = await ApiService.get(
            '/payments',
            { params }
        );
        return response.data;
    },

    getPayment: async (id) => {
        const response = await ApiService.get(
            `/payments/${id}`
        );
        return response.data;
    },

    getMyPayments: async (params = {}) => {
        const response = await ApiService.get(
            '/payments/me',
            { params }
        );
        return response.data;
    }
};

export default subscriptionApi;












// import axios from 'axios';

// const ApiService = axios.create({
//     baseURL: import.meta.env.VITE_API_SUPER,
//     timeout: 30000
// });

// ApiService.interceptors.request.use(
//     (config) => {
//         const token =
//             localStorage.getItem('authToken');
//         if (token) {
//             config.headers.Authorization =
//                 `Bearer ${token}`;
//         }
//         return config;
//     }
// );


// const subscriptionApi = {
//   getPlans: async () => {
//     const response = await ApiService.get('/subscription-plans');
//     return response.data;
//   },

//   getPlan: async (id) => {
//     const response = await ApiService.get(`/subscription-plans/${id}`);
//     return response.data;
//   },

//   createPlan: async (data) => {
//     const response = await ApiService.post(
//       '/subscription-plans',
//       data
//     );
//     return response.data;
//   },

//   updatePlan: async (id, data) => {
//     const response = await ApiService.put(
//       `/subscription-plans/${id}`,
//       data
//     );
//     return response.data;
//   },

//   deletePlan: async (id) => {
//     const response = await ApiService.delete(
//       `/subscription-plans/${id}`
//     );
//     return response.data;
//   },

//   togglePlan: async (id) => {
//     const response = await ApiService.patch(
//       `/subscription-plans/${id}/toggle`
//     );
//     return response.data;
//   },

//   getSubscriptions: async (params = {}) => {
//     const response = await ApiService.get(
//       '/subscriptions',
//       { params }
//     );
//     return response.data;
//   },

//   getSubscription: async (id) => {
//     const response = await ApiService.get(
//       `/subscriptions/${id}`
//     );
//     return response.data;
//   },

//   getPayments: async (params = {}) => {
//     const response = await ApiService.get(
//       '/payments',
//       { params }
//     );
//     return response.data;
//   },

//   getPayment: async (id) => {
//     const response = await ApiService.get(
//       `/payments/${id}`
//     );
//     return response.data;
//   }

// };

// export default subscriptionApi;

