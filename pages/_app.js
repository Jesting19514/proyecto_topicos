// pages/_app.js
import '../styles/globals.css'
import { Auth0Provider } from '@auth0/auth0-react'
import { ProductsContextProvider } from '../components/ProductsContext'
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={typeof window !== 'undefined' ? window.location.origin : ''}
      cacheLocation="localstorage"
    >
      <ProductsContextProvider>
        {/* Toaster debe estar aquí para que funcione en toda la app */}
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Component {...pageProps} />
      </ProductsContextProvider>
    </Auth0Provider>
  );
}

export default MyApp;
