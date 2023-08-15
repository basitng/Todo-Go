import React, { useState } from "react";
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

const EditTodoModal = ({ open, onClose, onSave, todoToEdit }) => {
  const [editedTodo, setEditedTodo] = useState({});

  const [loadingEdit, setLoadingEdit] = useState(false);

  const handleTodoChange = (field, value) => {
    setEditedTodo((prevTodo) => ({
      ...prevTodo,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setLoadingEdit(true);
    try {
      await onSave(editedTodo);
      onClose();
    } catch (error) {
      onClose();
      console.error(error);
    } finally {
      setLoadingEdit(false);
    }
  };

  React.useEffect(() => {
    setEditedTodo({ ...todoToEdit } || {});
  }, [todoToEdit]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Edit Todo</DialogTitle>
      <DialogContent>
        <DialogContentText>Update todo details:</DialogContentText>
        <form>
          <FormControl fullWidth>
            <TextField
              label="Todo"
              value={editedTodo.todo || ""}
              onChange={(e) => handleTodoChange("todo", e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Note"
              value={editedTodo.noted || ""}
              onChange={(e) => handleTodoChange("noted", e.target.value)}
              fullWidth
              margin="normal"
            />
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editedTodo.completed || false}
                    onChange={(e) => handleTodoChange("completed", e.target.checked)}
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
        <Button onClick={handleSave} color="primary" disabled={loadingEdit}>
          {loadingEdit ? <CircularProgress size={24} color="inherit" /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTodoModal;
