import "./App.css";

import axios from "axios";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import { CircularProgress, createTheme, ThemeProvider } from "@mui/material";
import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";

import { AuthContext } from "../../contexts";
import { IAuth, IUser } from "../../interfaces";
import { getAccounts, Login } from "../Login";
import AppHeader from "./AppHeader";
import { Campaign } from "../Campaign";
import { getWeb3Client, IWeb3Client } from "../../web3/web3Client";
import { Profile } from "../Profile";
import { MyCampaigns } from "../MyCampaigns";

const clientId =
  "BGqWWFD1HnxrgO5zBD27oDK8cAqSIvKrRGWCCuRaSio02FiaWDxdYVjrfiYcshBjka9bTamHKGhCZGGvCTtdpAI";

export const MuiTheme = createTheme({
  typography: {
    allVariants: {
      color: "black",
      fontFamily: "Plus Jakarta Sans",
    },
    button: {
      backgroundColor: "black",
      margin: 5,
      width: 219,
      height: 33,
      border: "solid",
      borderColor: "#000000",
      borderRadius: 25,
      "&:hover": {
        backgroundColor: "transparent",
        color: "#000000",
        textColor: "#000000",
      },
      color: "white",
    },
  },
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "black",
          color: "black",
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        input: {
          backgroundColor: "black",
          color: "white",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          border: "solid",
          borderColor: "#000000",
          borderRadius: 25,
          backgroundColor: "#000000",
          color: "white",
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          color: "green",
        },
      },
    },
  },
  palette: {
    primary: {
      light: "#28FFB2",
      main: "rgba(122, 40, 198, 1)",
      dark: "#28FFB2",
      contrastText: "#FFFFF",
    },
  },
});

export const App = (): JSX.Element => {
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
  const [auth, setAuth] = useState<IAuth | undefined>(undefined);
  const [user, setUser] = useState<IUser | undefined>(undefined);

  const [isAxiosReady, setIsAxiosReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [wasLoginAttempted, setWasLoginAttempted] = useState(false);
  const [web3Client, setWeb3Client] = useState<IWeb3Client | undefined>(
    undefined
  );
  const history = useHistory();

  useEffect(() => {
    const init = async () => {
      try {
        const w3A = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x13881",
            rpcTarget: "https://rpc-mumbai.maticvigil.com", // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
          authMode: "DAPP",
        });

        const metamaskAdapter = new MetamaskAdapter({
          clientId,
        });

        // w3A.configureAdapter(metamaskAdapter);
        // const config: any = {};
        // config[WALLET_ADAPTERS.METAMASK] = {
        // 	showOnDesktop: true,
        // };
        setWeb3Auth(w3A);
        w3A.initModal().then(async () => {
          if (w3A.provider) {
            setProvider(w3A.provider);
            setWeb3Client(getWeb3Client(w3A.provider));
            const publicAddress = (
              await getAccounts(w3A.provider)
            )?.toLowerCase();
            fetch(
              `${process.env.REACT_APP_BACKEND_URL}/users?publicAddress=${publicAddress}`
            )
              .then((response) => response.json())
              // If yes, retrieve it. If no, create it.
              .then((users) => {
                if (users.length) {
                  w3A.authenticateUser().then((token) => {
                    if (token) {
                      setAuth({
                        accessToken: token.idToken,
                      });

                      setUser(users[0]);
                      setIsAuthenticated(true);
                      axios.defaults.headers.common[
                        "Authorization"
                      ] = `Bearer ${token.idToken}`;
                      axios.defaults.withCredentials = true;
                      setIsAxiosReady(true);
                      setWasLoginAttempted(true);
                    }
                  });
                }
              });
          } else {
            setWasLoginAttempted(true);
          }
        });
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, [history]);

  const handleLoggedIn = React.useCallback(
    (auth: IAuth, isNewUser: boolean, provider: any) => {
      const decodedToken = jwtDecode<any>(auth.accessToken);
      console.log(JSON.stringify(decodedToken));
      let currentUser: IUser | undefined;
      getAccounts(provider)
        .then((address) => {
          if (!address) {
            throw Error("User public address not found");
          }
          return fetch(
            `${
              process.env.REACT_APP_BACKEND_URL
            }/users/byPublicAddress/${address.toLowerCase()}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.accessToken}`,
              },
            }
          )
            .then((response) => response.json())
            .catch(() => {
              // TODO: Do this securely by verifying app private key
              // https://web3auth.io/docs/server-side-verification/social-login-users#getting-app_pub_key-and-idtoken-in-frontend
              return fetch(
                `${
                  process.env.REACT_APP_BACKEND_URL
                }/users?publicAddress=${address.toLowerCase()}`
              )
                .then((response) => response.json())
                .then((users) => users[0]);
            });
        })
        .then((user) => {
          currentUser = user;
          setUser(user);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${auth.accessToken}`;
          axios.defaults.withCredentials = true;
        })
        .then(() => {
          setWeb3Client(getWeb3Client(provider));
          setProvider(provider);
        })
        .then(() => {
          setIsAxiosReady(true);
          setWasLoginAttempted(true);
          history.push("/campaigns/my");
        })
        .catch((e) => {
          setAuth(undefined);
          console.log(e);
          setWasLoginAttempted(true);
        });

      setAuth(auth);
      setIsAuthenticated(true);
    },
    [setWasLoginAttempted, user, history]
  );

  const handleLoggedOut = async () => {
    await web3Auth?.logout();
    setAuth(undefined);
    setIsAuthenticated(false);
    setUser(undefined);
    history.push("/login");
  };

  React.useEffect(() => {
    if (
      (wasLoginAttempted && !isAuthenticated) ||
      (user && !user.isAdmittedToAlpha)
    ) {
      history.push("/login");
    }
  }, [user, wasLoginAttempted, isAuthenticated, history]);

  return wasLoginAttempted && web3Auth ? (
    <div className="App">
      <ThemeProvider theme={MuiTheme}>
        {auth && isAxiosReady && provider ? (
          <AuthContext.Provider
            value={{
              isAuthenticated,
              user,
              setUser,
              logoutUser: handleLoggedOut,
              web3Client,
            }}
          >
            {isAuthenticated ? <AppHeader /> : null}
            <main>
              <Switch>
                <Route
                  path="/campaigns/view/:id"
                  exact={true}
                  component={Campaign}
                />

                <Route
                  path="/profile"
                  exact={true}
                  render={() => <Profile onLoggedOut={handleLoggedOut} />}
                />
                <Route path="*" component={MyCampaigns} />
              </Switch>
            </main>
          </AuthContext.Provider>
        ) : (
          <main>
            <Switch>
              <Route
                path="/*"
                render={() => (
                  <Login onLoggedIn={handleLoggedIn} web3Auth={web3Auth} />
                )}
              />
            </Switch>
          </main>
        )}
      </ThemeProvider>
    </div>
  ) : (
    <div style={{ display: "flex", justifyContent: "center", margin: 50 }}>
      <CircularProgress />
    </div>
  );
};
