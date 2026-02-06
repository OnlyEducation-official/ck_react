    <Grid size={{ xs: 12 }}>
          <Controller
            name="picture"
            control={control}
            rules={{
              required: "Photo is required",
              validate: (file: File | null) =>
                file && file.type.startsWith("image/")
                  ? true
                  : "Only image files are allowed",
            }}
            render={({ field, fieldState }) => (
              <Stack spacing={2}>
                <MuiFileInput
                  {...field}
                  value={field.value || null}
                  onChange={(file) => field.onChange(file)}
                  label="Upload Photo"
                  placeholder="Choose an image"
                  inputProps={{ accept: "image/*" }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />

                {/* ✅ Responsive Image Preview */}
                {preview && (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems={{ xs: "center", sm: "flex-start" }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Preview
                    </Typography>

                    <Avatar
                      src={preview}
                      sx={{
                        width: { xs: 96, sm: 120, md: 140 },
                        height: { xs: 96, sm: 120, md: 140 },
                        borderRadius: "50%",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    />
                  </Box>
                )}
              </Stack>
            )}
          />
        </Grid>
