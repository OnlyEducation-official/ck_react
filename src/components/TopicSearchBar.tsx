import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  ListItem,
  IconButton,
} from "@mui/material";
// import { searchTopics } from "../util/topicSearch";
// import UseMeiliDataContext from "../context/MeiliContext";
// import UseMeiliDataContext from "../context/MeiliContext";
import DeleteIcon from "@mui/icons-material/Delete";
import { searchTopics } from "../util/topicSearch.js";
import UseMeiliDataContext from "../context/MeiliContext.js";

interface topSearchBarProps<
  TSchema extends Record<string, any>, // schema object
  TField extends keyof TSchema // allowed field names
> {
  routeName: string;
  typeName: "topicData" | "subjectData" | "exams" | "category";
  dropdownType: string;
  // react-hook-form strongly typed props
  setValue: (field: TField, value: TSchema[TField]) => void;
  watch: (field: TField) => TSchema[TField];

  fieldName: TField; // must be a valid key from schema
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
  typeName,
  dropdownType,
  fieldName,
  setValue,
  watch,
}: topSearchBarProps<TSchema, TField>) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TopicHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  // addDropItem
  const {} = UseMeiliDataContext();
  // console.log("fieldName: ", fieldName);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const handle = setTimeout(async () => {
      try {
        setLoading(true);
        const hits = await searchTopics(query, routeName);
        console.log("hits: ", hits);
        setResults(hits);
      } catch (err) {
        console.error("Meilisearch error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(handle);
  }, [query, routeName]);

  const handleSelect = (topic: TopicHit) => {
    const title =
      topic.title || topic.name || topic.slug || `Topic #${topic.id}`;
    console.log("currentValue: ", topic);
    // setValue(fieldName, topic.id as TSchema[TField]);
    if (dropdownType === "multi") {
      const currentValue = watch(fieldName) as unknown as number[];
      if (Array.isArray(currentValue)) {
        setValue(fieldName, [...currentValue, topic.id] as TSchema[TField]);
      } else {
        setValue(fieldName, [topic.id] as TSchema[TField]);
      }
    } else {
      setValue(fieldName, topic.id as TSchema[TField]);
    }
    // addDropItem(title, topic.id, typeName, dropdownType);
    setQuery("");
    setResults([]);
  };

  return (
    <>
      <Box sx={{ maxWidth: 600, width: "100%", position: "relative" }}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          label="Search topics"
          placeholder="Type to search…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!touched) setTouched(true);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {loading && <CircularProgress size={18} />}
              </InputAdornment>
            ),
          }}
        />

        {/* helper text below input, still in flow but small */}
        {!loading && touched && query && results.length === 0 && (
          <Typography variant="body2" sx={{ mt: 0.5, color: "text.secondary" }}>
            No topics found for “{query}”.
          </Typography>
        )}

        {/* DROPDOWN – absolutely positioned so it doesn’t push layout */}
        {!loading && results.length > 0 && (
          <Paper
            elevation={3}
            sx={{
              position: "absolute",
              top: "100%", // just below the TextField
              left: 0,
              width: "100%",
              mt: 0.5,
              maxHeight: 260,
              overflowY: "auto",
              borderRadius: 2,
              zIndex: 10,
            }}
          >
            <List dense disablePadding>
              {dropdownType === "multi" &&
                results
                  .filter((r) => !watch(fieldName)?.includes(r.id))
                  .map((topic: TopicHit) => {
                    const primaryText =
                      topic.title ||
                      topic.name ||
                      topic.slug ||
                      `Topic #${topic.id}`;

                    return (
                      <ListItemButton
                        key={topic.id}
                        onClick={() => handleSelect(topic)}
                      >
                        <ListItemText primary={primaryText} />
                      </ListItemButton>
                    );
                  })}
              {dropdownType === "single" &&
                results
                  .filter((item) => item.id !== watch(fieldName))
                  .map((topic: TopicHit) => {
                    const primaryText =
                      topic.title ||
                      topic.name ||
                      topic.slug ||
                      `Topic #${topic.id}`;

                    return (
                      <ListItemButton
                        key={topic.id}
                        onClick={() => handleSelect(topic)}
                      >
                        <ListItemText primary={primaryText} />
                      </ListItemButton>
                    );
                  })}
            </List>
          </Paper>
        )}
      </Box>
      {dropdownType === "single" && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Selected subjects
          </Typography>

          {watch(fieldName) === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No subjects added yet. Start searching and selecting from the
              dropdown.
            </Typography>
          ) : (
            <Paper
              variant="outlined"
              sx={{
                borderRadius: 2,
                maxHeight: 240,
                overflowY: "auto",
              }}
            >
              <List dense disablePadding>
                {/* {subjects.map((d, index) => (
                    <ListItem
                      key={d.id ?? index}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          size="small"
                          // onClick={() =>
                          //   deleteData(d.id as number, "subjectData")
                          // }
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={
                          d.title || d.name || d.slug || "Untitled topic"
                        }
                      />
                    </ListItem>
                  ))} */}
                {
                  <ListItem
                    // key={}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        size="small"
                        // onClick={() =>
                        //   deleteData(d.id as number, "subjectData")
                        // }
                        onClick={() =>
                          setValue(fieldName, 0 as TSchema[TField])
                        }
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={
                        // d.title || d.name || d.slug || "Untitled topic"
                        watch(fieldName)
                      }
                    />
                  </ListItem>
                }
              </List>
            </Paper>
          )}
        </Box>
      )}
      {dropdownType === "multi" && (
        <Box sx={{ mt: 3 }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ mb: 1, fontWeight: 700 }}
          >
            Selected topics
          </Typography>

          {watch(fieldName).length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No topics added yet. Start searching and selecting from the
              dropdown.
            </Typography>
          ) : (
            <Paper
              variant="outlined"
              sx={{
                borderRadius: 2,
                maxHeight: 240,
                overflowY: "auto",
              }}
            >
              <List dense disablePadding>
                {watch(fieldName).map((d: number, index: number) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        size="small"
                        // onClick={() => deleteData(d.id as number, "topicData")}
                        onClick={() =>
                          setValue(
                            fieldName,
                            watch(fieldName).filter(
                              (item: number) => item !== d
                            )
                          )
                        }
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={
                        d
                        // d.title || d.name || d.slug || "Untitled topic"
                      }
                    />
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

export default TopicSearchBar;
