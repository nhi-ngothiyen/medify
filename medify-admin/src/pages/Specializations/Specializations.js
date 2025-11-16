import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useCallback, memo } from 'react';
import { specializationService } from '../../services/apiService';
import Layout from '../../components/Layout';
import './Specializations.css';
const StarRating = memo(({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (_jsxs("div", { className: "rating-stars", children: [[1, 2, 3, 4, 5].map((star) => (_jsx("span", { className: `star ${star <= fullStars
                    ? 'filled'
                    : star === fullStars + 1 && hasHalfStar
                        ? 'half'
                        : 'empty'}`, children: "\u2605" }, star))), _jsxs("span", { className: "rating-number", children: ["(", rating.toFixed(1), ")"] })] }));
});
StarRating.displayName = 'StarRating';
const SortableHeader = memo(({ field, label, currentSort, onSort }) => {
    const isActive = currentSort.field === field;
    const icon = isActive ? (currentSort.order === 'asc' ? '↑' : '↓') : null;
    return (_jsxs("th", { className: "sortable", onClick: () => onSort(field), children: [label, icon && _jsx("span", { className: "sort-icon", children: icon })] }));
});
SortableHeader.displayName = 'SortableHeader';
const CreateModal = memo(({ isOpen, onClose, onCreate }) => {
    const [name, setName] = useState('');
    useEffect(() => {
        if (isOpen) {
            setName('');
        }
    }, [isOpen]);
    if (!isOpen)
        return null;
    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onCreate(name.trim());
        }
    };
    return (_jsx("div", { className: "modal-overlay", onClick: onClose, children: _jsxs("div", { className: "modal-content", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "modal-header", children: [_jsx("h3", { children: "Th\u00EAm chuy\u00EAn khoa m\u1EDBi" }), _jsx("button", { className: "modal-close", onClick: onClose, children: "\u00D7" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "modal-body", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "T\u00EAn chuy\u00EAn khoa:" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), className: "form-input", placeholder: "Nh\u1EADp t\u00EAn chuy\u00EAn khoa", autoFocus: true })] }), _jsxs("div", { className: "modal-footer", children: [_jsx("button", { type: "button", onClick: onClose, className: "btn-cancel", children: "H\u1EE7y" }), _jsx("button", { type: "submit", className: "btn-save", disabled: !name.trim(), children: "T\u1EA1o" })] })] })] }) }));
});
CreateModal.displayName = 'CreateModal';
const EditModal = memo(({ specialization, onClose, onSave }) => {
    const [newName, setNewName] = useState('');
    useEffect(() => {
        if (specialization) {
            setNewName(specialization.name);
        }
    }, [specialization]);
    if (!specialization)
        return null;
    const handleSubmit = (e) => {
        e.preventDefault();
        if (newName.trim() && newName !== specialization.name) {
            onSave(specialization.name, newName.trim());
        }
    };
    return (_jsx("div", { className: "modal-overlay", onClick: onClose, children: _jsxs("div", { className: "modal-content", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "modal-header", children: [_jsx("h3", { children: "Ch\u1EC9nh s\u1EEDa chuy\u00EAn khoa" }), _jsx("button", { className: "modal-close", onClick: onClose, children: "\u00D7" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "modal-body", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "T\u00EAn chuy\u00EAn khoa hi\u1EC7n t\u1EA1i:" }), _jsx("input", { type: "text", value: specialization.name, disabled: true, className: "form-input-disabled" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "T\u00EAn m\u1EDBi:" }), _jsx("input", { type: "text", value: newName, onChange: (e) => setNewName(e.target.value), className: "form-input", placeholder: "Nh\u1EADp t\u00EAn chuy\u00EAn khoa m\u1EDBi", autoFocus: true })] }), _jsxs("div", { className: "modal-footer", children: [_jsx("button", { type: "button", onClick: onClose, className: "btn-cancel", children: "H\u1EE7y" }), _jsx("button", { type: "submit", className: "btn-save", disabled: !newName.trim() || newName === specialization.name, children: "L\u01B0u" })] })] })] }) }));
});
EditModal.displayName = 'EditModal';
// Main Component
export default function Specializations() {
    const [specializations, setSpecializations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [searchQuery, setSearchQuery] = useState('');
    const [sort, setSort] = useState({ field: 'name', order: 'asc' });
    const [editingSpecialization, setEditingSpecialization] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const loadSpecializations = useCallback(async () => {
        try {
            setLoading(true);
            setError(undefined);
            const params = {};
            if (searchQuery.trim()) {
                params.search = searchQuery.trim();
            }
            if (sort.field) {
                params.sort_by = sort.field;
                params.sort_order = sort.order;
            }
            const data = await specializationService.getAll(params);
            setSpecializations(data);
        }
        catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Không thể tải danh sách chuyên khoa';
            setError(errorMessage);
            console.error('Error loading specializations:', e);
        }
        finally {
            setLoading(false);
        }
    }, [searchQuery, sort]);
    useEffect(() => {
        loadSpecializations();
    }, [loadSpecializations]);
    const handleSort = useCallback((field) => {
        setSort((prev) => ({
            field,
            order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
        }));
    }, []);
    const handleSearch = useCallback((e) => {
        e.preventDefault();
    }, []);
    const handleCreate = useCallback(async (name) => {
        try {
            await specializationService.create(name);
            setIsCreateModalOpen(false);
            loadSpecializations();
        }
        catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Có lỗi xảy ra khi tạo chuyên khoa';
            alert(errorMessage);
            console.error('Error creating specialization:', e);
        }
    }, [loadSpecializations]);
    const handleEdit = useCallback((specialization) => {
        setEditingSpecialization(specialization);
    }, []);
    const handleSave = useCallback(async (oldName, newName) => {
        try {
            await specializationService.update(oldName, newName);
            setEditingSpecialization(null);
            loadSpecializations();
        }
        catch (e) {
            alert('Có lỗi xảy ra khi cập nhật chuyên khoa');
            console.error('Error updating specialization:', e);
        }
    }, [loadSpecializations]);
    const handleDelete = useCallback(async (name, doctorCount) => {
        if (doctorCount > 0) {
            const action = confirm(`Chuyên khoa "${name}" có ${doctorCount} bác sĩ.\n\n` +
                `Chọn OK để chỉ xóa chuyên khoa (giữ lại bác sĩ)\n` +
                `Chọn Cancel để hủy`);
            if (!action)
                return;
        }
        else {
            if (!confirm(`Bạn có chắc muốn xóa chuyên khoa "${name}"?`))
                return;
        }
        try {
            await specializationService.delete(name, 'clear');
            loadSpecializations();
        }
        catch (e) {
            alert('Có lỗi xảy ra khi xóa chuyên khoa');
            console.error('Error deleting specialization:', e);
        }
    }, [loadSpecializations]);
    if (loading && specializations.length === 0) {
        return (_jsx(Layout, { children: _jsx("div", { className: "specializations-container", children: _jsxs("div", { className: "specializations-loading", children: [_jsx("div", { className: "spinner" }), _jsx("p", { children: "\u0110ang t\u1EA3i..." })] }) }) }));
    }
    if (error && specializations.length === 0) {
        return (_jsx(Layout, { children: _jsx("div", { className: "specializations-container", children: _jsxs("div", { className: "specializations-error", children: [_jsx("div", { className: "error-text", children: error }), _jsx("button", { onClick: loadSpecializations, className: "retry-button", children: "Th\u1EED l\u1EA1i" })] }) }) }));
    }
    return (_jsx(Layout, { children: _jsxs("div", { className: "specializations-container", children: [_jsx("div", { className: "specializations-header", children: _jsx("h2", { children: "Specializations Management" }) }), _jsxs("div", { className: "specializations-toolbar", children: [_jsxs("form", { onSubmit: handleSearch, className: "search-form", children: [_jsx("input", { type: "text", className: "search-input", placeholder: "T\u00ECm ki\u1EBFm chuy\u00EAn khoa...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) }), _jsx("button", { type: "submit", className: "search-button", children: "\uD83D\uDD0D" })] }), _jsx("button", { className: "add-specialization-btn", onClick: () => setIsCreateModalOpen(true), children: "+ Th\u00EAm chuy\u00EAn khoa" })] }), loading && specializations.length > 0 && (_jsx("div", { className: "loading-overlay", children: _jsx("div", { className: "spinner" }) })), _jsx("div", { className: "specializations-table-wrapper", children: _jsxs("table", { className: "specializations-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx(SortableHeader, { field: "name", label: "T\u00EAn chuy\u00EAn khoa", currentSort: sort, onSort: handleSort }), _jsx(SortableHeader, { field: "doctor_count", label: "S\u1ED1 b\u00E1c s\u0129", currentSort: sort, onSort: handleSort }), _jsx("th", { children: "\u0110\u00E1nh gi\u00E1 trung b\u00ECnh" }), _jsx("th", { children: "Thao t\u00E1c" })] }) }), _jsx("tbody", { children: specializations.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "no-data", children: "Kh\u00F4ng c\u00F3 chuy\u00EAn khoa n\u00E0o" }) })) : (specializations.map((spec) => (_jsxs("tr", { children: [_jsx("td", { className: "spec-name", children: spec.name }), _jsx("td", { className: "spec-count", children: _jsx("span", { className: "count-badge", children: spec.doctor_count }) }), _jsx("td", { children: _jsx(StarRating, { rating: spec.avg_rating }) }), _jsx("td", { children: _jsxs("div", { className: "action-buttons", children: [_jsx("button", { className: "edit-btn", onClick: () => handleEdit(spec), title: "Ch\u1EC9nh s\u1EEDa", children: "\u270F\uFE0F" }), _jsx("button", { className: "delete-btn", onClick: () => handleDelete(spec.name, spec.doctor_count), title: "X\u00F3a", children: "\uD83D\uDDD1\uFE0F" })] }) })] }, spec.name)))) })] }) }), _jsx(CreateModal, { isOpen: isCreateModalOpen, onClose: () => setIsCreateModalOpen(false), onCreate: handleCreate }), _jsx(EditModal, { specialization: editingSpecialization, onClose: () => setEditingSpecialization(null), onSave: handleSave })] }) }));
}
