import React from 'react'
import { useI18n } from 'twake-i18n'

import Checkbox from 'cozy-ui/transpiled/react/Checkbox'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Paper from 'cozy-ui/transpiled/react/Paper'
import Typography from 'cozy-ui/transpiled/react/Typography'

const FlashcardGenerationResultsList = ({
  allCards,
  results,
  selectedCards,
  onToggleCard,
  onToggleAll
}) => {
  const { t } = useI18n()

  return (
    <div
      style={{
        maxHeight: 400,
        overflow: 'auto'
      }}
    >
      <Paper className="u-m-half">
        <div className="u-flex u-flex-justify-between u-flex-items-center u-ph-1">
          <Typography variant="h6">
            {t('questions.generation.summary.selected_count', {
              selected: selectedCards.length,
              total: allCards.length
            })}
          </Typography>
          <div
            className="u-flex u-flex-items-center"
            onClick={onToggleAll}
            style={{ cursor: 'pointer' }}
          >
            <Checkbox
              checked={
                selectedCards.length === allCards.length && allCards.length > 0
              }
              indeterminate={
                selectedCards.length > 0 &&
                selectedCards.length < allCards.length
              }
            />
            <Typography variant="body2" className="u-ml-half">
              {t('questions.generation.summary.select_all')}
            </Typography>
          </div>
        </div>
      </Paper>

      <List>
        {results.map((res, resIdx) => (
          <React.Fragment key={resIdx}>
            <ListItem divider>
              <ListItemText
                primary={res.filename}
                secondary={t('questions.generation.summary.cards_count', {
                  count: res.cards?.length || 0
                })}
              />
            </ListItem>
            <List>
              {res.cards?.map((card, cardIdx) => {
                const id = `${resIdx}-${cardIdx}`
                return (
                  <ListItem
                    key={cardIdx}
                    button
                    onClick={() => onToggleCard(id)}
                    size="small"
                  >
                    <ListItemIcon className="u-pl-1">
                      <Checkbox checked={selectedCards.includes(id)} />
                    </ListItemIcon>
                    <ListItemText primary={card.text} secondary={card.answer} />
                  </ListItem>
                )
              })}
            </List>
          </React.Fragment>
        ))}
      </List>
    </div>
  )
}

export default FlashcardGenerationResultsList
