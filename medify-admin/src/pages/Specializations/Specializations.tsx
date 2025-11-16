import { useEffect, useState, useCallback, memo } from 'react';
import { specializationService } from '../../services/apiService';
import { Specialization } from '../../types';
import Layout from '../../components/Layout';
import './Specializations.css';

type SortField = 'name' | 'doctor_count';
type SortOrder = 'asc' | 'desc';

interface SortState {
  field: SortField;
  order: SortOrder;
}

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

// Create Modal Component
interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

const CreateModal = memo(({ isOpen, onClose, onCreate }: CreateModalProps) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim());
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Thêm chuyên khoa mới</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Tên chuyên khoa:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder="Nhập tên chuyên khoa"
              autoFocus
            />
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Hủy
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={!name.trim()}
            >
              Tạo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

CreateModal.displayName = 'CreateModal';

// Edit Modal Component
interface EditModalProps {
  specialization: Specialization | null;
  onClose: () => void;
  onSave: (oldName: string, newName: string) => void;
}

const EditModal = memo(({ specialization, onClose, onSave }: EditModalProps) => {
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (specialization) {
      setNewName(specialization.name);
    }
  }, [specialization]);

  if (!specialization) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && newName !== specialization.name) {
      onSave(specialization.name, newName.trim());
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Chỉnh sửa chuyên khoa</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Tên chuyên khoa hiện tại:</label>
            <input type="text" value={specialization.name} disabled className="form-input-disabled" />
          </div>
          <div className="form-group">
            <label>Tên mới:</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="form-input"
              placeholder="Nhập tên chuyên khoa mới"
              autoFocus
            />
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Hủy
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={!newName.trim() || newName === specialization.name}
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

EditModal.displayName = 'EditModal';

// Main Component
export default function Specializations() {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState<SortState>({ field: 'name', order: 'asc' });
  const [editingSpecialization, setEditingSpecialization] = useState<Specialization | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadSpecializations = useCallback(async () => {
    try {
      setLoading(true);
      setError(undefined);

      const params: {
        search?: string;
        sort_by?: string;
        sort_order?: string;
      } = {};

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      if (sort.field) {
        params.sort_by = sort.field;
        params.sort_order = sort.order;
      }

      const data = await specializationService.getAll(params) as Specialization[];
      setSpecializations(data);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Không thể tải danh sách chuyên khoa';
      setError(errorMessage);
      console.error('Error loading specializations:', e);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, sort]);

  useEffect(() => {
    loadSpecializations();
  }, [loadSpecializations]);

  const handleSort = useCallback((field: SortField) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
  }, []);

  const handleCreate = useCallback(async (name: string) => {
    try {
      await specializationService.create(name);
      setIsCreateModalOpen(false);
      loadSpecializations();
    } catch (e: any) {
      const errorMessage = e instanceof Error ? e.message : 'Có lỗi xảy ra khi tạo chuyên khoa';
      alert(errorMessage);
      console.error('Error creating specialization:', e);
    }
  }, [loadSpecializations]);

  const handleEdit = useCallback((specialization: Specialization) => {
    setEditingSpecialization(specialization);
  }, []);

  const handleSave = useCallback(async (oldName: string, newName: string) => {
    try {
      await specializationService.update(oldName, newName);
      setEditingSpecialization(null);
      loadSpecializations();
    } catch (e) {
      alert('Có lỗi xảy ra khi cập nhật chuyên khoa');
      console.error('Error updating specialization:', e);
    }
  }, [loadSpecializations]);

  const handleDelete = useCallback(async (name: string, doctorCount: number) => {
    if (doctorCount > 0) {
      const action = confirm(
        `Chuyên khoa "${name}" có ${doctorCount} bác sĩ.\n\n` +
        `Chọn OK để chỉ xóa chuyên khoa (giữ lại bác sĩ)\n` +
        `Chọn Cancel để hủy`
      );
      
      if (!action) return;
    } else {
      if (!confirm(`Bạn có chắc muốn xóa chuyên khoa "${name}"?`)) return;
    }

    try {
      await specializationService.delete(name, 'clear');
      loadSpecializations();
    } catch (e) {
      alert('Có lỗi xảy ra khi xóa chuyên khoa');
      console.error('Error deleting specialization:', e);
    }
  }, [loadSpecializations]);

  if (loading && specializations.length === 0) {
    return (
      <Layout>
        <div className="specializations-container">
          <div className="specializations-loading">
            <div className="spinner"></div>
            <p>Đang tải...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && specializations.length === 0) {
    return (
      <Layout>
        <div className="specializations-container">
          <div className="specializations-error">
            <div className="error-text">{error}</div>
            <button onClick={loadSpecializations} className="retry-button">
              Thử lại
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="specializations-container">
        <div className="specializations-header">
          <h2>Specializations Management</h2>
        </div>

        <div className="specializations-toolbar">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm chuyên khoa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">🔍</button>
          </form>
          <button
            className="add-specialization-btn"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Thêm chuyên khoa
          </button>
        </div>

        {loading && specializations.length > 0 && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}

        <div className="specializations-table-wrapper">
          <table className="specializations-table">
            <thead>
              <tr>
                <SortableHeader
                  field="name"
                  label="Tên chuyên khoa"
                  currentSort={sort}
                  onSort={handleSort}
                />
                <SortableHeader
                  field="doctor_count"
                  label="Số bác sĩ"
                  currentSort={sort}
                  onSort={handleSort}
                />
                <th>Đánh giá trung bình</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {specializations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="no-data">
                    Không có chuyên khoa nào
                  </td>
                </tr>
              ) : (
                specializations.map((spec) => (
                  <tr key={spec.name}>
                    <td className="spec-name">{spec.name}</td>
                    <td className="spec-count">
                      <span className="count-badge">{spec.doctor_count}</span>
                    </td>
                    <td>
                      <StarRating rating={spec.avg_rating} />
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(spec)}
                          title="Chỉnh sửa"
                        >
                          ✏️
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(spec.name, spec.doctor_count)}
                          title="Xóa"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <CreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreate}
        />

        <EditModal
          specialization={editingSpecialization}
          onClose={() => setEditingSpecialization(null)}
          onSave={handleSave}
        />
      </div>
    </Layout>
  );
}
