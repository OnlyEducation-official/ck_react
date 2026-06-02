import { getResourceByPath } from '@/util/resource'
import { GetRoleType } from '@/util/utils'
import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { RoutesEnum } from '../GetAllPage'

export default function GetAllHead({
    totalInteger,
    to,
    routeName
}: {
    totalInteger: number;
    to: string;
    routeName: string;
}) {

    const location = useLocation();
    const resource = getResourceByPath(location?.pathname);
    return (
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
                    {totalInteger} total
                </Box>

                <Button
                    variant="contained"
                    component={Link}
                    to={`/${to}`}
                    sx={{
                        borderRadius: 999,
                        textTransform: "none",
                        fontWeight: 600,
                        width: { xs: 250 },
                    }}
                    disabled={
                        GetRoleType()
                            ? false
                            : routeName === RoutesEnum.QUESTIONS
                                ? false
                                : true
                    }
                >
                    Add New {resource?.labels?.singular}
                </Button>
            </Box>
        </Box>
    )
}
