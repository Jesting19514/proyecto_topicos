import Link from "next/link";
import {useRouter} from "next/router";
import {useContext} from "react";
import {ProductsContext} from "./ProductsContext";
import { useAuth0 } from '@auth0/auth0-react';


export default function Footer() {
  const router = useRouter();
  const path = router.pathname;
  const {selectedProducts} = useContext(ProductsContext);

  // ← IMPORTANTE: incluimos isLoading
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    isLoading,
  } = useAuth0();

  return (
    <footer className="sticky bottom-0 bg-white p-5 w-full flex border-t border-gray-200 justify-center space-x-12 text-gray-400">
      <Link href={'/'} className={(path === '/' ? 'text-sky-500' : '')+" flex justify-center items-center flex-col"}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        <span>Inicio</span>
      </Link>

    
     {/* Enlace a Perfil (solo si está autenticado) */}
     {isAuthenticated && (
       <Link
         href="/profile"
         className={`flex justify-center items-center flex-col ${path === '/profile' ? 'text-sky-500' : ''}`}
       >
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
           <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9A3.75 3.75 0 119.75 9m6 0A3.75 3.75 0 0115.75 9m-6 0v3.75m6-3.75v3.75m-6 3.75a6.75 6.75 0 0113.5 0v.75H3v-.75a6.75 6.75 0 0113.5 0z" />
        </svg>
        <span>Perfil</span>
       </Link>
     )}


     {/* Botón de login/logout */}
      {isLoading ? (
        <div className="flex justify-center items-center flex-col">
          <span>Cargando...</span>
        </div>
      ) : isAuthenticated ? (
        <button
          onClick={() => logout({ returnTo: window.location.origin })}
          className="flex justify-center items-center flex-col"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 8.25v-1.5A2.25 2.25 0 0015.75 4.5h-9A2.25 2.25 0 004.5 6.75v10.5A2.25 2.25 0 006.75 19.5h9a2.25 2.25 0 002.25-2.25v-1.5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15l3-3m0 0l-3-3m3 3H9" />
          </svg>
          <span>Cerrar Sesión</span>
        </button>
      ) : (
        <button
          onClick={() => loginWithRedirect()}
          className="flex justify-center items-center flex-col"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-9A2.25 2.25 0 002.25 5.25v13.5A2.25 2.25 0 004.5 21h9a2.25 2.25 0 002.25-2.25V15M18 15l3-3m0 0l-3-3m3 3H9" />
          </svg>
          <span>Iniciar Sesión</span>
        </button>
      )}
    
      <Link href={'/checkout'} className={(path === '/checkout' ? 'text-sky-500' : '')+" flex justify-center items-center flex-col"}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
        <span>Carrito {selectedProducts.length}</span>
      </Link>

</footer>
  );
}
