import React, { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Chip,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { searchTopics } from "../../util/topicSearch";

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

  console.log("routeName: ", routeName);
  const debouncedFetch = useMemo(
    () =>
      debounce(async (text: string) => {
        try {
          setLoading(true);
          const results = await searchTopics(text, routeName);
          console.log("results: ", results);

          setOptions((prev) => {
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
  // useEffect(() => {
  //   if (dropdownType === "multi") {
  //     const defaultValue = watch(fieldName) as TopicHit[];
  //     console.log('defaultValue: ', defaultValue);

  //     if (
  //       defaultValue &&
  //       Array.isArray(defaultValue) &&
  //       defaultValue.length > 0
  //     ) {
  //       setSelectedOptions(defaultValue);
  //       console.log('defaultValue: ', defaultValue);

  //       setOptions((prev) => {
  //         const merged = [...prev, ...defaultValue];
  //         return Array.from(
  //           new Map(merged.map((item) => [item.id, item])).values()
  //         );
  //       });
  //     }
  //   }
  // }, [watch(fieldName)]);
  const fieldValue = watch(fieldName);
  useEffect(() => {
    if (dropdownType !== "multi") return;

    const defaultValue = fieldValue as TopicHit[];
    console.log("defaultValue from RHF:", defaultValue);

    if (
      defaultValue &&
      Array.isArray(defaultValue) &&
      defaultValue.length > 0
    ) {
      setSelectedOptions(defaultValue);

      setOptions((prev) => {
        const merged = [...prev, ...defaultValue];
        return Array.from(
          new Map(merged.map((item) => [item.id, item])).values()
        );
      });
    }
  }, [fieldValue]);

  // ---------------- VALUE FROM FORM ----------------
  const selected = watch(fieldName);

  // ---------------- HANDLE SELECT ----------------
  const handleSelect = (_: any, value: TopicHit[] | TopicHit | null) => {
    if (dropdownType === "multi") {
      const val = value as TopicHit[];
      setSelectedOptions(val);
      setValue(fieldName, val as TSchema[TField]); // store full objects
    } else {
      const id = (value as TopicHit)?.id ?? 0;
      setValue(fieldName, id as TSchema[TField]); // store only id
    }
  };

  // ---------------- FORMAT VALUE FOR AUTOCOMPLETE ----------------
  const autoValue =
    dropdownType === "single"
      ? options.find((opt) => opt.id === selected) || null
      : selectedOptions;

  return (
    <>
      {/* AUTOCOMPLETE FIELD */}
      <Autocomplete
        size="small"
        multiple={dropdownType === "multi"}
        open={open}
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
            label="Search topics"
            placeholder="Type to search…"
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

      {/* ---------------- SINGLE SELECT DISPLAY ---------------- */}
      {dropdownType === "single" && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Selected Subject
          </Typography>

          {selected === 0 ? (
            <Typography>No subject selected.</Typography>
          ) : (
            <Paper variant="outlined" sx={{ borderRadius: 2 }}>
              <List>
                <ListItem
                  secondaryAction={
                    <IconButton
                      onClick={() => setValue(fieldName, 0 as TSchema[TField])}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={`Selected ID: ${selected}`} />
                </ListItem>
              </List>
            </Paper>
          )}
        </Box>
      )}

      {/* ---------------- MULTI SELECT DISPLAY ---------------- */}
      {dropdownType === "multi" && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Selected Topics
          </Typography>

          {selectedOptions.length === 0 ? (
            <Typography>No topics selected.</Typography>
          ) : (
            <Paper
              variant="outlined"
              sx={{ borderRadius: 2, maxHeight: 180, overflowY: "auto" }}
            >
              <List>
                {selectedOptions.map((item, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton
                        onClick={() => {
                          const filtered = selectedOptions.filter(
                            (x) => x.id !== item.id
                          );
                          setSelectedOptions(filtered);
                          setValue(fieldName, filtered as TSchema[TField]);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={item.name || `#${item.id}`} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>
      )}
    </>
  );
};

export default OptimizedTopicSearch;
