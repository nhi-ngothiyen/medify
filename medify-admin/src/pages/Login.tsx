import { useState } from 'react';


export default function Login(){
const [email, setEmail] = useState('admin@medify.vn');
const [password, setPassword] = useState('Admin@123');
const [err, setErr] = useState<string|undefined>();


const submit = async (e: React.FormEvent) => {
e.preventDefault(); setErr(undefined);
try{
const res = await fetch(`${import.meta.env.VITE_API}/auth/login`, {
method: 'POST', headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ email, password })
});
if(!res.ok) throw new Error(await res.text());
const data = await res.json();
localStorage.setItem('token', data.access_token);
location.href = '/';
}catch(e:any){ setErr('Đăng nhập thất bại'); }
}


return (
<div style={{display:'grid', placeItems:'center', height:'100vh'}}>
<form onSubmit={submit} style={{display:'grid', gap:8, width:280}}>
<h2>Admin Login</h2>
<input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mật khẩu" />
{err && <div style={{color:'red'}}>{err}</div>}
<button>Đăng nhập</button>
</form>
</div>
);
}