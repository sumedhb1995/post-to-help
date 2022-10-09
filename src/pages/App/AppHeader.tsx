import { AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

import title from "../../assets/title.png";
import logo from "../../assets/logo-transparent.png";
import background from "../../assets/header-background.png";
import LoginButton from "../../components/LoginButton";
import { AuthContext } from "../../contexts";

const AppHeader = (): JSX.Element => {
  return (
    <div
      style={{
        width: "100%",
        flex: 1,
        background: `url(${background})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <br />
      <AppBar
        position="static"
        style={{
          backgroundColor: "transparent",
          margin: 0,
          padding: 0,
          boxShadow: "none",
          height: 200,
        }}
      >
        <Toolbar>
          <Link to="/campaigns/my">
            <img style={{ height: 40 }} src={logo} alt="Logo" />
          </Link>

          <div
            style={{
              flex: 1,
            }}
          />

          <LoginButton />
        </Toolbar>
      </AppBar>

      <img src={title} style={{ width: 500 }} />
      <Typography
        variant="h6"
        fontWeight={300}
        color="white"
        style={{ paddingBottom: 230 }}
      >
        {"Find funding. Go viral. Reward supporters."}
      </Typography>
    </div>
  );
};

export default AppHeader;
