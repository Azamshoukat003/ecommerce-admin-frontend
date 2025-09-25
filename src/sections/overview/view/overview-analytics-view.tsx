import React from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import { DashboardContent } from 'src/layouts/dashboard';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { Chart, useChart } from 'src/components/chart';
import { fNumber } from 'src/utils/format-number';
import { fToNow } from 'src/utils/format-time';

const MOCK_KPIS = {
  revenueWeekly: 714000,
  ordersTotal: 3_452,
  customersTotal: 8_321,
  productsTotal: 1_240,
};

const SALES_SERIES = {
  categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  series: [1200, 1800, 1500, 2200, 3200, 4000, 3600],
};

const ORDERS_BY_STATUS = [
  { label: 'Pending', value: 120 },
  { label: 'Processing', value: 340 },
  { label: 'Shipped', value: 1800 },
  { label: 'Delivered', value: 980 },
  { label: 'Returned', value: 12 },
];

const TOP_PRODUCTS = [
  { name: 'Wireless Headphones', sold: 4200 },
  { name: 'Sneakers', sold: 3780 },
  { name: 'Coffee Maker', sold: 2150 },
  { name: 'Sunglasses', sold: 1900 },
  { name: 'Backpacks', sold: 1600 },
];

const RECENT_ORDERS = [
  {
    id: 'ORD-1001',
    customer: 'Alice Smith',
    amount: 129.99,
    status: 'Processing',
    placedAt: Date.now() - 1000 * 60 * 60 * 4,
  },
  {
    id: 'ORD-1002',
    customer: 'John Doe',
    amount: 49.5,
    status: 'Pending',
    placedAt: Date.now() - 1000 * 60 * 60 * 8,
  },
  {
    id: 'ORD-1003',
    customer: 'Mary Lee',
    amount: 349.0,
    status: 'Shipped',
    placedAt: Date.now() - 1000 * 60 * 60 * 26,
  },
  {
    id: 'ORD-1004',
    customer: 'Carlos Ruiz',
    amount: 19.99,
    status: 'Delivered',
    placedAt: Date.now() - 1000 * 60 * 60 * 72,
  },
];

const LOW_STOCK = [
  { id: 'P-204', title: 'USB-C Cable 1m', stock: 2, image: '/assets/images/products/usb-c.jpg' },
  {
    id: 'P-521',
    title: 'Water Bottle 750ml',
    stock: 4,
    image: '/assets/images/products/bottle.jpg',
  },
  { id: 'P-178', title: 'Yoga Mat', stock: 1, image: '/assets/images/products/yogamat.jpg' },
];

const NEW_CUSTOMERS = [
  { id: 'U-901', name: 'Lina Park', joinedAt: Date.now() - 1000 * 60 * 60 * 36 },
  { id: 'U-902', name: 'Omar Khan', joinedAt: Date.now() - 1000 * 60 * 60 * 60 },
  { id: 'U-903', name: 'Hannah Lee', joinedAt: Date.now() - 1000 * 60 * 60 * 80 },
];

