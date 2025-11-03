import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Users from './pages/Users';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import { ROUTES } from './constants';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path={ROUTES.HOME} 
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          } 
        />
        <Route path={ROUTES.LOGIN} element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}