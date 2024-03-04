import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Login from "./Components/User/Login";
import SignUp from "./Components/User/SignUp";
import UserState from "./Context/User/UserState";
import ProductState from "./Context/Product/ProductState";
import OrderState from "./Context/Order/OrderState";
import ViewCart from "./Components/Order/ViewCart";
import ShippingDetails from "./Components/Order/ShippingDetails";
import SummaryPage from "./Components/Order/SummaryPage";
import ViewOrders from "./Components/Order/ViewOrders";
import AdminPanel from "./Components/User/AdminPanel";
import UserPanelModalCreateProduct from "./Components/User/UserPanelModalCreateProduct";
import ViewProfile from "./Components/User/ViewProfile";
import ManageProducts from "./Components/Product/ManageProducts";
import ViewProduct from "./Components/Product/ViewProduct";

function App() {
  return (
    <>
      <UserState>
        <OrderState>
          <ProductState>
            <Navbar />
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/SignUp" element={<SignUp />} />
              <Route exact path="/viewCart" element={<ViewCart />} />
              <Route exact path="/shippingDetails" element={<ShippingDetails />} />
              <Route exact path="/summary" element={<SummaryPage/>} />
              <Route exact path='/adminpanel' element={<AdminPanel/>}/>
              <Route exact path='/adminpanel/userRoute' element={<UserPanelModalCreateProduct/>}/>
              <Route exact path='/adminpanel/productRoute' element={<ManageProducts/>}/>
              <Route exact path='/viewProfile' element={<ViewProfile/>}/>
              <Route exact path='/viewProduct/:id' element={<ViewProduct/>}/>
              <Route exact path='/viewOrders' element={<ViewOrders/>}/>
              <Route path="*" element={<h1>400 Bad Request</h1>}/>
            </Routes>
          </ProductState>
        </OrderState>
      </UserState>
    </>
  );
}

export default App;
