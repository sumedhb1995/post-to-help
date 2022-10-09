import {
  Badge,
  Box,
  Button,
  Card,
  CardActions as muiCardActions,
  CardContent,
  CardHeader,
  Modal,
  Skeleton,
  Typography,
} from "@mui/material";
import { Tweet } from "react-twitter-widgets";
import SpeedIcon from "@mui/icons-material/Speed";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import { MuiTheme } from "../pages";
import styled from "@emotion/styled";
import { useEffect, useState, useMemo, useContext, useCallback } from "react";
import { CommentSection } from "react-comments-section";
import "react-comments-section/dist/index.css";
import { AuthContext } from "../contexts";
import { ScoreSlider } from "./ScoreSlider";
import axios from "axios";

import { Tweet as TweetType } from "../pages/Campaign/types";

type Status = "initial" | "loading" | "resolved" | "error";

interface TweetWidgetProps {
  tweetId: string;
  score: string | number;
  type: string;
  authorUserId: string;
  campaignId: string;
  fetchCampaign: () => void;
  tweet: TweetType;
  tweetScoresByUser: { [userId: string]: number };
}

export const TweetWidget = ({
  score,
  tweetId,
  type,
  campaignId,
  authorUserId,
  fetchCampaign,
  tweet,
  tweetScoresByUser,
}: TweetWidgetProps) => {
  const { user } = useContext(AuthContext);
  const [status, setStatus] = useState<Status>("loading");
  const [data, setData] = useState<any[]>([]);
  const isLoading = status === "loading";
  const [userScore, setUserScore] = useState(60);

  const [openComments, setOpenComments] = useState(false);
  const handleOpenComments = () => setOpenComments(true);
  const handleCloseComments = () => setOpenComments(false);

  const [openScore, setOpenScore] = useState(false);
  const handleOpenScore = () => setOpenScore(true);
  const handleCloseScore = () => setOpenScore(false);

  const averageScore = useMemo(() => {
    const allScores = tweetScoresByUser ? Object.values(tweetScoresByUser) : [];

    let totalScore = 0;

    allScores.forEach((value) => {
      totalScore = totalScore + value;
    });

    return totalScore / allScores.length;
  }, [tweetScoresByUser]);

  const updateScore = useCallback(() => {
    const body = {
      campaignId,
      type: `${type.toLowerCase()}s`,
      tweetId,
      score: userScore,
      tweetAuthorId: authorUserId,
      currentUserId: user?.id,
    };

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/campaigns/updateTweetScore`,
        body
      )
      .then(() => {
        fetchCampaign();
        setOpenScore(false);
      });
  }, [campaignId, type, tweetId, userScore, authorUserId]);

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
          <Button style={{ marginTop: 20 }} onClick={() => updateScore()}>
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
          {type}
        </Typography>
      </div>

      <CardContent sx={{ px: 2, py: 1 }}>
        {isLoading && <TweetWidgetSkeleton />}
        <Tweet
          onLoad={() => setStatus("resolved")}
          renderError={() => <TweetWidgetError onError={setStatus} />}
          options={{ width: "auto" }}
          tweetId={tweetId}
        />
      </CardContent>
      {commentsModal}
      {scoreModal}
      {!isLoading && (
        <CardActions>
          <CardAction>
            <IconContainer>
              <Typography
                color={MuiTheme.palette.grey[600]}
                variant="h5"
                component="span"
              >
                {averageScore || "--"}
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
      )}
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

interface TweetWidgetErrorProps {
  onError: React.Dispatch<React.SetStateAction<Status>>;
}

const TweetWidgetError = ({ onError }: TweetWidgetErrorProps) => {
  useEffect(() => {
    onError("error");
  }, []);
  return <div> Failed to load Tweet :( </div>;
};

const TweetWidgetSkeleton = () => {
  return (
    <Box
      sx={{
        height: "370px",
        marginTop: 1,
        mb: 2,
      }}
    >
      <Box
        sx={{
          p: 2,
          borderColor: "#cfd9de",
          borderWidth: "1px",
          borderRadius: "12px",
          borderStyle: "solid",
          height: "180px",
        }}
      >
        <CardHeader
          avatar={
            <Skeleton
              animation="wave"
              variant="circular"
              width={40}
              height={40}
            />
          }
          title={
            <Skeleton
              animation="wave"
              height={10}
              width="80%"
              style={{ marginBottom: 6 }}
            />
          }
          subheader={<Skeleton animation="wave" height={10} width="40%" />}
        />
        <Skeleton sx={{ height: 100 }} animation="wave" variant="rectangular" />
      </Box>
      <Skeleton sx={{ mt: 2, height: "72px" }} animation="wave" />
    </Box>
  );
};
