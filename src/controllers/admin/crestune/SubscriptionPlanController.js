import { subscriptionPlanApi } from '../../../services/SynerphixPdts/crestune/subscriptionPlanApi';

class SubscriptionPlanController {
    async getPlans() {
        const response =
            await subscriptionPlanApi.getAll();
        return response.data || [];
    }

    async createPlan(data) {
        const response =
            await subscriptionPlanApi.create(data);
        return response.data;
    }

    async updatePlan(id, data) {
        const response =
            await subscriptionPlanApi.update(
                id,
                data
            );
        return response.data;
    }

    async togglePlan(id) {
        const response =
            await subscriptionPlanApi.toggleStatus(id);
        return response.data;
    }

    async deletePlan(id) {
        return subscriptionPlanApi.delete(id);
    }
}

export default new SubscriptionPlanController();

