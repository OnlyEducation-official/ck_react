import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    Box,
    CircularProgress,
    Pagination
} from '@mui/material';

interface User {
    id: number;
    name: string;
    email: string;
}

const baseURL = `${import.meta.env.VITE_BASE_URL}auth/all-users`;

export default function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState<number>(1);
    const rowsPerPage = 5;

    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1', 10);

    // 2. Initialize the navigation engine hook
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${baseURL}?page=${page}&limit=${rowsPerPage}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();

            setUsers(data?.data || []);
            setTotalPages(data?.meta?.pagination?.totalPages || 1);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setSearchParams({ page: value.toString() });
    };

    // 3. Updated Edit handler to pass the user ID as a query param
    const handleEdit = (id: number) => {
        navigate(`/add-users?id=${id}`);
    };

    const handleDelete = async (id: number) => {
        const deleteURL = `${import.meta.env.VITE_BASE_URL}auth`;

        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${deleteURL}/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete the user.');
            }

            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
            alert('User deleted successfully.');

            if (users.length === 1 && page > 1) {
                setSearchParams({ page: (page - 1).toString() });
            } else if (users.length === 1 && page === 1) {
                fetchUsers();
            }

        } catch (err: any) {
            console.error('Delete Error:', err);
            alert(err.message || 'An error occurred while trying to delete the user.');
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Typography color="error" textAlign="center" sx={{ mt: 4 }}>Error: {error}</Typography>;

    return (
        <TableContainer component={Paper} sx={{ maxWidth: 800, margin: '20px auto', padding: 2 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>User List</Typography>
            <Table aria-label="users table">
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell><strong>Name</strong></TableCell>
                        <TableCell><strong>Email</strong></TableCell>
                        <TableCell align="center"><strong>Actions</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} hover>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell align="center">
                                <Button variant="outlined" size="small" sx={{ mr: 1 }} onClick={() => handleEdit(user.id)}>
                                    Edit
                                </Button>
                                <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(user.id)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {users.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} align="center">No users found.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {users.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 1 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        shape="rounded"
                        variant="outlined"
                    />
                </Box>
            )}
        </TableContainer>
    );
}