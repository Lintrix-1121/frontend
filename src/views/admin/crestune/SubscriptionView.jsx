import React, { useEffect, useMemo, useState } from 'react';
import {  Badge, Button, Card, Col, Form, Modal, Row, Spinner, Table } from 'react-bootstrap';
import toast from 'react-hot-toast';
import subscriptionApi from '../../../services/SynerphixPdts/crestune/subscriptionApi';

const SubscriptionView = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await subscriptionApi.getSubscriptions({
        search,
        status: statusFilter
      });
      setSubscriptions(
        response?.data ||
        response?.subscriptions ||
        []
      );

    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
        'Failed to load subscriptions'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, [statusFilter]);

  const filteredSubscriptions = useMemo(() => {
    if (!search.trim()) {
      return subscriptions;
    }
    const value = search.toLowerCase();
    return subscriptions.filter((subscription) => {
      return (
        String(subscription.id || '')
          .toLowerCase()
          .includes(value) ||
        String(subscription.userId || '')
          .toLowerCase()
          .includes(value) ||
        String(subscription.provider || '')
          .toLowerCase()
          .includes(value) ||
        String(subscription.status || '')
          .toLowerCase()
          .includes(value)
      );
    });
  }, [subscriptions, search]);

  const handleStatusChange = async (subscription, status) => {
    if (!window.confirm(
      `Change subscription status to "${status}"?`
    )) {
      return;
    }
    try {
      await subscriptionApi.updateSubscriptionStatus(
        subscription.id,
        status
      );
      toast.success('Subscription status updated');
      loadSubscriptions();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Failed to update subscription'
      );

    }
  };

  const handleCancel = async (subscription) => {
    if (!window.confirm(
      'Are you sure you want to cancel this subscription?'
    )) {
      return;
    }
    try {
      await subscriptionApi.cancelSubscription(
        subscription.id
      );
      toast.success('Subscription cancelled');
      loadSubscriptions();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Failed to cancel subscription'
      );
    }
  };

  const getStatusVariant = (status) => {
    switch (String(status).toLowerCase()) {
      case 'active':
        return 'success';
      case 'trialing':
      case 'trial':
        return 'info';
      case 'expired':
        return 'secondary';
      case 'cancelled':
      case 'canceled':
        return 'danger';
      case 'past_due':
        return 'warning';
      default:
        return 'dark';
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString();
  };

  return (
    <div className="container-fluid py-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            Subscriptions
          </h2>
          <p className="text-muted mb-0">
            Manage customer subscriptions and trial periods.
          </p>
        </div>

        <Button
          variant="outline-primary"
          onClick={loadSubscriptions}
        >
          Refresh
        </Button>
      </div>

      {/* STATISTICS */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <small className="text-muted">
                Total Subscriptions
              </small>
              <h3 className="mt-2 mb-0">
                {subscriptions.length}
              </h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <small className="text-muted">
                Active
              </small>
              <h3 className="mt-2 mb-0 text-success">
                {
                  subscriptions.filter(
                    s => s.status === 'active'
                  ).length
                }
              </h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <small className="text-muted">
                Trial
              </small>
              <h3 className="mt-2 mb-0 text-info">
                {
                  subscriptions.filter(
                    s =>
                      s.status === 'trial' ||
                      s.status === 'trialing'
                  ).length
                }
              </h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <small className="text-muted">
                Cancelled
              </small>
              <h3 className="mt-2 mb-0 text-danger">
                {
                  subscriptions.filter(
                    s =>
                      s.status === 'cancelled' ||
                      s.status === 'canceled'
                  ).length
                }
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* FILTERS */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Label>
                Search
              </Form.Label>
              <Form.Control
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user ID, subscription ID or provider..."
              />
            </Col>
            <Col md={3}>
              <Form.Label>
                Status
              </Form.Label>
              <Form.Select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >
                <option value="">
                  All statuses
                </option>
                <option value="trial">
                  Trial
                </option>
                <option value="active">
                  Active
                </option>
                <option value="expired">
                  Expired
                </option>
                <option value="cancelled">
                  Cancelled
                </option>
              </Form.Select>
            </Col>

            <Col md={3} className="d-flex align-items-end">
              <Button
                className="w-100"
                onClick={loadSubscriptions}
              >
                Apply Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* TABLE */}
      <Card className="shadow-sm">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p className="mt-3 text-muted">
                Loading subscriptions...
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table
                hover
                responsive
                className="mb-0 align-middle"
              >
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Trial End</th>
                    <th>Period End</th>
                    <th>Provider</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-5 text-muted"
                      >
                        No subscriptions found.
                      </td>
                    </tr>
                  ) : (
                    filteredSubscriptions.map(
                      (subscription) => (
                        <tr key={subscription.id}>
                          <td>
                            <small>
                              {subscription.id}
                            </small>
                          </td>
                          <td>
                            {subscription.userId}
                          </td>
                          <td>
                            {subscription.planId}
                          </td>
                          <td>
                            <Badge
                              bg={getStatusVariant(
                                subscription.status
                              )}
                            >
                              {subscription.status}
                            </Badge>
                          </td>
                          <td>
                            {formatDate(
                              subscription.trialEnd
                            )}
                          </td>
                          <td>
                            {formatDate(
                              subscription.currentPeriodEnd
                            )}
                          </td>
                          <td>
                            {subscription.provider || '-'}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => {
                                  setSelectedSubscription(
                                    subscription
                                  );
                                  setShowDetails(true);
                                }}
                              >
                                View
                              </Button>
                              {subscription.status !== 'active' && (
                                <Button
                                  size="sm"
                                  variant="outline-success"
                                  onClick={() =>
                                    handleStatusChange(
                                      subscription,
                                      'active'
                                    )
                                  }
                                >
                                  Activate
                                </Button>
                              )}
                              {subscription.status === 'active' && (
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() =>
                                    handleCancel(
                                      subscription
                                    )
                                  }
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* DETAILS MODAL */}
      <Modal
        show={showDetails}
        onHide={() => setShowDetails(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Subscription Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSubscription && (
            <Row className="g-3">
              <Col md={6}>
                <strong>Subscription ID</strong>
                <div>
                  {selectedSubscription.id}
                </div>
              </Col>
              <Col md={6}>
                <strong>User ID</strong>
                <div>
                  {selectedSubscription.userId}
                </div>
              </Col>
              <Col md={6}>
                <strong>Plan ID</strong>
                <div>
                  {selectedSubscription.planId}
                </div>
              </Col>
              <Col md={6}>
                <strong>Status</strong>
                <div>
                  <Badge
                    bg={getStatusVariant(
                      selectedSubscription.status
                    )}
                  >
                    {selectedSubscription.status}
                  </Badge>
                </div>
              </Col>
              <Col md={6}>
                <strong>Trial Start</strong>
                <div>
                  {formatDate(
                    selectedSubscription.trialStart
                  )}
                </div>
              </Col>
              <Col md={6}>
                <strong>Trial End</strong>
                <div>
                  {formatDate(
                    selectedSubscription.trialEnd
                  )}
                </div>
              </Col>
              <Col md={6}>
                <strong>Period Start</strong>
                <div>
                  {formatDate(
                    selectedSubscription.currentPeriodStart
                  )}
                </div>
              </Col>
              <Col md={6}>
                <strong>Period End</strong>
                <div>
                  {formatDate(
                    selectedSubscription.currentPeriodEnd
                  )}
                </div>
              </Col>
              <Col md={6}>
                <strong>Payment Provider</strong>
                <div>
                  {selectedSubscription.provider}
                </div>
              </Col>
              <Col md={6}>
                <strong>Provider Subscription ID</strong>
                <div>
                  {selectedSubscription.providerSubscriptionId || '-'}
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDetails(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SubscriptionView;

