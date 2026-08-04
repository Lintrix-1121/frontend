import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api'; // adjust path
import { Cart } from 'react-bootstrap-icons';
import toast from 'react-hot-toast';
import ProductCard from '../../components/customer/ProductCard'; // for related products

const ProductDetail = () => {
  const { slugOrId } = useParams(); // captures slug or ID from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Try to fetch by slug first; if not found, try by ID
        // Your API might have a single endpoint that accepts both
        // Adjust according to your backend.
        const response = await api.get(`/products/${slugOrId}`);
        const productData = response.data.data;
        setProduct(productData);

        // Fetch related products (same category or similar)
        if (productData.categoryId) {
          const relatedRes = await api.get('/products', {
            params: { categoryId: productData.categoryId, limit: 4 }
          });
          const related = relatedRes.data.data?.products || [];
          // filter out current product
          setRelatedProducts(related.filter(p => p.id !== productData.id));
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Product not found');
        toast.error('Product not found');
        // Optionally navigate back
        // navigate('/shop');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slugOrId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  const handleAddToCart = async () => {
    // Implement add to cart logic (could use a store or context)
    try {
      setIsAddingToCart(true);
      // For example, call a cart API or update context
      // For now, just show toast
      toast.success(`Added ${product.name} to cart`);
      // You can also call onAddToCart prop if needed
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5 text-center">
        <h3>Product Not Found</h3>
        <p>The product you are looking for does not exist.</p>
        <button className="btn btn-primary" onClick={() => navigate('/shop')}>
          Back to Shop
        </button>
      </div>
    );
  }

  const isOnSale = product.isOnSale && product.salePrice && product.salePrice < product.price;
  const discountPercentage = isOnSale ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Image Gallery */}
        <div className="col-md-6">
          <div className="position-relative">
            <img
              src={product.thumbnail || product.images?.[0] || '/placeholder-image.jpg'}
              className="img-fluid rounded"
              alt={product.name}
              style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
            />
            {isOnSale && (
              <span className="position-absolute top-0 start-0 m-3 badge bg-danger">
                -{discountPercentage}%
              </span>
            )}
          </div>
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="d-flex gap-2 mt-3 flex-wrap">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url || img}
                  className="rounded"
                  style={{ width: '60px', height: '60px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => { /* set main image */ }}
                  alt={`Thumbnail ${idx}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="col-md-6">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/shop">Shop</a></li>
              <li className="breadcrumb-item active">{product.category?.name || 'Product'}</li>
            </ol>
          </nav>

          <h1 className="display-6 fw-bold">{product.name}</h1>
          <p className="text-muted">{product.brand && `Brand: ${product.brand}`}</p>

          <div className="mb-3">
            {isOnSale ? (
              <>
                <span className="h3 text-success">{formatPrice(product.salePrice)}</span>
                <span className="text-muted text-decoration-line-through ms-3">{formatPrice(product.price)}</span>
                <span className="badge bg-danger ms-2">-{discountPercentage}%</span>
              </>
            ) : (
              <span className="h3 text-success">{formatPrice(product.price)}</span>
            )}
          </div>

          {/* Stock */}
          <div className="mb-3">
            {product.stockQuantity > 0 ? (
              <span className="text-success">
                <i className="bi bi-check-circle-fill me-1"></i> In Stock ({product.stockQuantity} available)
              </span>
            ) : (
              <span className="text-danger">Out of Stock</span>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <h6>Description</h6>
            <p>{product.description || 'No description available.'}</p>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="d-flex align-items-center border rounded">
              <button
                className="btn btn-outline-secondary border-0"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={product.stockQuantity === 0}
              >
                -
              </button>
              <span className="px-3">{quantity}</span>
              <button
                className="btn btn-outline-secondary border-0"
                onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                disabled={product.stockQuantity === 0}
              >
                +
              </button>
            </div>
            <button
              className="btn btn-success btn-lg flex-grow-1"
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0 || isAddingToCart}
            >
              <Cart size={20} className="me-2" />
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>

          {/* Additional info */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mt-4">
              <h6>Specifications</h6>
              <table className="table table-bordered">
                <tbody>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <tr key={key}>
                      <th className="w-25">{key}</th>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-5">
          <h3 className="mb-4">You May Also Like</h3>
          <div className="row g-4">
            {relatedProducts.map(rel => (
              <div className="col-6 col-md-3" key={rel.id}>
                <ProductCard
                  product={rel}
                  onAddToCart={(product) => toast.success(`Added ${product.name}`)}
                  isInCart={false}
                  basePath="/shop"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;