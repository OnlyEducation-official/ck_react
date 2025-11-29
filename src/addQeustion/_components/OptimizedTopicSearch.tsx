import { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Chip,
  Typography,
  Box,
} from "@mui/material";
import { searchTopics } from "../../util/topicSearch";
import type { SxProps, Theme } from "@mui/material";
import type { TextFieldProps, AutocompleteProps } from "@mui/material";
export type TopicHit = {
  id: number;
  name?: string;
  title?: string;
  slug?: string;
};

interface Props<
  TSchema extends Record<string, any>,
  TField extends keyof TSchema
> {
  routeName: string;
  fieldName: TField;
  dropdownType: "single" | "multi";
  setValue: (field: TField, value: TSchema[TField]) => void;
  watch: (field: TField) => TSchema[TField];
  // NEW EXTENDED PROPS
  sx?: SxProps<Theme>;
  label?: string;
  placeholder?: string;

  // allow passing additional Autocomplete props
  autocompleteProps?: Partial<
    AutocompleteProps<any, boolean, boolean, boolean>
  >;
  required?: boolean;
  showLabel?: boolean;
  labelSx?: SxProps<Theme>;
  // allow passing additional TextField props
  textFieldProps?: Partial<TextFieldProps>;
}

const OptimizedTopicSearch = <
  TSchema extends Record<string, any>,
  TField extends keyof TSchema
