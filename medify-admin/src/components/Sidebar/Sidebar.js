import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { ROUTES } from '../../constants';
import './Sidebar.css';
const sidebarLinks = [
    { id: 'dashboard', label: 'Dashboard', path: ROUTES.DASHBOARD, icon: '📊' },
    { id: 'appointments', label: 'Appointments', path: ROUTES.APPOINTMENTS, icon: '📅' },
    { id: 'doctors', label: 'Doctor Management', path: ROUTES.DOCTORS, icon: '👨‍⚕️' },
    { id: 'availabilities', label: 'Doctor Availability', path: ROUTES.AVAILABILITIES, icon: '🕐' },
    { id: 'specializations', label: 'Specializations Management', path: ROUTES.SPECIALIZATIONS, icon: '🏥' },
    { id: 'users', label: 'Users Management', path: ROUTES.USERS, icon: '👥' },
];
export default function Sidebar() {
    const location = useLocation();
    return (_jsxs("aside", { className: "sidebar", children: [_jsxs("div", { className: "sidebar-brand", children: [_jsx("img", { src: logo, alt: "Medify logo", className: "sidebar-logo" }), _jsx("span", { className: "sidebar-title", children: "Medify Admin" })] }), _jsx("nav", { className: "sidebar-nav", children: sidebarLinks.map((link) => (_jsxs(Link, { to: link.path, className: `sidebar-link ${location.pathname === link.path || (location.pathname === '/' && link.path === ROUTES.DASHBOARD) ? 'active' : ''}`, children: [_jsx("span", { className: "sidebar-link-icon", children: link.icon }), _jsx("span", { className: "sidebar-link-label", children: link.label })] }, link.id))) })] }));
}
