import { useEffect, useState } from "react";
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from "react-hook-form";
import {
    keepPreviousData,
    useQuery,
    type QueryKey,
} from "@tanstack/react-query";
import { Autocomplete, TextField, CircularProgress, TextFieldProps } from "@mui/material";
import { useDebounce } from "@/hooks/useDebounce";
import type { PaginatedResponse } from "@/types/api.types";

type OptionValue = string | number;

type BaseProps<TOption> = {
    label?: string;
    placeholder?: string;
    queryKey: QueryKey;
    queryFn: (params: {
        page: number;
        limit: number;
        search?: string;
    }) => Promise<PaginatedResponse<TOption>>;
    getOptionLabel: (option: TOption) => string;
    getOptionValue: (option: TOption) => OptionValue;
    limit?: number;
    disabled?: boolean;
    required?: boolean;
    /** Pass the loaded record on edit pages so the label shows for a pre-filled id */
    defaultOption?: TOption | null;
};

type AsyncAutocompleteProps<TOption, TFieldValues extends FieldValues> =
    BaseProps<TOption> & {
        name: Path<TFieldValues>;
        control: Control<TFieldValues>;
    };

type FieldProps<TOption> = BaseProps<TOption> & {
    value: OptionValue | undefined;
    onChange: (value: OptionValue | undefined) => void;
    onBlur: () => void;
    error?: string;
};

// --- Public component: wires RHF Controller to the field below ---
export function AsyncAutocomplete<TOption, TFieldValues extends FieldValues>({
    name,
    control,
    ...rest
}: AsyncAutocompleteProps<TOption, TFieldValues>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <AutocompleteField<TOption>
                    {...rest}
                    value={field.value as OptionValue | undefined}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message || ""}
                />
            )}
        />
    );
}

// --- MUI Autocomplete + data logic ---
function AutocompleteField<TOption>({
    label,
    placeholder,
    queryKey,
    queryFn,
    getOptionLabel,
    getOptionValue,
    limit = 10,
    disabled = false,
    required = false,
    defaultOption,
    value,
    onChange,
    onBlur,
    error,
}: FieldProps<TOption>) {
    const [open, setOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [selectedOption, setSelectedOption] = useState<TOption | null>(
        defaultOption ?? null
    );

    const debouncedSearch = useDebounce(searchText, 400);

    const query = useQuery({
        queryKey: [...queryKey, "autocomplete", limit, debouncedSearch],
        queryFn: () =>
            queryFn({
                page: 1,
                limit,
                search: debouncedSearch.trim(),
            }),
        enabled: open, // only fetch once the dropdown is opened
        placeholderData: keepPreviousData,
        staleTime: 60_000,
    });

    const options = query.data?.data ?? [];
    const loading = open && query.isFetching;

    // Resolve the label for a pre-filled id on edit pages
    useEffect(() => {
        if (
            defaultOption &&
            value !== undefined &&
            getOptionValue(defaultOption) === value
        ) {
            setSelectedOption(defaultOption);
        }
    }, [defaultOption, value, getOptionValue]);

    // If the form is reset/cleared externally, drop the displayed object too
    useEffect(() => {
        if (value === undefined && selectedOption !== null) {
            setSelectedOption(null);
        }
    }, [value, selectedOption]);

    return (
        <Autocomplete<TOption>
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            disabled={disabled}
            value={selectedOption}
            options={options}
            loading={loading}
            filterOptions={(x) => x} // server already filtered — don't re-filter
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={(a, b) => getOptionValue(a) === getOptionValue(b)}
            onChange={(_, newValue) => {
                setSelectedOption(newValue);
                onChange(newValue ? getOptionValue(newValue) : undefined); // id only
            }}
            onInputChange={(_, input, reason) => {
                if (reason === "input") setSearchText(input);
                if (reason === "clear") setSearchText("");
            }}
            onBlur={onBlur}
            noOptionsText={query.isError ? "Failed to load options" : "No results"}
            renderInput={(params) => (
                <TextField
                    {...params as TextFieldProps}
                    label={label}
                    placeholder={placeholder || ""}
                    required={required}
                    error={Boolean(error)}
                    helperText={error}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={18} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
}