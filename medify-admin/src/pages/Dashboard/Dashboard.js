import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { dashboardService } from '../../services/apiService';
import Layout from '../../components/Layout';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, Legend, CartesianGrid } from 'recharts';
import './Dashboard.css';
const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6C5CE7', '#A8E6CF', '#FF8B94'];
function StatsCard({ title, value, icon, color, iconBg }) {
    return (_jsxs("div", { className: "stats-card", children: [_jsx("div", { className: "stats-icon", style: { backgroundColor: iconBg }, children: icon }), _jsxs("div", { className: "stats-info", children: [_jsx("div", { className: "stats-value", children: value }), _jsx("div", { className: "stats-title", children: title })] })] }));
}
function ChartLegend({ items }) {
    if (!items || items.length === 0) {
        return null;
    }
    return (_jsx("div", { className: "chart-legend", children: items.map((item, index) => (_jsxs("div", { className: "legend-item", children: [_jsx("div", { className: "legend-color", style: { backgroundColor: item.color } }), _jsx("span", { className: "legend-label", children: item.label }), item.value !== undefined && item.value > 0 && (_jsxs("span", { className: "legend-value", children: ["(", item.value, ")"] }))] }, `legend-${index}`))) }));
}
export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const loadData = async () => {
        try {
            setLoading(true);
            setError(undefined);
            const dashboardData = await dashboardService.getAllDashboardData();
            setData(dashboardData);
        }
        catch (e) {
            setError('Không thể tải dữ liệu dashboard');
            console.error(e);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadData();
    }, []);
    if (loading) {
        return (_jsx(Layout, { children: _jsxs("div", { className: "dashboard-loading", children: [_jsx("div", { className: "spinner" }), _jsx("p", { children: "\u0110ang t\u1EA3i d\u1EEF li\u1EC7u..." })] }) }));
    }
    if (error || !data) {
        return (_jsx(Layout, { children: _jsxs("div", { className: "dashboard-error", children: [_jsx("div", { className: "error-text", children: error || 'Có lỗi xảy ra' }), _jsx("button", { onClick: loadData, className: "retry-button", children: "Th\u1EED l\u1EA1i" })] }) }));
    }
    const { overview, specialties, appointments_by_status, appointment_trends } = data;
    // Transform specialties for donut chart
    const departmentData = specialties.map((s, idx) => ({
        name: s.specialty,
        value: s.appointment_count,
        color: COLORS[idx % COLORS.length]
    }));
    // Transform appointment status for pie chart
    const statusColors = {
        'BOOKED': '#F59E0B',
        'CANCELED': '#EF4444',
        'DONE': '#22C55E',
        'COMPLETED': '#3B82F6', // Xanh dương
        'NO_SHOW': '#14B8A6', // Xanh lá (teal)
        'SCHEDULED': '#A78BFA' // Tím nhạt
    };
    const statusLabels = {
        'BOOKED': 'Đã đặt',
        'CANCELED': 'Đã hủy',
        'DONE': 'Hoàn thành',
        'COMPLETED': 'Hoàn thành',
        'NO_SHOW': 'Không đến',
        'SCHEDULED': 'Đã lên lịch'
    };
    const appointmentStatusData = appointments_by_status.map((item) => ({
        name: statusLabels[item.status] || item.status,
        value: item.count,
        status: item.status,
        color: statusColors[item.status] || '#6B7280'
    }));
    // Transform appointment trends for line chart
    const trendData = appointment_trends.map((item) => {
        const date = new Date(item.date);
        return {
            date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            count: item.count
        };
    });
    return (_jsx(Layout, { children: _jsxs("div", { className: "dashboard", children: [_jsx("div", { className: "dashboard-header", children: _jsx("h2", { children: "Dashboard" }) }), _jsxs("div", { className: "stats-grid", children: [_jsx(StatsCard, { title: "Appointments", value: overview.total_appointments, icon: "\uD83D\uDCCB", color: "#5B7FFF", iconBg: "#E8EDFF" }), _jsx(StatsCard, { title: "Total Specializations", value: overview.total_specializations, icon: "\uD83C\uDFE5", color: "#FF9066", iconBg: "#FFE8E0" }), _jsx(StatsCard, { title: "Total Patients", value: overview.total_patients, icon: "\uD83D\uDC64", color: "#A66CFF", iconBg: "#F3EBFF" }), _jsx(StatsCard, { title: "Total Doctors", value: overview.total_doctors, icon: "\uD83D\uDC68\u200D\u2695\uFE0F", color: "#22C55E", iconBg: "#DCFCE7" })] }), _jsxs("div", { className: "dashboard-grid", children: [_jsxs("div", { className: "card department-chart-card", children: [_jsx("div", { className: "card-header", children: _jsx("h3", { children: "Ph\u00E2n b\u1ED1 b\u1EC7nh nh\u00E2n theo khoa" }) }), _jsxs("div", { className: "chart-container", children: [_jsx("div", { className: "chart-wrapper", children: _jsx(ResponsiveContainer, { width: "100%", height: 180, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: departmentData, dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", innerRadius: 55, outerRadius: 90, paddingAngle: 3, label: false, children: departmentData.map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) }), _jsx(Tooltip, { contentStyle: {
                                                                backgroundColor: 'white',
                                                                border: '1px solid #E5E7EB',
                                                                borderRadius: '8px',
                                                                fontSize: '13px',
                                                                padding: '10px',
                                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                                            }, formatter: (value, name) => [
                                                                `${value} bệnh nhân`,
                                                                name
                                                            ] })] }) }) }), _jsx(ChartLegend, { items: departmentData.map(item => ({
                                                color: item.color,
                                                label: item.name,
                                                value: item.value
                                            })) })] })] }), _jsxs("div", { className: "card status-chart-card", children: [_jsx("div", { className: "card-header", children: _jsx("h3", { children: "Ph\u00E2n b\u1ED1 tr\u1EA1ng th\u00E1i cu\u1ED9c h\u1EB9n" }) }), _jsxs("div", { className: "chart-container", children: [_jsx(ResponsiveContainer, { width: "100%", height: 180, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: appointmentStatusData, dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", innerRadius: 55, outerRadius: 90, paddingAngle: 3, label: false, children: appointmentStatusData.map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) }), _jsx(Tooltip, { contentStyle: {
                                                            backgroundColor: 'white',
                                                            border: '1px solid #E5E7EB',
                                                            borderRadius: '8px',
                                                            fontSize: '13px',
                                                            padding: '10px',
                                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                                        }, formatter: (value, name) => [
                                                            `${value} cuộc hẹn`,
                                                            name
                                                        ] })] }) }), _jsx(ChartLegend, { items: appointmentStatusData.map(item => ({
                                                color: item.color,
                                                label: item.name,
                                                value: item.value
                                            })) })] })] }), _jsxs("div", { className: "card trend-chart-card", children: [_jsx("div", { className: "card-header", children: _jsx("h3", { children: "Xu h\u01B0\u1EDBng cu\u1ED9c h\u1EB9n" }) }), _jsx("div", { className: "chart-container trend-chart-container", children: _jsx(ResponsiveContainer, { width: "100%", height: 160, children: _jsxs(LineChart, { data: trendData, margin: { top: 5, right: 10, left: 0, bottom: 30 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#E5E7EB" }), _jsx(XAxis, { dataKey: "date", stroke: "#6B7280", fontSize: 8, angle: -45, textAnchor: "end", height: 35, interval: 0, tick: { fontSize: 7 } }), _jsx(YAxis, { stroke: "#6B7280", fontSize: 9, allowDecimals: false, width: 30 }), _jsx(Tooltip, { contentStyle: {
                                                        backgroundColor: 'white',
                                                        border: '1px solid #E5E7EB',
                                                        borderRadius: '8px',
                                                        fontSize: '12px'
                                                    } }), _jsx(Legend, { wrapperStyle: { fontSize: '10px', paddingTop: '2px' } }), _jsx(Line, { type: "monotone", dataKey: "count", stroke: "#5B7FFF", strokeWidth: 2, dot: { fill: '#5B7FFF', r: 3 }, activeDot: { r: 5 }, name: "S\u1ED1 cu\u1ED9c h\u1EB9n" })] }) }) })] })] })] }) }));
}
