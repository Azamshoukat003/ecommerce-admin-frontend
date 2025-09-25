import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';

interface Product {
  _id: string;
  productImage: string;
  productName: string;
  productPrice: string;
  productDiscountPrice: string;
  productCategory: {
    _id: string;
    categoryName: string;
  };
  productModel: {
    _id: string;
    modelName: string;
  };
}

interface Props {
  open: boolean;
  onClose: () => void;
  categories: string[];
  models: string[];
  onSuccess?: () => void;
  product?: Product | null;
}

const AddProductDialog: React.FC<Props> = ({
  open,
  onClose,
  categories,
  models,
  onSuccess,
  product,
}) => {
  const [loading, setLoading] = useState(false);

  const [newProduct, setNewProduct] = useState<{
    productImage: File | string;
    productName: string;
    productPrice: string;
    productDiscountPrice: string;
    categoryName: string;
    productModel: string;
  }>({
    productImage: '',
    productName: '',
    productPrice: '',
    productDiscountPrice: '',
    categoryName: '',
    productModel: '',
  });

  const handleChange = (field: string, value: string | File) => {
    setNewProduct((prev) => ({ ...prev, [field]: value }));
  };

  const saveProduct = async () => {
    if (
      !newProduct.productName.trim() ||
      !newProduct.productPrice ||
      !newProduct.categoryName ||
      (!(newProduct.productImage instanceof File) && !product)
    ) {
      toast.info('All fields including image are required!');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('productName', newProduct.productName.trim());
    formData.append('productPrice', newProduct.productPrice);
    formData.append('productDiscountPrice', newProduct.productDiscountPrice);
    formData.append('categoryName', newProduct.categoryName);
    formData.append('modelName', newProduct.productModel);

    if (newProduct.productImage instanceof File) {
      formData.append('productImage', newProduct.productImage);
    }

    try {
      let response;
      if (product) {
        // ✅ Update
        response = await axios.put(`/auth/update-product/${product._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // ✅ Add
        response = await axios.post('/auth/add-product', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (response?.data?.success) {
        toast.success(product ? 'Product Updated Successfully' : 'Product Added Successfully');
        onClose();
        onSuccess?.();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      if (product) {
        // Editing existing product
        setNewProduct({
          productImage: product.productImage || '',
          productName: product.productName,
          productPrice: product.productPrice,
          productDiscountPrice: product.productDiscountPrice,
          categoryName: product.productCategory?.categoryName || '',
          productModel: product.productModel?.modelName || '',
        });
      } else {
        // Adding new product → reset all fields
        setNewProduct({
          productImage: '',
          productName: '',
          productPrice: '',
          productDiscountPrice: '',
          categoryName: '',
          productModel: '',
        });
      }
    }
  }, [open, product]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader color="#36d7b7" loading={loading} size={50} />
        </div>
      ) : (
        <>
          <DialogTitle>{product ? 'Edit Product' : 'Add Product'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Product Name"
              fullWidth
              margin="dense"
              value={newProduct.productName}
              onChange={(e) => handleChange('productName', e.target.value)}
            />
            <TextField
              label="Price"
              fullWidth
              margin="dense"
              type="number"
              value={newProduct.productPrice}
              onChange={(e) => handleChange('productPrice', e.target.value)}
            />
            <TextField
              label="Discount Price"
              fullWidth
              margin="dense"
              type="number"
              value={newProduct.productDiscountPrice}
              onChange={(e) => handleChange('productDiscountPrice', e.target.value)}
            />
            <TextField
              select
              label="Category"
              fullWidth
              margin="dense"
              value={newProduct.categoryName}
              onChange={(e) => handleChange('categoryName', e.target.value)}
            >
              {categories.map((cat, indx) => (
                <MenuItem key={indx} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Model"
              fullWidth
              margin="dense"
              value={newProduct.productModel}
              onChange={(e) => handleChange('productModel', e.target.value)}
            >
              {models.map((m, indx) => (
                <MenuItem key={indx} value={m}>
                  {m}
                </MenuItem>
              ))}
            </TextField>
            <Button variant="outlined" component="label" sx={{ mt: 2 }}>
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) =>
                  handleChange('productImage', e.target.files ? e.target.files[0] : '')
                }
              />
            </Button>
            {newProduct.productImage && newProduct.productImage instanceof File && (
              <img
                src={URL.createObjectURL(newProduct.productImage)}
                alt="Preview"
                style={{ marginTop: 10, height: 100 }}
              />
            )}
            {/* If productImage is a string (editing existing product) */}
            {typeof newProduct.productImage === 'string' && newProduct.productImage && (
              <img
                src={newProduct.productImage}
                alt="Preview"
                style={{ marginTop: 10, height: 100 }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={saveProduct} variant="contained">
              {product ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default AddProductDialog;
