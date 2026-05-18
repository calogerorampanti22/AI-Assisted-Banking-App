import React, { useState } from 'react';

interface PasswordFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    placeholder?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ id, label, value, onChange, required = false, placeholder = '' }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="form-group">
            <label className="form-label" htmlFor={id}>{label}</label>
            <div style={{ position: 'relative' }}>
                <input
                    id={id}
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                    placeholder={placeholder}
                    style={{ paddingRight: '2.5rem' }}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    aria-label={showPassword ? "Nascondi password" : "Mostra password"}
                >
                    <span className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></span>
                </button>
            </div>
        </div>
    );
};

export default PasswordField;
