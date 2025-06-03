
import { useEffect, useState } from 'react';
import { useAuth0 }          from '@auth0/auth0-react';
import Layout from "../components/Layout";

export default function Profile() {
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const [form, setForm]       = useState({ name: '', email: '', address: '', postalCode: '' });
  const [saving, setSaving]   = useState(false);

  // Redirige al login si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({ appState: { returnTo: '/profile' } });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);
  

  // Al montar, carga datos actuales
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/profile', {
        headers: {
          'Content-Type': 'application/json',
          'x-user-sub': user.sub
        }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) setForm({
            name: data.name,
            email: data.email,
            address: data.address || '',
            postalCode: data.postalCode || ''
          });
        });
    }
  }, [isAuthenticated, user?.sub]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-sub': user.sub
      },
      body: JSON.stringify(form)
    });
    setSaving(false);
    if (res.ok) {
      alert('Perfil guardado correctamente');
    } else {
      alert('Error al guardar perfil');
    }
  };

  if (isLoading) return <p className="p-4">Cargando…</p>;
  if (!isAuthenticated) return null;

  return (
    <>
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tu Perfil</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-gray-700">Nombre</label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>
        {/* Correo */}
        <div>
          <label className="block text-gray-700">Correo</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>
        {/* Dirección */}
        <div>
          <label className="block text-gray-700">Dirección</label>
          <input
            name="address"
            type="text"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        {/* Código Postal */}
        <div>
          <label className="block text-gray-700">Código Postal</label>
          <input
            name="postalCode"
            type="text"
            value={form.postalCode}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-sky-500 text-white rounded"
        >
          {saving ? 'Guardando…' : 'Guardar Perfil'}
        </button>
      </form>
    </div>
     <Layout/>
    </>
  );
}
