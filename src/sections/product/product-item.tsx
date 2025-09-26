import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Tooltip, IconButton } from '@mui/material';
import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Icon } from '@iconify/react';
import AddProductDialog from 'src/components/productsModels/AddProductDialog';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;


// ----------------------------------------------------------------------

export type ProductItemProps = {
  _id: string;
  productImage: string;
  productName: string;
  productPrice: string;
  productDiscountPrice: string;
  categoryName: string;
  productModel: string;
};

export function ProductItem({
  product,
  onEdit,
  onDeleted,
}: {
  product: ProductItemProps;
  onEdit: (p: ProductItemProps) => void;
  onDeleted: any;
}) {
  const [open, setOpen] = useState(false);

  const renderStatus = (
    <Label
      variant="inverted"
      color={(Number(product.productDiscountPrice) > 0 && 'info') || 'info'}
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      Sale
    </Label>
  );

  const handleDelete = async () => {
    if (!product._id) return;

    try {
      const res = await axios.delete(`${API_URL}/auth/delete-product/${product._id}`);
      if (res.data.success) {
        toast.success('Product deleted successfully');
        setOpen(false);
        onDeleted();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const renderImg = (
    <Box
      component="img"
      alt={product.productName}
      src={product.productImage}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
        borderRadius: 1.5,
      }}
    />
  );

  const renderPrice = (
    <Typography variant="subtitle1">
      <Typography
        component="span"
        variant="body1"
        sx={{
          color: 'text.disabled',
          textDecoration: 'line-through',
        }}
      >
        {Number(product.productDiscountPrice) > 0 && fCurrency(product.productDiscountPrice)}
      </Typography>
      &nbsp;
      {fCurrency(product.productPrice)}
    </Typography>
  );

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        '&:hover .action-overlay': {
          opacity: 1,
          transform: 'scale(1)',
        },
        transition: 'transform 0.3s ease',
      }}
    >
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {Number(product.productDiscountPrice) > 0 && renderStatus}
        {renderImg}
      </Box>

      {/* ✅ Hover overlay with centered buttons + transition */}
      <Box
        className="action-overlay"
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 2,
          backgroundColor: 'rgba(0,0,0,0.4)',
          opacity: 0,
          transform: 'scale(0.95)', // start slightly smaller
          transition: 'all 0.3s ease',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<Icon icon="mdi:pencil" />}
          sx={{
            transform: 'translateY(10px)',
            opacity: 0,
            transition: 'all 0.3s ease',
            transitionDelay: '0.1s',
            '.action-overlay:hover &': {
              transform: 'translateY(0)',
              opacity: 1,
            },
          }}
          onClick={() => onEdit(product)}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<Icon icon="mdi:delete" />}
          sx={{
            transform: 'translateY(10px)',
            opacity: 0,
            transition: 'all 0.3s ease',
            transitionDelay: '0.2s',
            '.action-overlay:hover &': {
              transform: 'translateY(0)',
              opacity: 1,
            },
          }}
          onClick={() => setOpen(true)}
        >
          Delete
        </Button>
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover" variant="subtitle2" noWrap>
          {product.productName}
        </Link>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography>{renderPrice}</Typography>
        </Box>
      </Stack>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this product? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">
            No
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
