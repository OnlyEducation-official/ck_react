import { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthContext } from "../context/AuthContext.js";

// MUI Components
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    const success = await login(data.email, data.password);
    if (success) window.location.href = "/";
    else alert("Invalid credentials");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 420,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={2} color="primary">
          Admin Login
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={4}>
          Please sign in using your admin credentials.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <TextField
            label="Email"
            type="email"
            fullWidth
            {...register("email")}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            sx={{ mb: 3 }}
          />

          {/* Password */}
          <TextField
            label="Password"
            type="password"
            fullWidth
            {...register("password")}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            sx={{ mb: 3 }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              py: 1.4,
              fontSize: "1rem",
              fontWeight: 600,
              borderRadius: 2,
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={26} color="inherit" /> : "Login"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
