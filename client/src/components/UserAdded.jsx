import { Close } from '@mui/icons-material'
import { Avatar, IconButton } from '@mui/material'
import React from 'react'

const UserAdded = ({ user, handleFunction }) => {
    return (
        <div className='flex justify-center items-center mb-5'>
            <Avatar src={user.pic} sx={{ width: '28px', height: '28px' }} />
            <span className='text-sm text-gray-400 ml-2'>{user.name}</span>
            <IconButton className='' onClick={handleFunction}>
                <Close sx={{ fontSize: '13px', color: 'gray' }} />
            </IconButton>
        </div>
    )
}

export default UserAdded