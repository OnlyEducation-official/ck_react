import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    CircularProgress
} from '@mui/material';
import { api } from '@/lib/api';
import z from 'zod';
import { toast } from "react-toastify";
import { AuthContext } from '@/context/AuthContext';

export default function AddUserForm() {
    const { token } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    });
    const [loading, setLoading] = useState(false);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const userId = searchParams.get('id');
    const isEditMode = Boolean(userId);

    const baseURL = `${import.meta.env.VITE_BASE_URL}auth`;

    useEffect(() => {
        if (!isEditMode) return;

        const fetchUserData = async () => {
            try {
                setLoading(true);

                const result = await api<any>(`auth/${userId}`,{
                    method: 'PUT'
                });

                const userData = result?.data || result;

                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    password: '',
                    role: userData.role || ''
                });

            } catch (error: any) {
                console.error("Error fetching single user:", error);

                toast.error(error.message || "Could not load user data.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId, isEditMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        if (!name) return;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const url = isEditMode ? `auth/${userId}` : 'auth/register';
        const HTTPMethod = isEditMode ? 'PUT' : 'POST';

        try {
            const payload = { ...formData };
            if (isEditMode && !payload.password) {
                delete (payload as any).password;
            }

            const response = await api<any>(url, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload),
                method: HTTPMethod,
            });

            toast.success(response.message || "User created successfully");
            navigate(-1);

        } catch (error: any) {
            console.log("Caught Error Payload inside handleSubmit:", error);

            const toastMessage =
                error.response?.data?.message ||
                error.data?.message ||
                error.message ||
                "User Already Exist!";

            toast.error(toastMessage);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: 400,
                margin: '20px auto',
                padding: 3,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: 'background.paper'
            }}
        >
            <Typography variant="h5" component="h2" textAlign="center" gutterBottom>
                {isEditMode ? 'Edit User Details' : 'Add New User'}
            </Typography>

            <TextField
                label="Name"
                name="name"
                variant="outlined"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
            />

            <TextField
                label="Email"
                name="email"
                type="email"
                variant="outlined"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
            />

            <TextField
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                fullWidth
                required={!isEditMode}
                placeholder={isEditMode ? "Leave blank to keep unchanged" : ""}
                value={formData.password}
                onChange={handleChange}
            />

            <FormControl fullWidth required>
                <InputLabel id="role-select-label">Role</InputLabel>
                <Select
                    labelId="role-select-label"
                    id="role-select"
                    name="role"
                    value={formData.role}
                    label="Role"
                    onChange={handleChange as any}
                >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="teacher">Teacher</MenuItem>
                </Select>
            </FormControl>

            <Button
                type="submit"
                variant="contained"
                color={isEditMode ? "secondary" : "primary"}
                size="large"
                sx={{ mt: 1 }}
            >
                {isEditMode ? 'Update User' : 'Submit'}
            </Button>

            {isEditMode && (
                <Button variant="text" color="inherit" onClick={() => navigate(-1)}>
                    Cancel
                </Button>
            )}
        </Box>
    );
}