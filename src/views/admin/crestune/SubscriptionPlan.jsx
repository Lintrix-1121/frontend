import React, { useEffect, useState } from 'react';
import { Card, Button, Table, Badge, Modal, Form, Row, Col, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';
import controller from '../../../controllers/admin/crestune/SubscriptionPlanController';

const emptyPlan = {
    name: '',
    price: '',
    currency: 'UGX',
    interval: 'month',
    trialDays: 14,
    isActive: true
};

const SubscriptionPlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [form, setForm] = useState(emptyPlan);
   
    const loadPlans = async () => {
        try {
            setLoading(true);
            const data = await controller.getPlans();
            setPlans(data);
        } catch (error) {
            console.error(error);
            toast.error(
                'Failed to load subscription plans'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPlans();
    }, []);

    const openCreate = () => {
        setEditingPlan(null);
        setForm(emptyPlan);
        setShowModal(true);
    };

    const openEdit = (plan) => {
        setEditingPlan(plan);
        setForm({
            name: plan.name,
            price: plan.price,
            currency: plan.currency,
            interval: plan.interval,
            trialDays: plan.trialDays,
            isActive: plan.isActive
        });
        setShowModal(true);
    };

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
            setSaving(true);
            if (editingPlan) {
                await controller.updatePlan(
                    editingPlan.id,
                    {
                        ...form,
                        price: Number(form.price),
                        trialDays: Number(form.trialDays)
                    }
                );

                toast.success(
                    'Subscription plan updated'
                );
            } else {

                await controller.createPlan({
                    ...form,
                    price: Number(form.price),
                    trialDays: Number(form.trialDays)
                });

                toast.success(
                    'Subscription plan created'
                );
            }
            setShowModal(false);
            await loadPlans();
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message ||
                'Failed to save subscription plan'
            );
        } finally {
            setSaving(false);
        }
    };

    const toggleStatus = async (id) => {
        try {
            await controller.togglePlan(id);
            toast.success(
                'Plan status updated'
            );
            await loadPlans();
        } catch (error) {
            toast.error(
                'Failed to update plan status'
            );
        }
    };

    const deletePlan = async (id) => {
        if (
            !window.confirm(
                'Are you sure you want to delete this plan?'
            )
        ) {
            return;
        }
        try {
            await controller.deletePlan(id);
            toast.success(
                'Plan deleted'
            );
            await loadPlans();
        } catch (error) {
            toast.error(
                'Failed to delete plan'
            );
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>
                        Subscription Plans
                    </h2>
                    <p className="text-muted mb-0">
                        Manage plans available to Lintune users.
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={openCreate}
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

                    ) : (
                        <Table
                            responsive
                            hover
                            bordered
                        >
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Currency</th>
                                    <th>Interval</th>
                                    <th>Trial</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {plans.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="text-center py-4"
                                        >
                                            No subscription plans found.
                                        </td>
                                    </tr>
                                ) : (
                                    plans.map(plan => (
                                        <tr key={plan.id}>
                                            <td>
                                                <strong>
                                                    {plan.name}
                                                </strong>
                                            </td>
                                            <td>
                                                {Number(
                                                    plan.price
                                                ).toLocaleString()}
                                            </td>
                                            <td>
                                                {plan.currency}
                                            </td>
                                            <td>
                                                {plan.interval}
                                            </td>
                                            <td>
                                                {plan.trialDays} days
                                            </td>
                                            <td>
                                                <Badge
                                                    bg={
                                                        plan.isActive
                                                            ? 'success'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {plan.isActive
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Button
                                                    size="sm"
                                                    variant="outline-primary"
                                                    className="me-2"
                                                    onClick={() =>
                                                        openEdit(plan)
                                                    }
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline-warning"
                                                    className="me-2"
                                                    onClick={() =>
                                                        toggleStatus(
                                                            plan.id
                                                        )
                                                    }
                                                >
                                                    {plan.isActive
                                                        ? 'Deactivate'
                                                        : 'Activate'}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    onClick={() =>
                                                        deletePlan(
                                                            plan.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingPlan
                            ? 'Edit Subscription Plan'
                            : 'Create Subscription Plan'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
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
                        <Row>
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
                            <Col md={6}>
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
                                        <option value="KES">
                                            KES
                                        </option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
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

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Trial Days
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        name="trialDays"
                                        value={form.trialDays}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Check
                            type="switch"
                            name="isActive"
                            label="Active"
                            checked={form.isActive}
                            onChange={handleChange}
                        />
                    </Modal.Body>

                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() =>
                                setShowModal(false)
                            }
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={saving}
                        >
                            {saving
                                ? 'Saving...'
                                : 'Save Plan'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default SubscriptionPlans;

