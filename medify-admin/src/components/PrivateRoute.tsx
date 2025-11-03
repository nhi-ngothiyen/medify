/**
 * PrivateRoute Component
 * Protects routes that require authentication
 */

import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES, STORAGE_KEYS } from '../constants';

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  
  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  return <>{children}</>;
}

