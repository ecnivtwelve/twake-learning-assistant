import React, { useState } from 'react'
import { useI18n } from 'twake-i18n'

import { useQuery } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import {
  DialogCloseButton,
  useCozyDialog
} from 'cozy-ui/transpiled/react/CozyDialogs'
import Dialog, {
  DialogTitle,
  DialogActions
} from 'cozy-ui/transpiled/react/Dialog'
import Divider from 'cozy-ui/transpiled/react/Divider'
import List from 'cozy-ui/transpiled/react/List'
import SearchBar from 'cozy-ui/transpiled/react/SearchBar'

import QuestionItem from './QuestionItem'
import { useSubject } from '@/context/SubjectContext'
import { buildQuestionsBySubjectQuery } from '@/queries'

const ItemImportDialog = ({ open, onClose, onSelectQuestions }) => {
  const { t } = useI18n()
  const [searchTerm, setSearchTerm] = useState('')

  const { selectedSubject } = useSubject()
  const questionsQuery = buildQuestionsBySubjectQuery(selectedSubject?._id)

  const questions = useQuery(questionsQuery.definition, {
    ...questionsQuery.options,
    enabled: !!selectedSubject?._id
  })
  const { dialogProps, dialogTitleProps, dividerProps, dialogActionsProps } =
    useCozyDialog({
      size: 'large',
      open: open,
      onClose: onClose,
      disableEnforceFocus: true
    })

  const [selectedQuestions, setSelectedQuestions] = useState([])

  const filteredQuestions = questions.data?.filter(question =>
    question.label?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog {...dialogProps}>
      <DialogCloseButton onClick={onClose} />
      <DialogTitle {...dialogTitleProps}>Importer des questions</DialogTitle>
      <Divider {...dividerProps} />
      <div className="u-m-1">
        <SearchBar
          elevation={0}
          type="search"
          value={searchTerm}
          onChange={ev => setSearchTerm(ev.target.value)}
          onClear={() => setSearchTerm('')}
        />
      </div>
      <Divider {...dividerProps} />
      <div className="u-h-6" style={{ overflowY: 'scroll' }}>
        <List>
          {filteredQuestions?.map(question => (
            <QuestionItem
              key={question._id}
              question={question}
              selectedQuestions={selectedQuestions}
              setSelectedQuestions={setSelectedQuestions}
              onOpen={() => {
                setSelectedQuestions(
                  selectedQuestions.includes(question._id)
                    ? selectedQuestions.filter(id => id !== question._id)
                    : [...selectedQuestions, question._id]
                )
              }}
            />
          ))}
        </List>
      </div>
      <Divider {...dividerProps} />
      <DialogActions {...dialogActionsProps}>
        <Button variant="secondary" label={t('cancel')} onClick={onClose} />
        <Button
          variant="primary"
          label={`${t('import')} ${selectedQuestions.length > 0 ? `(${selectedQuestions.length})` : ''
            }`}
          disabled={selectedQuestions.length === 0}
          onClick={() => {
            onSelectQuestions(selectedQuestions)
            onClose()
          }}
        />
      </DialogActions>
    </Dialog>
  )
}

export default ItemImportDialog
