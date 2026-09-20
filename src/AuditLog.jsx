import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { api, formatDate } from "./api";

const ACTION_COLORS = {
  CREATE: "success",
  UPDATE: "warning",
  DELETE: "error",
  READ: "info",
  LIST: "default",
};

export default function AuditLogPage() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setEntries(await api("/api/audit"));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Box sx={{ maxWidth: 960, mx: "auto", pb: 4 }}>
      <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" fontWeight={600}>
            Audit log
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The latest actions performed on items, newest first.
          </Typography>
        </Box>
        <Button variant="outlined" onClick={load}>
          Refresh
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Item id</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry._id} hover>
                  <TableCell>{formatDate(entry.at)}</TableCell>
                  <TableCell>{entry.username}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={entry.action}
                      color={ACTION_COLORS[entry.action] ?? "default"}
                    />
                  </TableCell>
                  <TableCell>{entry.detail}</TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: 12 }}>
                    {entry.itemId}
                  </TableCell>
                </TableRow>
              ))}
              {entries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    Nothing recorded yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
