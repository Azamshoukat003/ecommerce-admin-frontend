import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Props {
  open: boolean;
  onClose: () => void;
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  onSuccess?: () => void;
}
type Category = {
  id: string; // or _id if backend uses _id
  categoryName: string;
};
const AddCategoryDialog: React.FC<Props> = ({ open, onClose, setCategories, onSuccess }) => {
  const [categoryInput, setCategoryInput] = useState('');
  useEffect(() => {
    if (!open) {
      setCategoryInput('');
    }
  }, [open]);

  const handleAddCategory = async () => {
    const v = categoryInput.trim();
    if (!v) {
      alert('Category name cannot be empty.');
      return;
    }
    try {
      const response = await axios.post(
        '/auth/add-category',
        { categoryName: v },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response?.data?.success) {
        setCategories((c) => [...c, v]);
        toast.success('Category added Successfully');
        setCategoryInput('');
        onClose();
        onSuccess?.();
      }
    } catch (e: any) {
      toast.error(e.response.data.message);
      setCategoryInput('');

      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Category</DialogTitle>
      <DialogContent>
        <TextField
          label="Category Name"
          fullWidth
          margin="dense"
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAddCategory} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCategoryDialog;
