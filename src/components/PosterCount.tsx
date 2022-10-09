import { Group } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { ICampaign } from '../interfaces';

export interface Props {
	campaign: ICampaign;
	positionLeft: number;
	positionBottom: number;
}

export const PosterCount = (props: Props) => {
	return (
		<div>
			<Typography
				variant="body2"
				component="div"
				fontWeight="bold"
				fontSize="medium"
				style={{
					position: 'relative',
					left: props.positionLeft,
					bottom: props.positionBottom,
					background: 'black',
					color: 'white',
					borderRadius: 20,
					padding: 12,
					paddingTop: 6,
					paddingBottom: 6,
					width: 33,
					textAlign: 'right',
				}}
			>
				<Group
					fontSize="small"
					style={{
						position: 'absolute',
						top: 6,
						right: 26,
					}}
				/>
				{` ${Object.values(props.campaign.participantUserInfo).length}`}
			</Typography>
		</div>
	);
};
