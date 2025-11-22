import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { light, dark } from '../scss/MaterialTheme';
import { ApolloProvider, useReactiveVar } from '@apollo/client';
import { appWithTranslation } from 'next-i18next';
import { useApollo } from '../apollo/client';
import { themeVar } from '../apollo/store';
import '../scss/app.scss';
import '../scss/pc/main.scss';
import '../scss/mobile/main.scss';

const AppContent = ({ Component, pageProps }: AppProps) => {
	const themeMode = useReactiveVar(themeVar);

	// Update localStorage and body class when theme changes
	useEffect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('themeMode', themeMode);
			// Add theme class to body for CSS styling
			document.body.classList.remove('theme-light', 'theme-dark');
			document.body.classList.add(`theme-${themeMode}`);
		}
	}, [themeMode]);

	const theme = useMemo(() => {
		return createTheme((themeMode === 'dark' ? dark : light) as any);
	}, [themeMode]);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Component {...pageProps} />
		</ThemeProvider>
	);
};

const App = (props: AppProps) => {
	const apolloClient = useApollo((props.pageProps as any).initialApolloState || null);

	return (
		<ApolloProvider client={apolloClient}>
			<AppContent {...props} />
		</ApolloProvider>
	);
};

export default appWithTranslation(App);
