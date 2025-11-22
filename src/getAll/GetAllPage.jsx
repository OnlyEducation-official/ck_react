import React, { useEffect, useState } from "react";
import { fetchQuestions } from "./fetchQuestions";
import { Box, Button, Card, Container, Grid, IconButton, List, ListItemButton, Typography } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
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

    useEffect(() => {
        async function loadData() {
            const res = await fetchQuestions(routeName, ppage.page);
            if (res && res.data) {
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
                        mb: 4,
                        mt: 5,
                        display: "flex",
                        alignItems: { xs: "flex-start", sm: "center" },
                        justifyContent: "space-between",
                        gap: 2,
                    }}
                >
                    <Box>
                        <Typography
                            variant="h4"
                            sx={{ fontWeight: 700, letterSpacing: 0.2, mb: 0.5 }}
                        >
                            Exam Categories
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Manage all your exam categories in one place.
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            flexShrink: 0,
                        }}
                    >
                        {/* Count pill */}
                        <Box
                            sx={{
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 999,
                                bgcolor: "grey.100",
                                fontSize: 12,
                                fontWeight: 500,
                                color: "text.secondary",
                            }}
                        >
                            {questions.length} total
                        </Box>

                        <Button
                            variant="contained"
                            component={Link}
                            to={`/${lol}`}
                            sx={{ borderRadius: 999, textTransform: "none", fontWeight: 600 }}
                        >
                            Add New Questions
                        </Button>
                    </Box>
                </Box>

                {/* List container */}
                <Box
                    sx={{
                        borderRadius: 3,
                        overflow: "hidden",
                        bgcolor: "background.paper",
                        boxShadow: "0 18px 45px rgba(15,23,42,0.06)",
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <List disablePadding sx={{ width: "100%" }}>
                        {questions.map((q, index) => (
                            <ListItemButton
                                key={q.id}
                                onClick={() => handleClick(q.id)}
                                sx={{
                                    py: 1.75,
                                    px: 2.5,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 2,
                                    borderBottom:
                                        index === questions.length - 1 ? "none" : "1px solid",
                                    borderColor: "divider",
                                    transition: "background-color 0.15s ease, transform 0.1s ease",
                                    "&:hover": {
                                        bgcolor: "action.hover",
                                        transform: "translateY(-1px)",
                                    },
                                }}
                            >
                                {/* Left content */}
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 600,
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {q?.attributes?.name || q.id || "Untitled"}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        ID: {q.id}
                                    </Typography>
                                </Box>

                                {/* Right subtle label (visual only) */}
                                <Typography
                                    variant="caption"
                                    sx={{ fontWeight: 500, color: "text.secondary" }}
                                >
                                    View details
                                </Typography>
                            </ListItemButton>
                        ))}
                    </List>
                </Box>

                {/* Pagination */}
                <Box
                    sx={{
                        mt: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        rowGap: 1.5,
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        Page {ppage.page} of {ppage.pageCount}
                    </Typography>

                    <Pagination
                        count={ppage.pageCount}
                        page={ppage.page}
                        onChange={handleChange}
                        shape="rounded"
                        size="small"
                    />
                </Box>
            </Box>
        </Container>

    );
}
