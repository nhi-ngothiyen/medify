import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Users from './pages/Users';
import Login from './pages/Login';


function Guard({children}:{children: JSX.Element}){
const token = localStorage.getItem('token');
if(!token) return <Login/>;
return children;
}


export default function App(){
return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Guard><Users/></Guard>} />
    <Route path="/login" element={<Login/>} />
    </Routes>
    </BrowserRouter>
);
}