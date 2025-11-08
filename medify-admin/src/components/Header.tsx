import React from 'react';
import { api } from '../api';

export default function Header(){
  const doLogout = async () => {
    try {
      await api('/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('token');
    location.href = '/login';
  }

  return (
    <div style={{display:'flex', alignItems:'center', gap:12, padding:12, borderBottom:'1px solid #eee'}}>
      <div style={{fontWeight:700}}>Medify Admin</div>
      <div style={{marginLeft:'auto'}}>
        <button onClick={doLogout} style={{padding:'6px 10px'}}>Logout</button>
      </div>
    </div>
  );
}
