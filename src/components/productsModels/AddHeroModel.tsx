import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface AddHeroDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // refresh heroes after add
}

export default function AddHeroDialog({ open, onClose, onSuccess }: AddHeroDialogProps) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !desc || !imageFile) {
      toast.error('Please fill all fields and upload an image');
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('desc', desc);
      formData.append('image', imageFile);

      const response = await axios.post(`${API_URL}/auth/add-hero`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response?.data?.success) {
        toast.success('Hero added successfully!');
        onSuccess();
        onClose();
        setTitle('');
        setDesc('');
        setImageFile(null);
      } else {
        toast.error(response?.data?.message || 'Failed to add hero.');
      }
    } catch (e) {
    //   console.error('Error adding hero:', e);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Hero</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <TextField
            label="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
          <Button variant="outlined" component="label">
            Upload Image
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Button>
          {imageFile && <span>{imageFile.name}</span>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
