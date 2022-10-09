import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { config as dotEnvConfig } from 'dotenv';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { App } from './pages';

// Load ENV variables
dotEnvConfig({
	path:
		process.env.NODE_ENV === 'production'
			? '.env.production'
			: '.env.development',
});

ReactDOM.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
	document.getElementById('root')
);
