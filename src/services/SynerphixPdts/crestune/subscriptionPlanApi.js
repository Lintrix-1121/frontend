import axios from 'axios';

const ApiService = axios.create({
    baseURL: import.meta.env.VITE_API_SUPER,
    timeout: 30000
});

ApiService.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }
        return config;
    }
);


const subscriptionApi = {
  getPlans: async () => {
    const response = await ApiService.get('/subscription-plans');
    return response.data;
  },

  getPlan: async (id) => {
    const response = await ApiService.get(`/subscription-plans/${id}`);
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
  }

};

export default subscriptionApi;



// export const subscriptionPlanApi = {
//     getAll: async () => {
//         const response =
//             await ApiService.get('/subscription-plans');
//         return response.data;
//     },

//     getById: async (id) => {
//         const response =
//             await ApiService.get(
//                 `/subscription-plans/${id}`
//             );
//         return response.data;
//     },

//     create: async (data) => {
//         const response =
//             await ApiService.post(
//                 '/subscription-plans',
//                 data
//             );
//         return response.data;
//     },

//     update: async (id, data) => {
//         const response =
//             await ApiService.put(
//                 `/subscription-plans/${id}`,
//                 data
//             );
//         return response.data;
//     },

//     toggleStatus: async (id) => {
//         const response =
//             await ApiService.patch(
//                 `/subscription-plans/${id}/status`
//             );
//         return response.data;
//     },

//     delete: async (id) => {
//         const response =
//             await ApiService.delete(
//                 `/subscription-plans/${id}`
//             );
//         return response.data;
//     }
// };

