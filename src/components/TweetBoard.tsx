import React from "react";
import { Grid, Typography } from "@mui/material";

import { IAffiliateData } from "../pages/Campaign/types";
import { TweetWidget } from "./TweetWidget";

export const TweetBoard = (props: {
  affiliateData: IAffiliateData;
  campaignId: string;
  fetchCampaign: () => void;
}): JSX.Element => {
  const { affiliateData, campaignId, fetchCampaign } = props;
  let rows: JSX.Element[] = [];

  const data = React.useMemo(
    () =>
      Object.values(affiliateData).sort(
        (a, b) => b.scorePost + b.scoreSupport - (a.scorePost + a.scoreSupport)
      ),
    [affiliateData]
  );

  if (data.length !== 0) {
    data.forEach((participant, index) => {
      participant.tweets.mentions.forEach((tweet) => {
        rows.push(
          <Grid
            key={`username-label-${tweet.id}`}
            item
            xs={4}
            marginTop={2}
            marginBottom={2}
            style={{
              border: "none",
              boxShadow: "none",
              textAlign: "left",
            }}
          >
            <TweetWidget
              score={0}
              tweetId={tweet.id}
              authorUserId={participant.userId}
              type="Mention"
              campaignId={campaignId}
              fetchCampaign={fetchCampaign}
              tweet={tweet}
              tweetScoresByUser={participant.tweetScoresById[tweet.id]}
            />
          </Grid>
        );
      });
      participant.tweets.referrals.forEach((tweet) => {
        rows.push(
          <Grid
            key={`username-label-${tweet.id}`}
            item
            xs={4}
            marginTop={2}
            marginBottom={2}
            style={{
              border: "none",
              boxShadow: "none",
              textAlign: "left",
            }}
          >
            <TweetWidget
              score={0}
              tweetId={tweet.id}
              authorUserId={participant.userId}
              type="Referral"
              campaignId={campaignId}
              fetchCampaign={fetchCampaign}
              tweet={tweet}
              tweetScoresByUser={participant.tweetScoresById[tweet.id]}
            />
          </Grid>
        );
      });
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
          {"LIVE FEED"}
        </Typography>
      </div>
      <div style={{ padding: 30, paddingBottom: 10 }}>
        <Grid container spacing={3} width={"100%"}>
          {rows}
        </Grid>
      </div>
    </div>
  );
};
