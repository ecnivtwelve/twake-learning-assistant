import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import CheckIcon from 'cozy-ui/transpiled/react/Icons/Check'
import Paper from 'cozy-ui/transpiled/react/Paper'
import Typography from 'cozy-ui/transpiled/react/Typography'

const ActivityPreview = ({ activity }) => {
  return (
    <div
      className="u-p-2 u-flex u-flex-column u-flex-items-center"
      style={{ width: '24rem', borderLeft: '1px solid #4242441f' }}
    >
      <Typography align="center" color="textSecondary" variant="body2">
        {activity.notions.join(', ')}
      </Typography>

      <Typography align="center" variant="h4" className="u-mt-half">
        {activity.question}
      </Typography>

      <div className="u-flex u-flex-column u-mt-2 u-w-100">
        {activity.reponses.map((reponse, i) => (
          <Paper
            elevation={1}
            key={i}
            className="u-p-1 u-mb-half u-flex u-flex-row u-flex-justify-between u-flex-items-center"
          >
            <div className="u-mr-1">
              <Typography
                style={{ fontWeight: reponse.correct ? 700 : undefined }}
                variant="body1"
              >
                {reponse.texte}
              </Typography>
            </div>
            {reponse.correct && (
              <Icon icon={CheckIcon} size={20} style={{ marginBottom: 2 }} />
            )}
          </Paper>
        ))}
      </div>
    </div>
  )
}

export default ActivityPreview
