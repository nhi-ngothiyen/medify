import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import './Layout.css';
export default function Layout({ children }) {
    return (_jsxs("div", { className: "layout", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "layout-main", children: [_jsx(Navbar, {}), _jsx("div", { className: "layout-content", children: children })] })] }));
}
