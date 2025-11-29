import React, { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, useTheme } from '@mui/material';
import { googleLogIn } from '../../auth';
import { sweetMixinErrorAlert } from '../../sweetAlert';

interface GoogleLoginButtonProps {
	onSuccess?: () => void;
	onError?: (error: string) => void;
	showOneTap?: boolean;
	buttonTheme?: 'outline' | 'filled_blue' | 'filled_black';
	buttonSize?: 'large' | 'medium' | 'small';
	buttonText?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
	disabled?: boolean;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
	onSuccess,
	onError,
	showOneTap = true,
	buttonTheme = 'outline',
	buttonSize = 'large',
	buttonText = 'signin_with',
	disabled = false,
}) => {
	const theme = useTheme();
	const [loading, setLoading] = useState<boolean>(false);
	const buttonRef = useRef<HTMLDivElement>(null);
	const initializedRef = useRef<boolean>(false);
	const scriptLoadedRef = useRef<boolean>(false);

	// Global Google initialization - only runs once
	useEffect(() => {
		if (typeof window === 'undefined') return;
		if (initializedRef.current) return;

		const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
		if (!clientId) {
			console.warn('Google Client ID not configured. Set REACT_APP_GOOGLE_CLIENT_ID in environment variables.');
			return;
		}

		// Check if Google script is already loaded
		// @ts-ignore
		if (window.google?.accounts?.id) {
			scriptLoadedRef.current = true;
			initializeGoogle(clientId);
		} else {
			// Wait for script to load (script is loaded in _document.tsx)
			const checkScript = setInterval(() => {
				// @ts-ignore
				if (window.google?.accounts?.id) {
					scriptLoadedRef.current = true;
					clearInterval(checkScript);
					initializeGoogle(clientId);
				}
			}, 100);

			// Timeout after 5 seconds
			setTimeout(() => {
				clearInterval(checkScript);
				if (!scriptLoadedRef.current) {
					console.error('Google Identity Services script failed to load.');
				}
			}, 5000);
		}

		function initializeGoogle(clientId: string) {
			if (initializedRef.current) return;

			// @ts-ignore
			const google = window.google;
			if (!google?.accounts?.id) return;

			try {
				// Initialize Google Identity Services
				// IMPORTANT: Do NOT use redirect_uri - use pure credential mode
				google.accounts.id.initialize({
					client_id: clientId,
					callback: handleCredentialResponse,
					// No redirect_uri - this prevents redirect_uri_mismatch errors
					// Pure credential mode returns token directly via callback
				});

				initializedRef.current = true;

				// Show One Tap prompt if enabled
				if (showOneTap) {
					google.accounts.id.prompt((notification: any) => {
						// Silently handle notifications - these are normal user actions
						if (notification.isNotDisplayed()) {
							// One Tap not shown - user can use button instead
						} else if (notification.isSkippedMoment()) {
							// User skipped - normal behavior
						} else if (notification.isDismissedMoment()) {
							// User dismissed - normal behavior
						}
					});
				}

				// Render button when ref is available
				if (buttonRef.current) {
					renderButton();
				}
			} catch (error) {
				console.error('Error initializing Google Identity Services:', error);
				if (onError) {
					onError('Failed to initialize Google login.');
				}
			}
		}

		function renderButton() {
			if (!buttonRef.current || !initializedRef.current) return;

			// @ts-ignore
			const google = window.google;
			if (!google?.accounts?.id) return;

			try {
				// Clear any existing button
				buttonRef.current.innerHTML = '';

				// Calculate effective theme based on current theme mode
				// In dark mode, use 'filled_black' for better visibility if outline was requested
				const currentTheme = theme.palette.mode === 'dark' && buttonTheme === 'outline' 
					? 'filled_black' 
					: buttonTheme;

				// Render Google Sign-In button
				google.accounts.id.renderButton(buttonRef.current, {
					theme: currentTheme,
					size: buttonSize,
					text: buttonText,
					width: '100%',
					type: 'standard',
				});
			} catch (error) {
				console.error('Error rendering Google button:', error);
			}
		}

		// Re-render button when ref becomes available
		if (buttonRef.current && initializedRef.current) {
			renderButton();
		}

		// Cleanup function
		return () => {
			// No cleanup needed - Google handles its own lifecycle
		};
	}, [showOneTap, buttonTheme, buttonSize, buttonText, onError, theme.palette.mode]);

	// Update button disabled state
	useEffect(() => {
		if (buttonRef.current && initializedRef.current) {
			// @ts-ignore
			const google = window.google;
			if (google?.accounts?.id && buttonRef.current.querySelector('iframe')) {
				// Button is already rendered, update disabled state via CSS
				if (disabled) {
					buttonRef.current.style.opacity = '0.6';
					buttonRef.current.style.pointerEvents = 'none';
				} else {
					buttonRef.current.style.opacity = '1';
					buttonRef.current.style.pointerEvents = 'auto';
				}
			}
		}
	}, [disabled]);

	/**
	 * Handle Google credential response
	 * This is called when user successfully authenticates with Google
	 */
	const handleCredentialResponse = async (response: any) => {
		if (!response?.credential) {
			const errorMsg = 'Google login failed: missing credential.';
			if (onError) {
				onError(errorMsg);
			} else {
				sweetMixinErrorAlert(errorMsg).then();
			}
			return;
		}

		setLoading(true);

		try {
			// Send credential token to backend via existing googleLogIn function
			await googleLogIn(response.credential);

			// Call success callback if provided
			if (onSuccess) {
				onSuccess();
			}
		} catch (error: any) {
			const errorMsg = error?.message || 'Google login failed. Please try again.';
			console.error('Google login error:', error);

			if (onError) {
				onError(errorMsg);
			} else {
				sweetMixinErrorAlert(errorMsg).then();
			}
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					width: '100%',
					height: '55px',
					borderRadius: '12px',
					border: `1px solid ${theme.palette.divider}`,
					background: theme.palette.background.paper,
				}}
			>
				<CircularProgress size={24} />
			</Box>
		);
	}

	return (
		<Box
			ref={buttonRef}
			sx={{
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
				'& iframe': {
					width: '100% !important',
				},
				// Ensure Google button adapts to dark mode
				'& div[role="button"]': {
					// Google's button iframe styling
				},
				...(disabled && {
					opacity: 0.6,
					pointerEvents: 'none',
				}),
			}}
		/>
	);
};

export default GoogleLoginButton;

