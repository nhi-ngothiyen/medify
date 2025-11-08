import logo from '../../assets/logo.png';
import './Sidebar.css';

interface SidebarLink {
  id: string;
  label: string;
  active?: boolean;
}

const sidebarLinks: SidebarLink[] = [
  { id: 'overview', label: 'Overview', active: true },
  { id: 'doctor', label: 'Doctor' },
  { id: 'patient', label: 'Patient' },
  { id: 'department', label: 'Department' },
  { id: 'appointment', label: 'Appointment' },
  { id: 'pharmacy', label: 'Pharmacy' },
  { id: 'payment', label: 'Payment' },
  { id: 'report', label: 'Report' },
  { id: 'notice', label: 'Notice' },
  { id: 'settings', label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src={logo} alt="MediKit logo" className="sidebar-logo" />
        <span className="sidebar-title">MediKit</span>
      </div>
      <nav className="sidebar-nav">
        {sidebarLinks.map((link) => (
          <a
            key={link.id}
            className={`sidebar-link ${link.active ? 'active' : ''}`}
            href="#"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

