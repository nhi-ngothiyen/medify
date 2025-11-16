import { useEffect, useState, useRef, useMemo, useCallback, memo } from 'react';
import { doctorService } from '../../services/apiService';
import { Doctor, DoctorDetail } from '../../types';
import Layout from '../../components/Layout';
import { SEARCH_FIELD_LABELS, TABLE_HEADER_LABELS, SEARCH_PLACEHOLDERS } from '../../constants';
import './Doctors.css';

// Constants
const ITEMS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 500;
const WEEKDAY_NAMES = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

const SPECIALTY_TO_DEGREE: Record<string, string> = {
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

type SortField = 'name' | 'experience' | 'rating' | 'specialty';
type SortOrder = 'asc' | 'desc';
type SearchField = 'all' | 'name' | 'email' | 'specialty';

interface SortState {
  field: SortField;
  order: SortOrder;
}

// Helper functions
const getDegree = (specialty: string, yearsExp: number): string => {
  return SPECIALTY_TO_DEGREE[specialty] || (yearsExp > 10 ? 'Thạc sĩ' : 'Bác sĩ chuyên khoa I');
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Custom hook for debounce
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

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

// Star Rating Component
interface StarRatingProps {
  rating: number;
}

const StarRating = memo(({ rating }: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${
            star <= fullStars
              ? 'filled'
              : star === fullStars + 1 && hasHalfStar
              ? 'half'
              : 'empty'
          }`}
        >
          ★
        </span>
      ))}
      <span className="rating-number">({rating.toFixed(1)})</span>
    </div>
  );
});

StarRating.displayName = 'StarRating';

// Sortable Header Component
interface SortableHeaderProps {
  field: SortField;
  label: string;
  currentSort: SortState;
  onSort: (field: SortField) => void;
}

const SortableHeader = memo(({ field, label, currentSort, onSort }: SortableHeaderProps) => {
  const isActive = currentSort.field === field;
  const icon = isActive ? (currentSort.order === 'asc' ? '↑' : '↓') : null;

  return (
    <th className="sortable" onClick={() => onSort(field)}>
      {label}
      {icon && <span className="sort-icon">{icon}</span>}
    </th>
  );
});

SortableHeader.displayName = 'SortableHeader';

// Doctor Row Component
interface DoctorRowProps {
  doctor: Doctor;
  onView: (id: number) => void;
  onDelete: (id: number, name: string) => void;
}

const DoctorRow = memo(({ doctor, onView, onDelete }: DoctorRowProps) => {
  const handleDelete = useCallback(() => {
    onDelete(doctor.id, doctor.full_name);
  }, [doctor.id, doctor.full_name, onDelete]);

  const handleView = useCallback(() => {
    onView(doctor.id);
  }, [doctor.id, onView]);

  return (
    <tr>
      <td>
        <div className="avatar-cell">
          <div className="doctor-avatar">{getInitials(doctor.full_name)}</div>
        </div>
      </td>
      <td>
        <button className="doctor-name-link" onClick={handleView}>
          {doctor.full_name}
        </button>
      </td>
      <td>{doctor.email}</td>
      <td>{doctor.specialty}</td>
      <td>
        <span className="degree-badge">{getDegree(doctor.specialty, doctor.years_exp)}</span>
      </td>
      <td>
        <div className="experience-cell">
          <span className="calendar-icon">📅</span>
          {doctor.years_exp} years
        </div>
      </td>
      <td>
        <StarRating rating={doctor.avg_rating} />
      </td>
      <td>
        <button className="delete-btn" onClick={handleDelete}>
          🗑️ Delete
        </button>
      </td>
    </tr>
  );
});

DoctorRow.displayName = 'DoctorRow';

// Specialty Filter Component
interface SpecialtyFilterProps {
  specialties: string[];
  selected: string;
  onSelect: (specialty: string) => void;
}

const SpecialtyFilter = memo(({ specialties, selected, onSelect }: SpecialtyFilterProps) => {
  return (
    <div className="specialty-filters">
      <button
        className={`specialty-filter-btn ${selected === 'all' ? 'active' : ''}`}
        onClick={() => onSelect('all')}
      >
        All Specializations
      </button>
      {specialties.map((specialty) => (
        <button
          key={specialty}
          className={`specialty-filter-btn ${selected === specialty ? 'active' : ''}`}
          onClick={() => onSelect(specialty)}
        >
          {specialty}
        </button>
      ))}
    </div>
  );
});

SpecialtyFilter.displayName = 'SpecialtyFilter';

// Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = memo(({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ←
      </button>
      {getPageNumbers().map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="pagination-ellipsis">
              ...
            </span>
          );
        }
        return (
          <button
            key={page}
            className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
            onClick={() => onPageChange(page as number)}
          >
            {page}
          </button>
        );
      })}
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        →
      </button>
    </div>
  );
});

Pagination.displayName = 'Pagination';

// Doctor Modal Component
interface DoctorModalProps {
  doctor: DoctorDetail | null;
  onClose: () => void;
}

const DoctorModal = memo(({ doctor, onClose }: DoctorModalProps) => {
  if (!doctor) return null;

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Thông tin chi tiết bác sĩ</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="doctor-detail-grid">
            {/* Basic Information */}
            <div className="detail-section">
              <div className="detail-section-header">
                <span className="detail-section-icon">👤</span>
                <h4>Thông tin cá nhân</h4>
              </div>
              <table className="detail-table">
                <tbody>
                  <tr>
                    <td className="detail-label">Họ và tên</td>
                    <td className="detail-value">{doctor.user.full_name}</td>
                  </tr>
                  <tr>
                    <td className="detail-label">Email</td>
                    <td className="detail-value">{doctor.user.email}</td>
                  </tr>
                  <tr>
                    <td className="detail-label">Giới tính</td>
                    <td className="detail-value">
                      {doctor.user.gender === 'MALE'
                        ? 'Nam'
                        : doctor.user.gender === 'FEMALE'
                        ? 'Nữ'
                        : 'Khác'}
                    </td>
                  </tr>
                  <tr>
                    <td className="detail-label">Trạng thái</td>
                    <td className="detail-value">
                      <span
                        className={`status-badge ${doctor.user.is_active ? 'active' : 'inactive'}`}
                      >
                        {doctor.user.is_active ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Professional Information */}
            <div className="detail-section">
              <div className="detail-section-header">
                <span className="detail-section-icon">🏥</span>
                <h4>Thông tin chuyên môn</h4>
              </div>
              <table className="detail-table">
                <tbody>
                  <tr>
                    <td className="detail-label">Chuyên khoa</td>
                    <td className="detail-value">{doctor.profile_specialty}</td>
                  </tr>
                  <tr>
                    <td className="detail-label">Kinh nghiệm</td>
                    <td className="detail-value">{doctor.years_exp} năm</td>
                  </tr>
                  <tr>
                    <td className="detail-label">Đánh giá</td>
                    <td className="detail-value">
                      <StarRating rating={doctor.avg_rating} />
                    </td>
                  </tr>
                  <tr>
                    <td className="detail-label">Học vị</td>
                    <td className="detail-value">
                      <span className="degree-badge">
                        {getDegree(doctor.profile_specialty, doctor.years_exp)}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bio */}
            {doctor.bio && (
              <div className="detail-section full-width">
                <div className="detail-section-header">
                  <span className="detail-section-icon">📝</span>
                  <h4>Giới thiệu</h4>
                </div>
                <p className="bio-text">{doctor.bio}</p>
              </div>
            )}

            {/* Availability */}
            {doctor.availabilities && doctor.availabilities.length > 0 && (
              <div className="detail-section full-width">
                <div className="detail-section-header">
                  <span className="detail-section-icon">📅</span>
                  <h4>Lịch làm việc</h4>
                </div>
                <div className="availability-list">
                  {doctor.availabilities.map((avail, index) => (
                    <div key={`${avail.weekday}-${index}`} className="availability-item">
                      <span className="availability-day">{WEEKDAY_NAMES[avail.weekday]}</span>
                      <span className="availability-time">
                        {avail.start_time} - {avail.end_time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

DoctorModal.displayName = 'DoctorModal';

// Main Component
export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorDetail | null>(null);
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchField, setSearchField] = useState<SearchField>('all');
  const [sort, setSort] = useState<SortState>({ field: 'name', order: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [allSpecialties, setAllSpecialties] = useState<string[]>([]);
  const hasInitialized = useRef(false);

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  // Load specialties
  const loadSpecialties = useCallback(async () => {
    try {
      const allData = (await doctorService.getAll({})) as Doctor[];
      const specialties = Array.from(
        new Set(allData.map((d: Doctor) => d.specialty).filter(Boolean))
      ) as string[];
      setAllSpecialties(specialties);
    } catch (e) {
      console.error('Error loading specialties:', e);
    }
  }, []);

  // Load doctors with filters
  const loadDoctors = useCallback(
    async (
      specialty: string,
      search: string,
      searchFieldType: SearchField,
      sortField: SortField,
      sortOrder: SortOrder
    ) => {
      try {
        setLoading(true);
        setError(undefined);

        const params: {
          specialty?: string;
          search?: string;
          search_field?: string;
          sort_by?: string;
          sort_order?: string;
        } = {};

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

        const data = (await doctorService.getAll(params)) as Doctor[];
        setDoctors(data);
        setCurrentPage(1);
      } catch (e: unknown) {
        const errorMessage =
          e instanceof Error ? e.message : 'Không thể tải danh sách bác sĩ';
        setError(errorMessage);
        console.error('Error loading doctors:', e);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Initialize on mount
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initialize = async () => {
      await loadSpecialties();
      await loadDoctors('all', '', 'all', 'name', 'asc');
    };
    initialize();
  }, [loadSpecialties, loadDoctors]);

  // Reload when filters change
  useEffect(() => {
    if (!hasInitialized.current) return;
    loadDoctors(specialtyFilter, debouncedSearchQuery, searchField, sort.field, sort.order);
  }, [specialtyFilter, debouncedSearchQuery, searchField, sort.field, sort.order, loadDoctors]);

  // Handlers
  const handleViewDoctor = useCallback(async (doctorId: number) => {
    try {
      const detail = (await doctorService.getById(doctorId)) as DoctorDetail;
      setSelectedDoctor(detail);
    } catch (e) {
      console.error('Error loading doctor detail:', e);
      alert('Không thể tải thông tin chi tiết bác sĩ');
    }
  }, []);

  const handleDelete = useCallback(
    async (doctorId: number, doctorName: string) => {
      if (!confirm(`Bạn có chắc muốn xóa bác sĩ "${doctorName}"?`)) return;

      // Optimistic update
      setDoctors((prev) => prev.filter((d) => d.id !== doctorId));

      try {
        await doctorService.delete(doctorId);
      } catch (e) {
        // Revert on error
        loadDoctors(specialtyFilter, debouncedSearchQuery, searchField, sort.field, sort.order);
        alert('Có lỗi xảy ra khi xóa bác sĩ');
        console.error('Error deleting doctor:', e);
      }
    },
    [specialtyFilter, debouncedSearchQuery, searchField, sort.field, sort.order, loadDoctors]
  );

  const handleSort = useCallback((field: SortField) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by debounced query
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Computed values
  const totalPages = useMemo(
    () => Math.ceil(doctors.length / ITEMS_PER_PAGE),
    [doctors.length]
  );

  const paginatedDoctors = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return doctors.slice(startIndex, endIndex);
  }, [doctors, currentPage]);

  // Render loading state
  if (loading && doctors.length === 0) {
    return (
      <Layout>
        <div className="doctors-container">
          <div className="doctors-loading">
            <div className="spinner"></div>
            <p>Đang tải...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Render error state
  if (error && doctors.length === 0) {
    return (
      <Layout>
        <div className="doctors-container">
          <div className="doctors-error">
            <div className="error-text">{error}</div>
            <button
              onClick={() => loadDoctors(specialtyFilter, debouncedSearchQuery, searchField, sort.field, sort.order)}
              className="retry-button"
            >
              Thử lại
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="doctors-container">
        <div className="doctors-header">
          <h2>Doctor Management</h2>
        </div>

        {/* Specialization Filters */}
        <SpecialtyFilter
          specialties={allSpecialties}
          selected={specialtyFilter}
          onSelect={setSpecialtyFilter}
        />

        {/* Search and Add Doctor */}
        <div className="doctors-toolbar">
          <div className="toolbar-left">
            <select
              className="search-field-dropdown"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value as SearchField)}
              aria-label="Select search field"
            >
              <option value="all">{SEARCH_FIELD_LABELS.ALL}</option>
              <option value="name">{SEARCH_FIELD_LABELS.NAME}</option>
              <option value="email">{SEARCH_FIELD_LABELS.EMAIL}</option>
              <option value="specialty">{SEARCH_FIELD_LABELS.SPECIALTY}</option>
            </select>
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                className="search-input"
                placeholder={
                  searchField === 'all'
                    ? SEARCH_PLACEHOLDERS.ALL
                    : searchField === 'name'
                    ? SEARCH_PLACEHOLDERS.NAME
                    : searchField === 'email'
                    ? SEARCH_PLACEHOLDERS.EMAIL
                    : SEARCH_PLACEHOLDERS.SPECIALTY
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search doctors"
              />
              <button type="submit" className="search-button" aria-label="Search">
                🔍
              </button>
            </form>
          </div>
          <button
            className="add-doctor-btn"
            onClick={() => alert('Tính năng thêm bác sĩ sẽ được triển khai sau')}
          >
            + Add Doctor
          </button>
        </div>

        {/* Loading overlay for subsequent loads */}
        {loading && doctors.length > 0 && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}

        {/* Table */}
        <div className="doctors-table-wrapper">
          <table className="doctors-table">
            <thead>
              <tr>
                <th>{TABLE_HEADER_LABELS.AVATAR}</th>
                <SortableHeader field="name" label={TABLE_HEADER_LABELS.NAME} currentSort={sort} onSort={handleSort} />
                <th>{TABLE_HEADER_LABELS.EMAIL}</th>
                <SortableHeader
                  field="specialty"
                  label={TABLE_HEADER_LABELS.SPECIALIZATION}
                  currentSort={sort}
                  onSort={handleSort}
                />
                <th>{TABLE_HEADER_LABELS.DEGREE}</th>
                <SortableHeader
                  field="experience"
                  label={TABLE_HEADER_LABELS.EXPERIENCE}
                  currentSort={sort}
                  onSort={handleSort}
                />
                <SortableHeader
                  field="rating"
                  label={TABLE_HEADER_LABELS.RATING}
                  currentSort={sort}
                  onSort={handleSort}
                />
                <th>{TABLE_HEADER_LABELS.ACTION}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDoctors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="no-data">
                    Không có bác sĩ nào
                  </td>
                </tr>
              ) : (
                paginatedDoctors.map((doctor) => (
                  <DoctorRow
                    key={doctor.id}
                    doctor={doctor}
                    onView={handleViewDoctor}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Modal */}
        <DoctorModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />
      </div>
    </Layout>
  );
}
