import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
class ErrorBoundary extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            hasError: false,
            error: null
        };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (_jsxs("div", { style: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: '20px',
                    textAlign: 'center',
                    fontFamily: 'system-ui, sans-serif'
                }, children: [_jsx("h1", { style: { color: '#EF4444', marginBottom: '20px' }, children: "\u0110\u00E3 x\u1EA3y ra l\u1ED7i" }), _jsx("p", { style: { color: '#6B7280', marginBottom: '20px' }, children: this.state.error?.message || 'Có lỗi không xác định xảy ra' }), _jsx("button", { onClick: () => {
                            this.setState({ hasError: false, error: null });
                            window.location.href = '/';
                        }, style: {
                            padding: '10px 20px',
                            backgroundColor: '#2260ff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }, children: "T\u1EA3i l\u1EA1i trang" })] }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
