import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { appointmentService } from '../../services/apiService';
import Layout from '../../components/Layout';
import './Appointments.css';
// Mock data generators for sections not in database
const generateMockMedicalRecord = (appointment) => {
    const mockDiagnoses = [
        'Đau dạ dày',
        'Cảm cúm',
        'Viêm họng',
        'Đau đầu',
        'Mệt mỏi',
        'Da bị mụn'
    ];
    const mockTreatments = [
        'Sử dụng thuốc chống acid, ăn uống đúng giờ',
        'Nghỉ ngơi, uống nhiều nước',
        'Súc miệng bằng nước muối',
        'Uống thuốc giảm đau',
        'Nghỉ ngơi đầy đủ',
        'Sử dụng kem trị mụn'
    ];
    const index = appointment.id % mockDiagnoses.length;
    return {
        diagnosis: mockDiagnoses[index],
        treatment: mockTreatments[index],
        notes: appointment.note || ''
    };
};
const generateMockPrescription = (appointment) => {
    const mockPrescriptions = [
        'Omeprazol 25mg - 1 viên trước ăn sáng; Antacid - 1 viên sau ăn',
        'Paracetamol 500mg - 2 viên/ngày',
        'Thuốc kháng viêm - 1 viên/ngày',
        'Aspirin 100mg - 1 viên khi đau',
        'Vitamin C - 1 viên/ngày',
        'Kem trị mụn - bôi 2 lần/ngày'
    ];
    const index = appointment.id % mockPrescriptions.length;
    return {
        medicineDetails: mockPrescriptions[index]
    };
};
const generateMockPayment = (appointment) => {
    const amounts = [250000, 400000, 300000, 350000, 200000];
    const methods = ['e-wallet', 'cash', 'card', 'bank transfer'];
    const statuses = ['PAID', 'UNPAID', 'PENDING'];
    const index = appointment.id % amounts.length;
    const statusIndex = appointment.id % statuses.length;
    const methodIndex = appointment.id % methods.length;
    return {
        amount: amounts[index],
        status: statuses[statusIndex],
        paymentMethod: methods[methodIndex]
    };
};
function AppointmentModal({ appointment, onClose }) {
    if (!appointment)
        return null;
    const medicalRecord = appointment.medicalRecord || generateMockMedicalRecord(appointment);
    const prescription = appointment.prescription || generateMockPrescription(appointment);
    const payment = appointment.payment || generateMockPayment(appointment);
    return (_jsx("div", { className: "modal-overlay", onClick: onClose, children: _jsxs("div", { className: "modal-content", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "modal-header", children: [_jsx("h3", { children: "Appointment Details" }), _jsx("button", { className: "modal-close", onClick: onClose, children: "\u00D7" })] }), _jsx("div", { className: "modal-body", children: _jsxs("div", { className: "appointment-detail-grid", children: [_jsxs("div", { className: "detail-section", children: [_jsxs("div", { className: "detail-section-header", children: [_jsx("span", { className: "detail-section-icon", children: "\uD83C\uDFE5" }), _jsx("h4", { children: "Medical Record" })] }), _jsx("table", { className: "detail-table", children: _jsxs("tbody", { children: [_jsxs("tr", { children: [_jsx("td", { className: "detail-label", children: "Diagnosis" }), _jsx("td", { className: "detail-value", children: medicalRecord.diagnosis || 'N/A' })] }), _jsxs("tr", { children: [_jsx("td", { className: "detail-label", children: "Treatment" }), _jsx("td", { className: "detail-value", children: medicalRecord.treatment || 'N/A' })] }), _jsxs("tr", { children: [_jsx("td", { className: "detail-label", children: "Notes" }), _jsx("td", { className: "detail-value", children: medicalRecord.notes || 'N/A' })] })] }) })] }), _jsxs("div", { className: "detail-section", children: [_jsxs("div", { className: "detail-section-header", children: [_jsx("span", { className: "detail-section-icon", children: "\uD83D\uDC8A" }), _jsx("h4", { children: "Prescription" })] }), _jsx("table", { className: "detail-table", children: _jsx("tbody", { children: _jsxs("tr", { children: [_jsx("td", { className: "detail-label", children: "Medicine Details" }), _jsx("td", { className: "detail-value", children: prescription.medicineDetails || 'N/A' })] }) }) })] }), _jsxs("div", { className: "detail-section", children: [_jsxs("div", { className: "detail-section-header", children: [_jsx("span", { className: "detail-section-icon", children: "\uD83D\uDCB3" }), _jsx("h4", { children: "Payment" })] }), _jsx("table", { className: "detail-table", children: _jsxs("tbody", { children: [_jsxs("tr", { children: [_jsx("td", { className: "detail-label", children: "Amount" }), _jsx("td", { className: "detail-value", children: payment.amount ? `${payment.amount.toLocaleString('vi-VN')} VNĐ` : 'N/A' })] }), _jsxs("tr", { children: [_jsx("td", { className: "detail-label", children: "Status" }), _jsx("td", { className: "detail-value", children: _jsx("span", { className: `payment-status-badge ${payment.status?.toLowerCase()}`, children: payment.status || 'N/A' }) })] }), _jsxs("tr", { children: [_jsx("td", { className: "detail-label", children: "Payment Method" }), _jsx("td", { className: "detail-value", children: payment.paymentMethod || 'N/A' })] })] }) })] }), _jsxs("div", { className: "detail-section", children: [_jsxs("div", { className: "detail-section-header", children: [_jsx("span", { className: "detail-section-icon", children: "\u2B50" }), _jsx("h4", { children: "Feedback" })] }), _jsx("table", { className: "detail-table", children: _jsxs("tbody", { children: [_jsxs("tr", { children: [_jsx("td", { className: "detail-label", children: "Rating" }), _jsx("td", { className: "detail-value", children: appointment.review?.rating ? `${appointment.review.rating}/5` : 'N/A' })] }), _jsxs("tr", { children: [_jsx("td", { className: "detail-label", children: "Comment" }), _jsx("td", { className: "detail-value", children: appointment.review?.comment || 'N/A' })] })] }) })] })] }) })] }) }));
}
export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');
    const loadAppointments = async () => {
        try {
            setLoading(true);
            setError(undefined);
            const data = await appointmentService.getAll();
            // Ensure data is an array
            if (Array.isArray(data)) {
                setAppointments(data);
                setFilteredAppointments(data);
            }
            else {
                console.error('Invalid data format:', data);
                setError('Dữ liệu không hợp lệ từ server');
            }
        }
        catch (e) {
            console.error('Error loading appointments:', e);
            const errorMessage = e?.message || 'Không thể tải danh sách appointments';
            // Provide more specific error messages
            if (errorMessage.includes('timeout') || errorMessage.includes('timeout')) {
                setError('Kết nối timeout. Vui lòng kiểm tra backend có đang chạy không.');
            }
            else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
                setError('Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy tại http://localhost:8000 không.');
            }
            else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
                setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            }
            else if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
                setError('Bạn không có quyền truy cập. Vui lòng đăng nhập với tài khoản admin.');
            }
            else {
                setError(`Không thể tải danh sách appointments: ${errorMessage}`);
            }
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadAppointments();
    }, []);
    useEffect(() => {
        let filtered = [...appointments];
        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(apt => apt.status === statusFilter);
        }
        // Filter by date
        if (dateFilter) {
            const filterDate = new Date(dateFilter);
            filtered = filtered.filter(apt => {
                const aptDate = new Date(apt.start_at);
                return aptDate.toDateString() === filterDate.toDateString();
            });
        }
        setFilteredAppointments(filtered);
    }, [statusFilter, dateFilter, appointments]);
    const handleView = async (appointment) => {
        // Use appointment from list and add mock data for sections not in database
        const detail = {
            ...appointment,
            medicalRecord: generateMockMedicalRecord(appointment),
            prescription: generateMockPrescription(appointment),
            payment: generateMockPayment(appointment)
        };
        setSelectedAppointment(detail);
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        const dateStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        return `${time} - ${dateStr}`;
    };
    const getStatusBadgeClass = (status) => {
        // Map 3 trạng thái thật từ backend
        const statusMap = {
            'BOOKED': 'scheduled', // Đã đặt
            'CANCELED': 'cancelled', // Đã hủy
            'DONE': 'completed' // Hoàn thành
        };
        return statusMap[status] || 'default';
    };
    const getStatusLabel = (status) => {
        // Map 3 trạng thái thật từ backend sang tiếng Anh (lowercase)
        const labelMap = {
            'BOOKED': 'booked',
            'CANCELED': 'canceled',
            'DONE': 'done'
        };
        return labelMap[status] || status.toLowerCase();
    };
    const getPaymentStatus = (appointment) => {
        // Mock payment status based on appointment
        const statuses = ['PAID', 'UNPAID', 'PENDING'];
        const index = appointment.id % statuses.length;
        return statuses[index];
    };
    const getFees = (appointment) => {
        // Mock fees
        const amounts = [250000, 400000, 300000, 350000, 200000];
        const index = appointment.id % amounts.length;
        return amounts[index];
    };
    if (loading) {
        return (_jsx(Layout, { children: _jsx("div", { className: "appointments-container", children: _jsxs("div", { className: "appointments-loading", children: [_jsx("div", { className: "spinner" }), _jsx("p", { children: "\u0110ang t\u1EA3i..." })] }) }) }));
    }
    if (error) {
        return (_jsx(Layout, { children: _jsx("div", { className: "appointments-container", children: _jsxs("div", { className: "appointments-error", children: [_jsx("div", { className: "error-text", children: error }), _jsx("button", { onClick: loadAppointments, className: "retry-button", children: "Th\u1EED l\u1EA1i" })] }) }) }));
    }
    return (_jsx(Layout, { children: _jsxs("div", { className: "appointments-container", children: [_jsxs("div", { className: "appointments-header", children: [_jsx("h2", { children: "Appointments" }), _jsxs("div", { className: "appointments-filters", children: [_jsxs("div", { className: "filter-group", children: [_jsx("label", { htmlFor: "status-filter", children: "Filter by status" }), _jsxs("select", { id: "status-filter", className: "filter-select", value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "BOOKED", children: "booked" }), _jsx("option", { value: "CANCELED", children: "canceled" }), _jsx("option", { value: "DONE", children: "done" })] })] }), _jsxs("div", { className: "filter-group", children: [_jsx("label", { htmlFor: "date-filter", children: "Filter by date" }), _jsx("input", { id: "date-filter", type: "date", className: "filter-input", value: dateFilter, onChange: (e) => setDateFilter(e.target.value) })] })] })] }), _jsx("div", { className: "appointments-table-wrapper", children: _jsxs("table", { className: "appointments-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Patient" }), _jsx("th", { children: "Date" }), _jsx("th", { children: "Doctor" }), _jsx("th", { children: "Specialization" }), _jsx("th", { children: "Reason" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Fees" }), _jsx("th", { children: "Actions" })] }) }), _jsx("tbody", { children: filteredAppointments.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 8, className: "no-data", children: "Kh\u00F4ng c\u00F3 appointments n\u00E0o" }) })) : (filteredAppointments.map((appointment) => (_jsxs("tr", { children: [_jsx("td", { children: _jsxs("div", { className: "patient-cell", children: [_jsx("div", { className: "avatar", children: appointment.patient?.full_name?.charAt(0) || 'P' }), _jsx("span", { children: appointment.patient?.full_name || 'N/A' })] }) }), _jsx("td", { children: formatDate(appointment.start_at) }), _jsx("td", { children: _jsxs("div", { className: "doctor-cell", children: [_jsx("div", { className: "avatar doctor-avatar", children: appointment.doctor?.full_name?.charAt(0) || 'D' }), _jsx("span", { children: appointment.doctor?.full_name || 'N/A' })] }) }), _jsx("td", { children: appointment.doctor?.specialty || 'N/A' }), _jsx("td", { children: appointment.note || 'N/A' }), _jsx("td", { children: _jsx("span", { className: `status-badge ${getStatusBadgeClass(appointment.status)}`, children: getStatusLabel(appointment.status) }) }), _jsxs("td", { children: ["$", getFees(appointment).toLocaleString('vi-VN')] }), _jsx("td", { children: _jsx("div", { className: "action-buttons", children: _jsx("button", { className: "action-button view-button", onClick: () => handleView(appointment), children: "\uD83D\uDCC4 View" }) }) })] }, appointment.id)))) })] }) }), _jsx(AppointmentModal, { appointment: selectedAppointment, onClose: () => setSelectedAppointment(null) })] }) }));
}
