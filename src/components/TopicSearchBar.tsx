import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Autocomplete,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import { searchTopics } from "../util/topicSearch";
import CloseIcon from '@mui/icons-material/Close';

interface TopSearchBarProps<
  TSchema extends Record<string, any>,
  TField extends keyof TSchema
> {
  routeName: 't-topic' | 'test-series-subject';
  multiSelect?: boolean;
  setValue: (field: TField, value: TSchema[TField]) => void;
  watch: (field: TField) => TSchema[TField];

  fieldName: TField;
}

export type TopicHit = {
  id: number;
  title?: string;
  name?: string;
  slug?: string;
  description?: string;
};

const TopicSearchBar = <
  TSchema extends Record<string, any>,
  TField extends keyof TSchema
>({
  routeName,
  multiSelect = false,
  fieldName,
  setValue,
  watch,
}: TopSearchBarProps<TSchema, TField>) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TopicHit[]>([]);
  const [loading, setLoading] = useState(false);
  const formValue = watch(fieldName) as unknown as TopicHit[] | null;
  useEffect(() => {
    const handle = setTimeout(async () => {
      try {
        setLoading(true);
        const hits = await searchTopics(query, routeName);
        console.log('hits: ', query, hits);
        setResults(hits);
      } catch (err) {
        console.error("Meilisearch error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300); // debounce 300ms

    return () => clearTimeout(handle);
  }, [query, routeName]);
  console.log(formValue);
  return (
    <Box>
      <Autocomplete<TopicHit>
        options={results.filter((result) => !formValue?.some((val) => val.id === result.id))}
        fullWidth
        getOptionLabel={(option) => option.name || option.title || ""}
        value={formValue as TopicHit | null}
        onChange={(_, newValue) => {
          if (!newValue?.name) return null;
          console.log('newValue: ', newValue);
          if (multiSelect) {
            setValue(fieldName, [...watch(fieldName), { id: newValue?.id, name: newValue?.name }] as TSchema[TField]);
          } else {
            setValue(fieldName, { id: newValue?.id, name: newValue?.name } as TSchema[TField]);
          }
        }}
        inputValue={query}
        onInputChange={(_, newInputValue) => {
          setQuery(newInputValue);
        }}
        loading={loading}
        // sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search topic"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      <Stack gap={1} sx={{ paddingBlockStart: 2 }}>
        {watch(fieldName)?.map((item: TopicHit) => (
          <Stack key={item.id} direction={'row'} gap={1} sx={{ justifyContent: 'space-between', alignItems: 'center', paddingInline: 1.5, border: '1px solid', borderColor: 'primary.main', borderRadius: 1.5, paddingBlock: 1 }}>
            <Stack direction={'row'} gap={2}>

              <Typography variant="subtitle1">{item.id}</Typography>
              <Typography variant="subtitle1">{item.name}</Typography>
            </Stack>
            <IconButton
              sx={{ padding: 0.5 }}
              onClick={() => {
                setValue(fieldName, watch(fieldName).filter((i: TopicHit) => i.id !== item.id));
              }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        ))}
      </Stack>
    </Box >
  );
};

export default TopicSearchBar;
