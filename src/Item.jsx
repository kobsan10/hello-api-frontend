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

export default function ItemPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    try {
      setItems(await api("/api/item"));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const run = async (action) => {
    try {
      await action();
      setError("");
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const onAdd = (e) => {
    e.preventDefault();
    run(async () => {
      await api("/api/item", { method: "POST", body: { name, description } });
      setName("");
      setDescription("");
    });
  };

  const onSaveEdit = () =>
    run(async () => {
      await api(`/api/item/${editing._id}`, {
        method: "PUT",
        body: { name: editing.name, description: editing.description },
      });
      setEditing(null);
    });

  const onConfirmDelete = () =>
    run(async () => {
      await api(`/api/item/${deleting._id}`, { method: "DELETE" });
      setDeleting(null);
    });

  return (
    <Box sx={{ maxWidth: 960, mx: "auto", pb: 4 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Items
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Every action on this page is recorded in the audit log.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box component="form" onSubmit={onAdd}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                sx={{ flex: 1 }}
              />
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{ flex: 2 }}
              />
              <Button type="submit" variant="contained" sx={{ px: 4 }}>
                Add item
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
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Created by</TableCell>
                <TableCell>Updated</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item._id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.createdBy}</TableCell>
                  <TableCell>{formatDate(item.updatedAt)}</TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => setEditing({ ...item })}>
                      Edit
                    </Button>
                    <Button size="small" color="error" onClick={() => setDeleting(item)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No items yet. Add the first one above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={Boolean(editing)} onClose={() => setEditing(null)} fullWidth maxWidth="sm">
        <DialogTitle>Edit item</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Name"
              value={editing?.name ?? ""}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={editing?.description ?? ""}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              fullWidth
              multiline
              minRows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditing(null)}>Cancel</Button>
          <Button variant="contained" onClick={onSaveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(deleting)} onClose={() => setDeleting(null)}>
        <DialogTitle>Delete item?</DialogTitle>
        <DialogContent>
          <Typography>
            &ldquo;{deleting?.name}&rdquo; will be removed. The deletion stays in the audit log.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={onConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
