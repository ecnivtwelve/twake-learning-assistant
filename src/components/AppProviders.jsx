import React from 'react'
import { I18n } from 'twake-i18n'

import { BarProvider } from 'cozy-bar'
import { CozyProvider } from 'cozy-client'
import { WebviewIntentProvider } from 'cozy-intent'
import AlertProvider from 'cozy-ui/transpiled/react/providers/Alert'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'

import { SubjectProvider } from '@/context/SubjectContext'

const AppProviders = ({ client, lang, polyglot, children }) => {
  return (
    <WebviewIntentProvider>
      <CozyProvider client={client}>
        <BarProvider>
          <I18n lang={lang} polyglot={polyglot}>
            <AlertProvider>
              <CozyTheme>
                <BreakpointsProvider>
                  <SubjectProvider>{children}</SubjectProvider>
                </BreakpointsProvider>
              </CozyTheme>
            </AlertProvider>
          </I18n>
        </BarProvider>
      </CozyProvider>
    </WebviewIntentProvider>
  )
}

export default AppProviders
