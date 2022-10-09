export interface ICampaign {
  id?: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  createdByUserId: string;
  logoBlobId: string;
  pageLink: string;
  posters: number;
  affiliateConversions: number;
  totalPayout: number;
  participantUserInfo: {
    [userId: string]: {
      referralLink: string;
      referralHash: string;
      referralSeed: string;
    };
  };
  contractAddress?: string;
  campaignBalance: number;
  type: string;
  twitterUsername: string;
  lensUsername?: string;
  realtimeContainerId?: string;
  twitterId?: string;
  useTwitterImage: boolean;
  twitterProfileImageUrl: string;
  rewardedAllocations: { [time: string]: { [id: string]: number } };
}

export interface IUser {
  id: number;
  username: string;
  nonce: string;
  publicAddress: string;
  twitterUsername: string;
  lensUsername?: string;
  twitterId: string;
  profilePictureId?: string;
  twitterProfileImageUrl: string;
  isAdmin: boolean;
  isAdmittedToAlpha: boolean;
  email?: string;
  botometerStats?: {
    result: { display_scores: { english: { overall: number } } };
  };
}

export interface ILensProtocolData {
  posts: ILensItem[];
  supporterScore: number;
}

export interface ILensItem {
  username: string;
  lensUserId: string;
  content: string;
  timestamp: string;
  campaignId: string;
  postId: string;
}
