import React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Typography from '@mui/material/Typography'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import Cloud from '@mui/icons-material/Cloud'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddCardIcon from '@mui/icons-material/AddCard'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/system/Box'
import ListCards from './ListCards/ListCards'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'
function Column({ column, createNewCards, deleteColumnDetails }) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column._id,
    data:{ ...column }

  })
  const dndKitColumnStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
    height:'100%',
    opacity:isDragging? 0.5 : undefined
  }

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const orderedCards = column.cards
  const [openNewCard, setOpenNewCard] = useState(false)
  const toggleOpenNewCard = () => {
    setOpenNewCard(!openNewCard)
    setNewCardTitle('')
  }
  const [newCardTitle, setNewCardTitle]=useState('')
  const addNewCard = () => {
    if (!newCardTitle) {
      toast.error('Please enter Card title', { position: 'bottom-right' })
      return
    }

    const newCardData = {
      title: newCardTitle,
      columnId:column._id
    }
    createNewCards(newCardData)
    // console.log(newCardTitle)
    toggleOpenNewCard()
    setNewCardTitle('')
  }
  const confirmDeleteColumn= useConfirm()
  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: 'Delete Column',
      description:'This action will permanently delete your Column and its Cards! Are you sure?',
      confirmationText:'Confirm',
      cancellationText:'Cancel'
    }).then(() => {
      deleteColumnDetails(column._id)
    }).catch(() => {})
  }

  return (
    <div ref={setNodeRef}
      style={dndKitColumnStyle}
      {...attributes}
    >
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) => (theme.palette.mode == 'dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
        }}>
        {/*Colume hearder */}
        <Box sx={{
          height: (theme) => theme.trello.columnHeaderHeight,
          p: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant='h6' sx={{
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            {column?.title}
          </Typography>
          <Box sx={{ color: 'primary.main' }}>
            <ExpandMoreIcon
              sx={{ color: 'text.primary.main', cursor: 'pointer' }}
              id="basic-column-dropdown"
              aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            />
            <Menu
              id="basic-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClick={handleClose}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-menu-column-dropdown'
              }}
            >
              <MenuItem
                onClick={toggleOpenNewCard}
                sx={{
                  '&:hover':{
                    color: 'success.light',
                    '& .add-card-icon': { color: 'success.light' }
                  }
                }}>
                <ListItemIcon><AddCardIcon className='add-card-icon' fontSize="small" /></ListItemIcon>
                <ListItemText>Add New Card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentPaste fontSize="small" /> </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleDeleteColumn}
                sx= {{
                  '&:hover':{
                    color: 'warning.dark',
                    '& .delete-forever-icon': { color: 'warning.dark' }
                  }
                }}>
                <ListItemIcon><DeleteForeverIcon className='delete-forever-icon' fontSize="small" /></ListItemIcon>
                <ListItemText>Delete This Colume</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
                <ListItemText>Archive This Column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        {/*Colume content */}
        <ListCards cards={orderedCards} />
        {/*Colume footer */}
        <Box sx={{
          height: (theme) => theme.trello.columnFooterHeight,
          p: 2
        }}>
          {!openNewCard
            ? <Box sx={{
              height:'100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Button startIcon={<AddCardIcon />} onClick={toggleOpenNewCard} >Add New Card</Button>
              <Tooltip title='Drag to move'>
                <DragHandleIcon sx={{ cursor: 'pointer', color: 'primary.main' }} />
              </Tooltip>
            </Box>
            :<Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap:1
            }}>
              <TextField
                label="Enter Card Title "
                type='text'
                size='small'
                variant='outlined'
                autoFocus
                data-no-dnd="true"
                sx={{ minWidth: 120 }}
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
              />
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap:1
              }}>
                <Button
                  onClick={addNewCard}
                  variant='contained' color='success' size='small'
                  sx={{
                    boxShadow: 'none',
                    border:'0.5px solid ',
                    borderColor:(theme) => theme.palette.primary.light,
                    '&:hover': {
                      bgcolor:(theme) => theme.palette.primary.dark
                    }
                  }}
                >Add
                </Button>
                <CloseIcon
                  fontSize='small'
                  sx={{ color:  'primary.main', cursor: 'pointer',
                    '&:hover': {
                      color:(theme) => theme.palette.warning.light
                    } }
                  }
                  onClick={toggleOpenNewCard}
                />
              </Box>
            </Box>
          }
        </Box>
      </Box>
    </div>

  )
}

export default Column