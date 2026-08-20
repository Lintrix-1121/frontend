import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Row, Col, Spinner } from 'react-bootstrap';

import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import subscriptionApi from '../../../services/SynerphixPdts/crestune/subscriptionPlanApi';

const SubscriptionPlanForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    price: '',
    currency: 'UGX',
    interval: 'month',
    trialDays: 14,
    isActive: true
  });

  useEffect(() => {
    if (!editing) return;
    const loadPlan = async () => {
      try {
        setLoading(true);
        const result =
          await subscriptionApi.getPlan(id);
        const plan = result.data;
        setForm({
          name: plan.name || '',
          price: plan.price || '',
          currency: plan.currency || 'UGX',
          interval: plan.interval || 'month',
          trialDays: plan.trialDays ?? 14,
          isActive: plan.isActive ?? true
        });

      } catch (error) {
        toast.error('Failed to load plan');
      } finally {
        setLoading(false);
      }
    };
    loadPlan();
  }, [id, editing]);

  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;
    setForm(prev => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...form,
        price: Number(form.price),
        trialDays: Number(form.trialDays)
      };
      if (editing) {
        await subscriptionApi.updatePlan(
          id,
          payload
        );
        toast.success('Plan updated');
      } else {
        await subscriptionApi.createPlan(
          payload
        );
        toast.success('Plan created');
      }
      navigate('/admin/subscriptions/plans');
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
        'Failed to save plan'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <Card>
        <Card.Body>
          <h2 className="mb-4">
            {editing
              ? 'Edit Subscription Plan'
              : 'Create Subscription Plan'}
          </h2>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Plan Name
                  </Form.Label>
                  <Form.Control
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Premium"
                    required
                  />

                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Price
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Currency
                  </Form.Label>
                  <Form.Select
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                  >
                    <option value="UGX">
                      UGX
                    </option>
                    <option value="USD">
                      USD
                    </option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Billing Interval
                  </Form.Label>

                  <Form.Select
                    name="interval"
                    value={form.interval}
                    onChange={handleChange}
                  >
                    <option value="month">
                      Monthly
                    </option>
                    <option value="year">
                      Yearly
                    </option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Trial Period
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    name="trialDays"
                    value={form.trialDays}
                    onChange={handleChange}
                  />

                  <Form.Text>
                    Number of free trial days.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Form.Check
              type="switch"
              name="isActive"
              label="Plan is active"
              checked={form.isActive}
              onChange={handleChange}
              className="mb-4"
            />

            <Button
              type="submit"
              disabled={loading}
            >
              {loading
                ? <Spinner size="sm" />
                : editing
                  ? 'Update Plan'
                  : 'Create Plan'}
            </Button>

            <Button
              variant="secondary"
              className="ms-2"
              onClick={() =>
                navigate('/admin/subscriptions/plans')
              }
            >
              Cancel
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SubscriptionPlanForm;

