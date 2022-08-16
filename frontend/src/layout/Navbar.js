import React from "react";
import {
  useNavigate,
  Link as RouterLink,
  Outlet,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";

import { useColorMode } from "../context/ThemeContext";
import { useActions } from "../context/ActionsContext";
import { selectUser } from "../store/usersSlice";
import { Main } from "./Main";
import { Footer } from "./Footer";

import {
  Container,
  Card,
  Link,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Logout from "@mui/icons-material/Logout";

const NavbarBackdrop = {
  height: "4rem",
};

const NavbarContainer = {
  position: "fixed",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: "1300",
  padding: "1rem",
};

const NavbarCard = {
  width: "100%",
  height: "3rem",
  padding: "0.5rem 1rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "2rem",
};

export default function Navbar(props) {
  const { mode, toggleColorMode } = useColorMode();
  const user = useSelector(selectUser);
  const actions = useActions();
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);
  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Main sx={{ flexDirection: "column" }}>
      <nav style={NavbarBackdrop}>
        <Container maxWidth="md" sx={NavbarContainer}>
          <Card raised={true} sx={NavbarCard}>
            <Link
              component={RouterLink}
              underline="none"
              sx={{
                fontSize: "1.5rem",
                fontWeight: "light",
                color: mode === "light" ? "#555" : "#bbb",
              }}
              to={user ? "/" : "/welcome"}
            >
              Planner
            </Link>

            <div
              style={{
                display: "flex",
                alignSelf: user ? "center" : "start",
                alignItems: "center",
                justifyContent: "end",
                gap: "1rem",
                flexWrap: user ? "nowrap" : "wrap",
              }}
            >
              <IconButton
                size="small"
                onClick={toggleColorMode}
                sx={{ marginRight: "1rem" }}
              >
                {mode === "light" ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>

              {user ? (
                <>
                  <IconButton
                    onClick={openMenu}
                    size={"small"}
                    aria-controls={menuOpen ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={menuOpen ? "true" : undefined}
                  >
                    <Avatar sx={{ width: "2rem", height: "2rem" }}>
                      {user.username[0]}
                    </Avatar>
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    id="account-menu"
                    open={menuOpen}
                    onClose={closeMenu}
                    PaperProps={{
                      sx: {
                        overflow: "visible",
                        mt: 1.5,
                        "&:before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          backgroundColor: "inherit",
                          backgroundImage: "inherit",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                  >
                    <MenuItem onClick={() => navigate("/project/")}>
                      <ListItemIcon>
                        <AccountCircleIcon fontSize="small" />
                      </ListItemIcon>
                      {user.username}
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={actions.user.logout}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Log Out
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate("/login" + location.search)}
                  >
                    Log In
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate("/register" + location.search)}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </Card>
        </Container>
      </nav>

      <Outlet />

      <Footer />
    </Main>
  );
}
