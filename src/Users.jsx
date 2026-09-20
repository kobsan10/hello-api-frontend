import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { api, formatDate } from "./api";

const MIN_PASSWORD_LENGTH = 6;

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newUser, setNewUser] = useState({ email: "", username: "", password: "" });
  const [target, setTarget] = useState(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [dialogError, setDialogError] = useState("");

  const load = async () => {
    try {
      setUsers(await api("/api/users"));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onAdd = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api("/api/users", { method: "POST", body: newUser });
      setSuccess(`User ${newUser.email} created.`);
      setNewUser({ email: "", username: "", password: "" });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const openDialog = (user) => {
    setTarget(user);
    setPassword("");
    setConfirm("");
    setDialogError("");
  };

  const onChangePassword = async () => {
    if (password.length < MIN_PASSWORD_LENGTH) {
      setDialogError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setDialogError("Passwords do not match.");
      return;
    }
    try {
      await api(`/api/users/${target._id}/password`, { method: "PUT", body: { password } });
      setSuccess(`Password changed for ${target.email}.`);
      setError("");
      setTarget(null);
    } catch (err) {
      setDialogError(err.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 960, mx: "auto", pb: 4 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Users
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Administrators can add users and change their passwords.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Add user
          </Typography>
          <Box component="form" onSubmit={onAdd}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Email / login"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
                sx={{ flex: 1 }}
              />
              <TextField
                label="Username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                required
                sx={{ flex: 1 }}
              />
              <TextField
                label="Password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
                sx={{ flex: 1 }}
              />
              <Button type="submit" variant="contained" sx={{ px: 4 }}>
                Add
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email / login</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Last changed</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{user.email}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>{formatDate(user.updatedAt)}</TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => openDialog(user)}>
                      Change password
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No users yet. Add one above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={Boolean(target)} onClose={() => setTarget(null)} fullWidth maxWidth="xs">
        <DialogTitle>Change password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            New password for <strong>{target?.email}</strong>
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="New password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              autoFocus
            />
            <TextField
              label="Confirm new password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              fullWidth
            />
            {dialogError && <Alert severity="error">{dialogError}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTarget(null)}>Cancel</Button>
          <Button variant="contained" onClick={onChangePassword}>
            Change password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
