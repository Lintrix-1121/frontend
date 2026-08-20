import React, { useEffect, useMemo, useState } from 'react';
import { Badge, Button, Card, Col, Form, Modal, Row, Spinner, Table } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { subscriptionApi } from '../../../services/SynerphixPdts/crestune/subscriptionApi';

const PaymentView = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const loadPayments = async () => {
    try {
      setLoading(true);
      const response =
        await subscriptionApi.getPayments({
          status,
          search
        });
      setPayments(
        response?.data ||
        response?.payments ||
        []
      );

    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
        'Failed to load payments'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPayments(); }, [status]);

  const filteredPayments = useMemo(() => {
    if (!search.trim()) {
      return payments;
    }
    const value = search.toLowerCase();
    return payments.filter((payment) => {
      return (
        String(payment.id || '')
          .toLowerCase()
          .includes(value) ||
        String(payment.userId || '')
          .toLowerCase()
          .includes(value) ||
        String(payment.reference || '')
          .toLowerCase()
          .includes(value) ||
        String(payment.providerTransactionId || '')
          .toLowerCase()
          .includes(value)
      );
    });
  }, [payments, search]);

  const getStatusVariant = (value) => {
    switch (String(value).toLowerCase()) {
      case 'successful':
      case 'success':
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'danger';
      case 'cancelled':
      case 'canceled':
        return 'secondary';
      default:
        return 'dark';
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString();
  };

  const formatAmount = (payment) => {
    const amount = Number(
      payment.amount ??
      payment.ammount ??
      0
    );
    return `${payment.currency || ''} ${amount.toFixed(2)}`;
  };

  return (
    <div className="container-fluid py-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            Payments
          </h2>
          <p className="text-muted mb-0">
            Monitor subscription payments and transactions.
          </p>
        </div>

        <Button
          variant="outline-primary"
          onClick={loadPayments}
        >
          Refresh
        </Button>
      </div>

      {/* STATISTICS */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <small className="text-muted">
                Total Payments
              </small>
              <h3 className="mt-2">
                {payments.length}
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <small className="text-muted">
                Successful
              </small>
              <h3 className="text-success mt-2">
                {
                  payments.filter(
                    p =>
                      p.status === 'successful' ||
                      p.status === 'success' ||
                      p.status === 'paid'
                  ).length
                }
              </h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <small className="text-muted">
                Pending
              </small>
              <h3 className="text-warning mt-2">
                {
                  payments.filter(
                    p => p.status === 'pending'
                  ).length
                }
              </h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <small className="text-muted">
                Failed
              </small>
              <h3 className="text-danger mt-2">
                {
                  payments.filter(
                    p => p.status === 'failed'
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
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Reference, transaction ID, user ID..."
              />
            </Col>
            <Col md={3}>
              <Form.Label>
                Status
              </Form.Label>
              <Form.Select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >
                <option value="">
                  All
                </option>
                <option value="successful">
                  Successful
                </option>
                <option value="pending">
                  Pending
                </option>
                <option value="failed">
                  Failed
                </option>
              </Form.Select>
            </Col>

            <Col md={3} className="d-flex align-items-end">
              <Button
                className="w-100"
                onClick={loadPayments}
              >
                Search
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
              <p className="text-muted mt-3">
                Loading payments...
              </p>
            </div>
          ) : (

            <div className="table-responsive">
              <Table
                hover
                className="mb-0 align-middle"
              >
                <thead className="table-light">
                  <tr>
                    <th>Reference</th>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Provider</th>
                    <th>Transaction</th>
                    <th>Paid At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-5 text-muted"
                      >
                        No payments found.
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map(
                      payment => (
                        <tr key={payment.id}>
                          <td>
                            <strong>
                              {payment.reference || '-'}
                            </strong>
                          </td>
                          <td>
                            {payment.userId}
                          </td>
                          <td>
                            {formatAmount(payment)}
                          </td>
                          <td>
                            <Badge
                              bg={getStatusVariant(
                                payment.status
                              )}
                            >
                              {payment.status}
                            </Badge>
                          </td>
                          <td>
                            {payment.provider || '-'}
                          </td>
                          <td>
                            <small>
                              {
                                payment.providerTransactionId ||
                                '-'
                              }
                            </small>
                          </td>
                          <td>
                            {formatDate(payment.paidAt)}
                          </td>
                          <td>
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => {
                                setSelectedPayment(
                                  payment
                                );
                                setShowDetails(true);
                              }}
                            >
                              View
                            </Button>
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
      {/* PAYMENT DETAILS */}

      <Modal
        show={showDetails}
        onHide={() => setShowDetails(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Payment Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPayment && (
            <div>
              <div className="mb-3">
                <strong>Payment ID</strong>
                <div>
                  {selectedPayment.id}
                </div>
              </div>
              <div className="mb-3">
                <strong>User ID</strong>
                <div>
                  {selectedPayment.userId}
                </div>
              </div>
              <div className="mb-3">
                <strong>Subscription ID</strong>
                <div>
                  {selectedPayment.subscriptionId}
                </div>
              </div>
              <div className="mb-3">
                <strong>Reference</strong>
                <div>
                  {selectedPayment.reference}
                </div>
              </div>
              <div className="mb-3">
                <strong>Amount</strong>
                <div>
                  {formatAmount(selectedPayment)}
                </div>
              </div>
              <div className="mb-3">
                <strong>Status</strong>
                <div>
                  <Badge
                    bg={getStatusVariant(
                      selectedPayment.status
                    )}
                  >
                    {selectedPayment.status}
                  </Badge>

                </div>
              </div>
              <div className="mb-3">
                <strong>Provider</strong>
                <div>
                  {selectedPayment.provider}
                </div>
              </div>
              <div className="mb-3">
                <strong>Transaction ID</strong>
                <div>
                  {selectedPayment.providerTransactionId}
                </div>
              </div>
              <div>
                <strong>Paid At</strong>
                <div>
                  {formatDate(
                    selectedPayment.paidAt
                  )}
                </div>
              </div>
            </div>
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

export default PaymentView;

