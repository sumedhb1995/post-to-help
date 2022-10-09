import { Button, Link, Typography } from "@mui/material";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { Web3Auth } from "@web3auth/web3auth";
import { SafeEventEmitterProvider, WALLET_ADAPTERS } from "@web3auth/base";

import Web3 from "web3";

import { IAuth, IUser } from "../../interfaces";
import { AuthContext } from "../../contexts";
import title from "../../assets/title.png";

interface Props {
  onLoggedIn: (auth: IAuth, isNewUser: boolean, provider: any) => void;
  web3Auth: Web3Auth;
}

let web3: Web3 | undefined = undefined; // Will hold the web3 instance

export const getAccounts = async (
  provider: SafeEventEmitterProvider | null
) => {
  if (!provider) {
    console.log("provider not initialized yet");
    return;
  }
  const web3 = new Web3(provider as any);
  const address = (await web3.eth.getAccounts())[0];
  console.log(address);
  return address;
};

export const Login = ({ onLoggedIn, web3Auth }: Props): JSX.Element => {
  const [loading, setLoading] = useState(false); // Loading button state
  const { user } = React.useContext(AuthContext);

  const login = async () => {
    if (!web3Auth) {
      console.log("web3auth not initialized yet");
      return null;
    }
    const web3authProvider = await web3Auth.connect();
    return web3authProvider;
  };

  const handleSignup = (publicAddress: string) =>
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users`, {
      body: JSON.stringify({ publicAddress, username: publicAddress }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then((response) => response.json());

  const handleClick = async () => {
    const provider = await login();
    const publicAddress = (await getAccounts(provider))?.toLowerCase();

    if (!publicAddress) {
      throw Error("Unable to fetch user addresss");
    }

    setLoading(true);

    let isNewUser = false;
    let user: IUser | undefined;
    // Look if user with current publicAddress is already present on backend
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/users?publicAddress=${publicAddress}`
    )
      .then((response) => response.json())
      // If yes, retrieve it. If no, create it.
      .then((users) => {
        if (users.length) {
          return users[0];
        } else {
          isNewUser = true;
          return handleSignup(publicAddress);
        }
      })
      // Popup MetaMask confirmation modal to sign message
      .then((u) => web3Auth.authenticateUser())
      // Pass accessToken back to parent component (to save it in localStorage)
      .then((auth) => {
        console.log(auth.idToken);
        onLoggedIn({ accessToken: auth.idToken }, isNewUser, provider);
      })
      .catch((err) => {
        window.alert(err);
        setLoading(false);
      });
  };

  return (
    <>
      <div
        style={{
          flex: 1,
          height: "100%",
          width: "100%",
          position: "absolute",
          left: 0,
          right: 0,
          objectFit: "cover",
          background:
            "linear-gradient(239.88deg, #70D4FF 13.39%, #4C78EA 41.38%, #8511BC 86.64%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          flex: 1,
        }}
      >
        <img src={title} style={{ width: 500 }} />
        <Typography
          variant="h6"
          fontWeight={300}
          color="white"
          style={{ marginTop: 25 }}
        >
          Find funding. Go viral. Reward supporters.
        </Typography>
        <br />
        <Button
          variant="contained"
          onClick={() => handleClick()}
          style={{
            backgroundColor: "rgb(255, 125, 0)",
            width: 400,
            border: "none",
            marginTop: 25,
          }}
        >
          {loading ? "Loading..." : "Login"}
        </Button>
      </div>
    </>
  );
};
