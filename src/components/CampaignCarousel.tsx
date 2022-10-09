import {
  Paper,
  Button,
  Typography,
  Icon,
  Grid,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { AuthContext } from "../contexts";
import { ICampaign } from "../interfaces";
import twitterIcon from "../assets/twitter-logo.png";
import lensterIcon from "../assets/lenster-logo.png";
import tokenIcon from "../assets/token.png";
import helpImage from "../assets/help.png";

interface ICampaignCarouselProps {
  campaign: ICampaign;
  hasUserJoined: boolean;
  rewardBalance?: number;
  claimReward: () => Promise<{
    amount: number;
    budget: number | undefined;
  }>;
  addFunds: (amount: number) => Promise<void>;
}

export function CampaignCarousel(props: ICampaignCarouselProps) {
  const [index, setIndex] = useState(0);
  const [donationAmount, setDonationAmount] = useState(0);

  return (
    <div>
      <Carousel
        height={400}
        autoPlay={false}
        swipe={false}
        navButtonsAlwaysInvisible={true}
        index={index}
        animation={"fade"}
        navButtonsWrapperProps={{ style: { marginTop: 30 } }}
      >
        <StartItem
          setIndex={setIndex}
          hasUserJoined={props.hasUserJoined}
          campaign={props.campaign}
        />
        <PosterItem
          setIndex={setIndex}
          hasUserJoined={props.hasUserJoined}
          campaign={props.campaign}
          rewardBalance={props.rewardBalance}
          claimReward={props.claimReward}
        />
        <DonateItem
          campaign={props.campaign}
          setIndex={setIndex}
          addFunds={props.addFunds}
          setDonationAmount={setDonationAmount}
        />
        <DonateConfirmationItem
          campaign={props.campaign}
          donationAmount={donationAmount}
        />
      </Carousel>
    </div>
  );
}

interface IStartItemProps {
  setIndex: (index: number) => void;
  hasUserJoined: boolean;
  campaign: ICampaign;
}

function StartItem(props: IStartItemProps) {
  const { user } = useContext(AuthContext);
  return (
    <Paper style={{ height: 400 }}>
      <img
        style={{ width: 300, paddingTop: 70, paddingBottom: 20 }}
        src={helpImage}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            float: "left",
            height: "68px",
            width: "262px",
            marginLeft: "30%",
          }}
        >
          <Button
            style={{
              height: "68px",
              width: "262px",
              textAlign: "center",
              borderRadius: "14px",
              backgroundColor: "#F4F4F4",
              border: "none",
            }}
            onClick={() => {
              props.setIndex(2);
            }}
          >
            <Typography variant="subtitle1" fontWeight="bolder" color={"black"}>
              Join as a Donor!
            </Typography>
          </Button>
          <Typography
            variant="body2"
            fontWeight="bolder"
            color={"black"}
            style={{
              width: "262px",
            }}
          >
            Send funds to your cause!
          </Typography>
        </div>
        <div
          style={{
            float: "right",
            height: "68px",
            width: "262px",
            marginRight: "30%",
          }}
        >
          <Button
            style={{
              marginRight: "30%",
              background:
                "linear-gradient(239.88deg, #70D4FF 13.39%, #4C78EA 41.38%, #8511BC 86.64%)",
              border: "none",
              borderRadius: "14px",
              height: "68px",
              width: "262px",
            }}
            onClick={() => {
              if (!props.hasUserJoined) {
                axios
                  .post(
                    `${process.env.REACT_APP_BACKEND_URL}/campaigns/join/${props.campaign.id}`,
                    {
                      campaignId: props.campaign.id,
                      userId: user?.id,
                    }
                  )
                  .then((response) => {
                    props.setIndex(1);
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              } else {
                props.setIndex(1);
              }
            }}
          >
            <Typography variant="subtitle1" fontWeight="bolder" color={"white"}>
              Join as a Poster!
            </Typography>
          </Button>
          <Typography
            variant="body2"
            fontWeight="bolder"
            color={"black"}
            style={{
              width: "262px",
            }}
          >
            Earn rewards by posting about the causes that interest you!
          </Typography>
        </div>
      </div>
    </Paper>
  );
}

interface IPosterItemProps {
  setIndex: (index: number) => void;
  hasUserJoined: boolean;
  campaign: ICampaign;
  rewardBalance?: number;
  claimReward: () => Promise<{
    amount: number;
    budget: number | undefined;
  }>;
}

function PosterItem(props: IPosterItemProps) {
  const { user, web3Client } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const { campaign } = props;
  return (
    <Paper style={{ height: 400 }}>
      <div style={{ flex: 1, paddingTop: 70 }}>
        <Typography
          variant="h4"
          fontWeight="bolder"
          color={"black"}
          style={{
            paddingTop: 20,
            paddingBottom: 20,
            textAlign: "center",
          }}
        >
          {props.campaign.name}
        </Typography>
        <div
          style={{
            float: "left",
            height: "48px",
            width: "400px",
            marginLeft: "10%",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bolder"
            color={"black"}
            style={{
              float: "left",
              height: 60,
              width: 48,
              background: "#F8F0FF",
              borderRadius: 14,
              verticalAlign: "middle",
              paddingTop: 30,
            }}
          >
            A
          </Typography>
          <div style={{ float: "right" }}>
            <Typography
              variant="subtitle1"
              fontWeight="bolder"
              color={"black"}
              style={{ width: 340 }}
            >
              Support and create posts mentioning:
            </Typography>
            <Typography
              style={{
                color: "#1DA1F2",
                fontWeight: "bolder",
              }}
              variant="body2"
            >
              <Icon>
                <img
                  src={twitterIcon}
                  height={20}
                  style={{
                    position: "relative",
                  }}
                />
              </Icon>
              {`@${campaign.twitterUsername}`}
            </Typography>
            {campaign.lensUsername ? (
              <Typography
                style={{
                  color: "rgba(122, 40, 198, 1)",
                  fontWeight: "bolder",
                }}
                variant="body2"
              >
                <Icon>
                  <img
                    src={lensterIcon}
                    height={18}
                    style={{
                      position: "relative",
                      marginBottom: 2,
                    }}
                  />
                </Icon>

                {`@${campaign.lensUsername}`}
              </Typography>
            ) : null}
          </div>
        </div>
        <div
          style={{
            float: "right",
            height: "68px",
            width: "400px",
            marginRight: "10%",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bolder"
            color={"black"}
            style={{
              float: "left",
              height: 60,
              width: 48,
              background: "#F8F0FF",
              borderRadius: 14,
              verticalAlign: "middle",
              paddingTop: 30,
            }}
          >
            B
          </Typography>
          <div style={{ float: "right", width: 340 }}>
            <Typography variant="subtitle1" fontWeight="bolder" color={"black"}>
              Earn rewards by liking, commenting, and mirroring/retweeting the
              campaign posts and receiving responses on your posts
            </Typography>
          </div>
        </div>
      </div>
      <Grid container spacing={3} width={"100%"}>
        <Grid
          key={`reward-label`}
          item
          xs={4}
          marginTop={2}
          style={{
            border: "none",
            boxShadow: "none",
            textAlign: "right",
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight={300}
            color={"rgba(140, 140, 140, 1)"}
          >
            {`Current Rewards: `}
          </Typography>
          <Typography variant="h4" fontWeight={300} color={"black"}>
            {`${props.rewardBalance ?? 0} PPT`}
          </Typography>
        </Grid>
        <Grid
          key={`donate-label`}
          item
          xs={4}
          marginTop={2}
          style={{
            border: "none",
            boxShadow: "none",
          }}
        >
          <Button
            style={{
              background:
                "linear-gradient(239.88deg, #70D4FF 13.39%, #4C78EA 41.38%, #8511BC 86.64%)",
              border: "none",
              borderRadius: "14px",
              height: "68px",
              width: "220px",
            }}
            onClick={() => {
              props.setIndex(2);
            }}
          >
            <Typography variant="h5" fontWeight={300} color={"white"}>
              {`Donate`}
            </Typography>
          </Button>
        </Grid>
        <Grid
          key={`claim-label`}
          item
          xs={4}
          marginTop={2}
          style={{
            border: "none",
            boxShadow: "none",
            textAlign: "left",
          }}
        >
          <Button
            style={{
              backgroundColor: "#F4F4F4",
              border: "none",
              borderRadius: "14px",
              height: "68px",
              width: "220px",
            }}
            onClick={() => {
              setIsLoading(true);
              props.claimReward().then(() => setIsLoading(true));
            }}
          >
            <Typography variant="h5" fontWeight={300} color={"black"}>
              {isLoading ? (
                <CircularProgress
                  size={20}
                  style={{
                    marginRight: 5,
                    color: "white",
                  }}
                />
              ) : null}
              {`Claim Rewards`}
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

interface IDonateItemProps {
  campaign: ICampaign;
  setIndex: (index: number) => void;
  setDonationAmount: (amount: number) => void;
  addFunds: (amount: number) => Promise<void>;
}

function DonateItem(props: IDonateItemProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(0);

  const handleAmountChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseInt(value));
  };

  return (
    <Paper style={{ height: 400 }}>
      <div style={{ flex: 1, paddingTop: 70, alignContent: "center" }}>
        <Typography
          variant="h4"
          fontWeight="bolder"
          color={"black"}
          style={{
            paddingTop: 20,
            paddingBottom: 20,
            textAlign: "center",
          }}
        >
          {`Donate to ${props.campaign.name}`}
        </Typography>
        <div
          style={{
            alignContent: "center",
          }}
        >
          <TextField
            name="amountInput"
            style={{
              backgroundColor: "white",
            }}
            onChange={handleAmountChange}
            value={amount}
            variant={"outlined"}
            size={"medium"}
            type={"number"}
            placeholder={"100 PPT"}
            error={!amount || amount <= 0}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Icon>
                    <img src={tokenIcon} height={20} />
                  </Icon>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <br />
        <Button
          style={{
            background:
              "linear-gradient(239.88deg, #70D4FF 13.39%, #4C78EA 41.38%, #8511BC 86.64%)",
            border: "none",
            borderRadius: "14px",
            height: "68px",
            width: "220px",
          }}
          onClick={() => {
            setIsLoading(true);
            props.addFunds(amount).then(() => {
              setIsLoading(false);
              props.setDonationAmount(amount);
              props.setIndex(3);
            });
          }}
        >
          <Typography variant="h5" fontWeight={300} color={"white"}>
            {isLoading ? (
              <CircularProgress
                size={20}
                style={{
                  marginRight: 5,
                  color: "white",
                }}
              />
            ) : null}
            {`Donate`}
          </Typography>
        </Button>
      </div>
    </Paper>
  );
}

interface IDonateConfirmationItemProps {
  campaign: ICampaign;
  donationAmount: number;
}

function DonateConfirmationItem(props: IDonateConfirmationItemProps) {
  const { campaign } = props;

  return (
    <Paper style={{ height: 400 }}>
      <div style={{ flex: 1, paddingTop: 70, alignContent: "center" }}>
        <Typography
          variant="h4"
          fontWeight="bolder"
          color={"black"}
          style={{
            paddingTop: 20,
            paddingBottom: 20,
            textAlign: "center",
          }}
        >
          {`Thank you!`}
        </Typography>
        <Typography
          variant="subtitle1"
          fontWeight="bolder"
          color={"black"}
          style={{
            paddingTop: 20,
            textAlign: "center",
          }}
        >
          {`You just donated`}
          <Typography
            variant="h6"
            fontWeight="bolder"
            color={"rgba(122, 40, 198, 1)"}
            style={{
              textAlign: "center",
            }}
          >
            {`${props.donationAmount} PPT`}
          </Typography>
          {`to`}
        </Typography>
        <Typography
          variant="h4"
          fontWeight="bolder"
          color={"black"}
          style={{
            paddingBottom: 20,
            textAlign: "center",
          }}
        >
          {campaign.name}
        </Typography>
      </div>
    </Paper>
  );
}
