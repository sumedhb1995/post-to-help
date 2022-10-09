export interface ICampaignLeaderboardData {
	[campaignId: string]: {
		campaignName: string;
		totalScorePost: number;
		totalScoreSupport: number;
	};
}

export interface IAffiliateData {
	[userId: string]: {
		userId: string;
		username: string;
		userAddress: string;
		aggMetricsPost?: {
			retweet_count: number;
			reply_count: number;
			like_count: number;
			quote_count: number;
		};
		aggMetricsSupport?: {
			retweet_count: number;
			reply_count: number;
			like_count: number;
			quote_count: number;
		};
		scorePost: number;
		scoreSupport: number;
		tweets: {
			mentions: Tweet[];
			referrals: Tweet[];
		};
		clickCount: number;
		claimedBalance: number;
		rewardedBalance: {
			[time: string]: { value: number; isClaimed: boolean };
		};
		tweetScoresById: { [tweetId: string]: { [userId: string]: number } };
	};
}

export interface Tweet {
	id: string;
	author_id: string;
	public_metrics: {
		retweet_count: number;
		reply_count: number;
		like_count: number;
		quote_count: number;
	};
	text: string;
}
