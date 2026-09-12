import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useContext, useEffect, useRef } from "react";
import { UserContext } from "./context/UserContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const username = useRef("");
  const password = useRef("");
  const isInit = useRef(false);
  const navigate = useNavigate();

  const { login, isLoggedIn, isLogInError, loginErrorMsg } = useContext(UserContext);
  useEffect(() => {
    if (!isInit.current) {
      isInit.current = true;
      return;
    }
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);
  const onLogin = async () => {
    console.log("username: ", username.current.value);
    await login(username.current.value, password.current.value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100dvh",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Card sx={{ width: 360, maxWidth: "100%" }} elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to continue
          </Typography>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              onLogin();
            }}
          >
            <TextField
              id="username"
              name="username"
              label="Username"
              inputRef={username}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              type="password"
              id="password"
              name="password"
              label="Password"
              inputRef={password}
              fullWidth
              sx={{ mb: 3 }}
            />
            <Button type="submit" variant="contained" fullWidth size="large">
              Login
            </Button>
          </Box>
          {isLogInError && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {loginErrorMsg}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
