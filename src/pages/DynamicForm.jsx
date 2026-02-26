import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchFormFields,
    setFieldValue,
    setErrors,
    setSubmitted,
    resetForm,
} from '../store/formSlice';
import Loader from '../components/Loader';
import './DynamicForm.css';

function DynamicForm() {
    const dispatch = useDispatch();
    const { fields, values, errors, loading, error, submitted } = useSelector(
        (state) => state.form
    );

    useEffect(() => {
        if (fields.length === 0) {
            dispatch(fetchFormFields());
        }
    }, [dispatch, fields.length]);

    const getFieldKey = (field) => field.name || field.label;

    const handleChange = (field, value) => {
        const key = getFieldKey(field);
        dispatch(setFieldValue({ name: key, value }));
    };

    const validate = () => {
        const newErrors = {};
        fields.forEach((field) => {
            const key = getFieldKey(field);
            const isMandatory = field.mandatory || field.required;
            if (isMandatory) {
                const val = values[key];
                if (field.type === 'checkbox') {
                    if (!val) {
                        newErrors[key] = `${field.label} is required`;
                    }
                } else if (!val || (typeof val === 'string' && val.trim() === '')) {
                    newErrors[key] = `${field.label} is required`;
                }
            }
            if (field.type === 'email' && values[key]) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(values[key])) {
                    newErrors[key] = 'Please enter a valid email address';
                }
            }
        });
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            dispatch(setErrors(validationErrors));
            return;
        }
        dispatch(setErrors({}));
        dispatch(setSubmitted(true));
        console.log('Form submitted with values:', values);
    };

    const handleReset = () => {
        dispatch(resetForm());
        dispatch(fetchFormFields());
    };

    if (loading) return <Loader text="Loading form fields..." />;

    if (error) {
        return (
            <div className="form-page">
                <div className="form-error">
                    <span className="error-icon-large">⚠️</span>
                    <h2>Error Loading Form</h2>
                    <p>{error}</p>
                    <button className="retry-btn" onClick={() => dispatch(fetchFormFields())}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const renderField = (field) => {
        const key = getFieldKey(field);
        const isMandatory = field.mandatory || field.required;
        const hasError = errors[key];

        const commonProps = {
            id: key,
            name: key,
            className: `form-input ${hasError ? 'input-error' : ''}`,
        };

        switch (field.type) {
            case 'select':
                return (
                    <select
                        {...commonProps}
                        value={values[key] || ''}
                        onChange={(e) => handleChange(field, e.target.value)}
                    >
                        <option value="">Select an option...</option>
                        {(field.options || []).map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                );

            case 'textarea':
                return (
                    <textarea
                        {...commonProps}
                        rows={4}
                        placeholder={field.placeholder || ''}
                        value={values[key] || ''}
                        onChange={(e) => handleChange(field, e.target.value)}
                    />
                );

            case 'checkbox':
                return (
                    <div className="checkbox-wrapper">
                        <input
                            type="checkbox"
                            id={key}
                            name={key}
                            className="checkbox-input"
                            checked={values[key] || false}
                            onChange={(e) => handleChange(field, e.target.checked)}
                        />
                        <label htmlFor={key} className="checkbox-label">
                            {field.label}
                            {isMandatory && <span className="required-star"> *</span>}
                        </label>
                    </div>
                );

            default:
                return (
                    <input
                        {...commonProps}
                        type={field.type || 'text'}
                        placeholder={field.placeholder || ''}
                        value={values[key] || ''}
                        onChange={(e) => handleChange(field, e.target.value)}
                    />
                );
        }
    };

    if (submitted) {
        return (
            <div className="form-page">
                <div className="success-card">
                    <div className="success-icon">✅</div>
                    <h2>Form Submitted Successfully!</h2>
                    <p>Your data has been received. Thank you!</p>
                    <div className="submitted-data">
                        <h3>Submitted Data:</h3>
                        {Object.entries(values).map(([key, val]) => (
                            <div key={key} className="data-row">
                                <span className="data-key">{key}:</span>
                                <span className="data-value">{String(val)}</span>
                            </div>
                        ))}
                    </div>
                    <button className="retry-btn" onClick={handleReset}>
                        Submit Another Response
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="form-page">
            <div className="form-header">
                <h1 className="form-title">Dynamic Form</h1>
                <p className="form-subtitle">
                    Fields generated dynamically from an external API
                </p>
            </div>

            <form className="dynamic-form" onSubmit={handleSubmit} noValidate>
                {fields.map((field, index) => {
                    const key = getFieldKey(field);
                    const isMandatory = field.mandatory || field.required;

                    if (field.type === 'checkbox') {
                        return (
                            <div key={key || index} className="form-group">
                                {renderField(field)}
                                {errors[key] && (
                                    <span className="field-error">{errors[key]}</span>
                                )}
                            </div>
                        );
                    }

                    return (
                        <div key={key || index} className="form-group">
                            <label htmlFor={key} className="form-label">
                                {field.label}
                                {isMandatory && <span className="required-star"> *</span>}
                            </label>
                            {renderField(field)}
                            {errors[key] && (
                                <span className="field-error">{errors[key]}</span>
                            )}
                        </div>
                    );
                })}

                <div className="form-actions">
                    <button type="submit" className="submit-btn">
                        Submit Form
                    </button>
                    <button type="button" className="reset-btn" onClick={handleReset}>
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
}

export default DynamicForm;
