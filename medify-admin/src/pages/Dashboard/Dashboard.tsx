import { useEffect, useState } from 'react';
import { dashboardService } from '../../services/apiService';
import { DashboardData } from '../../types';
import Layout from '../../components/Layout';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, Legend, CartesianGrid } from 'recharts';
import './Dashboard.css';

const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6C5CE7', '#A8E6CF', '#FF8B94'];

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  iconBg: string;
}

function StatsCard({ title, value, icon, color, iconBg }: StatsCardProps) {
  return (
    <div className="stats-card">
      <div className="stats-icon" style={{ backgroundColor: iconBg }}>
        {icon}
      </div>
      <div className="stats-info">
        <div className="stats-value">{value}</div>
        <div className="stats-title">{title}</div>
      </div>
    </div>
  );
}

interface LegendItem {
  color: string;
  label: string;
  value?: number;
}

function ChartLegend({ items }: { items: LegendItem[] }) {
  if (!items || items.length === 0) {
    return null;
  }
  
  return (
    <div className="chart-legend">
      {items.map((item, index) => (
        <div key={`legend-${index}`} className="legend-item">
          <div 
            className="legend-color" 
            style={{ backgroundColor: item.color }}
          />
          <span className="legend-label">{item.label}</span>
          {item.value !== undefined && item.value > 0 && (
            <span className="legend-value">({item.value})</span>
          )}
        </div>
      ))}
    </div>
  );
}


export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const loadData = async () => {
    try {
      setLoading(true);
      setError(undefined);
      const dashboardData = await dashboardService.getAllDashboardData();
      setData(dashboardData);
    } catch (e: any) {
      setError('Không thể tải dữ liệu dashboard');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="dashboard-error">
          <div className="error-text">{error || 'Có lỗi xảy ra'}</div>
          <button onClick={loadData} className="retry-button">Thử lại</button>
        </div>
      </Layout>
    );
  }

  const { overview, specialties, appointments_by_status, appointment_trends } = data;

  // Transform specialties for donut chart
  const departmentData = specialties.map((s, idx) => ({
    name: s.specialty,
    value: s.appointment_count,
    color: COLORS[idx % COLORS.length]
  }));

  // Transform appointment status for pie chart
  const statusColors: { [key: string]: string } = {
    'BOOKED': '#F59E0B',
    'CANCELED': '#EF4444',
    'DONE': '#22C55E',
    'COMPLETED': '#3B82F6',  // Xanh dương
    'NO_SHOW': '#14B8A6',    // Xanh lá (teal)
    'SCHEDULED': '#A78BFA'   // Tím nhạt
  };

  const statusLabels: { [key: string]: string } = {
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


  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h2>Dashboard</h2>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <StatsCard
            title="Appointments"
            value={overview.total_appointments}
            icon="📋"
            color="#5B7FFF"
            iconBg="#E8EDFF"
          />
          <StatsCard
            title="Total Specializations"
            value={overview.total_specializations}
            icon="🏥"
            color="#FF9066"
            iconBg="#FFE8E0"
          />
          <StatsCard
            title="Total Patients"
            value={overview.total_patients}
            icon="👤"
            color="#A66CFF"
            iconBg="#F3EBFF"
          />
          <StatsCard
            title="Total Doctors"
            value={overview.total_doctors}
            icon="👨‍⚕️"
            color="#22C55E"
            iconBg="#DCFCE7"
          />
        </div>

        {/* Main Grid Layout */}
        <div className="dashboard-grid">
          {/* Patient Distribution by Department */}
          <div className="card department-chart-card">
            <div className="card-header">
              <h3>Phân bố bệnh nhân theo khoa</h3>
            </div>
            <div className="chart-container">
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      label={false}
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '13px',
                        padding: '10px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                      }}
                      formatter={(value: any, name: any) => [
                        `${value} bệnh nhân`,
                        name
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ChartLegend 
                items={departmentData.map(item => ({
                  color: item.color,
                  label: item.name,
                  value: item.value
                }))}
              />
            </div>
          </div>

          {/* Appointment Status Chart */}
          <div className="card status-chart-card">
            <div className="card-header">
              <h3>Phân bố trạng thái cuộc hẹn</h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={appointmentStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    label={false}
                  >
                    {appointmentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '13px',
                      padding: '10px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                    formatter={(value: any, name: any) => [
                      `${value} cuộc hẹn`,
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <ChartLegend 
                items={appointmentStatusData.map(item => ({
                  color: item.color,
                  label: item.name,
                  value: item.value
                }))}
              />
            </div>
          </div>

          {/* Appointment Trend Chart */}
          <div className="card trend-chart-card">
            <div className="card-header">
              <h3>Xu hướng cuộc hẹn</h3>
            </div>
            <div className="chart-container trend-chart-container">
              <ResponsiveContainer width="100%" height={160}>
                <LineChart 
                  data={trendData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280"
                    fontSize={8}
                    angle={-45}
                    textAnchor="end"
                    height={35}
                    interval={0}
                    tick={{ fontSize: 7 }}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={9}
                    allowDecimals={false}
                    width={30}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '2px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#5B7FFF" 
                    strokeWidth={2}
                    dot={{ fill: '#5B7FFF', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Số cuộc hẹn"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}

