import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PrinterIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  HomeIcon,
  CreditCardIcon,
  ChatBubbleLeftIcon,
  PencilIcon,
  PaperAirplaneIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const OrderDetailView = () => {
  const { id } = useParams();

  const [order, setOrder] = useState({
    id: 1,
    orderNumber: 'ORD-001',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567'
    },
    date: '2024-01-15 14:30',
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card (Visa **** 4242)',
    items: [
      { id: 1, name: 'FREE CHOISING TEST KIT', sku: 'WTK-001', price: 16, quantity: 1, total: 16 },
      { id: 2, name: 'SAFETY CUPS', sku: 'SC-001', price: 1, quantity: 2, total: 2 },
      { id: 3, name: 'WHITE TUBE', sku: 'WT-001', price: 2, quantity: 1, total: 2 }
    ],
    shipping: 5,
    notes: 'Please deliver before 5 PM',
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      phone: '+1 (555) 123-4567'
    },
    billingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    }
  });

  const [updatedOrder, setUpdatedOrder] = useState(order);
  const [status, setStatus] = useState(order.status);
  const [isEditing, setIsEditing] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  const badge = (type) => `badge bg-${type}-subtle text-${type}`;

  const calculateTotals = () => {
    const subtotal = updatedOrder.items.reduce((s, i) => s + i.total, 0);
    const tax = subtotal * 0.075;
    return { subtotal, tax, total: subtotal + tax + updatedOrder.shipping };
  };

  const totals = calculateTotals();

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <Link to="/admin/orders" className="btn btn-light">
            <ArrowLeftIcon width={18} />
          </Link>
          <div>
            <h4 className="mb-0 fw-bold">Order #{order.orderNumber}</h4>
            <small className="text-muted">Placed on {order.date}</small>
          </div>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setIsEditing(!isEditing)}
          >
            <PencilIcon width={16} className="me-1" />
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          <button className="btn btn-outline-secondary" onClick={() => window.print()}>
            <PrinterIcon width={16} className="me-1" />
            Print
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="d-flex gap-2">
            <span className={badge('primary')}>{status}</span>
            <span className={badge('success')}>{order.paymentStatus}</span>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-primary btn-sm">
              <PaperAirplaneIcon width={16} className="me-1" />
              Send Update
            </button>
            <button className="btn btn-success btn-sm">
              <CheckBadgeIcon width={16} className="me-1" />
              Mark Complete
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* LEFT */}
        <div className="col-lg-8">
          {/* Customer */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="fw-semibold mb-3">
                <UserIcon width={18} className="me-2 text-muted" />
                Customer Information
              </h5>
              <div className="row">
                <div className="col-md-4">
                  <small className="text-muted">Name</small>
                  <div>{order.customer.name}</div>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">Email</small>
                  <div>{order.customer.email}</div>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">Phone</small>
                  <div>{order.customer.phone}</div>
                </div>
              </div>

              <div className="mt-3 d-flex gap-3">
                <button className="btn btn-link p-0">
                  <EnvelopeIcon width={16} className="me-1" />
                  Email
                </button>
                <button className="btn btn-link p-0">
                  <ChatBubbleLeftIcon width={16} className="me-1" />
                  Message
                </button>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="card shadow-sm mb-4">
            <div className="card-header fw-semibold">Order Items</div>
            <div className="card-body">
              {updatedOrder.items.map(item => (
                <div key={item.id} className="d-flex justify-content-between border-bottom py-3">
                  <div>
                    <div className="fw-medium">{item.name}</div>
                    <small className="text-muted">SKU: {item.sku}</small>
                  </div>
                  <div className="text-end">
                    <div className="fw-semibold">USh {item.total.toFixed(2)}</div>
                    <small className="text-muted">
                      USh {item.price} × {item.quantity}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Notes */}
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="fw-semibold mb-3">Admin Notes</h5>
              <textarea
                className="form-control"
                rows={4}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
              />
              <div className="text-end mt-3">
                <button className="btn btn-outline-secondary btn-sm">
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-lg-4">
          {/* Shipping */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h6 className="fw-semibold mb-2">
                <TruckIcon width={16} className="me-1" />
                Shipping Address
              </h6>
              <div className="text-muted small">
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                {order.shippingAddress.country}
              </div>

              {order.notes && (
                <div className="alert alert-warning mt-3 p-2 small">
                  <ExclamationTriangleIcon width={16} className="me-1" />
                  {order.notes}
                </div>
              )}
            </div>
          </div>

          {/* Payment */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h6 className="fw-semibold mb-2">
                <CreditCardIcon width={16} className="me-1" />
                Payment
              </h6>
              <div>{order.paymentMethod}</div>
              <span className="badge bg-success-subtle text-success mt-2">
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Summary */}
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Order Summary</h6>

              <div className="d-flex justify-content-between">
                <span>Subtotal</span>
                <span>USh {totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Shipping</span>
                <span>USh {updatedOrder.shipping.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Tax</span>
                <span>USh {totals.tax.toFixed(2)}</span>
              </div>

              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>USh {totals.total.toFixed(2)}</span>
              </div>

              {isEditing && (
                <button className="btn btn-primary w-100 mt-3">
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailView;


