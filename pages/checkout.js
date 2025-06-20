 
import Layout from "../components/Layout";
import { useContext, useEffect, useState } from "react";
import { ProductsContext } from "../components/ProductsContext";
import { useAuth0 } from '@auth0/auth0-react';
import toast from 'react-hot-toast';


export default function CheckoutPage() {
  const { selectedProducts, setSelectedProducts } = useContext(ProductsContext);
  const [productsInfos, setProductsInfos] = useState([]);

  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Redirige al login si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({ appState: { returnTo: '/checkout' } });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  // Al montar, carga perfil del usuario
  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      fetch('/api/profile', {
        headers: {
          'Content-Type': 'application/json',
          'x-user-sub': user.sub
        }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) {
            setName(data.name || '');
            setEmail(data.email || '');
            setAddress(data.address || '');
            setCity(data.postalCode || '');
          }
        });
    }
  }, [isAuthenticated, user]);

  // Carga los productos a pagar
  useEffect(() => {
    const uniqIds = [...new Set(selectedProducts)];
    fetch('/api/products?ids=' + uniqIds.join(','))
      .then(response => response.json())
      .then(json => setProductsInfos(json));
  }, [selectedProducts]);

  function moreOfThisProduct(id) {
    setSelectedProducts(prev => [...prev, id]);
  }
  function lessOfThisProduct(id) {
    const pos = selectedProducts.indexOf(id);
    if (pos !== -1) {
      setSelectedProducts(prev => prev.filter((_, index) => index !== pos));
    }
  }

  const deliveryPrice = 150;
  let subtotal = 0;
  if (selectedProducts?.length) {
    for (let id of selectedProducts) {
      const price = productsInfos.find(p => p._id === id)?.precio || 0;
      subtotal += price;
    }
  }
  const total = subtotal + deliveryPrice;

  if (isLoading) return <p className="p-4">Cargando…</p>;
  if (!isAuthenticated) return null;

  return (
    <Layout>
      {!productsInfos.length && <div>No tienes productos en tu carrito</div>}
      {productsInfos.map(productInfo => {
        const amount = selectedProducts.filter(id => id === productInfo._id).length;
        if (amount === 0) return null;
        return (
          <div className="flex mb-5 items-center" key={productInfo._id}>
            <div
              className="bg-gray-100 p-3 rounded-xl shrink-0"
              style={{ boxShadow: 'inset 1px 0px 10px 10px rgba(0,0,0,0.1)' }}
            >
              <img className="w-24" src={productInfo.foto} alt="" />
            </div>
            <div className="pl-4 items-center">
              <h3 className="font-bold text-lg">{productInfo.nombre}</h3>
              <p className="text-sm leading-4 text-gray-500">
                {productInfo.descripcion}
              </p>
              <div className="flex mt-1">
                <div className="grow font-bold">
                  ${productInfo.precio}
                </div>
                <div>
                  <button
                    onClick={() => lessOfThisProduct(productInfo._id)}
                    className="border border-emerald-500 px-2 rounded-lg text-emerald-500"
                  >
                    -
                  </button>
                  <span className="px-2">{amount}</span>
                  <button
                    onClick={() => moreOfThisProduct(productInfo._id)}
                    className="bg-emerald-500 px-2 rounded-lg text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

<form action="/api/checkout" method="POST" onSubmit={(e) => {
  if (selectedProducts.length === 0) {
    e.preventDefault();
    toast.error('¡Tu carrito está vacío!');
  }
}}>


        <div className="mt-8 space-y-2">
          <input
            name="address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="bg-gray-100 w-full rounded-lg px-4 py-2"
            type="text"
            placeholder="Dirección"
            required
          />
          <input
            name="city"
            value={city}
            onChange={e => setCity(e.target.value)}
            className="bg-gray-100 w-full rounded-lg px-4 py-2"
            type="text"
            placeholder="Código Postal"
            required
          />
          <input
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="bg-gray-100 w-full rounded-lg px-4 py-2"
            type="text"
            placeholder="Nombre"
            required
          />
          <input
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="bg-gray-100 w-full rounded-lg px-4 py-2"
            type="email"
            placeholder="Correo"
            required
          />
        </div>

        <div className="mt-8">
          <div className="flex my-3">
            <h3 className="grow font-bold text-gray-400">Subtotal:</h3>
            <h3 className="font-bold">${subtotal} MXN</h3>
          </div>
          <div className="flex my-3">
            <h3 className="grow font-bold text-gray-400">Costo de envío:</h3>
            <h3 className="font-bold">${deliveryPrice} MXN</h3>
          </div>
          <div className="flex my-3 border-t pt-3 border-dashed border-sky-500">
            <h3 className="grow font-bold text-gray-400">Total:</h3>
            <h3 className="font-bold">${total} MXN</h3>
          </div>
        </div>

        <input type="hidden" name="products" value={selectedProducts.join(',')} />
        <button
          type="submit"
          className="bg-emerald-500 px-5 py-2 rounded-xl font-bold text-white w-full my-4 shadow-emerald-300 shadow-lg"
        >
          Pagar ${total} MXN
        </button>
      </form>
    </Layout>
  );
}
