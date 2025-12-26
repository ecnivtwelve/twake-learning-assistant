import React from 'react'
import { useI18n } from 'twake-i18n'

import { BarLeft } from 'cozy-bar'
import ButtonCozyHome from 'cozy-bar/dist/components/utils/ButtonCozyHome'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Typography from "cozy-ui/transpiled/react/Typography"
import LearningAssistantIcon from '@/assets/icons/LearningAssistantIcon'

const BarTitle = () => {
  const { t } = useI18n()

  return (
    <BarLeft>
      <div className='u-flex u-flex-items-center'>
        <ButtonCozyHome />
        <Divider orientation="vertical" flexItem />
        <div className='u-flex u-flex-items-center u-ml-1'>
          <LearningAssistantIcon />
          <Typography variant="h4" className="u-ml-half">
            {t('title')}
          </Typography>
        </div>
      </div>
    </BarLeft>
  )
}

export default BarTitle
