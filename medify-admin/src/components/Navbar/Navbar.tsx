import { useEffect, useState } from 'react';
import { authService, userService } from '../../services/apiService';
import { User } from '../../types';
import { STORAGE_KEYS } from '../../constants';
import './Navbar.css';

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      // Try to get user from localStorage first
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      } else {
        // If not in localStorage, fetch from API
        const user = await userService.getCurrentUser();
        setCurrentUser(user);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      }
    } catch (e: any) {
      console.error('Failed to load current user:', e);
    }
  };

  const logout = () => {
    authService.logout();
  };

  // Helper function to get user initials
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="navbar">
      <div className="navbar-search">
        <span className="search-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false" role="presentation">
            <path
              d="M11 4a7 7 0 0 1 5.6 11.2l3.1 3.1a1 1 0 0 1-1.4 1.4l-3.1-3.1A7 7 0 1 1 11 4zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"
            />
          </svg>
        </span>
        <input
          type="search"
          placeholder="Search for Files, Patient or Files"
          className="navbar-search-input"
        />
      </div>
      <div className="navbar-actions">
        <div className="navbar-profile">
          <div className="navbar-avatar">
            {currentUser ? getInitials(currentUser.full_name) : 'U'}
          </div>
          <div className="navbar-profile-info">
            <span className="profile-name">
              {currentUser?.full_name || 'User'}
            </span>
            <span className="profile-role">
              {currentUser?.role?.toUpperCase() || 'LOADING'}
            </span>
          </div>
        </div>
        <button onClick={logout} className="logout-button">Đăng xuất</button>
      </div>
    </header>
  );
}

