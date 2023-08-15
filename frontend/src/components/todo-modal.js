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

const TodoModal = ({ open, onClose }) => {
  const [todo, setTodo] = useState("");
  const [note, setNote] = useState("");
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reducerValue, forUpdate] = useReducer((x) => x + 1, 0);

  const handleSave = () => {
    setLoading(true);
    instance
      .post("/todos", {
        todo,
        completed,
        noted: note,
      })
      .then((response) => {
        setLoading(false);
        window.location.reload();

        onClose();
      });
  };

  return (
    <Dialog maxWidth="sm" fullWidth open={open} onClose={onClose}>
      <DialogTitle>Create Todo</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter todo details:</DialogContentText>
        <form>
          <FormControl fullWidth>
            <TextField
              label="Todo"
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              fullWidth
              margin="normal"
            />
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={completed}
                    onChange={() => setCompleted(!completed)}
                  />
                }
                label="Completed"
              />
            </FormGroup>
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

export default TodoModal;
