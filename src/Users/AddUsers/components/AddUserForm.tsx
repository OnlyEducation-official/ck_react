import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Added useNavigate for redirection after saving
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

export default function AddUserForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    });
    const [loading, setLoading] = useState(false);

    // 1. Hook up URL search parameter reader and router navigator
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const userId = searchParams.get('id'); // Will return the string ID (e.g., "20") or null
    const isEditMode = Boolean(userId);   // True if we are editing, False if adding

    const baseURL = `${import.meta.env.VITE_BASE_URL}auth`;

    // 2. Fetch single user data if 'id' exists in the URL
    useEffect(() => {
        if (!isEditMode) return;

        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${baseURL}/${userId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) throw new Error('Failed to fetch user data');
                const result = await response.json();

                console.log(result)
                
                // Assuming your backend responds with a nested data object like { data: { name, email, role } }
                // Adjust data mappings if your backend response structure differs
                const userData = result?.data || result;

                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    password: '', // Standard security practice: leave password field empty during edits
                    role: userData.role || ''
                });
            } catch (error: any) {
                console.error("Error fetching single user:", error);
                alert("Could not load user data.");
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

    // 3. Handle Form Submission dynamically based on Mode
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Dynamically choose endpoint path and method
        const submissionURL = isEditMode ? `${baseURL}/${userId}` : baseURL;
        const HTTPMethod = isEditMode ? 'PUT' : 'POST';

        try {
            // Optional: If password field is blank during edit, don't pass it to prevent overwriting it to empty
            const payload = { ...formData };
            console.log(payload)
            if (isEditMode && !payload.password) {
                delete (payload as any).password;
            }

            const response = await fetch(submissionURL, {
                method: HTTPMethod,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Something went wrong while processing your request.`);
            }

            alert(isEditMode ? 'User updated successfully!' : 'User added successfully!');
            
            // Clean up state and route back to list screen
            setFormData({ name: '', email: '', password: '', role: '' });
            navigate(-1); // Redirects back to previous view screen (UserList)

        } catch (error: any) {
            console.error('Submission Error:', error);
            alert(error.message || 'Failed to connect to the server.');
        }
    };

    // Loading indicator screen guard while pulling edit profiles
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
            {/* 4. Conditional UI Heading */}
            <Typography variant="h5" component="h2" textAlign="center" gutterBottom>
                {isEditMode ? 'Edit User Details' : 'Add New User'}
            </Typography>

            {/* Name Field */}
            <TextField
                label="Name"
                name="name"
                variant="outlined"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
            />

            {/* Email Field */}
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

            {/* Password Field — optional during edits */}
            <TextField
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                fullWidth
                required={!isEditMode} // Required for new users, optional for edits
                placeholder={isEditMode ? "Leave blank to keep unchanged" : ""}
                value={formData.password}
                onChange={handleChange}
            />

            {/* Role Dropdown */}
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

            {/* 5. Conditional Submit Button label and styling adjustments */}
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