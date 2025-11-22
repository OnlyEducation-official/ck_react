import { styled, alpha } from '@mui/material/styles';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { Container, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import Sidebar from '../GlobalComponent/Sidebar';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));


function DrawerAppBar() {

    const navBtn = [
        {
            label: 'Home',
            path: '/'
        },
        {
            label: 'Listing',
            path: '/listing'
        }
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar component="nav" sx={{ '& .MuiToolbar-root': { padding: 0 } }}>
                <Container maxWidth="xl">
                    <Toolbar>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            {/* <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton> */}
                            <Typography
                                variant="h5"
                                noWrap
                                component={Link}
                                to={'/'}
                                sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 600, textDecoration: 'none', color: 'white' }}
                            >
                                ONLY TEST
                            </Typography>
                            <Stack direction={'row'} gap={3}>
                                {navBtn.map((btn, index) => (
                                    <Typography
                                        variant="subtitle1"
                                        noWrap
                                        component={Link}
                                        to={btn.path}
                                        key={index}
                                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, fontWeight: 600 }}
                                    >
                                        {btn.label}
                                    </Typography>
                                ))}
                            </Stack>
                            <Sidebar />
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>


        </Box>
    );
}

export default DrawerAppBar;
