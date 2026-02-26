import { useEffect, useCallback, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, setSearchTerm, resetProducts } from '../store/productsSlice';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';
import './ProductList.css';

function ProductList() {
    const dispatch = useDispatch();
    const { items, loading, error, hasMore, searchTerm, currentPage } = useSelector(
        (state) => state.products
    );
    const [localSearch, setLocalSearch] = useState(searchTerm);
    const observerRef = useRef(null);
    const loadingRef = useRef(false);

    useEffect(() => {
        if (items.length === 0 && !loading) {
            dispatch(fetchProducts({ page: 1, name: searchTerm }));
        }
    }, []);

    const lastCardRef = useCallback(
        (node) => {
            if (loading) return;
            if (observerRef.current) observerRef.current.disconnect();

            observerRef.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
                        loadingRef.current = true;
                        dispatch(fetchProducts({ page: currentPage, name: searchTerm })).then(() => {
                            loadingRef.current = false;
                        });
                    }
                },
                { threshold: 0.1 }
            );

            if (node) observerRef.current.observe(node);
        },
        [loading, hasMore, currentPage, searchTerm, dispatch]
    );

    const handleSearch = (overrideValue) => {
        const term = typeof overrideValue === 'string' ? overrideValue : localSearch;
        dispatch(setSearchTerm(term));
        dispatch(resetProducts());
        dispatch(fetchProducts({ page: 1, name: term }));
    };

    return (
        <div className="product-list-page">
            <div className="page-header">
                <h1 className="page-title">Explore Products</h1>
                <p className="page-subtitle">
                    Discover our collection of unique characters from the multiverse
                </p>
            </div>

            <SearchBar
                value={localSearch}
                onChange={setLocalSearch}
                onSearch={handleSearch}
            />

            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    <p>{error}</p>
                </div>
            )}

            {items.length === 0 && !loading && !error && (
                <div className="empty-state">
                    <span className="empty-icon">🔍</span>
                    <h3>No products found</h3>
                    <p>Try a different search term</p>
                </div>
            )}

            <div className="products-grid">
                {items.map((product, index) => {
                    if (index === items.length - 1) {
                        return (
                            <div ref={lastCardRef} key={product.id}>
                                <ProductCard product={product} />
                            </div>
                        );
                    }
                    return <ProductCard key={product.id} product={product} />;
                })}
            </div>

            {loading && <Loader text="Loading products..." />}

            {!hasMore && items.length > 0 && (
                <p className="end-message">You've reached the end of the multiverse! 🌌</p>
            )}
        </div>
    );
}

export default ProductList;
