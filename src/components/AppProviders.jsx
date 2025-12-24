import React from 'react'
import { I18n } from 'twake-i18n'

import { BarProvider } from 'cozy-bar'
import { CozyProvider } from 'cozy-client'
import { WebviewIntentProvider } from 'cozy-intent'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'

const AppProviders = ({ client, lang, polyglot, children }) => {
  return (
    <WebviewIntentProvider>
      <CozyProvider client={client}>
        <BarProvider>
          <I18n lang={lang} polyglot={polyglot}>
            <BreakpointsProvider>{children}</BreakpointsProvider>
          </I18n>
        </BarProvider>
      </CozyProvider>
    </WebviewIntentProvider>
  )
}

export default AppProviders
