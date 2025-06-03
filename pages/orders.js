import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setOrders(data))
      .catch(() => toast.error('Error al cargar órdenes'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Botón regresar */}
      <button
        onClick={() => router.push('/adminpanel')}
        className="mb-6 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 py-2 rounded-lg shadow"
      >
        ← Regresar
      </button>

      <h1 className="text-3xl font-bold mb-6 text-gray-800">Órdenes de clientes</h1>

      {loading ? (
        <p className="text-center text-gray-500">Cargando órdenes…</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No hay órdenes registradas.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white border rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-700">Orden #{order._id.slice(-6)}</h2>
             
              </div>
              <p><span className="font-medium">Nombre:</span> {order.name}</p>
              <p><span className="font-medium">Correo:</span> {order.email}</p>
              <p><span className="font-medium">Dirección:</span> {order.address}, {order.city}</p>
              <p><span className="font-medium">Fecha:</span> {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}</p>

              {Array.isArray(order.products) && (
                <div className="mt-4">
                  <h3 className="font-semibold text-sm text-gray-500 mb-2">Productos:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {order.products.map((p, i) => (
                      <li key={i}>
                        <span className="font-medium">{p.price_data?.product_data?.name}</span>
                        {' × '}
                        {p.quantity} — ${((p.price_data?.unit_amount || 0) / 100).toFixed(2)} MXN c/u
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
