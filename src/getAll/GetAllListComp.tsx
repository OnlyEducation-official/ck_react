import HtmlWithMathRenderer from "@/GlobalComponent/QuestionRenderer";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    LinearProgress,
    List,
    ListItemButton,
    Pagination,
    Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { GetRoleType } from "@/util/utils";
import { deleteApi, type SubjectFilters } from "./api/subjectApi";
import { useSyllabusData } from "./hooks/getAllSubject";
import SearchFilter from "./components/SearchFilter";
import { Syllabus } from "./GetAllPage";

export default function GetAllListComp({ pageRoute, syllabus }: { pageRoute: string; syllabus: Syllabus }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [filters, setFilters] = React.useState<SubjectFilters | undefined>(
        undefined
    );

    const [deleteTargetId, setDeleteTargetId] = React.useState<number | null>(
        null
    );

    const { data, isLoading, pagination, setPage } = useSyllabusData({
        params: filters,
        initialPage: 1,
        initialLimit: 10,
        syllabus: syllabus
    });

    const subjects = data?.data ?? [];

    const handleSearchChange = useCallback((search: string) => {
        setFilters(search ? { search } : undefined);
        setPage(1);
    }, [setPage]);

    const handleClick = (id: number) => {
        navigate(`/${pageRoute}/edit/${id}`);
    };

    const handleDelete = async (id: number) => {
        const res = await deleteApi("subjects", id);

        if (!res.success) {
            toast.error(res.message);
            return;
        }

        toast.success(res.message);

        await queryClient.invalidateQueries({
            queryKey: ["subjects"],
        });
    };

    return (
        <>
            <SearchFilter onSearchChange={handleSearchChange} />

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
                {isLoading && <LinearProgress />}

                <List disablePadding>
                    {subjects.length === 0 ? (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBlock: 3,
                                gap: 2,
                            }}
                        >
                            <Typography sx={{ color: "text.secondary", fontWeight: 500 }}>
                                No results found.
                            </Typography>
                        </Box>
                    ) : (
                        subjects.map((item, index) => (
                            <ListItemButton
                                key={item.id}
                                onClick={() => handleClick(item.id)}
                                sx={{
                                    py: { xs: 1.5, md: 1.75 },
                                    px: { xs: 2, md: 2.5 },
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 2,
                                    borderBottom:
                                        index === subjects.length - 1 ? "none" : "1px solid #eee",
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
                                        flexDirection: "column",
                                        gap: 2,
                                        flex: 1,
                                        minWidth: 0,
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
                                        <HtmlWithMathRenderer html={item.name || item?.question || ""} />
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
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
                                            }}
                                        >
                                            <Typography variant="subtitle2">View details</Typography>
                                            <Box component="span" sx={{ ml: 0.5 }}>
                                                →
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>

                                {GetRoleType() && (
                                    <IconButton
                                        edge="end"
                                        color="error"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setDeleteTargetId(item.id);
                                        }}
                                        sx={{ mt: 0.5 }}
                                    >
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                )}
                            </ListItemButton>
                        ))
                    )}
                </List>
            </Box>

            <Dialog
                open={deleteTargetId !== null}
                onClose={() => setDeleteTargetId(null)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this item? This action cannot be
                        undone.
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setDeleteTargetId(null)}>Cancel</Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={() => {
                            if (deleteTargetId !== null) {
                                handleDelete(deleteTargetId);
                            }

                            setDeleteTargetId(null);
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

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
                    📄 Page {pagination.page}
                    <Typography component="span" sx={{ opacity: 0.6 }}>
                        / {pagination.totalPages}
                    </Typography>
                </Typography>

                <Pagination
                    count={pagination.totalPages}
                    page={pagination.page}
                    onChange={(_, value) => setPage(value)}
                    shape="rounded"
                    size="small"
                />
            </Box>
        </>
    );
}