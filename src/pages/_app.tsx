import { useEffect, useRef, useState } from 'react'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { Provider as NextAuthProvider } from 'next-auth/client'
import LoadingBar from 'react-top-loading-bar'

import { Header } from '../components/Header'

import '../styles/global.scss'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const ref = useRef(null)

  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      ref.current.continuousStart()
    })

    router.events.on('routeChangeComplete', () => {
      ref.current.complete()
    })

    return () => {
      router.events.off('routeChangeStart', () => {
        ref.current.continuousStart()
      })

      router.events.off('routeChangeComplete', () => {
        ref.current.complete()
      })
    }
  }, [])

  return (
    <NextAuthProvider session={pageProps.session}>
      <Header />
      <LoadingBar shadow={false} ref={ref} color="#eba417" />
      <Component {...pageProps} />
    </NextAuthProvider>
  )
}

export default MyApp
