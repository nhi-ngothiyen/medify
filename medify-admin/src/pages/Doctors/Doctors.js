import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef, useMemo, useCallback, memo } from 'react';
import { doctorService } from '../../services/apiService';
import Layout from '../../components/Layout';
import { SEARCH_FIELD_LABELS, TABLE_HEADER_LABELS, SEARCH_PLACEHOLDERS } from '../../constants';
import './Doctors.css';
// Constants
const ITEMS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 500;
const WEEKDAY_NAMES = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
const SPECIALTY_TO_DEGREE = {
    'Tim mạch': 'Bác sĩ chuyên khoa I',
    'Da liễu': 'Bác sĩ chuyên khoa I',
    'Tâm lý': 'Ph.D. Psychology',
    'Tâm lí': 'Ph.D. Psychology',
    'Khoa Lão': 'MD Geriatrics',
    'Chấn thương chỉnh hình': 'Bác sĩ chuyên khoa I',
    'Mắt': 'Bác sĩ chuyên khoa I',
    'Tai mũi họng': 'Bác sĩ chuyên khoa I',
    'Răng hàm mặt': 'Bác sĩ chuyên khoa I',
    'Nhi khoa': 'Thạc sĩ',
    'Sản phụ khoa': 'Bác sĩ chuyên khoa I',
};
// Helper functions
const getDegree = (specialty, yearsExp) => {
    return SPECIALTY_TO_DEGREE[specialty] || (yearsExp > 10 ? 'Thạc sĩ' : 'Bác sĩ chuyên khoa I');
};
const getInitials = (name) => {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};
// Custom hook for debounce
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};
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
const DoctorRow = memo(({ doctor, onView, onDelete }) => {
    const handleDelete = useCallback(() => {
        onDelete(doctor.id, doctor.full_name);
    }, [doctor.id, doctor.full_name, onDelete]);
    const handleView = useCallback(() => {
        onView(doctor.id);
    }, [doctor.id, onView]);
    return (_jsxs("tr", { children: [_jsx("td", { children: _jsx("div", { className: "avatar-cell", children: _jsx("div", { className: "doctor-avatar", children: getInitials(doctor.full_name) }) }) }), _jsx("td", { children: _jsx("button", { className: "doctor-name-link", onClick: handleView, children: doctor.full_name }) }), _jsx("td", { children: doctor.email }), _jsx("td", { children: doctor.specialty }), _jsx("td", { children: _jsx("span", { className: "degree-badge", children: getDegree(doctor.specialty, doctor.years_exp) }) }), _jsx("td", { children: _jsxs("div", { className: "experience-cell", children: [_jsx("span", { className: "calendar-icon", children: "\uD83D\uDCC5" }), doctor.years_exp, " years"] }) }), _jsx("td", { children: _jsx(StarRating, { rating: doctor.avg_rating }) }), _jsx("td", { children: _jsx("button", { className: "delete-btn", onClick: handleDelete, children: "\uD83D\uDDD1\uFE0F Delete" }) })] }));
});
DoctorRow.displayName = 'DoctorRow';
const SpecialtyFilter = memo(({ specialties, selected, onSelect }) => {
    return (_jsxs("div", { className: "specialty-filters", children: [_jsx("button", { className: `specialty-filter-btn ${selected === 'all' ? 'active' : ''}`, onClick: () => onSelect('all'), children: "All Specializations" }), specialties.map((specialty) => (_jsx("button", { className: `specialty-filter-btn ${selected === specialty ? 'active' : ''}`, onClick: () => onSelect(specialty), children: specialty }, specialty)))] }));
});
SpecialtyFilter.displayName = 'SpecialtyFilter';
const Pagination = memo(({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1)
        return null;
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        }
        else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++)
                    pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
            else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++)
                    pages.push(i);
            }
            else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++)
                    pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };
    return (_jsxs("div", { className: "pagination", children: [_jsx("button", { className: "pagination-btn", onClick: () => onPageChange(currentPage - 1), disabled: currentPage === 1, "aria-label": "Previous page", children: "\u2190" }), getPageNumbers().map((page, index) => {
                if (page === '...') {
                    return (_jsx("span", { className: "pagination-ellipsis", children: "..." }, `ellipsis-${index}`));
                }
                return (_jsx("button", { className: `pagination-btn ${currentPage === page ? 'active' : ''}`, onClick: () => onPageChange(page), children: page }, page));
            }), _jsx("button", { className: "pagination-btn", onClick: () => onPageChange(currentPage + 1), disabled: currentPage === totalPages, "aria-label": "Next page", children: "\u2192" })] }));
});
Pagination.displayName = 'Pagination';
const DoctorModal = memo(({ doctor, onClose }) => {
    if (!doctor)
        return null;
    const handleOverlayClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);
    return (_jsx("div", { className: "modal-overlay", onClick: handleOverlayClick, children: _jsxs("div", { className: "modal-content", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "modal-header", children: [_jsx("h3", { children: "Th\u00F4ng tin chi ti\u1EBFt b\u00E1c s\u0129" }), _jsx("button", { className: "modal-close", onClick: onClose, "aria-label": "Close modal", children: "\u00D7" })] }), _jsx("div", { className: "modal-body", children: _jsxs("div", { className: "doctor-detail-grid", children: [_jsxs("div", { className: "detail-section", children: [_jsxs("div", { className: "detail-section-header", children: [_jsx("span", { className: "detail-section-icon", children: "\uD83D\uDC64" }), _jsx("h4", { children: "Th\u00F4ng tin c\u00E1 nh\u00E2n" })] }), _jsx("table", { className: "detail-table", children: _jsxs("tbody", { children: [_jsxs("tr", { children: [_jsx("td", { className: "detail-label", children: "H\u1ECD v\u00E0 t\u00EAn" }), _jsx("td", { className: "detail-value", children: doctor.user.full_name })] }), _jsxs("tr", { children: [_jsx("td", { className: "detail-label", children: "Email" }), _jsx("td", { className: "detail-value", children: doctor.user.email })] }), _jsxs("tr", { children: [_jsx("td", { className: "detail-label", children: "Gi\u1EDBi t\u00EDnh" }), _jsx("td", { className: "detail-value", children: doctor.user.gender === 'MALE'
                                                                ? 'Nam'
                                                                : doctor.user.gender === 'FEMALE'
                                                                    ? 'Nữ'
                                                                    : 'Khác' })] }), _jsxs("tr", { children: [_jsx("td", { className: "detail-label", children: "Tr\u1EA1ng th\u00E1i" }), _jsx("td", { className: "detail-value", children: _jsx("span", { className: `status-badge ${doctor.user.is_active ? 'active' : 'inactive'}`, children: doctor.user.is_active ? 'Hoạt động' : 'Không hoạt động' }) })] })] }) })] }), _jsxs("div", { className: "detail-section", children: [_jsxs("div", { className: "detail-section-header", children: [_jsx("span", { className: "detail-section-icon", children: "\uD83C\uDFE5" }), _jsx("h4", { children: "Th\u00F4ng tin chuy\u00EAn m\u00F4n" })] }), _jsx("table", { className: "detail-table", children: _jsxs("tbody", { children: [_jsxs("tr", { children: [_jsx("td", { className: "detail-label", children: "Chuy\u00EAn khoa" }), _jsx("td", { className: "detail-value", children: doctor.profile_specialty })] }), _jsxs("tr", { children: [_jsx("td", { className: "detail-label", children: "Kinh nghi\u1EC7m" }), _jsxs("td", { className: "detail-value", children: [doctor.years_exp, " n\u0103m"] })] }), _jsxs("tr", { children: [_jsx("td", { className: "detail-label", children: "\u0110\u00E1nh gi\u00E1" }), _jsx("td", { className: "detail-value", children: _jsx(StarRating, { rating: doctor.avg_rating }) })] }), _jsxs("tr", { children: [_jsx("td", { className: "detail-label", children: "H\u1ECDc v\u1ECB" }), _jsx("td", { className: "detail-value", children: _jsx("span", { className: "degree-badge", children: getDegree(doctor.profile_specialty, doctor.years_exp) }) })] })] }) })] }), doctor.bio && (_jsxs("div", { className: "detail-section full-width", children: [_jsxs("div", { className: "detail-section-header", children: [_jsx("span", { className: "detail-section-icon", children: "\uD83D\uDCDD" }), _jsx("h4", { children: "Gi\u1EDBi thi\u1EC7u" })] }), _jsx("p", { className: "bio-text", children: doctor.bio })] })), doctor.availabilities && doctor.availabilities.length > 0 && (_jsxs("div", { className: "detail-section full-width", children: [_jsxs("div", { className: "detail-section-header", children: [_jsx("span", { className: "detail-section-icon", children: "\uD83D\uDCC5" }), _jsx("h4", { children: "L\u1ECBch l\u00E0m vi\u1EC7c" })] }), _jsx("div", { className: "availability-list", children: doctor.availabilities.map((avail, index) => (_jsxs("div", { className: "availability-item", children: [_jsx("span", { className: "availability-day", children: WEEKDAY_NAMES[avail.weekday] }), _jsxs("span", { className: "availability-time", children: [avail.start_time, " - ", avail.end_time] })] }, `${avail.weekday}-${index}`))) })] }))] }) })] }) }));
});
DoctorModal.displayName = 'DoctorModal';
const CreateDoctorModal = memo(({ isOpen, onClose, onCreate, specialties }) => {
    const [formData, setFormData] = useState({
        email: '',
        full_name: '',
        password: '',
        gender: '',
        specialty: '',
        years_exp: 0,
        bio: ''
    });
    useEffect(() => {
        if (isOpen) {
            setFormData({
                email: '',
                full_name: '',
                password: '',
                gender: '',
                specialty: '',
                years_exp: 0,
                bio: ''
            });
        }
    }, [isOpen]);
    if (!isOpen)
        return null;
    const handleSubmit = (e) => {
        e.preventDefault();
        const submitData = {
            email: formData.email,
            full_name: formData.full_name,
            password: formData.password,
            specialty: formData.specialty,
            years_exp: formData.years_exp
        };
        if (formData.gender)
            submitData.gender = formData.gender;
        if (formData.bio)
            submitData.bio = formData.bio;
        onCreate(submitData);
    };
    return (_jsx("div", { className: "modal-overlay", onClick: onClose, children: _jsxs("div", { className: "modal-content", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "modal-header", children: [_jsx("h3", { children: "Th\u00EAm b\u00E1c s\u0129 m\u1EDBi" }), _jsx("button", { className: "modal-close", onClick: onClose, children: "\u00D7" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "modal-body", children: [_jsxs("div", { className: "doctor-detail-grid", children: [_jsxs("div", { className: "detail-section", children: [_jsxs("div", { className: "detail-section-header", children: [_jsx("span", { className: "detail-section-icon", children: "\uD83D\uDC64" }), _jsx("h4", { children: "Th\u00F4ng tin c\u00E1 nh\u00E2n" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Email *" }), _jsx("input", { type: "email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), className: "form-input", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "H\u1ECD v\u00E0 t\u00EAn *" }), _jsx("input", { type: "text", value: formData.full_name, onChange: (e) => setFormData({ ...formData, full_name: e.target.value }), className: "form-input", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "M\u1EADt kh\u1EA9u * (8-16 k\u00FD t\u1EF1, bao g\u1ED3m ch\u1EEF hoa, ch\u1EEF th\u01B0\u1EDDng, s\u1ED1 v\u00E0 k\u00FD t\u1EF1 \u0111\u1EB7c bi\u1EC7t)" }), _jsx("input", { type: "password", value: formData.password, onChange: (e) => setFormData({ ...formData, password: e.target.value }), className: "form-input", minLength: 8, maxLength: 16, required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Gi\u1EDBi t\u00EDnh" }), _jsxs("select", { value: formData.gender, onChange: (e) => setFormData({ ...formData, gender: e.target.value }), className: "form-input", children: [_jsx("option", { value: "", children: "Ch\u1ECDn gi\u1EDBi t\u00EDnh" }), _jsx("option", { value: "MALE", children: "Nam" }), _jsx("option", { value: "FEMALE", children: "N\u1EEF" }), _jsx("option", { value: "OTHER", children: "Kh\u00E1c" })] })] })] }), _jsxs("div", { className: "detail-section", children: [_jsxs("div", { className: "detail-section-header", children: [_jsx("span", { className: "detail-section-icon", children: "\uD83C\uDFE5" }), _jsx("h4", { children: "Th\u00F4ng tin chuy\u00EAn m\u00F4n" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Chuy\u00EAn khoa *" }), _jsxs("select", { value: formData.specialty, onChange: (e) => setFormData({ ...formData, specialty: e.target.value }), className: "form-input", required: true, children: [_jsx("option", { value: "", children: "Ch\u1ECDn chuy\u00EAn khoa" }), specialties.map((spec) => (_jsx("option", { value: spec, children: spec }, spec)))] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Kinh nghi\u1EC7m (n\u0103m) *" }), _jsx("input", { type: "number", value: formData.years_exp, onChange: (e) => setFormData({ ...formData, years_exp: parseInt(e.target.value) || 0 }), className: "form-input", min: "0", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Gi\u1EDBi thi\u1EC7u" }), _jsx("textarea", { value: formData.bio, onChange: (e) => setFormData({ ...formData, bio: e.target.value }), className: "form-input", rows: 4, placeholder: "Nh\u1EADp th\u00F4ng tin gi\u1EDBi thi\u1EC7u v\u1EC1 b\u00E1c s\u0129..." })] })] })] }), _jsxs("div", { className: "modal-footer", children: [_jsx("button", { type: "button", onClick: onClose, className: "btn-cancel", children: "H\u1EE7y" }), _jsx("button", { type: "submit", className: "btn-save", disabled: !formData.email || !formData.full_name || !formData.password || !formData.specialty, children: "T\u1EA1o b\u00E1c s\u0129" })] })] })] }) }));
});
CreateDoctorModal.displayName = 'CreateDoctorModal';
// Main Component
export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [specialtyFilter, setSpecialtyFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchField, setSearchField] = useState('all');
    const [sort, setSort] = useState({ field: 'name', order: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [allSpecialties, setAllSpecialties] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const hasInitialized = useRef(false);
    // Debounce search query
    const debouncedSearchQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);
    // Load specialties
    const loadSpecialties = useCallback(async () => {
        try {
            const allData = (await doctorService.getAll({}));
            const specialties = Array.from(new Set(allData.map((d) => d.specialty).filter(Boolean)));
            setAllSpecialties(specialties);
        }
        catch (e) {
            console.error('Error loading specialties:', e);
        }
    }, []);
    // Load doctors with filters
    const loadDoctors = useCallback(async (specialty, search, searchFieldType, sortField, sortOrder) => {
        try {
            setLoading(true);
            setError(undefined);
            const params = {};
            if (specialty !== 'all') {
                params.specialty = specialty;
            }
            if (search.trim()) {
                params.search = search.trim();
                params.search_field = searchFieldType;
            }
            if (sortField) {
                params.sort_by = sortField;
                params.sort_order = sortOrder;
            }
            const data = (await doctorService.getAll(params));
            setDoctors(data);
            setCurrentPage(1);
        }
        catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Không thể tải danh sách bác sĩ';
            setError(errorMessage);
            console.error('Error loading doctors:', e);
        }
        finally {
            setLoading(false);
        }
    }, []);
    // Initialize on mount
    useEffect(() => {
        if (hasInitialized.current)
            return;
        hasInitialized.current = true;
        const initialize = async () => {
            await loadSpecialties();
            await loadDoctors('all', '', 'all', 'name', 'asc');
        };
        initialize();
    }, [loadSpecialties, loadDoctors]);
    // Reload when filters change
    useEffect(() => {
        if (!hasInitialized.current)
            return;
        loadDoctors(specialtyFilter, debouncedSearchQuery, searchField, sort.field, sort.order);
    }, [specialtyFilter, debouncedSearchQuery, searchField, sort.field, sort.order, loadDoctors]);
    // Handlers
    const handleViewDoctor = useCallback(async (doctorId) => {
        try {
            const detail = (await doctorService.getById(doctorId));
            setSelectedDoctor(detail);
        }
        catch (e) {
            console.error('Error loading doctor detail:', e);
            alert('Không thể tải thông tin chi tiết bác sĩ');
        }
    }, []);
    const handleCreateDoctor = useCallback(async (data) => {
        try {
            await doctorService.create(data);
            setIsCreateModalOpen(false);
            loadDoctors(specialtyFilter, debouncedSearchQuery, searchField, sort.field, sort.order);
        }
        catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Có lỗi xảy ra khi tạo bác sĩ';
            alert(errorMessage);
            console.error('Error creating doctor:', e);
        }
    }, [specialtyFilter, debouncedSearchQuery, searchField, sort.field, sort.order, loadDoctors]);
    const handleDelete = useCallback(async (doctorId, doctorName) => {
        if (!confirm(`Bạn có chắc muốn xóa bác sĩ "${doctorName}"?`))
            return;
        // Optimistic update
        setDoctors((prev) => prev.filter((d) => d.id !== doctorId));
        try {
            await doctorService.delete(doctorId);
        }
        catch (e) {
            // Revert on error
            loadDoctors(specialtyFilter, debouncedSearchQuery, searchField, sort.field, sort.order);
            alert('Có lỗi xảy ra khi xóa bác sĩ');
            console.error('Error deleting doctor:', e);
        }
    }, [specialtyFilter, debouncedSearchQuery, searchField, sort.field, sort.order, loadDoctors]);
    const handleSort = useCallback((field) => {
        setSort((prev) => ({
            field,
            order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
        }));
    }, []);
    const handleSearch = useCallback((e) => {
        e.preventDefault();
        // Search is handled by debounced query
    }, []);
    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);
    // Computed values
    const totalPages = useMemo(() => Math.ceil(doctors.length / ITEMS_PER_PAGE), [doctors.length]);
    const paginatedDoctors = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return doctors.slice(startIndex, endIndex);
    }, [doctors, currentPage]);
    // Render loading state
    if (loading && doctors.length === 0) {
        return (_jsx(Layout, { children: _jsx("div", { className: "doctors-container", children: _jsxs("div", { className: "doctors-loading", children: [_jsx("div", { className: "spinner" }), _jsx("p", { children: "\u0110ang t\u1EA3i..." })] }) }) }));
    }
    // Render error state
    if (error && doctors.length === 0) {
        return (_jsx(Layout, { children: _jsx("div", { className: "doctors-container", children: _jsxs("div", { className: "doctors-error", children: [_jsx("div", { className: "error-text", children: error }), _jsx("button", { onClick: () => loadDoctors(specialtyFilter, debouncedSearchQuery, searchField, sort.field, sort.order), className: "retry-button", children: "Th\u1EED l\u1EA1i" })] }) }) }));
    }
    return (_jsx(Layout, { children: _jsxs("div", { className: "doctors-container", children: [_jsx("div", { className: "doctors-header", children: _jsx("h2", { children: "Doctor Management" }) }), _jsx(SpecialtyFilter, { specialties: allSpecialties, selected: specialtyFilter, onSelect: setSpecialtyFilter }), _jsxs("div", { className: "doctors-toolbar", children: [_jsxs("div", { className: "toolbar-left", children: [_jsxs("select", { className: "search-field-dropdown", value: searchField, onChange: (e) => setSearchField(e.target.value), "aria-label": "Select search field", children: [_jsx("option", { value: "all", children: SEARCH_FIELD_LABELS.ALL }), _jsx("option", { value: "name", children: SEARCH_FIELD_LABELS.NAME }), _jsx("option", { value: "email", children: SEARCH_FIELD_LABELS.EMAIL }), _jsx("option", { value: "specialty", children: SEARCH_FIELD_LABELS.SPECIALTY })] }), _jsxs("form", { onSubmit: handleSearch, className: "search-form", children: [_jsx("input", { type: "text", className: "search-input", placeholder: searchField === 'all'
                                                ? SEARCH_PLACEHOLDERS.ALL
                                                : searchField === 'name'
                                                    ? SEARCH_PLACEHOLDERS.NAME
                                                    : searchField === 'email'
                                                        ? SEARCH_PLACEHOLDERS.EMAIL
                                                        : SEARCH_PLACEHOLDERS.SPECIALTY, value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), "aria-label": "Search doctors" }), _jsx("button", { type: "submit", className: "search-button", "aria-label": "Search", children: "\uD83D\uDD0D" })] })] }), _jsx("button", { className: "add-doctor-btn", onClick: () => setIsCreateModalOpen(true), children: "+ Add Doctor" })] }), loading && doctors.length > 0 && (_jsx("div", { className: "loading-overlay", children: _jsx("div", { className: "spinner" }) })), _jsx("div", { className: "doctors-table-wrapper", children: _jsxs("table", { className: "doctors-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: TABLE_HEADER_LABELS.AVATAR }), _jsx(SortableHeader, { field: "name", label: TABLE_HEADER_LABELS.NAME, currentSort: sort, onSort: handleSort }), _jsx("th", { children: TABLE_HEADER_LABELS.EMAIL }), _jsx(SortableHeader, { field: "specialty", label: TABLE_HEADER_LABELS.SPECIALIZATION, currentSort: sort, onSort: handleSort }), _jsx("th", { children: TABLE_HEADER_LABELS.DEGREE }), _jsx(SortableHeader, { field: "experience", label: TABLE_HEADER_LABELS.EXPERIENCE, currentSort: sort, onSort: handleSort }), _jsx(SortableHeader, { field: "rating", label: TABLE_HEADER_LABELS.RATING, currentSort: sort, onSort: handleSort }), _jsx("th", { children: TABLE_HEADER_LABELS.ACTION })] }) }), _jsx("tbody", { children: paginatedDoctors.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 8, className: "no-data", children: "Kh\u00F4ng c\u00F3 b\u00E1c s\u0129 n\u00E0o" }) })) : (paginatedDoctors.map((doctor) => (_jsx(DoctorRow, { doctor: doctor, onView: handleViewDoctor, onDelete: handleDelete }, doctor.id)))) })] }) }), _jsx(Pagination, { currentPage: currentPage, totalPages: totalPages, onPageChange: handlePageChange }), _jsx(CreateDoctorModal, { isOpen: isCreateModalOpen, onClose: () => setIsCreateModalOpen(false), onCreate: handleCreateDoctor, specialties: allSpecialties }), _jsx(DoctorModal, { doctor: selectedDoctor, onClose: () => setSelectedDoctor(null) })] }) }));
}
