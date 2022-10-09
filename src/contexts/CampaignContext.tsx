import React from 'react';

import { ICampaign } from '../interfaces';

export interface ICampaignContext {
	campaigns: ICampaign[];
}

export const CampaignContext = React.createContext<ICampaignContext>({
	campaigns: [],
});
