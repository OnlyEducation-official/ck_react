import React, { useEffect, useState } from "react";
import { fetchQuestions } from "./fetchQuestions";
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  IconButton,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
// import { Link } from 'react-router-dom'

export default function GetAllList({ routeName, lol }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ppage, setPage] = useState({
    page: 1,
    pageCount: 1,
    total: 0,
  });
  console.log('questions: ', questions);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      const res = await fetchQuestions(routeName, ppage.page);
      if (res && res.data) {
        setQuestions(res.data);
        setPage((prev) => ({
          ...prev,
          page: res.meta.pagination.page,
          pageCount: res.meta.pagination.pageCount,
          totel: res.meta.pagination.total,
        }));
      }
      setLoading(false);
    }

    loadData();
  }, [routeName, lol, ppage.page]);

  const handleClick = (qid) => {
    navigate(`/${lol}/edit/${qid}`);
  };

  const handleChange = (_event, value) => {
    setPage((prev) => ({
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
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: { xs: 2, sm: 2 },
            // width: {xs : "100%" , md : 1000},
            width: "100%",
          }}
        >
          {/* LEFT SIDE */}
          <Box sx={{ width: "fit-content" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                letterSpacing: 0.2,
                mb: 0.5,
                fontSize: { xs: "1.6rem", sm: "2rem" }, // Responsive heading size
                width: "fit-content",
              }}
            >
              Exam Categories
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: { xs: "0.85rem", sm: "0.9rem" },
                width: "fit-content",
              }}
            >
              Manage all your exam categories in one place.
            </Typography>
          </Box>

          {/* RIGHT SIDE (responsive buttons) */}
          <Box
            sx={{
              display: "flex",
              paddingBlock: { xs: 1.5, md: 0 },
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex-start", md: "center" },
              //   justifyItems: { xs: "flex-start", sm: "center" },
              gap: { xs: 1.5, sm: 2 },
              width: { xs: "100%", sm: "auto" },
              mt: { xs: 1, sm: 0 },
            }}
          >
            {/* Count Pill */}
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 999,
                bgcolor: "grey.100",
                fontSize: { xs: 11, sm: 12 },
                fontWeight: 500,
                color: "text.secondary",
                width: { xs: "fit-content" },
              }}
            >
              {questions.length} total
              {/* 9900000 total */}
            </Box>

            {/* ADD BUTTON */}
            <Button
              variant="contained"
              component={Link}
              to={`/${lol}`}
              fullWidth={{ xs: true, sm: false }} // Button full width only on mobile
              sx={{
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 600,
                // width: { xs: "100%", md: "fit-content" },
                width: { xs: 180 },
              }}
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
                  transition:
                    "background-color 0.15s ease, transform 0.1s ease",
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
                    {q?.attributes?.question_title || q?.id || "Untitled"}
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
          {/* <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              px: 1.5,
              py: 0.4,
              borderRadius: "50px",
              backgroundColor: "grey.100",
              color: "text.secondary",
              fontSize: "0.75rem",
              fontWeight: 500,
            }}
          >
            Page {ppage.page} of {ppage.pageCount}
          </Typography> */}
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.6,
              px: 1.6,
              py: 0.5,
              borderRadius: "50px",
              background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
              color: "#1A237E",
              fontWeight: 600,
              //   fontSize: "0.78rem",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
            variant="subtitle2"
          >
            📄 Page {ppage.page}
            <span style={{ opacity: 0.6 }}> / {ppage.pageCount}</span>
          </Typography>

          <Pagination
            count={ppage.pageCount}
            page={ppage.page}
            onChange={handleChange}
            shape="rounded"
            size="small"
            sx={{
              "& .MuiPagination-ul": {
                gap: 0.5,
              },

              // Normal Page Button
              "& .MuiPaginationItem-root": {
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 500,
                minWidth: 32,
                height: 32,
                transition: "0.25s ease",
                color: "text.primary",
                border: "1px solid #e0e0e0",
                backgroundColor: "#fff",

                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                  borderColor: "primary.main",
                  color: "primary.main",
                },
              },

              // Selected (Active) Page
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "primary.main",
                color: "#fff",
                borderColor: "primary.main",
                boxShadow: "0 2px 6px rgba(25, 118, 210, 0.4)",

                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              },

              // Next/Previous arrows
              "& .MuiPaginationItem-previousNext": {
                borderRadius: "50%",
                backgroundColor: "#f7f7f7",
                border: "1px solid #e0e0e0",

                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                  borderColor: "primary.main",
                },
              },

              // Dots (...)
              "& .MuiPaginationItem-ellipsis": {
                fontWeight: 700,
                color: "text.secondary",
              },
            }}
          />
        </Box>
      </Box>
    </Container>
  );
}
