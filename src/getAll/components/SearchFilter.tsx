import { Box, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";

function useDebounce<T>(value: T, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

type SearchFilterProps = {
    onSearchChange: (search: string) => void;
};

export default function SearchFilter({ onSearchChange }: SearchFilterProps) {
    const [search, setSearch] = useState("");

    const debouncedSearch = useDebounce(search.trim(), 500);

    const onSearchChangeRef = useRef(onSearchChange);

    useEffect(() => {
        onSearchChangeRef.current = onSearchChange;
    }, [onSearchChange]);

    useEffect(() => {
        onSearchChangeRef.current(debouncedSearch);
    }, [debouncedSearch]);

    return (
        <Box sx={{ mb: 3 }}>
            <TextField
                fullWidth
                label="Search by subject name"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
            />
        </Box>
    );
}