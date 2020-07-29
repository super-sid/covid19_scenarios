import 'reflect-metadata'

import 'react-dates/initialize'

import 'map.prototype.tojson' // to visualize Map in Redux Dev Tools
import 'set.prototype.tojson' // to visualize Set in Redux Dev Tools
import 'src/helpers/errorPrototypeTojson' // to visualize Error in Redux Dev Tools

import { enableES5 } from 'immer'

import React, { useEffect, useState, Suspense } from 'react'

import { AppProps } from 'next/app'
import type { Store } from 'redux'
import { ConnectedRouter } from 'connected-next-router'
import type { Persistor } from 'redux-persist'
import { ThemeProvider } from 'styled-components'

import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { PersistGate } from 'redux-persist/integration/react'
import { MDXProvider } from '@mdx-js/react'

import { initialize } from 'src/initialize'
import i18n from 'src/i18n/i18n'

import Loading from 'src/components/Loading/Loading'
import { LinkExternal } from 'src/components/Link/LinkExternal'
import { SEO } from 'src/components/Common/SEO'

import { theme } from 'src/theme'

import 'src/styles/global.scss'

enableES5()

export interface AppState {
  persistor: Persistor
  store: Store
}

export default function MyApp({ Component, pageProps, router }: AppProps) {
  const [state, setState] = useState<AppState | undefined>()

  useEffect(() => {
    initialize({ router })
      .then(setState)
      .catch((error: Error) => {
        throw error
      })
  }, [router])

  if (!state) {
    return <Loading />
  }

  const { store, persistor } = state

  return (
    <Provider store={store}>
      <ConnectedRouter>
        <ThemeProvider theme={theme}>
          <MDXProvider components={{ a: LinkExternal }}>
            <PersistGate loading={null} persistor={persistor}>
              <SEO />
              <Component {...pageProps} />
            </PersistGate>
          </MDXProvider>
        </ThemeProvider>
      </ConnectedRouter>
    </Provider>
  )
}
