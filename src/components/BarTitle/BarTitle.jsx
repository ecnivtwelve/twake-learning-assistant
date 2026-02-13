import React from 'react'

import { BarLeft } from 'cozy-bar'
import ButtonCozyHome from 'cozy-bar/dist/components/utils/ButtonCozyHome'
import { useClient } from 'cozy-client'
import Divider from 'cozy-ui/transpiled/react/Divider'

import TwakeLearningsWordmark from '@/assets/icons/TwakeLearningsWordmark'

const BarTitle = () => {
  const client = useClient()

  return (
    <BarLeft>
      <div className="u-flex u-flex-items-center">
        <ButtonCozyHome homeHref={client.stackClient.uri} />
        <Divider orientation="vertical" flexItem />
        <div className="u-flex u-flex-items-center u-ml-half">
          <TwakeLearningsWordmark />
        </div>
      </div>
    </BarLeft>
  )
}

export default BarTitle
