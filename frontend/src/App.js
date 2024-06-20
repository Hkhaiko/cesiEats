import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CustomerManagement from "./pages/CustomerManagement";
import OrderManagement from "./pages/OrderManagement";
import Layout from "./components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/customers" element={<CustomerManagement />} />
          <Route path="/orders" element={<OrderManagement />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
