import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

export default function HomePageRedirect() {
    return (
        <Navigate to="/login" replace />
    )
}
