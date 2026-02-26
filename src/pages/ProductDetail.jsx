import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductDetail, clearSelectedProduct } from '../store/productsSlice';
import Loader from '../components/Loader';
import './ProductDetail.css';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedProduct, detailLoading, detailError } = useSelector(
        (state) => state.products
    );

    useEffect(() => {
        dispatch(fetchProductDetail(id));
        return () => dispatch(clearSelectedProduct());
    }, [id, dispatch]);

    if (detailLoading) return <Loader text="Loading product details..." />;

    if (detailError) {
        return (
            <div className="detail-page">
                <div className="detail-error">
                    <span className="error-icon-large">😵</span>
                    <h2>Product Not Found</h2>
                    <p>{detailError}</p>
                    <button className="back-btn" onClick={() => navigate('/')}>
                        ← Back to Products
                    </button>
                </div>
            </div>
        );
    }

    if (!selectedProduct) return null;

    const product = selectedProduct;
    const statusColor = {
        Alive: '#00e676',
        Dead: '#ff5252',
        unknown: '#ffc107',
    };

    return (
        <div className="detail-page">
            <button className="back-btn" onClick={() => navigate('/')}>
                ← Back to Products
            </button>

            <div className="detail-card">
                <div className="detail-image-section">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="detail-image"
                    />
                    <div className="image-glow"></div>
                </div>

                <div className="detail-info-section">
                    <div className="detail-header">
                        <h1 className="detail-name">{product.name}</h1>
                        <span
                            className="detail-status"
                            style={{ background: statusColor[product.status] || '#888' }}
                        >
                            {product.status}
                        </span>
                    </div>

                    <div className="detail-price">
                        ${(product.id * 149.99 + 99.99).toFixed(2)}
                    </div>

                    <div className="detail-attributes">
                        <div className="attribute">
                            <span className="attr-label">Species</span>
                            <span className="attr-value">{product.species}</span>
                        </div>
                        <div className="attribute">
                            <span className="attr-label">Gender</span>
                            <span className="attr-value">{product.gender}</span>
                        </div>
                        <div className="attribute">
                            <span className="attr-label">Origin</span>
                            <span className="attr-value">{product.origin?.name}</span>
                        </div>
                        <div className="attribute">
                            <span className="attr-label">Location</span>
                            <span className="attr-value">{product.location?.name}</span>
                        </div>
                        <div className="attribute">
                            <span className="attr-label">Type</span>
                            <span className="attr-value">{product.type || 'N/A'}</span>
                        </div>
                        <div className="attribute">
                            <span className="attr-label">Total Episodes</span>
                            <span className="attr-value">{product.episode?.length}</span>
                        </div>
                    </div>

                    {product.episodeDetails && product.episodeDetails.length > 0 && (
                        <div className="detail-episodes">
                            <h3 className="episodes-title">Featured Episodes</h3>
                            <div className="episodes-list">
                                {product.episodeDetails.map((ep) => (
                                    <div key={ep.id} className="episode-chip">
                                        <span className="ep-code">{ep.episode}</span>
                                        <span className="ep-name">{ep.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button className="add-to-cart-btn">
                        🛒 Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
