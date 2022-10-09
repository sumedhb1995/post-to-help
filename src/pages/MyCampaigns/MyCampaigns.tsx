import { Add } from "@mui/icons-material";
import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import React from "react";

import CampaignCard from "../../components/CampaignCard";
import { CampaignContext } from "../../contexts/CampaignContext";

import { ICampaign } from "../../interfaces";
import axios from "axios";
import { ICampaignLeaderboardData } from "../Campaign/types";
import { CampaignLeaderboard } from "../../components/CampaignLeaderboard";

import poweredByImage from "../../assets/powered-by.png";

const LB_LIMIT = 5;

export const MyCampaigns = (): JSX.Element => {
  const { campaigns } = React.useContext(CampaignContext);
  const [fetchedCampaigns, setFetchedCampaigns] = React.useState([]);
  const [leaderboardData, setLeaderboardData] =
    React.useState<ICampaignLeaderboardData>({});

  React.useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/campaigns`)
      .then((value) => {
        setFetchedCampaigns(value.data);
      });
  }, []);

  React.useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/campaigns/campaignLeaderboard/${LB_LIMIT}`
      )
      .then((value) => {
        setLeaderboardData(value.data);
      });
  }, []);

  const campaignCards = campaigns.map((campaign) => (
    <Grid
      key={campaign.id}
      item
      xs={3}
      style={{ border: "none", boxShadow: "none" }}
    >
      <CampaignCard campaign={campaign as unknown as ICampaign} />
    </Grid>
  ));
  fetchedCampaigns.forEach((campaign: ICampaign, index: number) => {
    campaignCards.push(
      <Grid
        key={`grid-item-${index} - ${campaign.id}`}
        item
        xs={4}
        style={{ border: "none", boxShadow: "none" }}
      >
        <CampaignCard campaign={campaign} />
      </Grid>
    );
  });
  return (
    <div
      style={{
        textAlign: "left",
        paddingRight: 50,
        paddingLeft: 50,
        paddingTop: 20,
        paddingBottom: 100,
        background: "white",
      }}
    >
      <div
        style={{
          border: "rgba(140, 140, 140, 1) solid 1px",
          marginTop: 50,
          textAlign: "center",
          borderRadius: 20,
          backgroundColor: "#F4F4F4",
        }}
      >
        <div
          style={{
            padding: 36,
          }}
        >
          <Grid container spacing={4}>
            <Grid key={`grid-item-title`} item xs={12}>
              <div
                style={{
                  textAlign: "center",
                  paddingTop: 4,
                }}
              >
                <Typography
                  variant="h2"
                  fontWeight="bolder"
                  color={"rgba(122, 40, 198, 1)"}
                >
                  Explore Organizations
                </Typography>
                <Typography variant="subtitle1" fontWeight="bolder">
                  Earn rewards by posting about the causes that matter
                </Typography>
              </div>
            </Grid>
          </Grid>
        </div>

        <div style={{ padding: 36 }}>
          <Grid container spacing={4}>
            {fetchedCampaigns.length !== 0 ? (
              campaignCards
            ) : (
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
            )}
          </Grid>
        </div>
      </div>
      <div
        style={{
          border: "rgba(140, 140, 140, 1) solid 1px",
          borderRadius: 20,
          marginBottom: 50,
          marginTop: 50,
        }}
      >
        <CampaignLeaderboard leaderboardData={leaderboardData} />
      </div>
      <div style={{ width: "100%", textAlign: "center" }}>
        <Typography
          variant="subtitle1"
          fontWeight="bolder"
          color={"black"}
          style={{ marginBottom: 5 }}
        >
          Powered by:
        </Typography>
        <img style={{ maxWidth: 800 }} src={poweredByImage} />
      </div>
    </div>
  );
};
