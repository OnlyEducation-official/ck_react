import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
    FormControl,
    InputLabel,
    Select
} from '@mui/material';

export default function AddUserForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;

        // If name is undefined, do nothing
        if (!name) return;

        setFormData((prev) => ({
            ...prev,
            [name]: value // TypeScript is happy now!
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form Data Submitted:', formData);

        const path = `${import.meta.env.VITE_BASE_URL}auth`
        console.log(path)

        try {
            const response = await fetch(path, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong while creating the user.');
            }

            console.log('User created successfully:', data);
            alert('User added successfully!');

            setFormData({ name: '', email: '', password: '', role: '' });

        } catch (error: any) {
            console.error('Submission Error:', error);
            alert(error.message || 'Failed to connect to the server.');
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: 400,
                margin: '20px auto', // centers the form and gives it some top margin
                padding: 3,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: 'background.paper'
            }}
        >
            <Typography variant="h5" component="h2" textAlign="center" gutterBottom>
                Add New User
            </Typography>

            {/* 1. Name Field */}
            <TextField
                label="Name"
                name="name"
                variant="outlined"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
            />

            {/* 2. Email Field */}
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

            {/* 3. Password Field */}
            <TextField
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                fullWidth
                required
                value={formData.password}
                onChange={handleChange}
            />

            {/* 4. Role Dropdown */}
            <FormControl fullWidth required>
                <InputLabel id="role-select-label">Role</InputLabel>
                <Select
                    labelId="role-select-label"
                    id="role-select"
                    name="role"
                    value={formData.role}
                    label="Role"
                    // Cast your handler to any right here to satisfy the Select component
                    onChange={handleChange as any}
                >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="teacher">Teacher</MenuItem>
                </Select>
            </FormControl>

            {/* Submit Button */}
            <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 1 }}
            >
                Submit
            </Button>
        </Box>
    );
}