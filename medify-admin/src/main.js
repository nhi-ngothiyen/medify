import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import './styles/variables.css';
// Ensure root element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
    // If root doesn't exist, create it and show error
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = '<h1>Lỗi: Không tìm thấy phần tử root</h1><p>Vui lòng kiểm tra file index.html</p>';
    errorDiv.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui, sans-serif;';
    document.body.appendChild(errorDiv);
    throw new Error('Root element not found');
}
try {
    ReactDOM.createRoot(rootElement).render(_jsx(React.StrictMode, { children: _jsx(App, {}) }));
}
catch (error) {
    // Fallback error display
    console.error('Error rendering app:', error);
    rootElement.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui, sans-serif; padding: 20px; text-align: center;">
      <h1 style="color: #EF4444; margin-bottom: 20px;">Lỗi khi tải ứng dụng</h1>
      <p style="color: #6B7280; margin-bottom: 20px;">${error instanceof Error ? error.message : 'Có lỗi không xác định'}</p>
      <button onclick="window.location.reload()" style="padding: 10px 20px; background-color: #2260ff; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
        Tải lại trang
      </button>
    </div>
  `;
}
