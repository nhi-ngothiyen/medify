import { ReactNode } from 'react';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-main">
        <Navbar />
        <div className="layout-content">
          {children}
        </div>
      </div>
    </div>
  );
}

