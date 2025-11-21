import React, { useEffect, useState } from "react";
import { fetchQuestions } from "./fetchQuestions";
import { Box, Card, Container, Grid, IconButton, Typography } from "@mui/material";
import { Link, useNavigate, useLocation  } from "react-router-dom";
import Pagination from '@mui/material/Pagination';
// import { Link } from 'react-router-dom'

export default function GetAllList({ routeName, lol }) {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ppage, setPage] = useState({
        page: 1,
        pageCount: 1,
        total: 0
    })
    const navigate = useNavigate()
    const location = useLocation();

    useEffect(() => {
        async function loadData() {
            const res = await fetchQuestions(routeName, ppage.page);
            if (res && res.data) {
                console.log('res: ', res);
                setQuestions(res.data);
                setPage(prev => ({
                    ...prev,
                    page: res.meta.pagination.page,
                    pageCount: res.meta.pagination.pageCount,
                    totel: res.meta.pagination.total
                }));
            }
            setLoading(false);
        }

        loadData();
    }, [routeName, lol, ppage.page]);

    const handleClick = (qid) => {
        navigate(`/${lol}/edit/${qid}`);
    }

    const handleChange = (_event, value) => {
        setPage(prev => ({
            ...prev,
            page: value,
        }));
    };

    if (loading) return <p>Loading...</p>;

    return (
        <Container maxWidth="md">
            <Box sx={{ py: 6 }}>
                {/* Header */}
                <Box
                    sx={{
                        mb: 3,
                        display: 'flex',
                        alignItems: 'baseline',
                        justifyContent: 'space-between',
                        mt: 5
                    }}
                >
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        All Questions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {questions.length} total
                    </Typography>
                </Box>

                {/* Grid of cards */}
                <Grid container spacing={2}>
                    {questions.map((q) => (
                        <Grid xs={12} sm={6} md={4} key={q.id}>
                            <Card
                                onClick={() => handleClick(q.id)}
                                sx={{
                                    cursor: 'pointer',
                                    px: 2.5,
                                    py: 2,
                                    borderRadius: 3,
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    bgcolor: 'primary.main',
                                    color: 'primary.contrastText',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 16px 35px rgba(0,0,0,0.25)',
                                    },
                                }}
                            >
                                <Box sx={{ overflow: 'hidden', pr: 1 }}>
                                    <Typography
                                        variant="caption"
                                        sx={{ opacity: 0.7, textTransform: 'uppercase' }}
                                    >
                                        Question ID
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 700,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {q.id || 'Untitled'}
                                    </Typography>
                                </Box>

                                <IconButton
                                    size="small"
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.18)',
                                        color: 'inherit',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.28)',
                                        },
                                    }}
                                >
                                    {/* <ArrowForwardIosRoundedIcon fontSize="small" /> */}
                                </IconButton>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Typography>Page: {ppage.page}</Typography>
            <Pagination
                count={ppage.pageCount}
                page={ppage.page}
                onChange={handleChange}   // 👈 don’t wrap in arrow
            />

        </Container>
    );
}
