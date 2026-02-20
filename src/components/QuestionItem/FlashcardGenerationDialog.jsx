import React, { useEffect, useState } from 'react'
import { useI18n } from 'twake-i18n'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Checkbox from 'cozy-ui/transpiled/react/Checkbox'
import CircularProgress from 'cozy-ui/transpiled/react/CircularProgress'
import {
  DialogCloseButton,
  useCozyDialog
} from 'cozy-ui/transpiled/react/CozyDialogs'
import Dialog, {
  DialogActions,
  DialogTitle
} from 'cozy-ui/transpiled/react/Dialog'
import Divider from 'cozy-ui/transpiled/react/Divider'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Paper from 'cozy-ui/transpiled/react/Paper'
import Typography from 'cozy-ui/transpiled/react/Typography'

const FlashcardGenerationDialog = ({
  open,
  onClose,
  loading,
  status,
  results,
  onAddAll
}) => {
  const { t } = useI18n()
  const { dialogProps, dialogTitleProps, dividerProps, dialogActionsProps } =
    useCozyDialog({
      size: 'medium',
      open: open,
      onClose: onClose,
      disableEnforceFocus: true
    })

  const [selectedCards, setSelectedCards] = useState([])

  useEffect(() => {
    if (!loading && results.length > 0) {
      const allCards = results.flatMap((res, resIdx) =>
        res.cards.map((card, cardIdx) => ({
          ...card,
          id: `${resIdx}-${cardIdx}`, // Unique ID for management
          filename: res.filename
        }))
      )
      setSelectedCards(allCards.map(c => c.id))
    }
  }, [loading, results])

  const allCards = results.flatMap((res, resIdx) =>
    res.cards.map((card, cardIdx) => ({
      ...card,
      id: `${resIdx}-${cardIdx}`,
      filename: res.filename
    }))
  )

  const toggleCard = id => {
    setSelectedCards(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedCards.length === allCards.length) {
      setSelectedCards([])
    } else {
      setSelectedCards(allCards.map(c => c.id))
    }
  }

  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = async () => {
    setIsAdding(true)
    const cardsToAdd = allCards.filter(c => selectedCards.includes(c.id))
    await onAddAll(cardsToAdd)
    setIsAdding(false)
    onClose()
  }

  return (
    <Dialog {...dialogProps}>
      {!loading && <DialogCloseButton onClick={onClose} />}
      <DialogTitle {...dialogTitleProps}>
        {loading ? 'Génération en cours...' : 'Récapitulatif de la génération'}
      </DialogTitle>
      <Divider {...dividerProps} />
      <div>
        {loading ? (
          <div className="u-flex u-flex-column u-flex-items-center u-m-2">
            <CircularProgress size={48} />
            <Typography variant="body1" className="u-mt-1">
              {status}
            </Typography>
          </div>
        ) : (
          <div
            className=""
            style={{
              maxHeight: 400,
              overflow: 'auto'
            }}
          >
            <Paper className="u-m-half">
              <div className="u-flex u-flex-justify-between u-flex-items-center u-ph-1">
                <Typography variant="h6">
                  {selectedCards.length} / {allCards.length} flashcards
                  sélectionnées.
                </Typography>
                <div
                  className="u-flex u-flex-items-center"
                  onClick={toggleAll}
                  style={{ cursor: 'pointer' }}
                >
                  <Checkbox
                    checked={
                      selectedCards.length === allCards.length &&
                      allCards.length > 0
                    }
                    indeterminate={
                      selectedCards.length > 0 &&
                      selectedCards.length < allCards.length
                    }
                  />
                  <Typography variant="body2" className="u-ml-half">
                    Tout sélectionner
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
                      secondary={`${res.cards?.length || 0} cartes`}
                    />
                  </ListItem>
                  <List>
                    {res.cards?.map((card, cardIdx) => {
                      const id = `${resIdx}-${cardIdx}`
                      return (
                        <ListItem
                          key={cardIdx}
                          button
                          onClick={() => toggleCard(id)}
                          size="small"
                        >
                          <ListItemIcon className="u-pl-1">
                            <Checkbox checked={selectedCards.includes(id)} />
                          </ListItemIcon>
                          <ListItemText
                            primary={card.text}
                            secondary={card.answer}
                          />
                        </ListItem>
                      )
                    })}
                  </List>
                </React.Fragment>
              ))}
            </List>
          </div>
        )}
      </div>
      <Divider {...dividerProps} />
      <DialogActions {...dialogActionsProps}>
        <Button variant="secondary" label={t('cancel')} onClick={onClose} />
        <Button
          variant="primary"
          label={`Ajouter ${selectedCards.length} flashcards`}
          endIcon={isAdding && <CircularProgress color="white" size={20} />}
          disabled={selectedCards.length === 0}
          onClick={handleAdd}
        />
      </DialogActions>
    </Dialog>
  )
}

export default FlashcardGenerationDialog
