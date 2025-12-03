import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Container,
  List,
  ListItemButton,
  Typography,
  Pagination,
  TextField,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getResourceByPath } from "../util/resource.js";
import { searchTopics, type TopicHit } from "../util/topicSearch.js";
import fetchQuestions from "./fetchQuestions.js";
// import fetchQuestions from "./fetchQuestions.js";

export enum RoutesEnum {
  CATEGORIES = "t-categories",
  QUESTIONS = "t-questions",
  SUBJECTS = "test-series-subjects",
  TOPICS = "t-topics",
  EXAMS = "t-exams",
}

interface Props {
  routeName: RoutesEnum;
  lol: string;
  title: {
    singular: string;
    plural: string;
  };
}

const PAGE_SIZE = 10;

// Correct Meili index mapping
function getRouteType(routeName: RoutesEnum): string {
  switch (routeName) {
    case RoutesEnum.CATEGORIES:
      return "t-category";

    case RoutesEnum.QUESTIONS:
      return "t-question";

    case RoutesEnum.SUBJECTS:
      return "test-series-subject";

    case RoutesEnum.TOPICS:
      return "t-topic";

    case RoutesEnum.EXAMS:
      return "t-exam";

    default:
      return routeName;
  }
}

export default function GetAllList({ routeName, lol, title }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const resource = getResourceByPath(location?.pathname);
  const [list, setList] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<TopicHit[]>([]);
  const [loading, setLoading] = useState(true);

  const [pageState, setPageState] = useState({
    page: 1,
    pageCount: 1,
    total: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const searchTimer = useRef<number | null>(null);

  // Load Strapi Data
  useEffect(() => {
    if (searchQuery.trim().length > 0) return;

    async function load() {
      const res = await fetchQuestions(routeName, pageState.page);

      setList(res?.data || []);
      setPageState({
        page: res?.meta.pagination.page || 1,
        pageCount: res?.meta.pagination.pageCount || 1,
        total: res?.meta.pagination.total || 0,
      });

      setLoading(false);
    }

    load();
  }, [routeName, pageState.page, searchQuery]);

  // Handle Meili search
  const handleSearch = (value: string) => {
    setSearchQuery(value);

    if (searchTimer.current) clearTimeout(searchTimer.current);

    searchTimer.current = setTimeout(async () => {
      if (!value.trim()) {
        setSearchResults([]);
        setPageState((prev) => ({ ...prev, page: 1 }));
        return;
      }

      const results = await searchTopics(value, getRouteType(routeName));
      setSearchResults(results);

      const pageCount = Math.ceil(results.length / PAGE_SIZE);

      setPageState({
        page: 1,
        pageCount,
        total: results.length,
      });
    }, 300);
  };

  const handleClick = (id: number) => navigate(`/${lol}/edit/${id}`);

  if (loading) return <p>Loading...</p>;

  // Search pagination
  let displayList: any[] = [];
  if (searchQuery.trim().length > 0) {
    const start = (pageState.page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    displayList = searchResults.slice(start, end);
  } else {
    displayList = list;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        {/* HEADER */}
        <Box
          sx={{
            mb: 4,
            mt: 5,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
            width: "100%",
          }}
        >
          {/* LEFT SIDE */}
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                letterSpacing: 0.2,
                mb: 0.5,
                fontSize: { xs: "1.6rem", sm: "2rem" },
              }}
            >
              All {resource?.labels?.plural}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Manage all your {resource?.labels?.plural} in one place.
            </Typography>
          </Box>

          {/* RIGHT SIDE BUTTONS */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
            }}
          >
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 999,
                bgcolor: "grey.100",
                fontSize: 12,
                fontWeight: 500,
                color: "text.secondary",
                width: "fit-content",
                aspectRatio: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* {displayList?.length} total */}
              {pageState?.total} total
            </Box>

            <Button
              variant="contained"
              component={Link}
              to={`/${lol}`}
              sx={{
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 600,
                width: { xs: 180 },
              }}
            >
              {/* {title?.singular} */}
              Add New  {resource?.labels?.singular}
            </Button>
          </Box>
        </Box>

        {/* SEARCH */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Search"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Box>

        {/* LIST */}
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
          <List disablePadding>
            {displayList.map((item, index) => {
              const attrs = item.attributes || item;

              return (
                <ListItemButton
                  key={item.id}
                  onClick={() => handleClick(item.id)}
                  sx={{
                    py: 1.75,
                    px: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom:
                      index === displayList.length - 1
                        ? "none"
                        : "1px solid #eee",
                    "&:hover": {
                      bgcolor: "action.hover",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
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
                      {attrs.title || attrs.name || attrs.slug || "Untitled"}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      ID: {item.id}
                    </Typography>
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    View details
                  </Typography>
                </ListItemButton>
              );
            })}
          </List>
        </Box>

        {/* PAGINATION */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.6,
              py: 0.5,
              borderRadius: "50px",
              background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
              color: "#1A237E",
              fontWeight: 600,
            }}
          >
            📄 Page {pageState.page}
            <Typography component="span" sx={{ opacity: 0.6 }}>
              {" "}
              / {pageState.pageCount}
            </Typography>
          </Typography>

          <Pagination
            count={pageState.pageCount}
            page={pageState.page}
            onChange={(_, val) =>
              setPageState((prev) => ({ ...prev, page: val }))
            }
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