// pages/adminpanel.js
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth0 } from '@auth0/auth0-react';

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', categoria: '', foto: '' });
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { logout } = useAuth0();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  const startEdit = (product) => {
    setIsAdding(false);
    setEditing(product._id);
    setForm({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      categoria: product.categoria,
      foto: product.foto,
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ nombre: '', descripcion: '', precio: '', categoria: '', foto: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const saveProduct = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/edit-product', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: editing, ...form }),
    });
    setLoading(false);

    if (res.ok) {
      toast.success('Producto actualizado');
      const updated = await res.json();
      setProducts(prev => prev.map(p => p._id === updated._id ? updated : p));
      cancelEdit();
    } else {
      toast.error('Error al guardar');
    }
  };

  const addProduct = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/edit-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);

    if (res.ok) {
      toast.success('Producto agregado');
      const newProduct = await res.json();
      setProducts(prev => [...prev, newProduct]);
      cancelEdit();
      setIsAdding(false);
    } else {
      toast.error('Error al agregar producto');
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;
    const res = await fetch('/api/admin/edit-product', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: id }),
    });
    if (res.ok) {
      toast.success('Producto eliminado');
      setProducts(prev => prev.filter(p => p._id !== id));
    } else {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
  <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel de Administración</h1>

  <div className="mb-6">
    <button
      onClick={() => {
        setIsAdding(true);
        setEditing(null);
        setForm({ nombre: '', descripcion: '', precio: '', categoria: '', foto: '' });
      }}
      className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg shadow"
    >
      + Agregar nuevo producto
    </button>
  </div>

  {(editing || isAdding) && (
    <div className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">
        {isAdding ? 'Agregar producto' : 'Editar producto'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['nombre', 'descripcion', 'precio', 'categoria', 'foto'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
              {field}
            </label>
            <input
              name={field}
              value={form[field]}
              onChange={handleChange}
              type={field === 'precio' ? 'number' : 'text'}
              placeholder={`Escribe el ${field}`}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={isAdding ? addProduct : saveProduct}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-white shadow ${
            isAdding ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isAdding ? 'Agregar' : 'Guardar'}
        </button>
        <button
          onClick={cancelEdit}
          className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
        >
          Cancelar
        </button>
      </div>
    </div>
  )}

  <div className="overflow-x-auto shadow border border-gray-200 rounded-lg">
    <table className="min-w-full text-sm">
      <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
        <tr>
          <th className="p-3 text-left">Nombre</th>
          <th className="p-3 text-left">Descripción</th>
          <th className="p-3 text-left">Precio</th>
          <th className="p-3 text-left">Categoría</th>
          <th className="p-3 text-left">Imagen</th>
          <th className="p-3 text-center">Acciones</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {products.map((product) => (
          <tr key={product._id} className="hover:bg-gray-50">
            <td className="p-3">{product.nombre}</td>
            <td className="p-3">{product.descripcion}</td>
            <td className="p-3">${product.precio}</td>
            <td className="p-3">{product.categoria}</td>
            <td className="p-3">
              <img
                src={product.foto}
                alt={product.nombre}
                className="h-12 w-12 object-cover rounded"
              />
            </td>
            <td className="p-3 text-center">
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => startEdit(product)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <div className="mt-10 text-center">
    <button
      onClick={() => logout({ returnTo: window.location.origin })}
      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow"
    >
      Cerrar sesión
    </button>
  </div>
</div>

  );
}
