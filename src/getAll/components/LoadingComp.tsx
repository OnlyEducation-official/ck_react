import { getResourceByPath } from '@/util/resource';
import { Box, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom';

export default function LoadingComp() {

    const location = useLocation();
    const resource = getResourceByPath(location?.pathname);
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
    )
}
