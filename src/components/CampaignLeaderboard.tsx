import React from "react";
import { Avatar, CircularProgress, Grid, Typography } from "@mui/material";
import { ICampaignLeaderboardData } from "../pages/Campaign/types";

export const CampaignLeaderboard = (props: {
  leaderboardData: ICampaignLeaderboardData;
}): JSX.Element => {
  const { leaderboardData } = props;
  let rows: JSX.Element[] = [];

  const sortedData = React.useMemo(
    () =>
      Object.entries(leaderboardData).sort(
        (a, b) =>
          b[1].totalScorePost +
          b[1].totalScoreSupport -
          (a[1].totalScorePost + a[1].totalScoreSupport)
      ),
    [leaderboardData]
  );

  if (sortedData.length != 0) {
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
          key={`campaign-label`}
          item
          xs={5}
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
            {`Campaign Name`}
          </Typography>
        </Grid>
        <Grid
          key={`total-score-label`}
          item
          xs={2}
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
            {`Poster Score`}
          </Typography>
        </Grid>
        <Grid
          key={`supporter-score-label`}
          item
          xs={2}
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
            {`Supporter Score`}
          </Typography>
        </Grid>
      </>
    );

    sortedData.forEach(([id, value], index) => {
      const campaignName = value.campaignName;
      rows.push(
        <>
          <Grid
            key={`position-${id}`}
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
                height: "70%",
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
              >
                {`${index + 1}`}
              </Typography>
            </div>
          </Grid>
          <Grid
            key={`campaign-${id}`}
            item
            xs={5}
            marginY={1}
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
                marginTop: -10,
              }}
              imgProps={{
                style: {
                  objectFit: "contain",
                },
              }}
              src={`${process.env.REACT_APP_BACKEND_URL}/campaigns/logo/${id}`}
            />
            <Typography
              variant="body2"
              fontWeight={600}
              textOverflow={"ellipsis"}
              style={{ paddingLeft: 60 }}
            >
              {`${campaignName}`}
            </Typography>
          </Grid>
          <Grid
            key={`total-score-${id}`}
            item
            xs={2}
            marginY={1}
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
              variant="body2"
              fontWeight={600}
              textOverflow={"ellipsis"}
            >
              {`${value.totalScorePost + value.totalScoreSupport} Pts`}
            </Typography>
          </Grid>
          <Grid
            key={`poster-score-${id}`}
            item
            xs={2}
            marginY={1}
            style={{
              boxShadow: "none",
              textAlign: "left",
              borderTop: "solid rgba(140, 140, 140, 1) 1px",
              borderBottom: "solid rgba(140, 140, 140, 1) 1px",
              height: 72,
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              {`${value.totalScorePost}`}
            </Typography>
          </Grid>
          <Grid
            key={`supporter-score-${id}`}
            item
            xs={2}
            marginY={1}
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
            <Typography variant="body2" fontWeight={600}>
              {`${value.totalScoreSupport}`}
            </Typography>
          </Grid>
        </>
      );
    });
  } else {
    rows.push(
      <>
        <Grid xs={12} item marginY={2}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: 50,
            }}
          >
            <CircularProgress />
          </div>
        </Grid>
      </>
    );
  }

  return (
    <div>
      <Typography
        variant="h4"
        style={{
          fontWeight: "bolder",
          borderBottom: "rgba(140, 140, 140, 1) solid 1px",
          padding: 36,
        }}
      >
        {"CAMPAIGN LEADERBOARD"}
      </Typography>
      <div
        style={{
          paddingTop: 36,
          paddingBottom: 36,
        }}
      >
        <Grid container spacing={3} width={"100%"}>
          {rows}
        </Grid>
      </div>
    </div>
  );
};
