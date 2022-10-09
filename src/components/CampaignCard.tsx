import { Group } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Icon,
  Typography,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import tokenIcon from "../assets/token.png";
import twitterIcon from "../assets/twitter-logo.png";
import lensterIcon from "../assets/lenster-logo.png";

import { ICampaign } from "../interfaces";

const CampaignCard = (props: { campaign: ICampaign }): JSX.Element => {
  const { campaign } = props;
  const history = useHistory();
  return (
    <Card
      sx={{
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
      onClick={() => history.push(`/campaigns/view/${campaign.id}`)}
    >
      <CardActionArea style={{ padding: 5 }}>
        <div style={{ marginRight: 9, marginLeft: 9 }}>
          <div>
            <Typography
              variant="body2"
              component="div"
              fontWeight="bold"
              fontSize="medium"
              style={{
                position: "absolute",
                right: 22,
                top: 12,
                background: "black",
                color: "white",
                borderRadius: 20,
                padding: 12,
                paddingTop: 6,
                paddingBottom: 6,
                width: 33,
                textAlign: "right",
              }}
            >
              <Group
                fontSize="small"
                style={{
                  position: "absolute",
                  top: 6,
                  right: 26,
                }}
              />
              {` ${Object.values(campaign.participantUserInfo).length}`}
            </Typography>
          </div>
          <div
            style={{
              width: "100%",
              height: "250px",
            }}
          >
            <CardMedia
              component="img"
              alt={campaign.name}
              src={`${process.env.REACT_APP_BACKEND_URL}/campaigns/logo/${campaign.id}`}
              sx={{
                maxHeight: "250px",
                objectFit: "cover",
                borderRadius: 6,
              }}
            />
          </div>
        </div>

        <CardContent
          style={{
            backgroundColor: "transparent",
            textAlign: "left",
            paddingLeft: 30,
          }}
        >
          <Typography variant="h5" component="div" fontWeight="bold">
            {campaign.name}
          </Typography>
          <div>
            <Grid container spacing={4}>
              <Grid
                key={`grid-item-title`}
                item
                xs={6}
                style={{ border: "none", boxShadow: "none" }}
              >
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
                        position: "absolute",
                        left: 31,
                        bottom: 52,
                      }}
                    />
                  </Icon>
                  {`@${campaign.twitterUsername}`}
                </Typography>
                {campaign.lensUsername ? (
                  <Typography
                    style={{
                      marginBottom: 5,
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
                          position: "absolute",
                          left: 32,
                          bottom: 24,
                          marginTop: -10,
                        }}
                      />
                    </Icon>
                    {`@${campaign.lensUsername}`}
                  </Typography>
                ) : null}
              </Grid>
              <Grid
                key={`grid-item-title`}
                item
                xs={6}
                style={{
                  border: "none",
                  boxShadow: "none",
                  textAlign: "right",
                }}
              >
                <Typography variant="body2">reward balance:</Typography>
                <Typography variant="body1" style={{ paddingBottom: 15 }}>
                  {`${campaign.campaignBalance} PPT`}
                  <Icon>
                    <img
                      src={tokenIcon}
                      height={20}
                      style={{
                        position: "absolute",
                        right: 12,
                        bottom: 34,
                      }}
                    />
                  </Icon>
                </Typography>
              </Grid>
            </Grid>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CampaignCard;
