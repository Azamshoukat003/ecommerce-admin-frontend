import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import { Button, Stack } from '@mui/material';

import { _products } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { ProductItem } from '../product-item';
import { ProductSort } from '../product-sort';
import { CartIcon } from '../product-cart-widget';
import { ProductFilters } from '../product-filters';

import type { FiltersProps } from '../product-filters';
import AddCategoryDialog from 'src/components/productsModels/AddCategoryDialog';
import AddModelDialog from 'src/components/productsModels/AddModelDialog';
import AddProductDialog from 'src/components/productsModels/AddProductDialog';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface Product {
  _id: string;
  productImage: string;
  productName: string;
  productPrice: string;
  productDiscountPrice: string;
  categoryName: string;
  productModel: string;
}

const GENDER_OPTIONS = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'kids', label: 'Kids' },
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'shose', label: 'Shose' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'accessories', label: 'Accessories' },
];

const RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];

const PRICE_OPTIONS = [
  { value: 'below', label: 'Below $25' },
  { value: 'between', label: 'Between $25 - $75' },
  { value: 'above', label: 'Above $75' },
];

const COLOR_OPTIONS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

const defaultFilters = {
  price: '',
  gender: [GENDER_OPTIONS[0].value],
  colors: [COLOR_OPTIONS[4]],
  rating: RATING_OPTIONS[0],
  category: CATEGORY_OPTIONS[0].value,
};

export function ProductsView() {
  const [sortBy, setSortBy] = useState('featured');
  const [openCategory, setOpenCategory] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const [categories, setCategories] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [openFilter, setOpenFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FiltersProps>(defaultFilters);
  const [editProduct, setEditProduct] = useState(null);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12); // products per page

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const paginatedProducts = products.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleOpenFilter = useCallback(() => {
    setOpenFilter(true);
  }, []);

  const handleCloseFilter = useCallback(() => {
    setOpenFilter(false);
  }, []);

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
  }, []);

  const handleSetFilters = useCallback((updateState: Partial<FiltersProps>) => {
    setFilters((prevValue) => ({ ...prevValue, ...updateState }));
  }, []);

  const canReset = Object.keys(filters).some(
    (key) => filters[key as keyof FiltersProps] !== defaultFilters[key as keyof FiltersProps]
  );

  const getALlCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/get-categories`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response?.data?.success) {
        // toast.success('Category added1 Successfully');
        const names = response?.data?.data.map(
          (item: { categoryName: string }) => item.categoryName
        );
        setCategories(names);
        // console.log(response.data.data);
      } else {
        toast.error('Failed to add category.');
      }
    } catch (e) {
      console.error('Error adding category:', e);
    }
  };
  const getAllModels = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/get-models`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response?.data?.success) {
        // toast.success('Model added Successfully');
        const names = response?.data?.data.map((item: { modelName: string }) => item.modelName);
        setModels(names);
        // console.log(response.data.data);
      } else {
        toast.error('Failed to add Model.');
      }
    } catch (e) {
      console.error('Error adding category:', e);
    }
  };

  const getAllProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/get-products`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response?.data?.success) {
        setProducts(response?.data?.data);
        // console.log(response.data.data);
      } else {
        toast.error('Failed to add Model.');
      }
    } catch (e) {
      console.error('Error adding category:', e);
    }
  };
  useEffect(() => {
    getALlCategories();
    getAllModels();
    getAllProducts();
  }, []);

  useEffect(() => {
    if (isDeleted) {
      getAllProducts();
      setIsDeleted(false);
    }
  }, [isDeleted]);
  return (
    <DashboardContent>
      <CartIcon totalItems={8} />

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        {/* Left side - Title */}
        <Typography variant="h4">Products</Typography>

        {/* Right side - Buttons */}
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={() => setOpenCategory(true)}>
            Add Category
          </Button>
          <Button variant="outlined" onClick={() => setOpenModel(true)}>
            Add Model
          </Button>
          <Button variant="contained" onClick={() => setOpenProduct(true)}>
            Add Product
          </Button>
        </Stack>
      </Stack>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap-reverse',
          justifyContent: 'flex-end',
        }}
      >
        <Box
          sx={{
            my: 1,
            gap: 1,
            flexShrink: 0,
            display: 'flex',
          }}
        >
          <ProductFilters
            canReset={canReset}
            filters={filters}
            onSetFilters={handleSetFilters}
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
            onResetFilter={() => setFilters(defaultFilters)}
            options={{
              genders: GENDER_OPTIONS,
              categories: CATEGORY_OPTIONS,
              ratings: RATING_OPTIONS,
              price: PRICE_OPTIONS,
              colors: COLOR_OPTIONS,
            }}
          />

          <ProductSort
            sortBy={sortBy}
            onSort={handleSort}
            options={[
              { value: 'featured', label: 'Featured' },
              { value: 'newest', label: 'Newest' },
              { value: 'priceDesc', label: 'Price: High-Low' },
              { value: 'priceAsc', label: 'Price: Low-High' },
            ]}
          />
        </Box>
      </Box>

      <AddCategoryDialog
        open={openCategory}
        onClose={() => setOpenCategory(false)}
        setCategories={setCategories}
        onSuccess={getALlCategories}
      />

      <AddModelDialog
        open={openModel}
        onClose={() => setOpenModel(false)}
        setModels={setModels}
        onSuccess={getAllModels}
      />

      <AddProductDialog
        open={openProduct}
        onClose={() => {
          setOpenProduct(false);
          setEditProduct(null);
        }}
        categories={categories}
        models={models}
        // setProducts={setProducts}
        onSuccess={getAllProducts}
        product={editProduct}
      />
     
     
      <Grid container spacing={3}>
        {paginatedProducts.map((product) => (
          <Grid key={product._id} size={{ xs: 12, sm: 6, md: 3 }}>
            <ProductItem
              product={product}
              onEdit={(p: any) => {
                setEditProduct(p);
                setOpenProduct(true);
              }}
              onDeleted={() => setIsDeleted(true)}
            />
          </Grid>
        ))}
      </Grid>

      <Pagination
        count={Math.ceil(products.length / rowsPerPage)}
        page={page}
        onChange={handleChangePage}
        color="primary"
        sx={{ mt: 8, mx: 'auto' }}
      />

      {/* <Pagination count={10} color="primary" sx={{ mt: 8, mx: 'auto' }} /> */}
    </DashboardContent>
  );
}
