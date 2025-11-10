import { useEffect, useState } from 'react';
import { appointmentService } from '../../services/apiService';
import { Appointment, AppointmentDetail, MedicalRecord, Prescription, Payment } from '../../types';
import Layout from '../../components/Layout';
import './Appointments.css';

// Mock data generators for sections not in database
const generateMockMedicalRecord = (appointment: Appointment): MedicalRecord => {
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

const generateMockPrescription = (appointment: Appointment): Prescription => {
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

const generateMockPayment = (appointment: Appointment): Payment => {
  const amounts = [250000, 400000, 300000, 350000, 200000];
  const methods = ['e-wallet', 'cash', 'card', 'bank transfer'];
  const statuses: Payment['status'][] = ['PAID', 'UNPAID', 'PENDING'];
  
  const index = appointment.id % amounts.length;
  const statusIndex = appointment.id % statuses.length;
  const methodIndex = appointment.id % methods.length;
  
  return {
    amount: amounts[index],
    status: statuses[statusIndex],
    paymentMethod: methods[methodIndex]
  };
};

interface AppointmentModalProps {
  appointment: AppointmentDetail | null;
  onClose: () => void;
}

function AppointmentModal({ appointment, onClose }: AppointmentModalProps) {
  if (!appointment) return null;

  const medicalRecord = appointment.medicalRecord || generateMockMedicalRecord(appointment);
  const prescription = appointment.prescription || generateMockPrescription(appointment);
  const payment = appointment.payment || generateMockPayment(appointment);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Appointment Details</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="appointment-detail-grid">
            {/* Medical Record - Top Left */}
            <div className="detail-section">
              <div className="detail-section-header">
                <span className="detail-section-icon">🏥</span>
                <h4>Medical Record</h4>
              </div>
              <table className="detail-table">
                <tbody>
                  <tr>
                    <td className="detail-label">Diagnosis</td>
                    <td className="detail-value">{medicalRecord.diagnosis || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="detail-label">Treatment</td>
                    <td className="detail-value">{medicalRecord.treatment || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="detail-label">Notes</td>
                    <td className="detail-value">{medicalRecord.notes || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Prescription - Top Right */}
            <div className="detail-section">
              <div className="detail-section-header">
                <span className="detail-section-icon">💊</span>
                <h4>Prescription</h4>
              </div>
              <table className="detail-table">
                <tbody>
                  <tr>
                    <td className="detail-label">Medicine Details</td>
                    <td className="detail-value">{prescription.medicineDetails || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment - Bottom Right */}
            <div className="detail-section">
              <div className="detail-section-header">
                <span className="detail-section-icon">💳</span>
                <h4>Payment</h4>
              </div>
              <table className="detail-table">
                <tbody>
                  <tr>
                    <td className="detail-label">Amount</td>
                    <td className="detail-value">
                      {payment.amount ? `${payment.amount.toLocaleString('vi-VN')} VNĐ` : 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="detail-label">Status</td>
                    <td className="detail-value">
                      <span className={`payment-status-badge ${payment.status?.toLowerCase()}`}>
                        {payment.status || 'N/A'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="detail-label">Payment Method</td>
                    <td className="detail-value">{payment.paymentMethod || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Feedback - Bottom Left */}
            <div className="detail-section">
              <div className="detail-section-header">
                <span className="detail-section-icon">⭐</span>
                <h4>Feedback</h4>
              </div>
              <table className="detail-table">
                <tbody>
                  <tr>
                    <td className="detail-label">Rating</td>
                    <td className="detail-value">
                      {appointment.review?.rating ? `${appointment.review.rating}/5` : 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="detail-label">Comment</td>
                    <td className="detail-value">{appointment.review?.comment || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDetail | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(undefined);
      const data = await appointmentService.getAll();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setAppointments(data);
        setFilteredAppointments(data);
      } else {
        console.error('Invalid data format:', data);
        setError('Dữ liệu không hợp lệ từ server');
      }
    } catch (e: any) {
      console.error('Error loading appointments:', e);
      const errorMessage = e?.message || 'Không thể tải danh sách appointments';
      
      // Provide more specific error messages
      if (errorMessage.includes('timeout') || errorMessage.includes('timeout')) {
        setError('Kết nối timeout. Vui lòng kiểm tra backend có đang chạy không.');
      } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        setError('Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy tại http://localhost:8000 không.');
      } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
        setError('Bạn không có quyền truy cập. Vui lòng đăng nhập với tài khoản admin.');
      } else {
        setError(`Không thể tải danh sách appointments: ${errorMessage}`);
      }
    } finally {
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

  const handleView = async (appointment: Appointment) => {
    // Use appointment from list and add mock data for sections not in database
    const detail: AppointmentDetail = {
      ...appointment,
      medicalRecord: generateMockMedicalRecord(appointment),
      prescription: generateMockPrescription(appointment),
      payment: generateMockPayment(appointment)
    };
    setSelectedAppointment(detail);
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${time} - ${dateStr}`;
  };

  const getStatusBadgeClass = (status: string) => {
    // Map 3 trạng thái thật từ backend
    const statusMap: { [key: string]: string } = {
      'BOOKED': 'scheduled',      // Đã đặt
      'CANCELED': 'cancelled',    // Đã hủy
      'DONE': 'completed'         // Hoàn thành
    };
    return statusMap[status] || 'default';
  };

  const getStatusLabel = (status: string) => {
    // Map 3 trạng thái thật từ backend sang tiếng Anh (lowercase)
    const labelMap: { [key: string]: string } = {
      'BOOKED': 'booked',
      'CANCELED': 'canceled',
      'DONE': 'done'
    };
    return labelMap[status] || status.toLowerCase();
  };

  const getPaymentStatus = (appointment: Appointment) => {
    // Mock payment status based on appointment
    const statuses: Payment['status'][] = ['PAID', 'UNPAID', 'PENDING'];
    const index = appointment.id % statuses.length;
    return statuses[index];
  };

  const getFees = (appointment: Appointment) => {
    // Mock fees
    const amounts = [250000, 400000, 300000, 350000, 200000];
    const index = appointment.id % amounts.length;
    return amounts[index];
  };

  if (loading) {
    return (
      <Layout>
        <div className="appointments-container">
          <div className="appointments-loading">
            <div className="spinner"></div>
            <p>Đang tải...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="appointments-container">
          <div className="appointments-error">
            <div className="error-text">{error}</div>
            <button onClick={loadAppointments} className="retry-button">Thử lại</button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="appointments-container">
        <div className="appointments-header">
          <h2>Appointments</h2>
        </div>

        {/* Filters */}
        <div className="appointments-filters">
          <div className="filter-group">
            <label htmlFor="status-filter">Filter by status</label>
            <select
              id="status-filter"
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="BOOKED">booked</option>
              <option value="CANCELED">canceled</option>
              <option value="DONE">done</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="date-filter">Filter by date</label>
            <input
              id="date-filter"
              type="date"
              className="filter-input"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="appointments-table-wrapper">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Doctor</th>
                <th>Specialization</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Fees</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="no-data">
                    Không có appointments nào
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      <div className="patient-cell">
                        <div className="avatar">
                          {appointment.patient?.full_name?.charAt(0) || 'P'}
                        </div>
                        <span>{appointment.patient?.full_name || 'N/A'}</span>
                      </div>
                    </td>
                    <td>{formatDate(appointment.start_at)}</td>
                    <td>
                      <div className="doctor-cell">
                        <div className="avatar doctor-avatar">
                          {appointment.doctor?.full_name?.charAt(0) || 'D'}
                        </div>
                        <span>{appointment.doctor?.full_name || 'N/A'}</span>
                      </div>
                    </td>
                    <td>{appointment.doctor?.specialty || 'N/A'}</td>
                    <td>{appointment.note || 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(appointment.status)}`}>
                        {getStatusLabel(appointment.status)}
                      </span>
                    </td>
                    <td>${getFees(appointment).toLocaleString('vi-VN')}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-button view-button"
                          onClick={() => handleView(appointment)}
                        >
                          📄 View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        <AppointmentModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      </div>
    </Layout>
  );
}

