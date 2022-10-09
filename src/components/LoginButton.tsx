import { AccountCircle, ManageAccounts } from '@mui/icons-material';
import {
	Button,
	IconButton,
	Menu,
	MenuItem,
	PopoverOrigin,
	Typography,
} from '@mui/material';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';

import { AuthContext } from '../contexts/AuthContext';

const LoginButton = (): JSX.Element => {
	const [menuAnchorEl, setMenuAnchorEl] = React.useState<Element | null>(
		null
	);

	const history = useHistory();
	const { isAuthenticated, logoutUser, user } = React.useContext(AuthContext);

	const handleMenuOpen = (event: any) => setMenuAnchorEl(event.currentTarget);
	const handleMenuClose = () => setMenuAnchorEl(null);

	const login = () => history.push('/login');
	const logout = () => {
		handleMenuClose();
		logoutUser?.();
	};

	if (!isAuthenticated)
		return (
			<Button color="inherit" onClick={login}>
				Login
			</Button>
		);

	const menuPosition: PopoverOrigin = {
		vertical: 'top',
		horizontal: 'right',
	};

	return (
		<div>
			<Button
				style={{
					backgroundColor: 'transparent',
					border: 'solid',
					borderColor: '#000000',
					borderRadius: 25,
					margin: 20,
				}}
				startIcon={<ManageAccounts />}
				onClick={handleMenuOpen}
				color="inherit"
			>
				<Typography>
					{`${user?.publicAddress.substring(0, 8)}...`}
				</Typography>
			</Button>
			<Menu
				anchorEl={menuAnchorEl}
				anchorOrigin={menuPosition}
				transformOrigin={menuPosition}
				open={!!menuAnchorEl}
				onClose={handleMenuClose}
				PaperProps={{
					style: {
						backgroundColor: 'black',
					},
				}}
			>
				<MenuItem>
					<Button component={Link} to="/profile">
						{'Profile'}
					</Button>
				</MenuItem>
				<MenuItem onClick={logout}>
					<Button>{'Logout'}</Button>
				</MenuItem>
			</Menu>
		</div>
	);
};

export default LoginButton;
