
import Box from '@mui/system/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatter'
const menuStyle = {
  color: 'primary.main',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '5px',
  '& .MuiSvgIcon-root': {
    color: 'primary.main'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}
function BoardBar({ board }) {
  return (
    <Box sx={{
      height: (theme) => theme.trello.boardBarHeight,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingX: 2,
      gap: 2,
      overflowX: 'auto'
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Tooltip title={board?.description}>
          <Chip
            sx={menuStyle}
            icon={<DashboardIcon />}
            label={board?.title}
            clickable />
        </Tooltip>
        <Chip
          sx={menuStyle}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable />
        <Chip
          sx={menuStyle}
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          clickable />
        <Chip
          sx={menuStyle}
          icon={<BoltIcon />}
          label="Automation"
          clickable />
        <Chip
          sx={menuStyle}
          icon={<FilterListIcon />}
          label="Filters"
          clickable />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant="outlined" startIcon={<PersonAddIcon />} sx={{
          '&:hover': {
            borderColor: 'praimary.secondary'
          }
        }}>Invited</Button>
        <AvatarGroup
          max={4}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'write',
              cursor: 'pointer',
              '& .first-of-type': {
                bgcolor: '#a4b0be'
              }
            }
          }}>
          <Tooltip title='Avatar'>
            <Avatar
              alt="Avatar"
              src='https://tse4.mm.bing.net/th?id=OIP.MFhGMNHFpbQLvyXeag9K5wHaHV&pid=Api&P=0&h=180' />
          </Tooltip>
          <Tooltip title='Avatar'>
            <Avatar
              alt="Avatar"
              src='https://tse4.mm.bing.net/th?id=OIP.MFhGMNHFpbQLvyXeag9K5wHaHV&pid=Api&P=0&h=180' />
          </Tooltip>
          <Tooltip title='Avatar'>
            <Avatar
              alt="Avatar"
              src='https://tse4.mm.bing.net/th?id=OIP.MFhGMNHFpbQLvyXeag9K5wHaHV&pid=Api&P=0&h=180' />
          </Tooltip>
          <Tooltip title='Avatar'>
            <Avatar
              alt="Avatar"
              src='https://tse4.mm.bing.net/th?id=OIP.MFhGMNHFpbQLvyXeag9K5wHaHV&pid=Api&P=0&h=180' />
          </Tooltip>
          <Tooltip title='Avatar'>
            <Avatar
              alt="Avatar"
              src='https://tse4.mm.bing.net/th?id=OIP.MFhGMNHFpbQLvyXeag9K5wHaHV&pid=Api&P=0&h=180' />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar