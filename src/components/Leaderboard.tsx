import React from "react";
import { Avatar, Grid, Typography } from "@mui/material";
import { IAffiliateData } from "../pages/Campaign/types";
import { AuthContext } from "../contexts";

export const Leaderboard = (props: {
  affiliateData: IAffiliateData;
}): JSX.Element => {
  const { affiliateData } = props;
  let rows: JSX.Element[] = [];
  const { user } = React.useContext(AuthContext);

  const data = React.useMemo(
    () =>
      Object.values(affiliateData).sort(
        (a, b) => b.scorePost + b.scoreSupport - (a.scorePost + a.scoreSupport)
      ),
    [affiliateData]
  );
  if (data.length !== 0) {
    rows.push(
      <>
        <Grid
          key={`position-label`}
          item
          xs={1}
          marginTop={2}
          style={{
            border: "none",
            boxShadow: "none",
            textAlign: "left",
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight={300}
            color={"rgba(140, 140, 140, 1)"}
          >
            {""}
          </Typography>
        </Grid>
        <Grid
          key={`username-label`}
          item
          xs={5}
          marginTop={2}
          style={{
            border: "none",
            boxShadow: "none",
            textAlign: "left",
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight={300}
            color={"rgba(140, 140, 140, 1)"}
          >
            {`Username`}
          </Typography>
        </Grid>
        <Grid
          key={`score-label`}
          item
          xs={2}
          marginTop={2}
          style={{
            border: "none",
            boxShadow: "none",
            textAlign: "left",
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight={300}
            color={"rgba(140, 140, 140, 1)"}
          >
            {`Total Score`}
          </Typography>
        </Grid>
        <Grid
          key={`poster-score-label`}
          item
          xs={2}
          marginTop={2}
          style={{
            border: "none",
            boxShadow: "none",
            textAlign: "left",
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight={300}
            color={"rgba(140, 140, 140, 1)"}
          >
            {"Poster Score"}
          </Typography>
        </Grid>
        <Grid
          key={`supporter-score-label`}
          item
          xs={2}
          marginTop={2}
          style={{
            border: "none",
            boxShadow: "none",
            textAlign: "left",
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight={300}
            color={"rgba(140, 140, 140, 1)"}
          >
            {"Supporter Score"}
          </Typography>
        </Grid>
      </>
    );
    data.forEach((data, index) => {
      const isCurrentUser = data.userId === `${user?.id}`;
      rows.push(
        <>
          <Grid
            key={`position-${data.username}`}
            item
            marginY={2}
            xs={1}
            style={{
              border: "none",
              boxShadow: "none",
              overflow: "scroll",
            }}
          >
            <div
              style={{
                border: "solid rgba(140, 140, 140, 1) 1px",
                width: "25%",
                height: "50%",
                textAlign: "center",
                borderRadius: "100%",
                float: "right",
                marginRight: "21%",
              }}
            >
              <Typography
                variant="body1"
                fontWeight={"bolder"}
                textOverflow={"ellipsis"}
                style={
                  isCurrentUser
                    ? {
                        color: "#7A28C6",
                      }
                    : {}
                }
              >
                {`${index + 1}`}
              </Typography>
            </div>
          </Grid>
          <Grid
            key={`username-${data.username}`}
            item
            xs={5}
            marginY={2}
            style={{
              boxShadow: "none",
              textAlign: "left",
              overflow: "scroll",
              border: "solid rgba(140, 140, 140, 1) 1px",
              borderRadius: 5,
              borderRight: "none",
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              height: 72,
            }}
          >
            <Avatar
              sx={{ width: 49, height: 49 }}
              style={{
                position: "absolute",
                marginTop: -12,
              }}
              imgProps={{
                style: {
                  objectFit: "contain",
                },
              }}
              alt={data.username}
              src={`${process.env.REACT_APP_BACKEND_URL}/users/profilePicture/${data.userId}`}
            />
            <Typography
              variant="body1"
              fontWeight={"bolder"}
              textOverflow={"ellipsis"}
              style={
                isCurrentUser
                  ? {
                      color: "#7A28C6",
                      paddingBottom: 15,
                      paddingLeft: 60,
                    }
                  : { paddingBottom: 15, paddingLeft: 60 }
              }
            >
              {data.username.length > 16
                ? `${data.username.substring(0, 16)}...`
                : data.username}
            </Typography>
          </Grid>
          <Grid
            key={`score-${data.username}`}
            item
            xs={2}
            marginY={2}
            style={{
              border: "none",
              boxShadow: "none",
              textAlign: "left",
              borderTop: "solid rgba(140, 140, 140, 1) 1px",
              borderBottom: "solid rgba(140, 140, 140, 1) 1px",
              height: 72,
            }}
          >
            <Typography
              variant="body1"
              fontWeight={"bolder"}
              style={isCurrentUser ? { color: "#7A28C6" } : {}}
            >
              {`${(data.scorePost ?? 0) + (data.scoreSupport ?? 0)}`}
            </Typography>
          </Grid>
          <Grid
            key={`tweet-count-${data.username}`}
            item
            xs={2}
            marginY={2}
            style={{
              border: "none",
              boxShadow: "none",
              textAlign: "left",
              borderTop: "solid rgba(140, 140, 140, 1) 1px",
              borderBottom: "solid rgba(140, 140, 140, 1) 1px",
              verticalAlign: "center",
              height: 72,
            }}
          >
            <Typography
              variant="body2"
              fontWeight={isCurrentUser ? 600 : 300}
              style={isCurrentUser ? { color: "#7A28C6" } : {}}
            >
              {`${data.scorePost ?? 0}`}
            </Typography>
          </Grid>
          <Grid
            key={`claimed-balance-${data.username}`}
            item
            xs={2}
            marginY={2}
            style={{
              boxShadow: "none",
              textAlign: "left",
              border: "solid rgba(140, 140, 140, 1) 1px",
              borderLeft: "none",
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
              height: 72,
            }}
          >
            <Typography
              variant="body1"
              fontWeight={"bolder"}
              style={isCurrentUser ? { color: "#7A28C6" } : {}}
            >
              {`${data.scoreSupport ?? 0}`}
            </Typography>
          </Grid>
        </>
      );
    });
  } else {
    rows.push(
      <>
        <Grid
          key={`no-users-label`}
          item
          xs={12}
          style={{
            border: "none",
            boxShadow: "none",
            textAlign: "left",
            overflow: "scroll",
            marginLeft: 25,
          }}
        >
          <Typography
            variant="body2"
            fontWeight={300}
            textOverflow={"ellipsis"}
          >
            {`No referrers yet. Join now!`}
          </Typography>
        </Grid>
      </>
    );
  }
  return (
    <div style={{ paddingTop: 30 }}>
      <div
        style={{
          width: "100%",
          textAlign: "left",
          borderBottom: "rgba(140, 140, 140, 1) solid 1px",
        }}
      >
        <Typography
          variant="h5"
          style={{
            marginBottom: 24,
            marginLeft: 25,
            fontWeight: "bolder",
            color: "#7A28C6",
          }}
        >
          {"CAMPAIGN LEADERBOARD"}
        </Typography>
      </div>
      <Grid container spacing={3} width={"100%"}>
        {rows}
      </Grid>
    </div>
  );
};
