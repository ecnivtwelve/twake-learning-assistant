import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from 'twake-i18n'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import HelpIcon from 'cozy-ui/transpiled/react/Icons/HelpOutlined'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import Typography from 'cozy-ui/transpiled/react/Typography'

import FilterChip from '@/components/FilterChip/FilterChip'
import TabTitle from '@/components/TabTitle/TabTitle'
import TableItemText from '@/components/TableItem/TableItemText'
import questions from '@/utils/data/questions.json'

const QuestionsTab = () => {
  const { t } = useI18n()

  const [filters] = React.useState({
    types: {
      label: t('types'),
      values: []
    },
    sources: {
      label: t('sources'),
      values: []
    },
    tags: {
      label: t('tags'),
      values: []
    }
  })

  return (
    <>
      <TabTitle
        trailing={
          <Button
            variant="primary"
            label={t('new')}
            startIcon={<Icon icon={PlusIcon} />}
          />
        }
      >
        <Typography variant="h3">{t('questions')}</Typography>

        <div className="u-flex u-mt-1">
          {Object.entries(filters).map(([key, filter]) => (
            <FilterChip key={key} label={filter.label} />
          ))}
        </div>
      </TabTitle>

      <List>
        <ListItem size="small" dense>
          <ListItemIcon className="u-w-2-half"></ListItemIcon>
          <TableItemText value="Questions" type="primary" />
          <TableItemText value="Source" type="secondary" />
          <TableItemText value="Tags" type="secondary" />
          <TableItemText value="Maîtrise" type="secondary" />
          <div className="u-w-1-half" />
        </ListItem>

        <Divider />

        {questions.map((question, i) => (
          <React.Fragment key={i}>
            <ListItem button>
              <ListItemIcon className="u-w-2-half">
                <Icon icon={HelpIcon} size={20} />
              </ListItemIcon>
              <TableItemText value={question.question} type="primary" />
              <TableItemText value={question.source} type="secondary" />
              <TableItemText value={question.tags} type="chip" />
              <TableItemText
                value={Math.round(question.score * 100)}
                type="colouredValue"
              />
              <ListItemSecondaryAction className="u-pr-1">
                <IconButton>
                  <Icon icon={DotsIcon} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </>
  )
}

export default QuestionsTab
