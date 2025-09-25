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
  setModels: React.Dispatch<React.SetStateAction<string[]>>;
  onSuccess?: () => void;
}

const AddModelDialog: React.FC<Props> = ({ open, onClose, setModels, onSuccess }) => {
  const [modelInput, setModelInput] = useState('');

  const handleAddModel = async () => {
    const v = modelInput.trim();
    if (!v) {
      toast.info('Model name cannot be empty.');
      return;
    }
    try {
      const response = await axios.post(
        '/auth/add-model',
        { modelName: v },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.data.success) {
        setModels((m) => [...m, v]);
        toast.success('Model Added Successfully');
        setModelInput('');
        onClose();
        onSuccess?.();
      }
    } catch (e: any) {
      //   console.error('Error adding model:', e);
      toast.error(e.response.data.message);
      setModelInput('');

      onClose();
    }
  };

  useEffect(() => {
    if (!open) {
      setModelInput('');
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Model</DialogTitle>
      <DialogContent>
        <TextField
          label="Model Name"
          fullWidth
          margin="dense"
          value={modelInput}
          onChange={(e) => setModelInput(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
            setModelInput('');
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleAddModel} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddModelDialog;
