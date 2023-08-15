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

const EditItemModal = ({ open, onClose, onSave, itemToEdit }) => {
  const [editedItem, setEditedItem] = useState({});

  const [loadingEdit, setLoadingEdit] = useState(false);

  const handleItemChange = (field, value) => {
    setEditedItem((prevItem) => ({
      ...prevItem,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setLoadingEdit(true);
    try {
      await onSave(editedItem);
      onClose();
    } catch (error) {
      onClose();
      console.error(error);
    } finally {
      setLoadingEdit(false);
    }
  };

  React.useEffect(() => {
    setEditedItem({ ...itemToEdit } || {});
  }, [itemToEdit]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Edit Item</DialogTitle>
      <DialogContent>
        <DialogContentText>Update Item details:</DialogContentText>
        <form>
          <FormControl fullWidth>
            <TextField
              label="Item"
              value={editedItem.value || ""}
              onChange={(e) => handleItemChange("value", e.target.value)}
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
        <Button onClick={handleSave} color="primary" disabled={loadingEdit}>
          {loadingEdit ? <CircularProgress size={24} color="inherit" /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditItemModal;
