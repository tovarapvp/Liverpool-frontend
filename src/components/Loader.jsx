import './Loader.css';

function Loader({ text = 'Loading...' }) {
    return (
        <div className="loader-container">
            <div className="loader-spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
            </div>
            <p className="loader-text">{text}</p>
        </div>
    );
}

export default Loader;
