import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardActions as muiCardActions,
  CardContent,
  Grid,
  Icon,
  Modal,
  Typography,
} from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import { MuiTheme } from "../pages";
import styled from "@emotion/styled";
import { useState, useContext } from "react";
import { CommentSection } from "react-comments-section";
import "react-comments-section/dist/index.css";
import { AuthContext } from "../contexts";
import { ScoreSlider } from "./ScoreSlider";
import lensterIcon from "../assets/lenster-logo.png";
import { ILensItem } from "../interfaces";

export const LensWidget = ({
  username,
  lensUserId,
  content,
  timestamp,
  campaignId,
}: ILensItem) => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState<any[]>([]);
  const [userScore, setUserScore] = useState(60);

  const [openComments, setOpenComments] = useState(false);
  const handleOpenComments = () => setOpenComments(true);
  const handleCloseComments = () => setOpenComments(false);

  const [openScore, setOpenScore] = useState(false);
  const handleOpenScore = () => setOpenScore(true);
  const handleCloseScore = () => setOpenScore(false);

  const commentsModal = (
    <Modal open={openComments} onClose={handleCloseComments}>
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          overflowY: "scroll",
          maxHeight: "80%",
        }}
      >
        <CommentSection
          currentUser={{
            currentUserId: `${user?.id}` || "",
            currentUserImg: user?.profilePictureId
              ? `${process.env.REACT_APP_BACKEND_URL}/users/profilePicture/${user?.id}`
              : user?.twitterProfileImageUrl ??
                `https://ui-avatars.com/api/?name=${user?.username}`,
            currentUserProfile: "https://x.postmint.xyz",
            currentUserFullName: user?.username || "",
          }}
          logIn={{
            loginLink: "https://x.postmint.xyz",
            signupLink: "https://x.postmint.xyz",
          }}
          commentData={data || ([] as any)}
          onSubmitAction={(newData: {
            userId: string;
            comId: string;
            avatarUrl: string;
            userProfile?: string;
            fullName: string;
            text: string;
            replies: any;
            commentId: string;
          }) => {}}
        />
      </Box>
    </Modal>
  );

  const scoreModal = (
    <Modal open={openScore} onClose={handleCloseScore}>
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          overflowY: "scroll",
          maxHeight: "80%",
        }}
      >
        <div style={{ textAlign: "center", padding: 20 }}>
          <ScoreSlider setScore={setUserScore} score={userScore} />
          <Button style={{ marginTop: 20 }} onClick={() => {}}>
            {"Submit"}
          </Button>
        </div>
      </Box>
    </Modal>
  );
  return (
    <Card
      sx={{
        maxWidth: "500px",
        boxShadow: MuiTheme.shadows[6],
        height: "370px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginTop: 4,
          marginBottom: -15,
        }}
      >
        <Typography color={MuiTheme.palette.grey[600]} variant="body2">
          {"Mention"}
        </Typography>
      </div>

      <CardContent sx={{ px: 2, py: 1 }}>
        <div>
          <Grid
            container
            style={{
              height: 250,
              width: "100%",
              marginTop: 10,
              borderColor: "#cfd9de",
              borderWidth: "1px",
              borderRadius: "12px",
              borderStyle: "solid",
            }}
          >
            <Grid
              key={"lensAvatar"}
              item
              xs={3}
              style={{
                border: "none",
                boxShadow: "none",
                textAlign: "right",
                paddingLeft: 20,
                marginTop: 12,
                height: 5,
              }}
            >
              <Avatar
                sx={{ width: 50, height: 50 }}
                imgProps={{
                  style: {
                    objectFit: "fill",
                  },
                }}
                src={`${process.env.REACT_APP_BACKEND_URL}/campaigns/logo/${campaignId}`}
              />
            </Grid>
            <Grid
              key={"lensName"}
              item
              xs={8}
              style={{
                boxShadow: "none",
                textAlign: "left",
                marginTop: 12,
                height: 5,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                textOverflow={"ellipsis"}
              >
                {`${username}`}
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                color={`#7A28C6`}
                textOverflow={"ellipsis"}
              >
                {`${lensUserId}`}
              </Typography>
            </Grid>
            <Grid
              key={"lensLogo"}
              item
              xs={1}
              style={{
                boxShadow: "none",
                textAlign: "left",
                marginTop: 12,
                height: 5,
              }}
            >
              <Icon>
                <img src={lensterIcon} height={24} />
              </Icon>
            </Grid>
            <Grid
              key={"lensContent"}
              item
              xs={12}
              style={{
                border: "none",
                boxShadow: "none",
                textAlign: "left",
                marginLeft: 20,
                marginRight: 20,
                marginTop: -20,
                height: 20,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                textOverflow={"ellipsis"}
              >
                {content}
              </Typography>
            </Grid>
            <Grid
              key={"lensTimestamp"}
              item
              xs={12}
              style={{
                border: "none",
                boxShadow: "none",
                textAlign: "left",
                marginLeft: 20,
                marginRight: 20,
                height: 30,
                paddingBottom: 10,
                borderBottom: "1px solid #D6D6D6",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                textOverflow={"ellipsis"}
                color={"#7A28C6"}
              >
                {new Date(timestamp).toLocaleString(undefined, {
                  dateStyle: "full",
                  timeStyle: "medium",
                })}
              </Typography>
              <div
                style={{
                  textAlign: "center",
                  marginTop: 5,
                }}
              >
                <Button
                  style={{
                    height: "30px",
                    padding: 5,
                    textAlign: "center",
                    borderRadius: "14px",
                    background: "white",
                    border: "rgba(140, 140, 140, 1) solid 1px",
                  }}
                  onClick={() => {}}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight="bolder"
                    color={"#7A28C6"}
                  >
                    View on Lenster
                  </Typography>
                </Button>
              </div>
            </Grid>
          </Grid>
        </div>
      </CardContent>
      {commentsModal}
      {scoreModal}
      <CardActions>
        <CardAction>
          <IconContainer>
            <Typography
              color={MuiTheme.palette.grey[600]}
              variant="h5"
              component="span"
            >
              {0 || "--"}
            </Typography>
          </IconContainer>
          <Typography
            color={MuiTheme.palette.grey[600]}
            variant="body2"
            component="span"
          >
            Score
          </Typography>
        </CardAction>
        <CardAction onClick={handleOpenScore}>
          <IconContainer>
            <SpeedIcon
              style={{
                color: MuiTheme.palette.grey[600],
              }}
              fontSize="large"
            />
          </IconContainer>
          <Typography
            color={MuiTheme.palette.grey[600]}
            variant="body2"
            component="span"
          >
            Rate post
          </Typography>
        </CardAction>
        <CardAction onClick={handleOpenComments}>
          <IconContainer>
            <Badge color="success" badgeContent={data.length}>
              <ForumOutlinedIcon
                fontSize="large"
                style={{
                  color: MuiTheme.palette.grey[600],
                }}
              />
            </Badge>
          </IconContainer>
          <Typography
            color={MuiTheme.palette.grey[600]}
            variant="body2"
            component="span"
          >
            Comment
          </Typography>
        </CardAction>
      </CardActions>
    </Card>
  );
};

const CardAction = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconContainer = styled.div`
  height: 35px;
  display: flex;
  align-items: center;
`;

const CardActions = styled(muiCardActions)`
  display: flex;
  justify-content: space-between;
  padding: 0 16px 16px;
`;
