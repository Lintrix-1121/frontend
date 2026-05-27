import { useEffect, useState } from "react";
import CartService from "../../services/CartService";
import HorizontalNav from "../HorizontalNav";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await CartService.getCart();
      setCart(cartData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQty = async (productId, qty) => {
    if (qty < 1) return;
    await CartService.updateCartItem(productId, qty);
    loadCart();
  };

  const removeItem = async (productId) => {
    await CartService.removeFromCart(productId);
    loadCart();
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" />
      </div>
    );
  } 

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h4>Your cart is empty</h4>
      </div>
    );
  }

  return (
    <div>
      {/* <h2 className="text-center mb-4">Cart</h2> */}
       <section className="bg-success bg-gradient py-3">
        <div className="container py-1">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-4 fw-bold text-white mb-4">
                Your <span className="text-warning">Cart</span>
              </h1>
              <p className="lead text-white mb-0">
                Shop more with your Authorised LPG distributer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-5">

      <table className="table align-middle">
        <thead className="border-bottom">
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th style={{ width: 140 }}>Quantity</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {cart.items.map((item) => (
            <tr key={item.productId}>
              <td className="d-flex align-items-center gap-3">
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                  width="60"
                />
                <div>
                  <div className="fw-medium">{item.name}</div>
                  {item.sku && (
                    <small className="text-muted">{item.sku}</small>
                  )}
                </div>
              </td>

              <td>USh {item.price.toFixed(2)}</td>

              <td>
                <div className="d-flex align-items-center border rounded">
                  <button
                    className="btn btn-sm"
                    onClick={() =>
                      updateQty(item.productId, item.quantity - 1)
                    }
                  >
                    −
                  </button>
                  <span className="px-2">{item.quantity}</span>
                  <button
                    className="btn btn-sm"
                    onClick={() =>
                      updateQty(item.productId, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </td>

              <td>
                USh {(item.price * item.quantity).toFixed(2)}
              </td>

              <td>
                <button
                  className="btn btn-link text-danger"
                  onClick={() => removeItem(item.productId)}
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="row justify-content-end">
        <div className="col-md-4">
          <div className="border-top pt-3">
            <div className="d-flex justify-content-between">
              <span>Subtotal</span>
              <strong>USh {cart.totalAmount.toFixed(2)}</strong>
            </div>

            <div className="d-flex justify-content-between mt-2 fs-5">
              <span>Total</span>
              <strong>USh {cart.totalAmount.toFixed(2)}</strong>
            </div>

            <button className="btn btn-dark w-100 mt-3">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
      </div>

    </div>
  );
}
