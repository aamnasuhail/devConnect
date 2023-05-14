import React, { useContext, useState } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import {
  Search,
  ExpandMore,
  InsertPhoto,
  AccountCircle,
  Add,
  ExitToApp,
  AccountBox,
} from "@material-ui/icons";
import {
  Menu,
  InputBase,
  IconButton,
  AppBar,
  Button,
  Divider,
  Toolbar,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box,
} from "@material-ui/core";

import { NavLink, useHistory } from "react-router-dom";
import { UserContext, SnackbarContext } from "../App";
import axios from "../helpers/axios";
import "./Navbar.css";
import logo from "../assets/images/DevConnect-removebg-preview.png";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  toolbar: {
    [theme.breakpoints.down("sm")]: {
      padding: "2px 2px",
    },
  },
  brand: {
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "6px",
    },
  },
  AppBar: {
    padding: "8px",
    backgroundColor: "#ffffff",
    color: "#000000",
    boxShadow:
      "rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px",
  },
  MuiButton: {
    textTransform: "none",
    fontWeight: "normal",
    marginRight: "8px",
    borderRadius: "8px",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },

  userlist: {
    position: "absolute",
    top: "56px",
    width: "100%",
    maxWidth: 362,
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    zIndex: 999,
    boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
    borderColor: "rgba(223,225,229,0)",
    [theme.breakpoints.down("sm")]: {
      width: "100vw",
      left: "-56%",
    },
  },
  search: {
    position: "relative",
    borderRadius: "8px",
    backgroundColor: fade(theme.palette.common.lightWhite, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.lightWhite, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(2),
      width: "auto",
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: "8px",
      width: "auto",
    },

    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing(4),
      width: 362,
    },
  },

  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    color: "#2b2727;",
    alignItems: "center",
    justifyContent: "center",
  },

  inputRoot: {
    color: "inherit",
  },

  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    width: "100%",
  },

  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    boxShadow:
      "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
  },
  desktopMenu: {
    "& div": {
      minWidth: "156px",
      top: "60px !important",
    },
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [anchorElDesktop, setDesktopAnchorEl] = useState(null);
  const [showuserDiv, setShowuserDiv] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const { state, dispatch } = useContext(UserContext);
  const { handleSnackBar } = useContext(SnackbarContext);
  const history = useHistory();

  const logout = () => {
    localStorage.clear();
    dispatch({ type: "CLEAR" });
    handleDesktopMenuClose();
    history.push("/login");
  };

  const handleSearchUser = (e) => {
    setSearchText(e.target.value);
    if (e.target.value === "") {
      setShowuserDiv(false);
      setUsers([]);
      return;
    }
    setShowuserDiv(true);
    fetchUsers(e.target.value);
  };

  const closeUserDiv = () => {
    setShowuserDiv(false);
    setSearchText("");
  };

  const fetchUsers = (email) => {
    axios
      .post("/findusers", { query: email })
      .then((result) => {
        console.log(result.data.users);
        if (result.data.users.length > 0) {
          setUsers(result.data.users);
        }
        if (result.data.users.length === 0) {
          handleSnackBar("No users found", "warning", 2000, {
            vertical: "bottom",
            horizontal: "left",
          });
          setUsers([]);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  //   Searching of Users
  const UsersListDiv = (
    <List className={classes.userlist} dense>
      {users.map((user) => {
        return (
          <NavLink
            to={
              state
                ? user._id !== state._id
                  ? `/profile/${user._id}`
                  : `/profile`
                : `/profile/${user._id}`
            }
            onClick={closeUserDiv}
            key={user._id}
          >
            <ListItem key={user._id} className="userlist-hover">
              <ListItemAvatar>
                <Avatar
                  alt={`Avatar n°${user._id}`}
                  src={user.pic}
                  className="avatar-box-shadow"
                />
              </ListItemAvatar>
              <ListItemText
                id={user._id}
                primary={user.name}
                secondary={user.email}
              />
            </ListItem>
          </NavLink>
        );
      })}
    </List>
  );

  const renderListMobile = () => {
    if (state) {
      return [
        <MenuItem key="11">
          {" "}
          <IconButton>
            {" "}
            <AccountCircle />{" "}
          </IconButton>{" "}
          <p>
            {" "}
            <NavLink onClick={handleMobileMenuClose} to="/profile">
              Profile
            </NavLink>{" "}
          </p>{" "}
        </MenuItem>,
        <MenuItem key="12">
          {" "}
          <IconButton>
            {" "}
            <Add />{" "}
          </IconButton>{" "}
          <p>
            {" "}
            <NavLink onClick={handleMobileMenuClose} to="/createPost">
              Create Post
            </NavLink>{" "}
          </p>{" "}
        </MenuItem>,
        <MenuItem key="13">
          {" "}
          <IconButton>
            {" "}
            <InsertPhoto />
          </IconButton>
          <p>
            <NavLink onClick={handleMobileMenuClose} to="/myfollowingposts">
              My Following Posts
            </NavLink>
          </p>{" "}
        </MenuItem>,
        <MenuItem key="14" onClick={logout}>
          {" "}
          <IconButton>
            {" "}
            <ExitToApp />{" "}
          </IconButton>{" "}
          Logout{" "}
        </MenuItem>,
      ];
    } else {
      return [
        <MenuItem key="15">
          {" "}
          <IconButton>
            {" "}
            <AccountCircle />{" "}
          </IconButton>{" "}
          <p>
            {" "}
            <NavLink onClick={handleMobileMenuClose} to="/login">
              Login
            </NavLink>{" "}
          </p>{" "}
        </MenuItem>,
        <MenuItem key="16">
          {" "}
          <IconButton>
            {" "}
            <AccountBox />{" "}
          </IconButton>{" "}
          <p>
            {" "}
            <NavLink onClick={handleMobileMenuClose} to="/signup">
              Signup
            </NavLink>{" "}
          </p>{" "}
        </MenuItem>,
      ];
    }
  };

  const renderListDesktop = () => {
    if (state) {
      return [
        <Button
          variant="contained"
          color="primary"
          className={classes.MuiButton}
          key="1"
        >
          {" "}
          <NavLink to="/chatbot" className="chatbot-button">
            AI Assistant For You
          </NavLink>{" "}
        </Button>,
        <Button
          variant="text"
          color="primary"
          className={classes.MuiButton}
          key="12"
        >
          {" "}
          <NavLink to="/">Explore</NavLink>{" "}
        </Button>,
        <Button
          variant="text"
          color="primary"
          className={classes.MuiButton}
          key="14"
        >
          {" "}
          <NavLink to="/profile">Profile</NavLink>{" "}
        </Button>,
        <Button
          variant="text"
          color="primary"
          className={classes.MuiButton}
          key="2"
        >
          {" "}
          <NavLink to="/createPost">Create Post</NavLink>{" "}
        </Button>,
        <Button
          variant="text"
          color="primary"
          className={classes.MuiButton}
          key="6"
        >
          {" "}
          <NavLink to="/myfollowingposts">My Following Posts</NavLink>{" "}
        </Button>,
        <div
          className="flex ptr desktopMenu-shadow"
          onClick={handleDesktopMenuOpen}
          key="3"
        >
          <Avatar
            alt="user-pic"
            src={state.pic}
            style={{ marginRight: "6px" }}
            className="avatar-boxshadow"
          />
          <span className="user-name">{state.name}</span>
          <ExpandMore />
        </div>,
        anchorElDesktop ? menuofDesktop : null,
      ];
    } else {
      return [
        <Button className={classes.MuiButton} key="4">
          {" "}
          <NavLink to="/login">Login</NavLink>{" "}
        </Button>,
        <Button className={classes.MuiButton} key="5">
          {" "}
          <NavLink to="/signup">Signup</NavLink>{" "}
        </Button>,
      ];
    }
  };

  const handleDesktopMenuOpen = (event) => {
    setDesktopAnchorEl(event.currentTarget);
  };
  const handleDesktopMenuClose = () => {
    setDesktopAnchorEl(null);
  };
  const goToProfile = () => {
    history.push("/profile");
  };

  const menuofDesktop = (
    <Menu
      id="simple-menu"
      className={classes.desktopMenu}
      anchorEl={anchorElDesktop}
      keepMounted
      open={Boolean(anchorElDesktop)}
      onClose={handleDesktopMenuClose}
    >
      <MenuItem onClick={goToProfile}>Profile</MenuItem>
      <Divider />
      <MenuItem onClick={logout}>
        Log Out&nbsp;
        <ExitToApp />
      </MenuItem>
    </Menu>
  );

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {renderListMobile()}
    </Menu>
  );

  return (
    <div className={`${classes.grow}`}>
      <AppBar className={classes.AppBar} elevation={4} position="fixed">
        <Toolbar className={classes.toolbar}>
          <Box
            component="span"
            variant="h4"
            className={`brand-logo ${classes.brand}`}
          >
            <NavLink to={state ? "/" : "/login"}>
              <img src={logo} alt="logo" className="logo" />
            </NavLink>
          </Box>

          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <Search />
            </div>
            <InputBase
              style={{ color: "#000", width: "100%" }}
              placeholder="Search User by emails…"
              value={searchText}
              onChange={handleSearchUser}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />

            {showuserDiv ? UsersListDiv : ""}
          </div>

          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>{renderListDesktop()}</div>

          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <Avatar
                alt="user-pic"
                src={state?.pic}
                className={classes.small}
              />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </div>
  );
};

export default Navbar;
