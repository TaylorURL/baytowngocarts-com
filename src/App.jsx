import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import PricingPage from "./pages/PricingPage";
import EventsPage from "./pages/EventsPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SuccessPage from "./pages/SuccessPage";
import DashboardPage from "./pages/PurchasesPage";
import CartPage from "./pages/CartPage";
import PurchaseDetailsPage from "./pages/PurchaseDetailsPage";
import StaffPanelPage from "./pages/StaffPanelPage";
import TrafficPage from "./pages/TrafficPage";
import ScrollToTop from "./components/common/ScrollToTop.jsx";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="purchase/:orderId" element={<PurchaseDetailsPage />} />
          <Route path="staff" element={<StaffPanelPage />} />
          <Route path="traffic" element={<TrafficPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </Router>
  );
}
