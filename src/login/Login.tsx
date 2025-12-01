import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid"
import { useForm, SubmitHandler, Form } from "react-hook-form"
import { LoginSchema, LoginSchemaType } from "../validation/loginSchema";
import SimpleTextField from "../GlobalComponent/SimpleTextField";
import { zodResolver } from "@hookform/resolvers/zod";

const Login = () => {

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        control
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = () => {
        console.log("subit")

    }


    return (
        <Grid
            container
            sx={{
                minHeight: "100vh",
                bgcolor: "#0f172a", // dark background
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Grid >
                <Paper
                    elevation={6}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        bgcolor: "#020617",
                        border: "1px solid rgba(148, 163, 184, 0.25)",
                    }}
                >
                    <Stack spacing={3}>
                        {/* Header */}
                        <Box textAlign="center">
                            <Typography
                                variant="h5"
                                fontWeight={700}
                                sx={{ color: "#e5e7eb", letterSpacing: 0.5 }}
                            >
                                Welcome back
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: "#9ca3af", mt: 0.5 }}
                            >
                                Login to access your test series dashboard
                            </Typography>
                        </Box>

                        {/* Form */}
                        <Box
                            component="form"
                            onSubmit={handleSubmit(onSubmit)}
                            noValidate
                        >
                            <Stack spacing={2.5}>
                                <SimpleTextField
                                    name="email"
                                    control={control}
                                    rules={{ required: "Email is required" }}
                                    type="email"
                                    fullWidth
                                    label="Email address"
                                />

                                <SimpleTextField
                                    name="password"
                                    control={control}
                                    rules={{ required: "Password is required" }}
                                    type="password"
                                    fullWidth
                                    label="Password"
                                />
                                <Button
                                    fullWidth
                                    variant="contained"
                                    type="submit"
                                    sx={{
                                        mt: 1,
                                        px: 5,
                                        py: 1.2,
                                        textTransform: "none",
                                        fontWeight: 600,
                                        fontSize: "16px",
                                        borderRadius: "999px",
                                        background:
                                            "linear-gradient(90deg, #4C6EF5, #15AABF)",
                                        color: "#fff",
                                        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.8)",
                                        "&:hover": {
                                            background:
                                                "linear-gradient(90deg, #3B5BDB, #1098AD)",
                                            boxShadow: "0 14px 34px rgba(15, 23, 42, 0.9)",
                                        },
                                    }}
                                >
                                    Login
                                </Button>
                            </Stack>
                        </Box>
                    </Stack>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default Login