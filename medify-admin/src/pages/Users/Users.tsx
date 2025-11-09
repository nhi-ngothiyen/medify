import { useEffect, useState } from 'react';
import { userService } from '../../services/apiService';
import { User } from '../../types';
import Layout from '../../components/Layout';
import './Users.css';

export default function Users() {
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const load = async () => {
    try {
      setLoading(true);
      setError(undefined);
      const data = await userService.getAll();
      setItems(data);
    } catch (e: any) {
      setError('Không thể tải danh sách người dùng');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (id: number) => {
    try {
      await userService.toggleActive(id);
      await load();
    } catch (e: any) {
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const reset = async (id: number) => {
    if (!confirm('Bạn có chắc muốn đặt lại mật khẩu?')) return;
    try {
      await userService.resetPassword(id);
      alert('Đã đặt lại mật khẩu thành công');
    } catch (e: any) {
      alert('Có lỗi xảy ra khi đặt lại mật khẩu');
    }
  };


  if (loading) {
    return (
      <Layout>
        <div className="users-container">
          <div className="users-loading">Đang tải...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="users-container">
          <div className="users-error">
            <div className="error-text">{error}</div>
            <button onClick={load} className="retry-button">Thử lại</button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="users-container">
        <div className="users-header">
          <h2>Quản lý người dùng</h2>
        </div>
        <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Tên</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {items.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.full_name}</td>
              <td>{u.role}</td>
              <td>
                <span className={`status-badge ${u.is_active ? 'active' : 'inactive'}`}>
                  {u.is_active ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </td>
              <td>
                <button onClick={() => toggle(u.id)} className="action-button">
                  {u.is_active ? 'Vô hiệu hóa' : 'Kích hoạt'}
                </button>
                <button onClick={() => reset(u.id)} className="action-button reset-button">
                  Đặt lại MK
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </Layout>
  );
}

