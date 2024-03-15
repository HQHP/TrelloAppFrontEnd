import Box from '@mui/system/Box'
import { toast } from 'react-toastify'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
function ListColumns({ columns, createNewColumns, createNewCards, deleteColumnDetails }) {
  const [openNewColumn, setOpenNewColumn] = useState(false)
  const toggleOpenNewColumn = () => {
    setOpenNewColumn(!openNewColumn)
    setNewColumnTitle('')
  }
  const [newColumnTitle, setNewColumnTitle]=useState('')
  const addNewColumn = () => {
    if (!newColumnTitle) {
      toast.error('Please enter Column Title')
      return
    }
    // Tao du lieu Column de goi Api
    const newColumnData = {
      title: newColumnTitle
    }
    createNewColumns(newColumnData)
    // console.log(newColumnTitle)
    toggleOpenNewColumn()
    setNewColumnTitle('')
  }
  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 },
        '&::-webkit-scrollbar-thumb': { backgroundColor: '#ced6e0' }
      }}>
        {columns?.map((column) => {
          return ( <Column
            key={column._id}
            column={column}
            createNewCards={createNewCards}
            deleteColumnDetails={deleteColumnDetails}
          />)
        })}
        {!openNewColumn
          ? <Box onClick={toggleOpenNewColumn}
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#dfe6e9'
            }}>
            <Button
              startIcon={<AddCircleOutlineIcon />}
              sx={{
                fontWeight: 'bold',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1
              }}
            >
                    Add New Column
            </Button>
          </Box>
          : <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p:1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#dfe6e9',
            display: 'flex',
            flexDirection: 'column',
            gap:1
          }}>
            <TextField
              label="Enter Column Title "
              type='text'
              size='small'
              variant='outlined'
              autoFocus
              sx={{ minWidth: 120 }}
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
            />
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap:1
            }}>
              <Button
                onClick={addNewColumn}
                variant='contained' color='success' size='small'
                sx={{
                  boxShadow: 'none',
                  border:'0.5px solid ',
                  borderColor:(theme) => theme.palette.primary.light,
                  '&:hover': {
                    bgcolor:(theme) => theme.palette.primary.dark
                  }
                }}
              >Add Columm
              </Button>
              <CloseIcon
                fontSize='small'
                sx={{ color:  'primary.main', cursor: 'pointer',
                  '&:hover': {
                    color:(theme) => theme.palette.warning.light
                  } }
                }
                onClick={toggleOpenNewColumn}
              />
            </Box>
          </Box>
        }
        {/* <Box sx={{
          minWidth: '200px',
          maxWidth: '200px',
          mx: 2,
          borderRadius: '6px',
          height: 'fit-content',
          bgcolor: '#dfe6e9'
        }}>
          <Button
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              fontWeight: 'bold',
              width: '100%',
              justifyContent: 'flex-start',
              pl: 2.5,
              py: 1
            }}
          >
                    Add New Column
          </Button>
        </Box> */}
      </Box >
    </SortableContext>
  )
}

export default ListColumns