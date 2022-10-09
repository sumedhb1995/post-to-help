import "./Profile.css";

import { Button, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import queryString from "query-string";
import { compressAccurately } from "image-conversion";
import { useDropzone } from "react-dropzone";

import { AuthContext } from "../../contexts";
import { IUser } from "../../interfaces";
import twitterLogo from "../../assets/twitter.png";

interface Props {
  onLoggedOut: () => void;
}

export const Profile = ({ onLoggedOut }: Props): JSX.Element => {
  const { user, setUser } = React.useContext(AuthContext);
  const [username, setUsername] = useState<string | undefined>(user?.username);
  const [twitterUsername, setTwitterUsername] = useState<string | undefined>(
    user?.twitterUsername
  );
  const [lensUsername, setLensUsername] = useState<string | undefined>(
    user?.lensUsername
  );
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = React.useState<Blob | undefined>(
    undefined
  );

  const uploadProfilePicture = React.useCallback(
    (profilePicture: Blob) => {
      const data = new FormData();
      data.append("profilePicture", profilePicture);
      data.append(
        "profilePictureName",
        `profile_picture_${user?.id}.${profilePicture.type}`
      );

      setLoading(true);
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/users/uploadProfilePicture/${user?.id}`,
          data
        )
        .then(() => {
          setLoading(false);
        });
    },
    [user, profilePicture]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg"],
    },
    minSize: 0,
    onDrop: (acceptedFiles) => {
      compressAccurately(acceptedFiles[0], 2000).then((res) => {
        setProfilePicture(res);
        uploadProfilePicture(res);
      });
    },
    onDropRejected: () => {
      alert("Please only upload image files smaller than 2MB");
    },
  });

  const handleUsernameChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(value);
  };

  const loginWithTwitter = () => {
    (async () => {
      try {
        //OAuth Step 1
        const response = await axios({
          url: `${process.env.REACT_APP_BACKEND_URL}/twitter/oauth/requestToken`,
          method: "POST",
          withCredentials: true,
        });

        const { oauth_token } = response.data;
        //Oauth Step 2
        window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`;
      } catch (error) {
        console.error(error);
      }
    })();
  };

  const linkLens = () => {
    axios({
      url: `${process.env.REACT_APP_BACKEND_URL}/users/linkLens`,
      method: "POST",
      // TOOD: Remove, use cookie
      data: { lensUsername, userId: user?.id },
      withCredentials: true,
    }).then((response) => {
      setUser?.(response.data);
    });
  };

  const unlinkLens = () => {
    setLoading(true);

    if (!user) {
      window.alert(
        "The user id has not been fetched yet. Please try again in 5 seconds."
      );
      return;
    }

    axios
      ?.post(`${process.env.REACT_APP_BACKEND_URL}/users\/unlinkLens`, {
        userId: user.id,
      })
      .then((response) => response.data as IUser)
      .then((user) => {
        setLoading(false);
        setUser?.(user);
      })
      .catch((err) => {
        window.alert(err);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    (async () => {
      const { oauth_token, oauth_verifier } = queryString.parse(
        window.location.search
      );

      if (oauth_token && oauth_verifier) {
        try {
          //Oauth Step 3
          await axios({
            url: `${process.env.REACT_APP_BACKEND_URL}/twitter/oauth/accessToken`,
            method: "POST",
            data: { oauth_token, oauth_verifier },
            withCredentials: true,
          });
        } catch (error) {
          console.error(error);
        }
      }

      try {
        //Authenticated Resource Access
        const {
          data: { screen_name },
        } = await axios({
          url: `${process.env.REACT_APP_BACKEND_URL}/twitter/linkAccount`,
          method: "POST",
          // TOOD: Remove, use cookie
          data: { oauth_token, userId: user?.id },
          withCredentials: true,
        });

        setTwitterUsername(screen_name);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const handleSubmit = () => {
    setLoading(true);

    if (!user) {
      window.alert(
        "The user id has not been fetched yet. Please try again in 5 seconds."
      );
      return;
    }

    axios
      ?.patch(`${process.env.REACT_APP_BACKEND_URL}/users/${user.id}`, {
        username,
        twitterUsername,
      })
      .then((response) => response.data as IUser)
      .then((user) => {
        setLoading(false);
        setUser?.(user);
      })
      .catch((err) => {
        window.alert(err);
        setLoading(false);
      });
  };

  const handleUnlinkAccount = () => {
    setLoading(true);

    if (!user) {
      window.alert(
        "The user id has not been fetched yet. Please try again in 5 seconds."
      );
      return;
    }

    axios
      ?.post(
        `${process.env.REACT_APP_BACKEND_URL}/twitter/unlinkAccount/${user.id}`
      )
      .then((response) => response.data as IUser)
      .then((user) => {
        setLoading(false);
        setUser?.(user);
        setTwitterUsername(undefined);
      })
      .catch((err) => {
        window.alert(err);
        setLoading(false);
      });
  };

  return (
    <div className="Profile">
      <div
        style={{
          textAlign: "left",
          margin: 80,
          height: "100%",
          flex: 1,
        }}
      >
        <Typography variant="h5" style={{ paddingLeft: 30, paddingTop: 30 }}>
          {"MY PROFILE"}
        </Typography>
        <div
          style={{
            backgroundColor: "white",
            marginTop: 30,
            textAlign: "center",
            borderRadius: 20,
            border: "rgba(140, 140, 140, 1) solid 1px",
          }}
        >
          <Grid container>
            <Grid
              key={"profileTitle"}
              item
              xs={3}
              style={{
                border: "none",
                boxShadow: "none",
                textAlign: "left",
                borderBottom: "rgba(140, 140, 140, 1) solid 1px",
                paddingLeft: 50,
                paddingTop: 20,
                paddingBottom: 10,
              }}
            >
              <Typography variant="h6" color="rgba(130, 204, 176, 1)">
                {`Logged in as ${user?.username}`}
              </Typography>
            </Grid>
            <Grid
              key={"infoTitleSpacing"}
              item
              xs={9}
              style={{
                boxShadow: "none",
                borderBottom: "rgba(140, 140, 140, 1) solid 1px",
              }}
            />
            <Grid
              key={"profileMetadata"}
              item
              xs={7}
              style={{
                boxShadow: "none",
              }}
            >
              <Grid
                container
                width={"80%"}
                marginY={1}
                style={{ marginLeft: 30 }}
              >
                <Grid
                  key={"username_label"}
                  item
                  xs={6}
                  marginY={1}
                  paddingY={1}
                  paddingLeft={3}
                  style={{
                    border: "rgba(140, 140, 140, 1) solid 1px",
                    borderRadius: 5,
                    borderRight: "none",
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    boxShadow: "none",
                    textAlign: "left",
                    backgroundColor: "#FFFDF8",
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight={300}
                    color={"rgba(140, 140, 140, 1)"}
                  >
                    {"Username:"}
                  </Typography>
                </Grid>
                <Grid
                  key={"username_value"}
                  item
                  xs={6}
                  marginY={1}
                  paddingRight={3}
                  paddingY={1}
                  style={{
                    border: "rgba(140, 140, 140, 1) solid 1px",
                    borderRadius: 5,
                    borderLeft: "none",
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    boxShadow: "none",
                    textAlign: "right",
                    backgroundColor: "#FFFDF8",
                  }}
                >
                  <Typography variant="body2" fontWeight={300}>
                    {`${user?.username}`}
                  </Typography>
                </Grid>
                <Grid
                  key={"address_label"}
                  item
                  xs={6}
                  marginY={1}
                  paddingY={1}
                  paddingLeft={3}
                  style={{
                    border: "rgba(140, 140, 140, 1) solid 1px",
                    borderRadius: 5,
                    borderRight: "none",
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    boxShadow: "none",
                    textAlign: "left",
                    backgroundColor: "#FFFDF8",
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight={300}
                    color={"rgba(140, 140, 140, 1)"}
                  >
                    {"Public Address:"}
                  </Typography>
                </Grid>
                <Grid
                  key={"username_value"}
                  item
                  xs={6}
                  marginY={1}
                  paddingRight={3}
                  paddingY={1}
                  style={{
                    border: "rgba(140, 140, 140, 1) solid 1px",
                    borderRadius: 5,
                    borderLeft: "none",
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    boxShadow: "none",
                    textAlign: "right",
                    backgroundColor: "#FFFDF8",
                  }}
                >
                  <Typography variant="body2" fontWeight={300}>
                    {`${user?.publicAddress}`}
                  </Typography>
                </Grid>
                <Grid
                  key={"twitter_username_label"}
                  item
                  xs={6}
                  marginY={1}
                  paddingY={1}
                  paddingLeft={3}
                  style={{
                    border: "rgba(140, 140, 140, 1) solid 1px",
                    borderRadius: 5,
                    borderRight: "none",
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    boxShadow: "none",
                    textAlign: "left",
                    backgroundColor: "#FFFDF8",
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight={300}
                    color={"rgba(140, 140, 140, 1)"}
                  >
                    {"Twitter Account:"}
                  </Typography>
                </Grid>
                <Grid
                  key={"twitter_username_value"}
                  item
                  xs={6}
                  marginY={1}
                  paddingRight={3}
                  paddingY={1}
                  style={{
                    border: "rgba(140, 140, 140, 1) solid 1px",
                    borderRadius: 5,
                    borderLeft: "none",
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    boxShadow: "none",
                    textAlign: "right",
                    backgroundColor: "#FFFDF8",
                  }}
                >
                  <Typography variant="body2" fontWeight={300}>
                    {twitterUsername
                      ? `${twitterUsername}`
                      : "No Twitter account linked"}
                  </Typography>
                </Grid>
                <Grid
                  key={"lens_username_label"}
                  item
                  xs={6}
                  marginY={1}
                  paddingY={1}
                  paddingLeft={3}
                  style={{
                    border: "rgba(140, 140, 140, 1) solid 1px",
                    borderRadius: 5,
                    borderRight: "none",
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    boxShadow: "none",
                    textAlign: "left",
                    backgroundColor: "#FFFDF8",
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight={300}
                    color={"rgba(140, 140, 140, 1)"}
                  >
                    {"Lens Protocol Account:"}
                  </Typography>
                </Grid>
                <Grid
                  key={"lens_username_value"}
                  item
                  xs={6}
                  marginY={1}
                  paddingRight={3}
                  paddingY={1}
                  style={{
                    border: "rgba(140, 140, 140, 1) solid 1px",
                    borderRadius: 5,
                    borderLeft: "none",
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    boxShadow: "none",
                    textAlign: "right",
                    backgroundColor: "#FFFDF8",
                  }}
                >
                  <Typography variant="body2" fontWeight={300}>
                    {user?.lensUsername ?? "No Lens account linked"}
                  </Typography>
                </Grid>
                <Grid
                  key={"profile_picture_label"}
                  item
                  xs={6}
                  marginY={1}
                  paddingY={1}
                  paddingLeft={3}
                  style={{
                    border: "rgba(140, 140, 140, 1) solid 1px",
                    borderRadius: 5,
                    borderRight: "none",
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    boxShadow: "none",
                    textAlign: "left",
                    backgroundColor: "#FFFDF8",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight={300}
                    color={"rgba(140, 140, 140, 1)"}
                  >
                    {"Profile Picture:"}
                  </Typography>
                </Grid>
                <Grid
                  key={"profile_picture_value"}
                  item
                  xs={6}
                  marginY={1}
                  paddingRight={3}
                  paddingY={1}
                  style={{
                    border: "rgba(140, 140, 140, 1) solid 1px",
                    borderRadius: 5,
                    borderLeft: "none",
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    boxShadow: "none",
                    textAlign: "right",
                    backgroundColor: "#FFFDF8",
                  }}
                >
                  {profilePicture ? (
                    <div
                      style={{
                        width: "100%",
                        marginRight: 30,
                      }}
                    >
                      <img
                        style={{ width: "40%" }}
                        src={URL.createObjectURL(profilePicture)}
                      />
                    </div>
                  ) : (
                    <img
                      style={{ width: "40%" }}
                      src={
                        user?.profilePictureId
                          ? `${process.env.REACT_APP_BACKEND_URL}/users/profilePicture/${user?.id}`
                          : user?.twitterProfileImageUrl ??
                            `https://ui-avatars.com/api/?name=${user?.username}`
                      }
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid
              key={"profileEdit"}
              item
              xs={5}
              style={{
                boxShadow: "none",
              }}
            >
              <Grid container width={"80%"} marginY={1}>
                <Grid
                  key={"username_edit"}
                  item
                  xs={12}
                  marginY={1}
                  paddingY={1}
                  paddingLeft={3}
                  style={{
                    border: "rgba(140, 140, 140, 1) solid 1px",
                    borderRadius: 5,
                    boxShadow: "none",
                    textAlign: "center",
                    backgroundColor: "#FFFDF8",
                  }}
                >
                  <div>
                    <Typography>Change username:</Typography>
                    <TextField
                      name="usernameInput"
                      style={{
                        backgroundColor: "white",
                        alignSelf: "left",
                        margin: 10,
                      }}
                      onChange={handleUsernameChange}
                      value={username}
                      variant={"outlined"}
                      size={"medium"}
                      placeholder={"Post-to-Help username"}
                    />

                    <Button
                      style={{
                        margin: 20,
                        color: "white",
                        borderColor: "white",
                      }}
                      disabled={loading}
                      variant="outlined"
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </div>
                </Grid>
                <Grid
                  key={"twitter_username_edit"}
                  item
                  xs={12}
                  marginY={1}
                  paddingY={1}
                  paddingLeft={3}
                  style={{
                    border: "rgba(140, 140, 140, 1) solid 1px",
                    borderRadius: 5,
                    boxShadow: "none",
                    textAlign: "center",
                    backgroundColor: "#FFFDF8",
                  }}
                >
                  {twitterUsername ? (
                    <div>
                      <Button
                        style={{
                          margin: 10,
                          color: "white",
                          borderColor: "white",
                          width: "70%",
                        }}
                        disabled={loading}
                        variant="outlined"
                        onClick={handleUnlinkAccount}
                      >
                        Unlink Twitter Account
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => loginWithTwitter()}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                      }}
                    >
                      <img src={twitterLogo} />
                    </Button>
                  )}
                </Grid>
                <Grid
                  key={"lens_username_edit"}
                  item
                  xs={12}
                  marginY={1}
                  paddingY={1}
                  paddingLeft={3}
                  style={{
                    border: "rgba(140, 140, 140, 1) solid 1px",
                    borderRadius: 5,
                    boxShadow: "none",
                    textAlign: "center",
                    backgroundColor: "#FFFDF8",
                  }}
                >
                  {user?.lensUsername ? (
                    <div>
                      <Button
                        style={{
                          margin: 10,
                          color: "white",
                          borderColor: "white",
                          width: "70%",
                        }}
                        disabled={loading}
                        variant="outlined"
                        onClick={unlinkLens}
                      >
                        Unlink Lens Protocol Account
                      </Button>
                    </div>
                  ) : (
                    <div
                      style={{
                        verticalAlign: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        name="lensUsernameInput"
                        style={{
                          backgroundColor: "white",
                          alignSelf: "left",
                          margin: 10,
                        }}
                        onChange={({ target: { value } }) => {
                          setLensUsername(value);
                        }}
                        value={lensUsername}
                        variant={"outlined"}
                        size={"medium"}
                        placeholder={"Lens username"}
                      />
                      <Button
                        onClick={() => linkLens()}
                        style={{
                          border: "none",
                          margin: 20,
                        }}
                      >
                        {"Link Lens"}
                      </Button>
                    </div>
                  )}
                </Grid>
                <Grid
                  key={"username_edit"}
                  item
                  xs={12}
                  marginY={1}
                  paddingY={1}
                  paddingLeft={3}
                  style={{
                    border: "rgba(140, 140, 140, 1) solid 1px",
                    borderRadius: 5,
                    boxShadow: "none",
                    textAlign: "center",
                    backgroundColor: "#FFFDF8",
                  }}
                >
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <div
                        style={{
                          backgroundColor: "black",
                          width: "80%",
                          borderRadius: 25,
                          paddingTop: 10,
                          paddingBottom: 10,
                          marginTop: 20,
                          marginBottom: 20,
                        }}
                      >
                        <Typography variant="body1" color="white">
                          Drop the file here!
                        </Typography>
                      </div>
                    ) : (
                      <Button
                        style={{
                          margin: 10,
                          color: "white",
                          borderColor: "white",
                          width: "70%",
                        }}
                        disabled={loading}
                        variant="outlined"
                      >
                        Upload New Profile Picture
                      </Button>
                    )}
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
      <Button
        style={{
          margin: 20,
          color: "white",
          borderColor: "white",
        }}
        variant="outlined"
        onClick={onLoggedOut}
      >
        Logout
      </Button>
    </div>
  );
};
