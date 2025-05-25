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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>

      <div className="mb-4">
        <button
          onClick={() => {
            setIsAdding(true);
            setEditing(null);
            setForm({ nombre: '', descripcion: '', precio: '', categoria: '', foto: '' });
          }}
          className="bg-emerald-500 text-white px-4 py-2 rounded"
        >
          Agregar Nuevo Producto
        </button>
      </div>

      {(editing || isAdding) && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {isAdding ? 'Nuevo Producto' : 'Editar Producto'}
          </h2>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="block w-full mb-2 px-3 py-2 border rounded"
          />
          <input
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
            className="block w-full mb-2 px-3 py-2 border rounded"
          />
          <input
            name="precio"
            type="number"
            value={form.precio}
            onChange={handleChange}
            placeholder="Precio"
            className="block w-full mb-2 px-3 py-2 border rounded"
          />
          <input
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            placeholder="Categoría"
            className="block w-full mb-2 px-3 py-2 border rounded"
          />
          <input
            name="foto"
            value={form.foto}
            onChange={handleChange}
            placeholder="URL de la imagen"
            className="block w-full mb-2 px-3 py-2 border rounded"
          />
          <div>
            {isAdding ? (
              <button
                onClick={addProduct}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Agregar
              </button>
            ) : (
              <button
                onClick={saveProduct}
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                Guardar
              </button>
            )}
            <button onClick={cancelEdit} className="bg-gray-500 text-white px-4 py-2 rounded">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Descripción</th>
            <th className="p-2 text-left">Precio</th>
            <th className="p-2 text-left">Categoría</th>
            <th className="p-2 text-left">Imagen</th>
            <th className="p-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id} className="border-t">
              <td className="p-2">{product.nombre}</td>
              <td className="p-2">{product.descripcion}</td>
              <td className="p-2">${product.precio}</td>
              <td className="p-2">{product.categoria}</td>
              <td className="p-2">
                <img src={product.foto} alt={product.nombre} className="h-12 w-12 object-cover rounded" />
              </td>
              <td className="p-2 text-center space-x-2">
                <button
                  onClick={() => startEdit(product)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-10 text-center">
        <button
          onClick={() => logout({ returnTo: window.location.origin })}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
