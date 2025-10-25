export async function api(path: string, opts: RequestInit = {}) {
const token = localStorage.getItem('token');
const res = await fetch(`${import.meta.env.VITE_API}${path}`, {
...opts,
headers: {
'Content-Type': 'application/json',
...(token ? { Authorization: `Bearer ${token}` } : {}),
...(opts.headers || {})
}
});
if (!res.ok) throw new Error(await res.text());
return res.json().catch(() => ({}));
}