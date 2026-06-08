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
import { Autocomplete, TextField, CircularProgress, Chip, TextFieldProps } from "@mui/material";
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
    /** Pass loaded records on edit pages so chips show for pre-filled ids */
    defaultOptions?: TOption[];
};

type AsyncMultiAutocompleteProps<TOption, TFieldValues extends FieldValues> =
    BaseProps<TOption> & {
        name: Path<TFieldValues>;
        control: Control<TFieldValues>;
    };

type FieldProps<TOption> = BaseProps<TOption> & {
    value: OptionValue[];
    onChange: (value: OptionValue[]) => void;
    onBlur: () => void;
    error?: string;
};

// --- Public component: wires RHF Controller to the field below ---
export function AsyncMultiAutocomplete<
    TOption,
    TFieldValues extends FieldValues
>({
    name,
    control,
    ...rest
}: AsyncMultiAutocompleteProps<TOption, TFieldValues>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <MultiAutocompleteField<TOption>
                    {...rest as FieldProps<TOption>}
                    value={(field.value as OptionValue[]) ?? []}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message || ""}
                />
            )}
        />
    );
}

// --- MUI Autocomplete (multiple) + data logic ---
function MultiAutocompleteField<TOption>({
    label,
    placeholder,
    queryKey,
    queryFn,
    getOptionLabel,
    getOptionValue,
    limit = 10,
    disabled = false,
    required = false,
    defaultOptions,
    value,
    onChange,
    onBlur,
    error,
}: FieldProps<TOption>) {
    const [open, setOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [selectedOptions, setSelectedOptions] = useState<TOption[]>(
        defaultOptions ?? []
    );

    const debouncedSearch = useDebounce(searchText, 400);

    const query = useQuery({
        queryKey: [...queryKey, "autocomplete-multi", limit, debouncedSearch],
        queryFn: () =>
            queryFn({
                page: 1,
                limit,
                search: debouncedSearch.trim(),
            }),
        enabled: open,
        placeholderData: keepPreviousData,
        staleTime: 60_000,
    });

    const options = query.data?.data ?? [];
    const loading = open && query.isFetching;

    // Resolve chips for pre-filled ids on edit pages
    useEffect(() => {
        if (defaultOptions && defaultOptions.length && value.length) {
            const matched = defaultOptions.filter((o) =>
                value.includes(getOptionValue(o))
            );
            if (matched.length) setSelectedOptions(matched);
        }
    }, [defaultOptions, value, getOptionValue]);

    // If the form is reset/cleared externally, drop the chips too
    useEffect(() => {
        if (value.length === 0 && selectedOptions.length > 0) {
            setSelectedOptions([]);
        }
    }, [value, selectedOptions]);

    return (
        <Autocomplete<TOption, true>
            multiple
            disableCloseOnSelect
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            disabled={disabled}
            value={selectedOptions}
            options={options}
            loading={loading}
            filterOptions={(x) => x} // server already filtered
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={(a, b) => getOptionValue(a) === getOptionValue(b)}
            onChange={(_, newValue) => {
                setSelectedOptions(newValue);
                onChange(newValue.map(getOptionValue)); // array of ids only
            }}
            onInputChange={(_, input, reason) => {
                if (reason === "input") setSearchText(input);
                if (reason === "clear") setSearchText("");
            }}
            onBlur={onBlur}
            noOptionsText={query.isError ? "Failed to load options" : "No results"}
            renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => {
                    const { key, ...chipProps } = getTagProps({ index });
                    return (
                        <Chip
                            key={key}
                            label={getOptionLabel(option)}
                            size="small"
                            {...chipProps}
                        />
                    );
                })
            }
            renderInput={(params) => (
                <TextField
                    {...params as TextFieldProps}
                    label={label}
                    placeholder={selectedOptions.length === 0 ? placeholder || "" : ""}
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