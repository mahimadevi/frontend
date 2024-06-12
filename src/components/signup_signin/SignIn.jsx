import React from "react";
import "./signup.css";
import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Logincontext } from "../context/Contextprovider";

const Sign_in = () => {
  const [logdata, setData] = useState({
    email: "",
    password: "",
  });

  const { account, setAccount } = useContext(Logincontext);
  const adddata = (e) => {
    const { name, value } = e.target;

    setData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };

  const senddata = async (e) => {
    e.preventDefault();

    const { email, password } = logdata;
    // console.log(email);

    try {
      const res = await fetch(`${serverUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();
      console.log(data);

      if (res.status === 400 || !data) {
        console.log("invalid details");
        toast.warn("Invalid Details 👎!", {
          position: "top-center",
        });
      } else {
        setAccount(data);
        setData({ ...logdata, email: "", password: "" });
        toast.success("Login Successfully done 😃!", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log("login page ka" + error.message);
    }
  };

  return (
    <>
      <section>
        <div className="sign_container">
          <div className="sign_header">
            <img src="./blacklogoamazon.png" alt="amazonlogo" />
          </div>
          <div className="sign_form">
            <form method="POST">
              <h1>Sign-In</h1>
              <div className="form_data">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  onChange={adddata}
                  value={logdata.email}
                  name="email"
                  id="email"
                />
              </div>
              <div className="form_data">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  onChange={adddata}
                  value={logdata.password}
                  placeholder="Atleast Six Characters"
                  id="password"
                />
              </div>
              <button type="submit" className="signin_btn" onClick={senddata}>
                Continue
              </button>
            </form>
            <ToastContainer />
          </div>
          <div className="create_accountinfo">
            <p>New To Amazon</p>
            <button>
              {" "}
              <NavLink to="/signup"> Create Your Amazon Account </NavLink>{" "}
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Sign_in;
