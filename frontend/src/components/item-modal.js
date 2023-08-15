import React, { useReducer, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  TextField,
} from "@mui/material";
import instance from "../utils/axios";

const ItemModal = ({ open, onClose }) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [reducerValue, forUpdate] = useReducer((x) => x + 1, 0);

  const handleSave = () => {
    setLoading(true);
    instance
      .post("/items", {
        value,
      })
      .then((response) => {
        setLoading(false);
        window.location.reload();

        onClose();
      });
  };

  return (
    <Dialog maxWidth="sm" fullWidth open={open} onClose={onClose}>
      <DialogTitle>Create Item</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter item details:</DialogContentText>
        <form>
          <FormControl fullWidth>
            <TextField
              label="Item"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              fullWidth
              margin="normal"
            />
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemModal;
