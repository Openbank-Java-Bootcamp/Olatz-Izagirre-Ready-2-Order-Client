import "./App.css";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import IsAnon from "./components/IsAnon";
import IsAdmin from "./components/IsAdmin";
import TablesPage from "./pages/TablesPage";
import EditTablesPage from "./pages/EditTablesPage";
import IsPrivate from "./components/IsPrivate";
import ResumePage from "./pages/ResumePage";
import IsChef from "./components/IsChef";
import OrderItemsPage from "./pages/OrderItemsPage";
import IsWaiter from "./components/IsWaiter";
import TablesByWaiterPage from "./pages/TablesByWaiterPage";
import NewOrderPage from "./pages/NewOrderPage";
import ChefOrdersPage from "./pages/ChefOrdersPage";
import WaiterOrdersPage from "./pages/WaiterOrdersPage";
import OrdersPage from "./pages/OrdersPage";
import EditOrderPage from "./pages/EditOrderPage";

function App() {
  return (
    <div className="App">
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <IsAnon>
              <HomePage />
            </IsAnon>
          }
        />
        <Route
          path="/signup"
          element={
            <IsAdmin>
              <SignupPage />
            </IsAdmin>
          }
        />
        <Route
          path="/tables"
          element={
            <IsAdmin>
              <TablesPage />
            </IsAdmin>
          }
        />
        <Route
          path="/tables/:tableId"
          element={
            <IsAdmin>
              <EditTablesPage />
            </IsAdmin>
          }
        />
        <Route
          path="/orders"
          element={
            <IsAdmin>
              <OrdersPage />
            </IsAdmin>
          }
        />
        <Route
          path="/resume"
          element={
            <IsPrivate>
              <ResumePage />
            </IsPrivate>
          }
        />
        <Route
          path="/orderItems"
          element={
            <IsChef>
              <OrderItemsPage />
            </IsChef>
          }
        />
        <Route
          path="/chef/orders"
          element={
            <IsChef>
              <ChefOrdersPage />
            </IsChef>
          }
        />
        <Route
          path="/tables/waiter"
          element={
            <IsWaiter>
              <TablesByWaiterPage />
            </IsWaiter>
          }
        />
        <Route
          path="/tables/:tableId/order"
          element={
            <IsWaiter>
              <NewOrderPage />
            </IsWaiter>
          }
        />
        <Route
          path="/waiter/orders"
          element={
            <IsWaiter>
              <WaiterOrdersPage />
            </IsWaiter>
          }
        />
        <Route
          path="/orders/:orderId"
          element={
            <IsWaiter>
              <EditOrderPage />
            </IsWaiter>
          }
        />
        <Route
          path="/login"
          element={
            <IsAnon>
              <LoginPage />
            </IsAnon>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
