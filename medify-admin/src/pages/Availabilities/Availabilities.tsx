import { useEffect, useState, useCallback, memo } from 'react';
import { availabilityService, doctorService } from '../../services/apiService';
import { Availability, Doctor } from '../../types';
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

// Create Modal Component
interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
  doctors: Doctor[];
}

const CreateModal = memo(({ isOpen, onClose, onCreate, doctors }: CreateModalProps) => {
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.doctor_user_id > 0) {
      onCreate(formData);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-small" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Time Slot</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Doctor *</label>
            <select
              value={formData.doctor_user_id}
              onChange={(e) => setFormData({ ...formData, doctor_user_id: parseInt(e.target.value) })}
              className="form-input"
              required
            >
              <option value={0}>Select doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.full_name} - {doctor.specialty}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Day *</label>
            <select
              value={formData.weekday}
              onChange={(e) => setFormData({ ...formData, weekday: parseInt(e.target.value) })}
              className="form-input"
              required
            >
              {WEEKDAYS.map((day) => (
                <option key={day.key} value={day.key}>{day.label}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Time *</label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label>End Time *</label>
              <input
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="form-input"
                required
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={formData.doctor_user_id === 0}
            >
              Add Slot
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
  availability: Availability | null;
  onClose: () => void;
  onSave: (id: number, data: any) => void;
}

const EditModal = memo(({ availability, onClose, onSave }: EditModalProps) => {
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

  if (!availability) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(availability.id, formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-small" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Time Slot</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Doctor</label>
            <input
              type="text"
              value={availability.doctor_name || ''}
              disabled
              className="form-input-disabled"
            />
          </div>
          <div className="form-group">
            <label>Day *</label>
            <select
              value={formData.weekday}
              onChange={(e) => setFormData({ ...formData, weekday: parseInt(e.target.value) })}
              className="form-input"
              required
            >
              {WEEKDAYS.map((day) => (
                <option key={day.key} value={day.key}>{day.label}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Time *</label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label>End Time *</label>
              <input
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="form-input"
                required
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

EditModal.displayName = 'EditModal';

// Helper functions for week navigation
const getWeekDates = (date: Date) => {
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

const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDateHeader = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Main Component
export default function Availabilities() {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [filterDoctorId, setFilterDoctorId] = useState<number>(0);
  const [filterWeekday, setFilterWeekday] = useState<number>(-1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAvailability, setEditingAvailability] = useState<Availability | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date());

  const loadDoctors = useCallback(async () => {
    try {
      const data = await doctorService.getAll({}) as Doctor[];
      setDoctors(data);
    } catch (e) {
      console.error('Error loading doctors:', e);
    }
  }, []);

  const loadAvailabilities = useCallback(async () => {
    try {
      setLoading(true);
      setError(undefined);

      const params: any = {};
      if (filterDoctorId > 0) params.doctor_id = filterDoctorId;
      if (filterWeekday >= 0) params.weekday = filterWeekday;

      const data = await availabilityService.getAll(params) as Availability[];
      setAvailabilities(data);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Không thể tải danh sách lịch làm việc';
      setError(errorMessage);
      console.error('Error loading availabilities:', e);
    } finally {
      setLoading(false);
    }
  }, [filterDoctorId, filterWeekday]);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  useEffect(() => {
    loadAvailabilities();
  }, [loadAvailabilities]);

  const handleCreate = useCallback(async (data: any) => {
    try {
      await availabilityService.create(data.doctor_user_id, {
        weekday: data.weekday,
        start_time: data.start_time,
        end_time: data.end_time
      });
      setIsCreateModalOpen(false);
      loadAvailabilities();
    } catch (e: any) {
      const errorMessage = e instanceof Error ? e.message : 'Có lỗi xảy ra khi tạo lịch làm việc';
      alert(errorMessage);
      console.error('Error creating availability:', e);
    }
  }, [loadAvailabilities]);

  const handleEdit = useCallback((availability: Availability) => {
    setEditingAvailability(availability);
  }, []);

  const handleSave = useCallback(async (id: number, data: any) => {
    try {
      await availabilityService.update(id, data);
      setEditingAvailability(null);
      loadAvailabilities();
    } catch (e) {
      alert('Có lỗi xảy ra khi cập nhật lịch làm việc');
      console.error('Error updating availability:', e);
    }
  }, [loadAvailabilities]);

  const handleDelete = useCallback(async (id: number, doctorName: string, weekday: number) => {
    const dayName = WEEKDAYS.find(d => d.key === weekday)?.label || 'Unknown';
    if (!confirm(`Are you sure you want to delete "${doctorName}"'s schedule on ${dayName}?`)) return;

    try {
      await availabilityService.delete(id);
      loadAvailabilities();
    } catch (e) {
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
  }, {} as Record<number, { doctor_name: string; doctor_specialty: string; slots: Record<number, Availability[]> }>);

  // Conditional renders AFTER all hooks
  if (loading && availabilities.length === 0) {
    return (
      <Layout>
        <div className="schedule-container">
          <div className="availabilities-loading">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && availabilities.length === 0) {
    return (
      <Layout>
        <div className="schedule-container">
          <div className="availabilities-error">
            <div className="error-text">{error}</div>
            <button onClick={loadAvailabilities} className="retry-button">
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="schedule-container">
        <div className="schedule-header">
          <div className="schedule-title">
            <span className="schedule-icon">📅</span>
            <h2>Schedule Manager</h2>
          </div>
          
          <div className="week-navigation">
            <div className="week-display">
              <span className="week-icon">🕐</span>
              <span className="week-text">
                Week: {formatDate(weekDates.start)} - {formatDate(weekDates.end)}
              </span>
            </div>
            <div className="week-controls">
              <button
                className="week-nav-btn"
                onClick={handlePreviousWeek}
                title="Previous week"
              >
                ‹
              </button>
              <button
                className="current-week-btn"
                onClick={handleCurrentWeek}
              >
                Current Week
              </button>
              <button
                className="week-nav-btn"
                onClick={handleNextWeek}
                title="Next week"
              >
                ›
              </button>
            </div>
          </div>

          <button
            className="add-slot-btn"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Add Time Slot
          </button>
        </div>

        <div className="schedule-filters">
          <select
            value={filterDoctorId}
            onChange={(e) => setFilterDoctorId(parseInt(e.target.value))}
            className="filter-dropdown"
          >
            <option value={0}>Filter by Specialization</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.specialty}
              </option>
            ))}
          </select>

          <select
            value={filterWeekday}
            onChange={(e) => setFilterWeekday(parseInt(e.target.value))}
            className="filter-dropdown"
          >
            <option value={-1}>Filter by Shift</option>
            {WEEKDAYS.map((day) => (
              <option key={day.key} value={day.key}>{day.label}</option>
            ))}
          </select>
        </div>

        {loading && availabilities.length > 0 && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}

        <div className="schedule-grid-wrapper">
          <div className="schedule-grid">
            {/* Header Row */}
            <div className="schedule-header-row">
              <div className="doctor-column-header">Doctor</div>
              {weekDateHeaders.map((day) => (
                <div key={day.key} className="day-column-header">
                  <div className="day-name">{day.label}</div>
                  <div className="day-date">{day.date}</div>
                </div>
              ))}
            </div>

            {/* Doctor Rows */}
            {Object.keys(groupedByDoctor).length === 0 ? (
              <div className="no-data-schedule">
                No schedules available
              </div>
            ) : (
              Object.entries(groupedByDoctor).map(([doctorId, data]) => (
                <div key={doctorId} className="doctor-row">
                  <div className="doctor-info">
                    <div className="doctor-name">{data.doctor_name}</div>
                    <div className="doctor-id">ID: {doctorId}</div>
                    <div className="doctor-specialty-badge">{data.doctor_specialty}</div>
                  </div>
                  {WEEKDAYS.map((day) => (
                    <div key={day.key} className="day-cell">
                      {data.slots[day.key]?.map((slot) => (
                        <div key={slot.id} className="time-slot">
                          <div className="time-slot-content">
                            {slot.start_time} - {slot.end_time}
                          </div>
                          <div className="time-slot-actions">
                            <button
                              className="slot-edit-btn"
                              onClick={() => handleEdit(slot)}
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              className="slot-delete-btn"
                              onClick={() => handleDelete(slot.id, data.doctor_name, slot.weekday)}
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        className="add-slot-cell-btn"
                        onClick={() => setIsCreateModalOpen(true)}
                        title="Add time slot"
                      >
                        +
                      </button>
                      <div className="day-label">{data.doctor_specialty}</div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

        <CreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreate}
          doctors={doctors}
        />

        <EditModal
          availability={editingAvailability}
          onClose={() => setEditingAvailability(null)}
          onSave={handleSave}
        />
      </div>
    </Layout>
  );
}
