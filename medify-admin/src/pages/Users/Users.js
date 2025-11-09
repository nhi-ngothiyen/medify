import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { userService } from '../../services/apiService';
import Layout from '../../components/Layout';
import './Users.css';
export default function Users() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const load = async () => {
        try {
            setLoading(true);
            setError(undefined);
            const data = await userService.getAll();
            setItems(data);
        }
        catch (e) {
            setError('Không thể tải danh sách người dùng');
            console.error(e);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        load();
    }, []);
    const toggle = async (id) => {
        try {
            await userService.toggleActive(id);
            await load();
        }
        catch (e) {
            alert('Có lỗi xảy ra khi cập nhật trạng thái');
        }
    };
    const reset = async (id) => {
        if (!confirm('Bạn có chắc muốn đặt lại mật khẩu?'))
            return;
        try {
            await userService.resetPassword(id);
            alert('Đã đặt lại mật khẩu thành công');
        }
        catch (e) {
            alert('Có lỗi xảy ra khi đặt lại mật khẩu');
        }
    };
    if (loading) {
        return (_jsx(Layout, { children: _jsx("div", { className: "users-container", children: _jsx("div", { className: "users-loading", children: "\u0110ang t\u1EA3i..." }) }) }));
    }
    if (error) {
        return (_jsx(Layout, { children: _jsx("div", { className: "users-container", children: _jsxs("div", { className: "users-error", children: [_jsx("div", { className: "error-text", children: error }), _jsx("button", { onClick: load, className: "retry-button", children: "Th\u1EED l\u1EA1i" })] }) }) }));
    }
    return (_jsx(Layout, { children: _jsxs("div", { className: "users-container", children: [_jsx("div", { className: "users-header", children: _jsx("h2", { children: "Qu\u1EA3n l\u00FD ng\u01B0\u1EDDi d\u00F9ng" }) }), _jsxs("table", { className: "users-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "ID" }), _jsx("th", { children: "Email" }), _jsx("th", { children: "T\u00EAn" }), _jsx("th", { children: "Vai tr\u00F2" }), _jsx("th", { children: "Tr\u1EA1ng th\u00E1i" }), _jsx("th", { children: "H\u00E0nh \u0111\u1ED9ng" })] }) }), _jsx("tbody", { children: items.map((u) => (_jsxs("tr", { children: [_jsx("td", { children: u.id }), _jsx("td", { children: u.email }), _jsx("td", { children: u.full_name }), _jsx("td", { children: u.role }), _jsx("td", { children: _jsx("span", { className: `status-badge ${u.is_active ? 'active' : 'inactive'}`, children: u.is_active ? 'Hoạt động' : 'Không hoạt động' }) }), _jsxs("td", { children: [_jsx("button", { onClick: () => toggle(u.id), className: "action-button", children: u.is_active ? 'Vô hiệu hóa' : 'Kích hoạt' }), _jsx("button", { onClick: () => reset(u.id), className: "action-button reset-button", children: "\u0110\u1EB7t l\u1EA1i MK" })] })] }, u.id))) })] })] }) }));
}
