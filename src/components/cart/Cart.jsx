import React, { useState, useContext, useEffect } from "react";
import "./cart.css";
import { products } from "../home/productdata";
import { Divider } from "@mui/material";
import { useParams, useNavigate } from "react-router";
import { Logincontext } from "../context/Contextprovider";
import CircularProgress from "@mui/material/CircularProgress";

const Cart = () => {
  const { id } = useParams("");
  const navigate = useNavigate();

  const { account, setAccount } = useContext(Logincontext);

  const [inddata, setInddata] = useState(`{}`);
  // console.log([inddata]);

  const getinddata = async () => {
    const res = await fetch(`${serverUrl}/getproductsone/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log(data);

    if (res.status !== 201) {
      // console.log("nodata available");
    } else {
      // console.log("getdata");
      setInddata(data);
    }
  };

  useEffect(() => {
    setTimeout(getinddata, 1000);
  }, [id]);

  const addtocart = async (id) => {
    console.log(id);
    const check = await fetch(`${serverUrl}/addcart/${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inddata,
      }),
      credentials: "include",
    });
    console.log(check);
    const data1 = await check.json();
    console.log(data1);

    if (check.status === 401 || !data1) {
      console.log("user invalid hai");
      alert("no data available");
    } else {
      setAccount(data1);
      navigate("/buynow");
      // alert("data added in your cart");
    }
  };

  return (
    <div className="cart_section">
      {inddata && Object.keys(inddata).length && (
        <div className="cart_container">
          <div className="left_cert">
            <img src={inddata.detailUrl} alt="cart_img" />
            <div className="cart_btn">
              <button
                className="cart_btn1"
                onClick={() => addtocart(inddata.id)}
              >
                Add To Cart
              </button>
              <button className="cart_btn2">Buy Now</button>
            </div>
          </div>
          <div className="right_cart">
            <h3>{inddata.title?.shortTitle}</h3>
            <h4>{inddata.title?.longTitle}</h4>
            <Divider />
            <p className="mrp">M.R.P.: ₹{inddata.price?.mrp}</p>
            <p>
              Deal of the day :{" "}
              <span style={{ color: "#B12704" }}>₹{inddata.price?.cost}</span>
            </p>
            <p>
              You save :{" "}
              <span style={{ color: "#B12704" }}>
                ₹{inddata.price?.mrp - inddata.price?.cost} (
                {inddata.price?.discount}))
              </span>
            </p>

            <div className="discount_box">
              <h5>
                Discount :{" "}
                <span style={{ color: "#111" }}> {inddata.discount}</span>
              </h5>
              <h4>
                Free Delievery{" "}
                <span style={{ color: "#111", fontWeight: 600 }}>
                  Oct 8 - 21
                </span>
                Details
              </h4>
              <p>
                Fastest Delievery:{" "}
                <span style={{ color: "#111", fontWeight: 600 }}>
                  Tommorow 11AM
                </span>
              </p>
            </div>
            <p className="description">
              About the Item:{" "}
              <span
                style={{
                  color: "#565959",
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "0.4",
                }}
              >
                {inddata.description}
              </span>{" "}
            </p>
          </div>
        </div>
      )}
      {!inddata ? (
        <div className="circle">
          <CircularProgress />
          <h2> Loading....</h2>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Cart;
