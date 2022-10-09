import {
  Avatar,
  CircularProgress,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";

import { Leaderboard } from "../../components";
import { PosterCount } from "../../components/PosterCount";
import { TweetBoard } from "../../components/TweetBoard";
import { AuthContext } from "../../contexts";
import { CampaignContext } from "../../contexts/CampaignContext";

import { IAffiliateData } from "./types";
import { generateMerkleTree, generateProof } from "../../web3/merkleTree";
import { CampaignCarousel } from "../../components/CampaignCarousel";

export const Campaign = (): JSX.Element => {
  const { campaigns } = React.useContext(CampaignContext);
  const { user, web3Client } = React.useContext(AuthContext);
  const { id } = useParams<{ id: string }>();
  const storedCampaign = campaigns.find((i) => i.id === id);
  const [campaign, setCampaign] = React.useState(storedCampaign);
  const [referral, setReferral] = React.useState(
    user?.id && storedCampaign?.participantUserInfo?.[user?.id]
  );
  const [affiliateData, setAffiliateData] = React.useState<
    IAffiliateData | undefined
  >(undefined);
  const [contractAddress, setContractAddress] = React.useState(
    campaign?.contractAddress
  );
  const [campaignBalance, setCampaignBalance] = React.useState<
    number | undefined
  >();
  const [rewardsUploaded, setRewardsUploaded] = React.useState(false);

  const addFunds = React.useCallback(
    async (amount: number) => {
      console.log(web3Client);
      console.log(contractAddress);
      if (web3Client && user && contractAddress) {
        await web3Client.addCampaignFunds(
          amount,
          contractAddress,
          user.publicAddress
        );

        setCampaignBalance(amount);
      }
    },
    [web3Client, contractAddress, user]
  );

  // Fetch the campaign itself from our DB

  const fetchCampaign = React.useCallback(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/campaigns/${id}`)
      .then((value) => {
        setCampaign(value.data);
        if (!contractAddress) {
          setContractAddress(value.data.contractAddress);
        }
        setReferral(user?.id && value.data.participantUserInfo?.[user?.id]);
      });
    // Fetch our referral data from the DB
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/campaigns/referrals/${id}`)
      .then((value) => {
        setAffiliateData(value.data);
      });
  }, [id]);

  React.useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  // Fetch the balance with the contract address available
  React.useEffect(() => {
    if (contractAddress && web3Client) {
      web3Client
        .getCampaignBalance(contractAddress, user?.publicAddress)
        .then((balance) => setCampaignBalance(balance));
      web3Client
        .doesCampaignHaveRoot(contractAddress)
        .then((value) => setRewardsUploaded(value));
    }
  }, [contractAddress, web3Client]);

  const openSeaRef = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    openSeaRef.current?.contentWindow?.location.href;
  }, [openSeaRef.current]);

  let totalClicks = 0;
  let totalPayout = 0;
  let timeKey: string | undefined;
  let times: string[] = [];
  let currentAffiliateBalance:
    | { value: number; isClaimed: boolean }
    | undefined;
  if (affiliateData) {
    Object.values(affiliateData).forEach((data) => {
      totalClicks += data.clickCount;
      totalPayout += data.claimedBalance;
    });
    if (affiliateData?.[`${user?.id}`]) {
      times = Object.keys(affiliateData?.[`${user?.id}`].rewardedBalance);
      timeKey = times[times.length - 1];
      currentAffiliateBalance =
        affiliateData?.[`${user?.id}`].rewardedBalance[timeKey];
    }
  }

  const claimReward = React.useCallback(async () => {
    if (
      affiliateData?.[`${user?.id}`] &&
      timeKey &&
      currentAffiliateBalance &&
      user?.publicAddress &&
      campaign?.contractAddress &&
      web3Client
    ) {
      const allocations = campaign?.rewardedAllocations[timeKey];
      if (allocations && web3Client) {
        const merkleTree = generateMerkleTree(allocations);
        const proof = generateProof(
          merkleTree,
          currentAffiliateBalance.value,
          user?.publicAddress
        );
        await web3Client.claimFromCampaignContract(
          user.publicAddress,
          campaign.contractAddress,
          proof,
          currentAffiliateBalance.value
        );
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/campaigns/acceptReward/${campaign.id}`,
          {
            campaignId: campaign.id,
            userId: user?.id,
            timeKey,
          }
        );
      }
    }
    return { amount: 0, budget: campaignBalance };
  }, [
    affiliateData?.[`${user?.id}`],
    timeKey,
    currentAffiliateBalance,
    user?.publicAddress,
    campaign?.rewardedAllocations,
    campaign?.contractAddress,
    web3Client,
  ]);

  if (!campaign || !user) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: 50,
        }}
      >
        <CircularProgress />
      </div>
    );
  } else {
    const campaignInfoElement = (
      <>
        <Grid
          key={"campaign_tweet_board"}
          item
          xs={12}
          width={"100%"}
          marginX={-3.5}
        >
          <div
            style={{
              backgroundColor: "white",
              paddingBottom: 45,
              borderRadius: 10,
              border: "rgba(140, 140, 140, 1) solid 1px",
            }}
          >
            {affiliateData && campaign.id ? (
              <TweetBoard
                affiliateData={affiliateData}
                campaignId={campaign.id}
                fetchCampaign={fetchCampaign}
              />
            ) : null}
          </div>
        </Grid>
        <Grid
          key={"campaign_leaderboard"}
          item
          xs={12}
          width={"100%"}
          marginX={-3.5}
        >
          <div
            style={{
              backgroundColor: "white",
              paddingBottom: 45,
              borderRadius: 10,
              border: "rgba(140, 140, 140, 1) solid 1px",
            }}
          >
            {affiliateData ? (
              <Leaderboard affiliateData={affiliateData} />
            ) : null}
          </div>
        </Grid>
      </>
    );
    return (
      <div
        style={{
          paddingRight: 150,
          paddingLeft: 150,
          paddingTop: 100,
          paddingBottom: 100,
        }}
      >
        <Grid container spacing={4} width={"100%"}>
          <Grid key={"campaign_info"} item xs={12}>
            <Grid
              container
              spacing={4}
              width={"100%"}
              style={{
                boxShadow: "none",
                textAlign: "right",
                background: "white",
                padding: 60,
                borderRadius: 10,
                border: "rgba(140, 140, 140, 1) solid 1px",
                minHeight: "400px",
              }}
            >
              <Grid key={"campaign_metadata"} item xs={6}>
                <div
                  style={{
                    width: "100%",
                    textAlign: "left",
                    alignContent: "center",
                    alignItems: "center",
                    verticalAlign: "center",
                  }}
                >
                  <Typography
                    variant="h3"
                    style={{
                      paddingBottom: 20,
                      fontWeight: "bolder",
                      color: "#7A28C6",
                    }}
                  >
                    {campaign?.name.toUpperCase()}
                  </Typography>
                  <Typography
                    style={{
                      marginBottom: 5,
                      color: "#1DA1F2",
                      fontWeight: "bolder",
                    }}
                    variant="body2"
                  >
                    {`@${campaign.twitterUsername}`}
                  </Typography>
                  <Typography
                    style={{
                      marginBottom: 20,
                      fontWeight: "bolder",
                    }}
                    variant="body2"
                  >
                    {`${campaign?.type.toUpperCase()} - `}
                    <Link href={campaign.pageLink}>{campaign.pageLink}</Link>
                  </Typography>
                  <Typography style={{ marginBottom: 20 }} variant="body2">
                    {campaign?.description}
                  </Typography>
                </div>
              </Grid>
              <Grid
                key={"grid_avatar"}
                item
                xs={5}
                style={{
                  border: "none",
                  boxShadow: "none",
                  textAlign: "center",
                  alignContent: "center",
                  alignItems: "center",
                  verticalAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "100%",
                  }}
                >
                  <Avatar
                    src={`${process.env.REACT_APP_BACKEND_URL}/campaigns/logo/${campaign.id}`}
                    sx={{ width: 240, height: 240 }}
                    style={{
                      display: "block",
                      marginLeft: "auto",
                      marginRight: "auto",
                      marginTop: "auto",
                      marginBottom: "auto",
                    }}
                    imgProps={{
                      style: {
                        objectFit: "contain",
                      },
                    }}
                  />
                </div>
              </Grid>
              <Grid key={"links_created"} xs={1} item>
                <PosterCount
                  campaign={campaign}
                  positionLeft={40}
                  positionBottom={60}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            key={"campaign_carousel"}
            item
            xs={12}
            width={"100%"}
            marginX={-3.5}
          >
            <CampaignCarousel
              campaign={campaign}
              hasUserJoined={Boolean(referral)}
              rewardBalance={currentAffiliateBalance?.value}
              claimReward={claimReward}
              addFunds={addFunds}
            />
          </Grid>

          {campaignInfoElement}
        </Grid>
      </div>
    );
  }
};
