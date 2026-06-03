import { Box, Button } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import AddUserForm from './components/AddUserForm'

export default function AddUsers() {
    return (
        <Box sx={{ mt: 10 }}>
            Add new User
            <AddUserForm />
        </Box>
    )
}