// ---------------- helper ------------------------------------------------
const formatCurrency = (v: number) => {
  return `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// ----------------- Small in-file cards ---------------------------------
function RecentOrdersCard() {
  return (
    <Card>
      <CardHeader title="Recent orders" subheader="Last 24 hours" />
      <CardContent sx={{ p: 0 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Placed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {RECENT_ORDERS.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.customer}</TableCell>
                <TableCell>{formatCurrency(row.amount)}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell align="right">{fToNow(row.placedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <Box sx={{ p: 1, textAlign: 'right' }}>
        <Button size="small">View all orders</Button>
      </Box>
    </Card>
  );
}

function LowStockCard() {
  return (
    <Card>
      <CardHeader title="Low stock" subheader="Products running low" />
      <CardContent>
        <Stack spacing={1}>
          {LOW_STOCK.map((p) => (
            <Stack key={p.id} direction="row" alignItems="center" spacing={2} sx={{ py: 1 }}>
              <Avatar variant="rounded" src={p.image} alt={p.title} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography noWrap variant="subtitle2">
                  {p.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Stock: {p.stock}
                </Typography>
              </Box>
              <Button size="small">Reorder</Button>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

function NewCustomersCard() {
  return (
    <Card>
      <CardHeader title="New customers" subheader="Recently registered" />
      <CardContent>
        <Stack spacing={1}>
          {NEW_CUSTOMERS.map((c) => (
            <Stack key={c.id} direction="row" alignItems="center" spacing={2} sx={{ py: 1 }}>
              <Avatar>{c.name.charAt(0)}</Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography noWrap variant="subtitle2">
                  {c.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Joined {fToNow(c.joinedAt)}
                </Typography>
              </Box>
              <Button size="small">Message</Button>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

// ---------------- Top products bar chart (uses Chart helper) ------------
function TopProductsChart() {
  const chartSeries = [
    {
      name: 'Sold',
      data: TOP_PRODUCTS.map((p) => p.sold),
    },
  ];

  const chartOptions = useChart({
    chart: { toolbar: { show: false } },
    xaxis: { categories: TOP_PRODUCTS.map((p) => p.name) },
    plotOptions: { bar: { borderRadius: 6, columnWidth: '56%' } },
    dataLabels: { enabled: false },
    tooltip: {
      y: {
        formatter: (val: number) => fNumber(val),
      },
    },
  });

  return (
    <Card>
      <CardHeader title="Top selling products" subheader="This month" />
      <CardContent>
        <Chart type="bar" series={chartSeries} options={chartOptions} />
      </CardContent>
    </Card>
  );
}

// ---------------- Main view --------------------------------------------
export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hello — Store Overview
      </Typography>

      {/* Responsive layout using CSS grid (no MUI Grid) */}
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(12, 1fr)',
          },
        }}
      >
        {/* KPI cards (each takes 3 / 12 columns on md+) */}
        <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 1', md: 'span 3' } }}>
          <AnalyticsWidgetSummary
            title="Revenue (7d)"
            percent={2.6}
            total={MOCK_KPIS.revenueWeekly}
            icon={<img alt="Revenue" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{ categories: SALES_SERIES.categories, series: SALES_SERIES.series }}
          />
        </Box>

        <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 1', md: 'span 3' } }}>
          <AnalyticsWidgetSummary
            title="Total orders"
            percent={-1.2}
            total={MOCK_KPIS.ordersTotal}
            color="secondary"
            icon={<img alt="Orders" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{ categories: SALES_SERIES.categories, series: SALES_SERIES.series }}
          />
        </Box>

        <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 1', md: 'span 3' } }}>
          <AnalyticsWidgetSummary
            title="Customers"
            percent={1.9}
            total={MOCK_KPIS.customersTotal}
            color="warning"
            icon={<img alt="Customers" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{ categories: SALES_SERIES.categories, series: SALES_SERIES.series }}
          />
        </Box>

        <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 1', md: 'span 3' } }}>
          <AnalyticsWidgetSummary
            title="Products"
            percent={0.6}
            total={MOCK_KPIS.productsTotal}
            color="error"
            icon={<img alt="Products" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{ categories: SALES_SERIES.categories, series: SALES_SERIES.series }}
          />
        </Box>

        {/* Sales overview (md: span 8) */}
        <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 8' } }}>
          <AnalyticsWebsiteVisits
            title="Sales overview"
            subheader="Revenue for the last 7 days"
            chart={{
              categories: SALES_SERIES.categories,
              series: [{ name: 'Revenue', data: SALES_SERIES.series }],
            }}
          />
        </Box>

        {/* Orders by status (md: span 4) */}
        <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 4' } }}>
          <AnalyticsCurrentVisits title="Orders by status" chart={{ series: ORDERS_BY_STATUS }} />
        </Box>

        {/* Top products (md: span 6) */}
        <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 12' } }}>
          <TopProductsChart />
        </Box>

        {/* Recent orders (md: span 6) */}
        <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 12' } }}>
          <RecentOrdersCard />
        </Box>

        {/* Low stock (md: span 4) */}
        <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 1', md: 'span 4' } }}>
          <LowStockCard />
        </Box>

        {/* New customers (md: span 4) */}
        <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 1', md: 'span 4' } }}>
          <NewCustomersCard />
        </Box>

        {/* Quick actions (md: span 4) */}
        <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 4' } }}>
          <Card>
            <CardHeader title="Quick actions" />
            <Divider />
            <CardContent>
              <Stack spacing={1}>
                <Button variant="contained">Create product</Button>
                <Button variant="outlined">View orders</Button>
                <Button variant="outlined">Manage inventory</Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </DashboardContent>
  );
}
