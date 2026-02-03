import React from 'react'
import { useI18n } from 'twake-i18n'

import log from 'cozy-logger'
import Button from 'cozy-ui/transpiled/react/Buttons'
import CircularProgress from 'cozy-ui/transpiled/react/CircularProgress'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ErrorIcon from 'cozy-ui/transpiled/react/Icons/Attention'
import CheckIcon from 'cozy-ui/transpiled/react/Icons/Check'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSkeleton from 'cozy-ui/transpiled/react/Skeletons/ListItemSkeleton'
import Typography from 'cozy-ui/transpiled/react/Typography'

import FilterChip from '@/components/FilterChip/FilterChip'
import SourceItem from '@/components/SourceItem/SourceItem'
import AddSourceDialog from '@/components/Sources/AddSourceDialog'
import TabTitle from '@/components/TabTitle/TabTitle'
import TableItemText from '@/components/TableItem/TableItemText'
import { OPENRAG_URL, PARTITION } from '@/consts/consts'
import {
  deleteFile,
  fetchPartition,
  fetchPartitionTask
} from '@/queries/rag/openrag'

const SourcesTab = () => {
  const { t } = useI18n()

  const [partitionData, setPartitionData] = React.useState([])
  const [loadingSources, setLoadingSources] = React.useState(true)

  const [activeTasks, setActiveTasks] = React.useState([])
  const [taskDetails, setTaskDetails] = React.useState({})
  const [isAddingTask, setIsAddingTask] = React.useState(false)

  const fetchSources = () => {
    return fetchPartition(PARTITION)
      .then(data => {
        setLoadingSources(false)
        if (data.files.length === 0) {
          return setPartitionData([])
        }
        return setPartitionData(data.files)
      })
      .catch(err => {
        log.error(err)
      })
  }

  React.useEffect(() => {
    fetchSources()
  }, [])

  React.useEffect(() => {
    if (activeTasks.length === 0) return

    const interval = setInterval(() => {
      activeTasks.forEach(task => {
        fetchPartitionTask(task.id)
          .then(async result => {
            if (result.task_state === 'COMPLETED') {
              setTaskDetails(prev => ({
                ...prev,
                [task.id]: result
              }))
              setActiveTasks(prev => prev.filter(t => t.id !== task.id))

              setTimeout(async () => {
                await fetchSources()
                setTaskDetails(prev => {
                  const newState = { ...prev }
                  delete newState[task.id]
                  return newState
                })
              }, 2000)
            } else {
              setTaskDetails(prev => ({
                ...prev,
                [task.id]: result
              }))
            }
            return null
          })
          .catch(err => log.error(err))
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [activeTasks])

  /* Existing filter state */
  const [filters] = React.useState({
    types: {
      label: t('tags.types'),
      values: []
    },
    level: {
      label: t('tags.level'),
      values: []
    },
    tags: {
      label: t('tags.tags'),
      values: []
    }
  })

  const statusInfo = {
    CHUNKING: {
      label: t('sources.status.chunking'),
      icon: <CircularProgress size={20} />
    },
    SERIALIZING: {
      label: t('sources.status.serializing'),
      icon: <CircularProgress size={20} />
    },
    COMPLETED: {
      label: t('sources.status.completed'),
      icon: <Icon icon={CheckIcon} size={20} />
    },
    FAILED: {
      label: t('sources.status.failed'),
      icon: <Icon icon={ErrorIcon} size={20} />
    }
  }

  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)

  const deleteSource = async source => {
    setPartitionData(prev =>
      prev.filter(item => item.file_id !== source.file_id)
    )

    try {
      const result = await deleteFile(PARTITION, source.file_id)
      if (result.task_id) {
        setActiveTasks(prev => [
          ...prev,
          { id: result.task_id, type: 'DELETE' }
        ])
      } else {
        fetchSources()
      }
    } catch (err) {
      log.error(err)
      fetchSources()
    }
  }

  return (
    <>
      <TabTitle
        trailing={
          <Button
            variant="primary"
            label={t('new')}
            startIcon={<Icon icon={PlusIcon} />}
            onClick={() => setIsAddDialogOpen(true)}
          />
        }
      >
        <Typography variant="h3">{t('sources.title')}</Typography>
        <Typography>
          depuis {PARTITION} sur {OPENRAG_URL}
        </Typography>

        <div className="u-flex u-mt-1">
          {Object.entries(filters).map(([key, filter]) => (
            <FilterChip key={key} label={filter.label} />
          ))}
        </div>
      </TabTitle>

      <AddSourceDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        partition={PARTITION}
        addTask={task =>
          setActiveTasks([...activeTasks, { id: task, type: 'ADD' }])
        }
        setIsAddingTask={setIsAddingTask}
      />

      <List>
        <ListItem size="small" dense>
          <ListItemIcon className="u-w-2-half"></ListItemIcon>
          <TableItemText value={t('sources.table.name')} type="primary" />
          <TableItemText value={t('sources.table.filename')} type="secondary" />
          <TableItemText value={t('sources.table.update')} type="secondary" />
          <TableItemText value={t('sources.table.tags')} type="secondary" />
          <div className="u-w-1-half" />
        </ListItem>

        <Divider />

        {(() => {
          const allPartitionData = [...partitionData]
          Object.values(taskDetails).forEach(task => {
            if (task.details && task.details.metadata) {
              allPartitionData.push({
                ...task.details.metadata,
                status: task.task_state,
                file_id: task.details.file_id
              })
            }
          })

          const addTasksPending = activeTasks.filter(
            t =>
              t.type === 'ADD' &&
              (!taskDetails[t.id] || !taskDetails[t.id].details?.metadata)
          ).length
          const skeletonsToShow = (isAddingTask ? 1 : 0) + addTasksPending

          return (
            <>
              {allPartitionData.map(source => (
                <React.Fragment key={source.file_id}>
                  <SourceItem
                    source={source}
                    statusInfo={statusInfo}
                    deleteSource={() => deleteSource(source)}
                  />
                  <Divider />
                </React.Fragment>
              ))}

              {Array.from({ length: skeletonsToShow }).map((_, i) => (
                <React.Fragment key={`skeleton-${i}`}>
                  <ListItem size="small" dense disableGutters>
                    <ListItemSkeleton />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </>
          )
        })()}

        {loadingSources && (
          <ListItem>
            <ListItemIcon className="u-w-2-half">
              <CircularProgress size={24} />
            </ListItemIcon>
            <TableItemText value="Chargement en cours" type="primary" />
          </ListItem>
        )}
      </List>
    </>
  )
}

export default SourcesTab
