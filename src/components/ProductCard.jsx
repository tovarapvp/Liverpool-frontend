import { Link } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ product }) {
    const statusColor = {
        Alive: '#00e676',
        Dead: '#ff5252',
        unknown: '#ffc107',
    };

    return (
        <Link to={`/product/${product.id}`} className="product-card">
            <div className="card-image-wrapper">
                <img
                    src={product.image}
                    alt={product.name}
                    className="card-image"
                    loading="lazy"
                />
                <div className="card-overlay">
                    <span className="view-detail">View Detail →</span>
                </div>
                <span
                    className="status-badge"
                    style={{ background: statusColor[product.status] || '#888' }}
                >
                    {product.status}
                </span>
            </div>
            <div className="card-body">
                <h3 className="card-title">{product.name}</h3>
                <div className="card-meta">
                    <span className="card-species">{product.species}</span>
                    <span className="card-price">
                        ${(product.id * 149.99 + 99.99).toFixed(2)}
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;
