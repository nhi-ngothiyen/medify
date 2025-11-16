import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useCallback, memo } from 'react';
import { availabilityService, doctorService } from '../../services/apiService';
import Layout from '../../components/Layout';
import './Availabilities.css';
const WEEKDAYS = [
    { key: 1, label: 'Monday' },
    { key: 2, label: 'Tuesday' },
    { key: 3, label: 'Wednesday' },
    { key: 4, label: 'Thursday' },
    { key: 5, label: 'Friday' },
    { key: 6, label: 'Saturday' },
    { key: 0, label: 'Sunday' }
];
const CreateModal = memo(({ isOpen, onClose, onCreate, doctors }) => {
    const [formData, setFormData] = useState({
        doctor_user_id: 0,
        weekday: 1,
        start_time: '07:00',
        end_time: '11:00'
    });
    useEffect(() => {
        if (isOpen) {
            setFormData({
                doctor_user_id: 0,
                weekday: 1,
                start_time: '07:00',
                end_time: '11:00'
            });
        }
    }, [isOpen]);
    if (!isOpen)
        return null;
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.doctor_user_id > 0) {
            onCreate(formData);
        }
    };
    return (_jsx("div", { className: "modal-overlay", onClick: onClose, children: _jsxs("div", { className: "modal-content-small", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "modal-header", children: [_jsx("h3", { children: "Add Time Slot" }), _jsx("button", { className: "modal-close", onClick: onClose, children: "\u00D7" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "modal-body", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Doctor *" }), _jsxs("select", { value: formData.doctor_user_id, onChange: (e) => setFormData({ ...formData, doctor_user_id: parseInt(e.target.value) }), className: "form-input", required: true, children: [_jsx("option", { value: 0, children: "Select doctor" }), doctors.map((doctor) => (_jsxs("option", { value: doctor.id, children: [doctor.full_name, " - ", doctor.specialty] }, doctor.id)))] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Day *" }), _jsx("select", { value: formData.weekday, onChange: (e) => setFormData({ ...formData, weekday: parseInt(e.target.value) }), className: "form-input", required: true, children: WEEKDAYS.map((day) => (_jsx("option", { value: day.key, children: day.label }, day.key))) })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Start Time *" }), _jsx("input", { type: "time", value: formData.start_time, onChange: (e) => setFormData({ ...formData, start_time: e.target.value }), className: "form-input", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "End Time *" }), _jsx("input", { type: "time", value: formData.end_time, onChange: (e) => setFormData({ ...formData, end_time: e.target.value }), className: "form-input", required: true })] })] }), _jsxs("div", { className: "modal-footer", children: [_jsx("button", { type: "button", onClick: onClose, className: "btn-cancel", children: "Cancel" }), _jsx("button", { type: "submit", className: "btn-save", disabled: formData.doctor_user_id === 0, children: "Add Slot" })] })] })] }) }));
});
CreateModal.displayName = 'CreateModal';
const EditModal = memo(({ availability, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        weekday: 1,
        start_time: '08:00',
        end_time: '17:00'
    });
    useEffect(() => {
        if (availability) {
            setFormData({
                weekday: availability.weekday,
                start_time: availability.start_time,
                end_time: availability.end_time
            });
        }
    }, [availability]);
    if (!availability)
        return null;
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(availability.id, formData);
    };
    return (_jsx("div", { className: "modal-overlay", onClick: onClose, children: _jsxs("div", { className: "modal-content-small", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "modal-header", children: [_jsx("h3", { children: "Edit Time Slot" }), _jsx("button", { className: "modal-close", onClick: onClose, children: "\u00D7" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "modal-body", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Doctor" }), _jsx("input", { type: "text", value: availability.doctor_name || '', disabled: true, className: "form-input-disabled" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Day *" }), _jsx("select", { value: formData.weekday, onChange: (e) => setFormData({ ...formData, weekday: parseInt(e.target.value) }), className: "form-input", required: true, children: WEEKDAYS.map((day) => (_jsx("option", { value: day.key, children: day.label }, day.key))) })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Start Time *" }), _jsx("input", { type: "time", value: formData.start_time, onChange: (e) => setFormData({ ...formData, start_time: e.target.value }), className: "form-input", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "End Time *" }), _jsx("input", { type: "time", value: formData.end_time, onChange: (e) => setFormData({ ...formData, end_time: e.target.value }), className: "form-input", required: true })] })] }), _jsxs("div", { className: "modal-footer", children: [_jsx("button", { type: "button", onClick: onClose, className: "btn-cancel", children: "Cancel" }), _jsx("button", { type: "submit", className: "btn-save", children: "Save" })] })] })] }) }));
});
EditModal.displayName = 'EditModal';
// Helper functions for week navigation
const getWeekDates = (date) => {
    const curr = new Date(date);
    const first = curr.getDate() - curr.getDay() + 1; // Monday
    const monday = new Date(curr.setDate(first));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return {
        start: monday,
        end: sunday
    };
};
const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};
const formatDateHeader = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};
// Main Component
export default function Availabilities() {
    const [availabilities, setAvailabilities] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [filterDoctorId, setFilterDoctorId] = useState(0);
    const [filterWeekday, setFilterWeekday] = useState(-1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingAvailability, setEditingAvailability] = useState(null);
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
    const loadDoctors = useCallback(async () => {
        try {
            const data = await doctorService.getAll({});
            setDoctors(data);
        }
        catch (e) {
            console.error('Error loading doctors:', e);
        }
    }, []);
    const loadAvailabilities = useCallback(async () => {
        try {
            setLoading(true);
            setError(undefined);
            const params = {};
            if (filterDoctorId > 0)
                params.doctor_id = filterDoctorId;
            if (filterWeekday >= 0)
                params.weekday = filterWeekday;
            const data = await availabilityService.getAll(params);
            setAvailabilities(data);
        }
        catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Không thể tải danh sách lịch làm việc';
            setError(errorMessage);
            console.error('Error loading availabilities:', e);
        }
        finally {
            setLoading(false);
        }
    }, [filterDoctorId, filterWeekday]);
    useEffect(() => {
        loadDoctors();
    }, [loadDoctors]);
    useEffect(() => {
        loadAvailabilities();
    }, [loadAvailabilities]);
    const handleCreate = useCallback(async (data) => {
        try {
            await availabilityService.create(data.doctor_user_id, {
                weekday: data.weekday,
                start_time: data.start_time,
                end_time: data.end_time
            });
            setIsCreateModalOpen(false);
            loadAvailabilities();
        }
        catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Có lỗi xảy ra khi tạo lịch làm việc';
            alert(errorMessage);
            console.error('Error creating availability:', e);
        }
    }, [loadAvailabilities]);
    const handleEdit = useCallback((availability) => {
        setEditingAvailability(availability);
    }, []);
    const handleSave = useCallback(async (id, data) => {
        try {
            await availabilityService.update(id, data);
            setEditingAvailability(null);
            loadAvailabilities();
        }
        catch (e) {
            alert('Có lỗi xảy ra khi cập nhật lịch làm việc');
            console.error('Error updating availability:', e);
        }
    }, [loadAvailabilities]);
    const handleDelete = useCallback(async (id, doctorName, weekday) => {
        const dayName = WEEKDAYS.find(d => d.key === weekday)?.label || 'Unknown';
        if (!confirm(`Are you sure you want to delete "${doctorName}"'s schedule on ${dayName}?`))
            return;
        try {
            await availabilityService.delete(id);
            loadAvailabilities();
        }
        catch (e) {
            alert('Có lỗi xảy ra khi xóa lịch làm việc');
            console.error('Error deleting availability:', e);
        }
    }, [loadAvailabilities]);
    // Week navigation handlers - MUST be before any conditional returns
    const handlePreviousWeek = useCallback(() => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentWeekStart(newDate);
    }, [currentWeekStart]);
    const handleNextWeek = useCallback(() => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentWeekStart(newDate);
    }, [currentWeekStart]);
    const handleCurrentWeek = useCallback(() => {
        setCurrentWeekStart(new Date());
    }, []);
    // Get week dates for display - MUST be before any conditional returns
    const weekDates = getWeekDates(currentWeekStart);
    const weekDateHeaders = WEEKDAYS.map((day, index) => {
        const date = new Date(weekDates.start);
        date.setDate(date.getDate() + index);
        return {
            ...day,
            date: formatDateHeader(date),
            fullDate: date
        };
    });
    // Group availabilities by doctor - MUST be before any conditional returns
    const groupedByDoctor = availabilities.reduce((acc, avail) => {
        const doctorId = avail.doctor_id;
        if (!acc[doctorId]) {
            acc[doctorId] = {
                doctor_name: avail.doctor_name || '',
                doctor_specialty: avail.doctor_specialty || '',
                slots: {}
            };
        }
        if (!acc[doctorId].slots[avail.weekday]) {
            acc[doctorId].slots[avail.weekday] = [];
        }
        acc[doctorId].slots[avail.weekday].push(avail);
        return acc;
    }, {});
    // Conditional renders AFTER all hooks
    if (loading && availabilities.length === 0) {
        return (_jsx(Layout, { children: _jsx("div", { className: "schedule-container", children: _jsxs("div", { className: "availabilities-loading", children: [_jsx("div", { className: "spinner" }), _jsx("p", { children: "Loading..." })] }) }) }));
    }
    if (error && availabilities.length === 0) {
        return (_jsx(Layout, { children: _jsx("div", { className: "schedule-container", children: _jsxs("div", { className: "availabilities-error", children: [_jsx("div", { className: "error-text", children: error }), _jsx("button", { onClick: loadAvailabilities, className: "retry-button", children: "Retry" })] }) }) }));
    }
    return (_jsx(Layout, { children: _jsxs("div", { className: "schedule-container", children: [_jsxs("div", { className: "schedule-header", children: [_jsxs("div", { className: "schedule-title", children: [_jsx("span", { className: "schedule-icon", children: "\uD83D\uDCC5" }), _jsx("h2", { children: "Schedule Manager" })] }), _jsxs("div", { className: "week-navigation", children: [_jsxs("div", { className: "week-display", children: [_jsx("span", { className: "week-icon", children: "\uD83D\uDD50" }), _jsxs("span", { className: "week-text", children: ["Week: ", formatDate(weekDates.start), " - ", formatDate(weekDates.end)] })] }), _jsxs("div", { className: "week-controls", children: [_jsx("button", { className: "week-nav-btn", onClick: handlePreviousWeek, title: "Previous week", children: "\u2039" }), _jsx("button", { className: "current-week-btn", onClick: handleCurrentWeek, children: "Current Week" }), _jsx("button", { className: "week-nav-btn", onClick: handleNextWeek, title: "Next week", children: "\u203A" })] })] }), _jsx("button", { className: "add-slot-btn", onClick: () => setIsCreateModalOpen(true), children: "+ Add Time Slot" })] }), _jsxs("div", { className: "schedule-filters", children: [_jsxs("select", { value: filterDoctorId, onChange: (e) => setFilterDoctorId(parseInt(e.target.value)), className: "filter-dropdown", children: [_jsx("option", { value: 0, children: "Filter by Specialization" }), doctors.map((doctor) => (_jsx("option", { value: doctor.id, children: doctor.specialty }, doctor.id)))] }), _jsxs("select", { value: filterWeekday, onChange: (e) => setFilterWeekday(parseInt(e.target.value)), className: "filter-dropdown", children: [_jsx("option", { value: -1, children: "Filter by Shift" }), WEEKDAYS.map((day) => (_jsx("option", { value: day.key, children: day.label }, day.key)))] })] }), loading && availabilities.length > 0 && (_jsx("div", { className: "loading-overlay", children: _jsx("div", { className: "spinner" }) })), _jsx("div", { className: "schedule-grid-wrapper", children: _jsxs("div", { className: "schedule-grid", children: [_jsxs("div", { className: "schedule-header-row", children: [_jsx("div", { className: "doctor-column-header", children: "Doctor" }), weekDateHeaders.map((day) => (_jsxs("div", { className: "day-column-header", children: [_jsx("div", { className: "day-name", children: day.label }), _jsx("div", { className: "day-date", children: day.date })] }, day.key)))] }), Object.keys(groupedByDoctor).length === 0 ? (_jsx("div", { className: "no-data-schedule", children: "No schedules available" })) : (Object.entries(groupedByDoctor).map(([doctorId, data]) => (_jsxs("div", { className: "doctor-row", children: [_jsxs("div", { className: "doctor-info", children: [_jsx("div", { className: "doctor-name", children: data.doctor_name }), _jsxs("div", { className: "doctor-id", children: ["ID: ", doctorId] }), _jsx("div", { className: "doctor-specialty-badge", children: data.doctor_specialty })] }), WEEKDAYS.map((day) => (_jsxs("div", { className: "day-cell", children: [data.slots[day.key]?.map((slot) => (_jsxs("div", { className: "time-slot", children: [_jsxs("div", { className: "time-slot-content", children: [slot.start_time, " - ", slot.end_time] }), _jsxs("div", { className: "time-slot-actions", children: [_jsx("button", { className: "slot-edit-btn", onClick: () => handleEdit(slot), title: "Edit", children: "\u270F\uFE0F" }), _jsx("button", { className: "slot-delete-btn", onClick: () => handleDelete(slot.id, data.doctor_name, slot.weekday), title: "Delete", children: "\uD83D\uDDD1\uFE0F" })] })] }, slot.id))), _jsx("button", { className: "add-slot-cell-btn", onClick: () => setIsCreateModalOpen(true), title: "Add time slot", children: "+" }), _jsx("div", { className: "day-label", children: data.doctor_specialty })] }, day.key)))] }, doctorId))))] }) }), _jsx(CreateModal, { isOpen: isCreateModalOpen, onClose: () => setIsCreateModalOpen(false), onCreate: handleCreate, doctors: doctors }), _jsx(EditModal, { availability: editingAvailability, onClose: () => setEditingAvailability(null), onSave: handleSave })] }) }));
}
