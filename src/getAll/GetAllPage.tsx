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
  LinearProgress,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getResourceByPath } from "../util/resource.js";
import { searchTopics, type TopicHit } from "../util/topicSearch.js";
import fetchQuestions from "./fetchQuestions.js";

import HtmlWithMathRenderer from "../GlobalComponent/QuestionRenderer.js";

export enum RoutesEnum {
  CATEGORIES = "t-categories",
  QUESTIONS = "t-questions",
  SUBJECTS = "test-series-subjects",
  TOPICS = "t-topics",
  EXAMS = "t-exams",
  SUBJECTCATEGORIE = "test-series-subject-categories",
  CHAPTER = "test-series-chapters",
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
    case RoutesEnum.SUBJECTCATEGORIE:
      return "test-series-subject-categorie";
    case RoutesEnum.CHAPTER:
      return "test-series-chapter";
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
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

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
      setLoading(true);
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

      setSearchLoading(true);
      const results = await searchTopics(value, getRouteType(routeName));
      setSearchResults(results);

      const pageCount = Math.ceil(results.length / PAGE_SIZE);

      setPageState({
        page: 1,
        pageCount,
        total: results.length,
      });
      setSearchLoading(false);
    }, 300);
  };

  const handleClick = (id: number) => navigate(`/${lol}/edit/${id}`);

  // -------------------------------------------------------------------
  // ✅ FULL-SCREEN CENTERED LOADER (UPDATED)
  // -------------------------------------------------------------------
  if (loading)
    return (
      <Box
        sx={{
          height: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        {/* Spinner */}
        <Box
          sx={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            border: "5px solid #e0e0e0",
            borderTopColor: "primary.main",
            animation: "spin 1s linear infinite",
          }}
        />

        {/* Description */}
        <Typography sx={{ color: "text.secondary", fontWeight: 500 }}>
          Loading {resource?.labels?.plural}...
        </Typography>

        {/* Keyframes */}
        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </Box>
    );
  // -------------------------------------------------------------------

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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
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
                width: { xs: 250 },
              }}
            >
              Add New {resource?.labels?.singular}
            </Button>
          </Box>
        </Box>

        {/* SEARCH */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Search By Id"
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
          {searchLoading && <LinearProgress />}
          <List disablePadding>
            {displayList.length === 0 ? (
              <Box
                sx={{
                  // height: "70vh",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBlock: 3,
                  gap: 2,
                }}
              >
                {/* No results */}
                <Typography sx={{ color: "text.secondary", fontWeight: 500 }}>
                  No results found.
                </Typography>
              </Box>
            ) : (
              displayList.map((item, index) => {
                return (
                  <ListItemButton
                    key={item.id}
                    onClick={() => handleClick(item.id)}
                    sx={{
                      py: { xs: 1.5, md: 1.75 },
                      px: { xs: 2, md: 2.5 },
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: 2,
                      borderBottom:
                        index === displayList.length - 1
                          ? "none"
                          : "1px solid #eee",
                      transition: "0.25s ease",
                      "&:hover": {
                        bgcolor: "action.hover",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        flex: 1,
                        flexDirection: "column",
                        minWidth: 0,
                        width: "100%",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          lineHeight: 1.4,
                          fontSize: { xs: "0.9rem", md: "1rem" },
                        }}
                      >
                        <HtmlWithMathRenderer
                          html={
                            item?.question_title ||
                            item?.name ||
                            item?.title ||
                            item?.attributes?.question_title ||
                            item?.attributes?.name ||
                            item?.attributes?.title ||
                            item?.attributes?.slug ||
                            ""
                          }
                        />
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Typography variant="subtitle1" color="text.secondary">
                          ID: {item.id}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "primary.main",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "0.25s ease",
                            "&:hover": { color: "primary.dark" },
                          }}
                        >
                          <Typography variant="subtitle2">
                            View details
                          </Typography>
                          <Box
                            component="span"
                            sx={{
                              ml: 0.5,
                              fontSize: { xs: "1rem", md: "1.1rem" },
                            }}
                          >
                            →
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </ListItemButton>
                );
              })
            )}
          </List>
        </Box>

        {/* PAGINATION */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "flex-start", sm: "space-between" },
            alignItems: { xs: "flex-start", sm: "center" },
            gap: { xs: 2, sm: 0 },
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
          />
        </Box>
      </Box>
    </Container>
  );
}
