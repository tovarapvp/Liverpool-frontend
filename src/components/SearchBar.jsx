import './SearchBar.css';

function SearchBar({ value, onChange, onSearch }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search products..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                {value && (
                    <button
                        type="button"
                        className="clear-btn"
                        onClick={() => { onChange(''); onSearch(''); }}
                        aria-label="Clear search"
                    >
                        ✕
                    </button>
                )}
            </div>
            <button type="submit" className="search-btn">
                Search
            </button>
        </form>
    );
}

export default SearchBar;
