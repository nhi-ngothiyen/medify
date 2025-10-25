import { useEffect, useState } from 'react';
import { api } from '../api';


export default function Users(){
const [items, setItems] = useState<any[]>([]);
const load = async()=> setItems(await api('/admin/users'));
useEffect(()=>{ load(); },[]);


const toggle = async(id:number)=>{ await api(`/admin/users/${id}/toggle-active`, {method:'POST'}); load(); }
const reset = async(id:number)=>{ await api(`/admin/users/${id}/reset-password`, {method:'POST'}); alert('Đã đặt lại'); }


return (
<div style={{padding:16}}>
<h2>Quản lý người dùng</h2>
<table>
<thead><tr><th>ID</th><th>Email</th><th>Tên</th><th>Vai trò</th><th>Active</th><th></th></tr></thead>
<tbody>
{items.map(u=> (
    <tr key={u.id}>
    <td>{u.id}</td>
    <td>{u.email}</td>
    <td>{u.full_name}</td>
    <td>{u.role}</td>
    <td>{String(u.is_active)}</td>
    <td>
    <button onClick={()=>toggle(u.id)}>Toggle</button>
    <button onClick={()=>reset(u.id)} style={{marginLeft:8}}>Reset PW</button>
    </td>
    </tr>
))}
</tbody>
</table>
</div>
);
}