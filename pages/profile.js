
import { useEffect, useState } from 'react';
import { useAuth0 }          from '@auth0/auth0-react';
import Layout from "../components/Layout";
import toast from 'react-hot-toast';


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
      toast.success('Perfil guardado correctamente');
    } else {
      toast.error('Error al guardar perfil');
    }
  };
  

  if (isLoading) return <p className="p-6 text-center text-gray-500">Cargando…</p>;
  if (!isAuthenticated) return null;
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Tu Perfil</h1>
  
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md border border-gray-200 rounded-xl p-6 space-y-6"
        >
          {/* Nombre */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Nombre</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
  
          {/* Correo */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Correo electrónico</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
  
          {/* Dirección */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Dirección</label>
            <input
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
  
          {/* Código Postal */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Código Postal</label>
            <input
              name="postalCode"
              type="text"
              value={form.postalCode}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
  
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md"
            >
              {saving ? 'Guardando…' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
  
}
