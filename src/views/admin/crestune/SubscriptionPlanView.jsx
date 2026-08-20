import React, { useEffect, useState } from 'react';
import { Card, Button, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import subscriptionApi from '../../../services/SynerphixPdts/crestune/subscriptionPlanApi';

const SubscriptionPlansView = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadPlans = async () => {
    try {
      setLoading(true);
      const result = await subscriptionApi.getPlans();
      setPlans(result.data || []);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
        'Failed to load subscription plans'
      );

    } finally {
      setLoading(false);

    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const deletePlan = async (id) => {
    if (!window.confirm(
      'Are you sure you want to delete this plan?'
    )) {
      return;
    }

    try {
      await subscriptionApi.deletePlan(id);
      toast.success('Plan deleted');
      loadPlans();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Failed to delete plan'
      );
    }
  };

  const togglePlan = async (id) => {
    try {
      await subscriptionApi.togglePlan(id);
      toast.success('Plan status updated');
      loadPlans();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Failed to update plan'
      );
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Subscription Plans</h2>
          <p className="text-muted">
            Manage plans available to customers.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() =>
            navigate('/admin/subscriptions/plans/new')
          }
        >
          + Add Plan
        </Button>
      </div>
      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner />
            </div>
          ) : plans.length === 0 ? (
            <Alert variant="info">
              No subscription plans have been created.
            </Alert>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Interval</th>
                  <th>Trial</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map(plan => (
                  <tr key={plan.id}>
                    <td>
                      <strong>{plan.name}</strong>
                    </td>
                    <td>
                      {plan.currency} {plan.price}
                    </td>
                    <td>
                      {plan.interval}
                    </td>
                    <td>
                      {plan.trialDays || 0} days
                    </td>

                    <td>
                      {plan.isActive ? (
                        <Badge bg="success">
                          Active
                        </Badge>
                      ) : (
                        <Badge bg="secondary">
                          Inactive
                        </Badge>
                      )}
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() =>
                          navigate(
                            `/admin/subscriptions/plans/${plan.id}/edit`
                          )
                        }
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant={
                          plan.isActive
                            ? 'outline-warning'
                            : 'outline-success'
                        }
                        className="me-2"
                        onClick={() =>
                          togglePlan(plan.id)
                        }
                      >
                        {plan.isActive
                          ? 'Disable'
                          : 'Enable'}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() =>
                          deletePlan(plan.id)
                        }
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default SubscriptionPlansView;

