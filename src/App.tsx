import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LocationModal } from './components/common/LocationModal';
import { MaterialCalculator } from './components/common/MaterialCalculator';
import { CartDrawer } from './components/customer/CartDrawer';
import { NewOrderModal } from './components/retailer/NewOrderModal';

// Customer Pages
import { HomePage } from './pages/customer/HomePage';
import { CategoriesPage, CategoryProductsPage } from './pages/customer/CategoriesPage';
import { StoresPage, StoreDetailPage } from './pages/customer/StoresPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { StoreComparePage } from './pages/customer/StoreComparePage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrderTrackingPage } from './pages/customer/OrderTrackingPage';
import { OrdersHistoryPage } from './pages/customer/OrdersHistoryPage';
import { OffersPage } from './pages/customer/OffersPage';

// Retailer Pages
import { RetailerDashboard } from './pages/retailer/RetailerDashboard';
import { RetailerOrdersPage } from './pages/retailer/RetailerOrdersPage';
import { RetailerInventoryPage } from './pages/retailer/RetailerInventoryPage';
import { RetailerPromotionsPage } from './pages/retailer/RetailerPromotionsPage';

// Driver Pages
import { DriverHomePage } from './pages/driver/DriverHomePage';
import { DriverOngoingDeliveryPage } from './pages/driver/DriverOngoingDeliveryPage';
import { DriverEarningsPage } from './pages/driver/DriverEarningsPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />

          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/category/:slug" element={<CategoryProductsPage />} />
            <Route path="/stores" element={<StoresPage />} />
            <Route path="/stores/:id" element={<StoreDetailPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/compare" element={<StoreComparePage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/tracking/:id" element={<OrderTrackingPage />} />
            <Route path="/orders" element={<OrdersHistoryPage />} />
            <Route path="/offers" element={<OffersPage />} />

            {/* Retailer Partner Routes */}
            <Route path="/retailer" element={<RetailerDashboard />} />
            <Route path="/retailer/orders" element={<RetailerOrdersPage />} />
            <Route path="/retailer/inventory" element={<RetailerInventoryPage />} />
            <Route path="/retailer/promotions" element={<RetailerPromotionsPage />} />

            {/* Driver Logistics Routes */}
            <Route path="/driver" element={<DriverHomePage />} />
            <Route path="/driver/ongoing" element={<DriverOngoingDeliveryPage />} />
            <Route path="/driver/earnings" element={<DriverEarningsPage />} />

            {/* Admin Governance Routes */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Footer />

          {/* Interactive Global Modals */}
          <LocationModal />
          <MaterialCalculator />
          <CartDrawer />
          <NewOrderModal />
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
