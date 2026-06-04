import SimpleTextField from '@/GlobalComponent/SimpleTextField'
import { TestSeriesSchemaType } from '@/validation/testSeriesSchema';
import { Box, Button, Grid, Typography } from '@mui/material'
import React from 'react'
import { Control, FieldValues, FormState } from 'react-hook-form';
import { useParams } from 'react-router-dom';

export default function NameComponent({
    control,
    isValid,
    isSubmitting,
    isSubmitted
}: {
    control: Control<TestSeriesSchemaType>;
    isValid: FormState<TestSeriesSchemaType>['isValid'];
    isSubmitting: FormState<TestSeriesSchemaType>['isSubmitting'];
    isSubmitted: FormState<TestSeriesSchemaType>['isSubmitted'];
}) {
    const { qid } = useParams();
    return (
        <Box
            sx={{
                marginBlockStart: 7,
                bgcolor: "background.paper",
                paddingInline: { xs: 2, sm: 3, md: 4 },
                paddingBlock: 4,
            }}
        >
            <Grid container size={12} spacing={2} alignItems="center">
                <Grid size={12}>
                    <Typography
                        variant="h5"
                        sx={{ fontWeight: 800, pl: 2, borderLeft: "6px solid", borderColor: "primary.main" }}
                    >
                        {qid ? "Edit Topic" : "Add Topic"}
                    </Typography>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Name
                        <Typography variant="subtitle1" component="span" color="error" fontWeight={700} marginLeft={0.2}>
                            *
                        </Typography>
                    </Typography>
                    <SimpleTextField
                        name="name"
                        control={control}
                        placeholder="Add name"
                        rules={{ required: "Name is required" }}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Button
                        variant="contained"
                        type="submit"
                        sx={{
                            px: 5, py: 1,
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "18px",
                            borderRadius: "13px",
                            background: "linear-gradient(90deg, #4C6EF5, #15AABF)",
                            color: "#fff",
                            boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
                            "&:hover": {
                                background: "linear-gradient(90deg, #3B5BDB, #1098AD)",
                                boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
                            },
                        }}
                        disabled={(!isValid && isSubmitted) || isSubmitting}
                    >
                        {qid ? "Update" : "Submit"}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    )
}
