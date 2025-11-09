import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { ROUTES } from '../../constants';
import './Sidebar.css';

interface SidebarLink {
  id: string;
  label: string;
  path: string;
  icon: string;
}

const sidebarLinks: SidebarLink[] = [
  { id: 'dashboard', label: 'Dashboard', path: ROUTES.DASHBOARD, icon: '📊' },
  { id: 'users', label: 'Quản lý người dùng', path: ROUTES.USERS, icon: '👥' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src={logo} alt="Medify logo" className="sidebar-logo" />
        <span className="sidebar-title">Medify Admin</span>
      </div>
      <nav className="sidebar-nav">
        {sidebarLinks.map((link) => (
          <Link
            key={link.id}
            to={link.path}
            className={`sidebar-link ${location.pathname === link.path || (location.pathname === '/' && link.path === ROUTES.DASHBOARD) ? 'active' : ''}`}
          >
            <span className="sidebar-link-icon">{link.icon}</span>
            <span className="sidebar-link-label">{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

