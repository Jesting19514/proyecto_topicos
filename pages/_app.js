// pages/_app.js
import '../styles/globals.css'
import { Auth0Provider } from '@auth0/auth0-react'
import { ProductsContextProvider } from '../components/ProductsContext'

function MyApp({ Component, pageProps }) {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={typeof window !== 'undefined' ? window.location.origin : ''}
      cacheLocation="localstorage"     // opcional, para persistir la sesión
    >
      <ProductsContextProvider>
        <Component {...pageProps} />
      </ProductsContextProvider>
    </Auth0Provider>
  )
}

export default MyApp
