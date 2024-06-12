import React, { useContext, useState, useEffect } from "react";
import "./navbar.css";
import SearchIcon from "@mui/icons-material/Search";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Avatar from "@mui/material/Avatar";
import { NavLink, useNavigate } from "react-router-dom";
import { Logincontext } from "../context/Contextprovider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LogoutIcon from "@mui/icons-material/Logout";
import "react-toastify/dist/ReactToastify.css";
import { Drawer, IconButton, List, ListItem } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import MenuIcon from "@mui/icons-material/Menu";
import Rightheader from "./Rightheader";
import { getProducts } from "../redux/actions/action";
import { useSelector, useDispatch } from "react-redux";
import { serverUrl } from "../../../helper/helper";

const Navbar = () => {
  const { account, setAccount } = useContext(Logincontext);
  // console.log(account);

  const navigate = useNavigate("");

  const [text, setText] = useState("");
  // only for search
  const { products } = useSelector((state) => state.getproductsdata);

  const [open, setOpen] = useState(false);
  const [liopen, setLiopen] = useState(true);

  const handleClick = (event) => {
    setOpen(event.currentTarget);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [dropen, setDropen] = useState(false);

  const getdetailsvaliduser = async () => {
    try {
      const res = await fetch(`${serverUrl}/validuser`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      // console.log(data);

      if (res.status !== 201) {
        console.log("first login");
        setAccount(null);
      } else {
        // console.log("cart add ho gya hain");
        setAccount(data);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setAccount(null);
    }
  };

  useEffect(() => {
    getdetailsvaliduser();
  }, []);

  // for logout
  const logoutuser = async () => {
    try {
      const res2 = await fetch("http://localhost:3005/logout", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data2 = await res2.json();
      // console.log(data2);

      if (res2.status !== 201) {
        const error = new Error(res2.error);
        throw error;
      } else {
        setAccount(false);
        setOpen(false);
        toast.success("User logged out 😃!", {
          position: "top-center",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // for drawer

  const handleopen = () => {
    setDropen(true);
  };

  const handleClosed = () => {
    setDropen(false);
  };

  const getText = (text) => {
    setText(text);
    setLiopen(false);
  };

  return (
    <header>
      <nav>
        <div className="left">
          <IconButton className="hamburgur" onClick={handleopen}>
            <MenuIcon style={{ color: "#fff" }} />
          </IconButton>
          {/* here define the right header */}
          <Drawer open={dropen} onClose={handleClosed}>
            <Rightheader logclose={handleClosed} userlog={logoutuser} />
          </Drawer>
          <div className="navlogo">
            <NavLink to="/">
              {" "}
              <img src="./amazon_PNG25.png" alt="" />{" "}
            </NavLink>
          </div>
          <div className="nav_searchbaar">
            <input
              type="text"
              name=""
              onChange={(e) => getText(e.target.value)}
              placeholder="Search Your Products"
              id=""
            />
            <div className="search_icon">
              <SearchIcon id="search" />
            </div>
            {text && (
              <List className="extrasearch" hidden={liopen}>
                {products
                  .filter((product) =>
                    product.title.longTitle
                      .toLowerCase()
                      .includes(text.toLowerCase())
                  )
                  .map((product) => (
                    <ListItem key={product.id}>
                      <NavLink
                        to={`/getproductsone/${product.id}`}
                        onClick={() => setLiopen(true)}
                      >
                        {product.title.longTitle}
                      </NavLink>
                    </ListItem>
                  ))}
              </List>
            )}
          </div>
        </div>
        <div className="right">
          <div className="nav_btn">
            <NavLink to="/login">Signin</NavLink>
          </div>
          {account && account.carts ? (
            <NavLink to="/buynow">
              <div className="cart_btn">
                <Badge badgeContent={account.carts.length} color="secondary">
                  <ShoppingCartIcon id="icon" />
                </Badge>
                <p>Cart</p>
              </div>
            </NavLink>
          ) : (
            <NavLink to="/login">
              <div className="cart_btn">
                <Badge badgeContent={0} color="secondary">
                  <ShoppingCartIcon id="icon" />
                </Badge>
                <p>Cart</p>
              </div>
            </NavLink>
          )}
          {account ? (
            <Avatar
              className="avtar2"
              onClick={handleClick}
              title={account.fname ? account.fname.toUpperCase() : ""}
            >
              {account.fname ? account.fname[0].toUpperCase() : ""}
            </Avatar>
          ) : (
            <Avatar className="avtar" onClick={handleClick} />
          )}

          <div className="menu_div">
            <Menu
              anchorEl={open}
              open={Boolean(open)}
              onClose={handleClose}
              // className={classes.component}
            >
              <MenuItem onClick={handleClose} style={{ margin: 10 }}>
                My account
              </MenuItem>
              {account ? (
                <MenuItem
                  onClick={handleClose}
                  style={{ margin: 10 }}
                  onClick={logoutuser}
                >
                  <LogoutIcon style={{ fontSize: 16, marginRight: 3 }} /> Logout
                </MenuItem>
              ) : (
                ""
              )}
            </Menu>
          </div>
          <ToastContainer />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
