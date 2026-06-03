import { Link } from 'react-router-dom';
import { Button, Box } from '@mui/material'; // Import MUI components
import UserList from './components/UserList';

export default function AllUsers() {
  return (
    // Box replaces the standard div and handles the 20px top margin
    <Box sx={{ mt: 10 }}>
      <Button
        component={Link} // Feeds the React Router Link directly into the Button
        to="/add-users"
        variant="contained" // Gives it the solid background style
        color="primary"
      >
        Add new User
      </Button>
      <UserList />
    </Box>
  );
}