>({
  routeName,
  dropdownType,
  fieldName,
  setValue,
  watch,
  sx,
  label = "",
  placeholder = "",
  autocompleteProps,
  textFieldProps,
  required = false,
  showLabel = true,
  labelSx,
}: Props<TSchema, TField>) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<TopicHit[]>([]);
  const [loading, setLoading] = useState(false);

  // will store objects (multi-select)
  const [selectedOptions, setSelectedOptions] = useState<TopicHit[]>([]);

  // ---------------- DEBOUNCE ----------------
  const debounce = (fn: Function, delay = 400) => {
    let timer: any;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };
  useEffect(() => {
    if (open) {
      debouncedFetch(query || "");
    }
  }, [open]);
  console.log("routeName: ", routeName);
  const debouncedFetch = useMemo(
    () =>
      debounce(async (text: string) => {
        try {
          setLoading(true);
          const results = await searchTopics(text, routeName);
          console.log("results: ", results);

          // setOptions((prev) => {
          //   const merged = [...results, ...selectedOptions];
          //   return Array.from(
          //     new Map(merged.map((item) => [item.id, item])).values()
          //   );
          // });
          setOptions((prev) => {
            if (dropdownType === "single") {
              // single → never re-add removed selected option
              return results;
            }

            // multi → keep merge logic
            const merged = [...results, ...selectedOptions];
            return Array.from(
              new Map(merged.map((item) => [item.id, item])).values()
            );
          });
        } finally {
          setLoading(false);
        }
      }, 400),
    [open, routeName, selectedOptions]
  );

  useEffect(() => {
    debouncedFetch(query);
  }, [query]);

  console.log("watch(fieldName): ", watch(fieldName));
  // // ADD THIS USEEFFECT (for edit mode)
  const fieldValue = watch(fieldName);
  useEffect(() => {
    // if (dropdownType !== "multi") return;

    const defaultValue = fieldValue as TopicHit[];
    console.log("defaultValue from RHF:", defaultValue);

    if (
      defaultValue &&
      Array.isArray(defaultValue) &&
      defaultValue.length > 0
    ) {
      setSelectedOptions(defaultValue);

      // setOptions((prev) => {
      //   const merged = [...prev, ...defaultValue];
      //   return Array.from(
      //     new Map(merged.map((item) => [item.id, item])).values()
      //   );
      // });
      setOptions((prev) => {
        if (dropdownType !== "multi") {
          // single → never re-add removed selected option
          return defaultValue;
        }

        // multi → keep merge logic
        const merged = [...defaultValue, ...selectedOptions];
        return Array.from(
          new Map(merged.map((item) => [item.id, item])).values()
        );
      });
    }
  }, [fieldValue]);

  // ---------------- VALUE FROM FORM ----------------
  const selected = watch(fieldName);

  // ---------------- HANDLE SELECT ----------------
  // const handleSelect = (_: any, value: TopicHit[] | TopicHit | null) => {
  //   if (!value) {
  //     setValue(fieldName, [] as TSchema[TField]);
  //     return;
  //   }

  //   if (dropdownType === "multi") {
  //     const val = value as TopicHit[];
  //     setSelectedOptions(val);
  //     setValue(fieldName, val as TSchema[TField]); // store full objects
  //   } else {
  //     // const id = (value as TopicHit)?.id ?? 0;
  //     // setValue(fieldName, id as TSchema[TField]); // store only id
  //     // single → always save array of one object
  //     const obj = value as TopicHit;
  //     const arr = obj ? [obj] : [];
  //     setSelectedOptions(arr);
  //     setValue(fieldName, arr as TSchema[TField]);
  //   }
  // };
  const handleSelect = (_: any, value: TopicHit[] | TopicHit | null) => {
    if (dropdownType === "multi") {
      const val = value as TopicHit[];
      setSelectedOptions(val);
      setValue(fieldName, val as TSchema[TField]);
    } else {
      const obj = (value as TopicHit) ?? null;

      // single → store array of one or empty array
      const arr = obj ? [obj] : [];

      setSelectedOptions(arr);
      setValue(fieldName, arr as TSchema[TField]);
    }
  };

  // ---------------- FORMAT VALUE FOR AUTOCOMPLETE ----------------
  // const autoValue =
  //   dropdownType === "single"
  //     ? options.find((opt) => opt.id === selected) || null
  //     : selectedOptions;
  // const autoValue =
  //   dropdownType === "single" ? selectedOptions[0] ?? null : selectedOptions;
  const autoValue =
    dropdownType === "single" ? selectedOptions[0] || null : selectedOptions;
  return (
    <>
      {/* <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}> */}
      {showLabel && (
        <Typography
          variant="subtitle1"
          sx={{ mb: 1.5, fontWeight: 600, ...labelSx }}
          component="label"
        >
          {label}
          {required && (
            <Typography component="span" sx={{ color: "red" }}>
              *
            </Typography>
          )}
        </Typography>
      )}
      {/* </Box> */}

      {/* AUTOCOMPLETE FIELD */}
      <Autocomplete
        size="small"
        multiple={dropdownType === "multi"}
        open={open}
        sx={sx}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        loading={loading}
        options={options}
        value={autoValue}
        onChange={handleSelect}
        onInputChange={(_, val) => setQuery(val)}
        filterSelectedOptions
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(o) => o.name || o.title || o.slug || `Topic #${o.id}`}
        {...autocompleteProps} // ← allow overriding Autocomplete props
        renderTags={(value, getTagProps) =>
          // dropdownType === "multi"
          //   ? value.map((option: TopicHit, index: number) => (
          //       <Chip
          //         {...getTagProps({ index })}
          //         label={option.name || `#${option.id}`}
          //         size="small"
          //       />
          //     ))
          //   : null
          dropdownType === "multi"
            ? value.map((option: TopicHit, index: number) => {
                const tagProps = getTagProps({ index });
                const { key, ...rest } = tagProps; // ⬅️ remove key from spread

                return (
                  <Chip
                    key={key} // ⬅️ pass key explicitly (React requirement)
                    {...rest}
                    label={option.name || `#${option.id}`}
                    size="small"
                  />
                );
              })
            : null
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={""}
            placeholder={placeholder}
            {...textFieldProps} // ← allow overriding TextField props
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress size={18} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </>
  );
};

export default OptimizedTopicSearch;
