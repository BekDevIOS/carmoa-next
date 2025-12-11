import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import { useReactiveVar } from '@apollo/client';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { themeVar } from '../../apollo/store';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import GoogleLoginButton from '../../libs/components/common/GoogleLoginButton';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Join: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const themeMode = useReactiveVar(themeVar);
	const logoSrc = themeMode === 'dark' ? '/img/logo/logoFooterDark.png' : '/img/logo/logoFooterLight.png';

	const [input, setInput] = useState({
		name: '',
		email: '',
		password: '',
		phone: '',
		type: 'USER',
	});

	const [loginView, setLoginView] = useState<boolean>(true);

	/** HANDLERS **/
	const viewChangeHandler = (state: boolean) => {
		setLoginView(state);
	};

	const checkUserTypeHandler = (e: any) => {
		const checked = e.target.checked;
		if (checked) {
			handleInput('type', e.target.name);
		} else {
			handleInput('type', 'USER');
		}
	};

	const handleInput = useCallback((name: any, value: any) => {
		setInput((prev) => ({ ...prev, [name]: value }));
	}, []);

	/** LOGIN **/
	const doLogin = useCallback(async () => {
		try {
			await logIn(input.email, input.password);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	/** SIGNUP **/
	const doSignUp = useCallback(async () => {
		try {
			await signUp(input.name, input.email, input.password, input.phone, input.type);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	/** GOOGLE LOGIN HANDLERS **/
	const handleGoogleLoginSuccess = useCallback(() => {
		router.push(`${router.query.referrer ?? '/'}`);
	}, [router]);

	const handleGoogleLoginError = useCallback((error: string) => {
		sweetMixinErrorAlert(error).then();
	}, []);

	const mainClassName = loginView ? 'main' : 'main main--swapped';

	if (device === 'mobile') {
		return (
			<Stack className={'join-page mobile'}>
				<Stack className={'container'}>
					<Stack className={mainClassName}>
						<Stack className={'left'}>
							{/* LOGO */}
							<Box className={'logo'}>
								<img src={logoSrc} alt="" />
							</Box>

							{/* TITLE */}
							<Box className={'info'}>
								<span>{loginView ? 'LOGIN' : 'SIGN UP'}</span>
								<p>{loginView ? 'Login to continue.' : 'Create your CarMoa account.'}</p>
							</Box>

							{/* INPUTS */}
							<Box className={'input-wrap'}>
								{/* Name (Signup only) */}
								{!loginView && (
									<div className={'input-box'}>
										<span>Name</span>
										<input
											type="text"
											placeholder={'Enter your name'}
											onChange={(e) => handleInput('name', e.target.value)}
											required
										/>
									</div>
								)}

								{/* Email */}
								<div className={'input-box'}>
									<span>Email</span>
									<input
										type="email"
										placeholder={'Enter your email'}
										onChange={(e) => handleInput('email', e.target.value)}
										required
										onKeyDown={(event) => {
											if (event.key === 'Enter' && loginView) doLogin();
											if (event.key === 'Enter' && !loginView) doSignUp();
										}}
									/>
								</div>

								{/* Password */}
								<div className={'input-box'}>
									<span>Password</span>
									<input
										type="password"
										placeholder={'Enter password'}
										onChange={(e) => handleInput('password', e.target.value)}
										required
									/>
								</div>

								{/* Phone */}
								{!loginView && (
									<div className={'input-box'}>
										<span>Phone Number</span>
										<input
											type="text"
											placeholder={'Enter phone number'}
											onChange={(e) => handleInput('phone', e.target.value)}
											required
										/>
									</div>
								)}
							</Box>

							{/* USER / DEALER SWITCH */}
							<Box className={'register'}>
								{!loginView && (
									<div className={'type-option'}>
										<span className={'text'}>Register as:</span>
										<div>
											<FormGroup>
												<FormControlLabel
													control={
														<Checkbox
															size="small"
															name="USER"
															onChange={checkUserTypeHandler}
															checked={input.type === 'USER'}
														/>
													}
													label="User"
												/>
											</FormGroup>
											<FormGroup>
												<FormControlLabel
													control={
														<Checkbox
															size="small"
															name="DEALER"
															onChange={checkUserTypeHandler}
															checked={input.type === 'DEALER'}
														/>
													}
													label="Dealer"
												/>
											</FormGroup>
										</div>
									</div>
								)}

								{/* REMEMBER ME */}
								{loginView && (
									<div className={'remember-info'}>
										<FormGroup>
											<FormControlLabel control={<Checkbox defaultChecked size="small" />} label="Remember me" />
										</FormGroup>
										<a>Forgot password?</a>
									</div>
								)}

								{/* SUBMIT BUTTON */}
								{loginView ? (
									<Button variant="contained" disabled={input.email === '' || input.password === ''} onClick={doLogin}>
										LOGIN
									</Button>
								) : (
									<Button
										variant="contained"
										disabled={
											input.name === '' ||
											input.email === '' ||
											input.password === '' ||
											input.phone === ''
										}
										onClick={doSignUp}
									>
										SIGN UP
									</Button>
								)}

								{/* GOOGLE LOGIN */}
								{loginView && (
									<Box sx={{ marginTop: '15px', width: '100%' }}>
										<GoogleLoginButton
											onSuccess={handleGoogleLoginSuccess}
											onError={handleGoogleLoginError}
											showOneTap={true}
											buttonTheme="outline"
											buttonSize="large"
											buttonText="signin_with"
										/>
									</Box>
								)}
							</Box>

							{/* SWITCH TEXT */}
							<Box className={'ask-info'}>
								{loginView ? (
									<p>
										Not registered yet?
										<b onClick={() => viewChangeHandler(false)}> SIGN UP</b>
									</p>
								) : (
									<p>
										Have an account?
										<b onClick={() => viewChangeHandler(true)}> LOGIN</b>
									</p>
								)}
							</Box>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
	return (
		<Stack className={'join-page'}>
			<Stack className={'container'}>
				<Stack className={mainClassName}>
					<Stack className={'left'}>
						{/* LOGO */}
						<Box className={'logo'}>
							<img src={logoSrc} alt="" />
						</Box>

						{/* TITLE */}
						<Box className={'info'}>
							<span>{loginView ? 'LOGIN' : 'SIGN UP'}</span>
							<p>{loginView ? 'Login to continue.' : 'Create your CarMoa account.'}</p>
						</Box>

						{/* INPUTS */}
						<Box className={'input-wrap'}>
							{/* Name (Signup only) */}
							{!loginView && (
								<div className={'input-box'}>
									<span>Name</span>
									<input
										type="text"
										placeholder={'Enter your name'}
										onChange={(e) => handleInput('name', e.target.value)}
										required
									/>
								</div>
							)}

							{/* Email */}
							<div className={'input-box'}>
								<span>Email</span>
								<input
									type="email"
									placeholder={'Enter your email'}
									onChange={(e) => handleInput('email', e.target.value)}
									required
									onKeyDown={(event) => {
										if (event.key === 'Enter' && loginView) doLogin();
										if (event.key === 'Enter' && !loginView) doSignUp();
									}}
								/>
							</div>

							{/* Password */}
							<div className={'input-box'}>
								<span>Password</span>
								<input
									type="password"
									placeholder={'Enter password'}
									onChange={(e) => handleInput('password', e.target.value)}
									required
								/>
							</div>

							{/* Phone */}
							{!loginView && (
								<div className={'input-box'}>
									<span>Phone Number</span>
									<input
										type="text"
										placeholder={'Enter phone number'}
										onChange={(e) => handleInput('phone', e.target.value)}
										required
									/>
								</div>
							)}
						</Box>

						{/* USER / DEALER SWITCH */}
						<Box className={'register'}>
							{!loginView && (
								<div className={'type-option'}>
									<span className={'text'}>Register as:</span>
									<div>
										<FormGroup>
											<FormControlLabel
												control={
													<Checkbox
														size="small"
														name="USER"
														onChange={checkUserTypeHandler}
														checked={input.type === 'USER'}
													/>
												}
												label="User"
											/>
										</FormGroup>
										<FormGroup>
											<FormControlLabel
												control={
													<Checkbox
														size="small"
														name="DEALER"
														onChange={checkUserTypeHandler}
														checked={input.type === 'DEALER'}
													/>
												}
												label="Dealer"
											/>
										</FormGroup>
									</div>
								</div>
							)}

							{/* REMEMBER ME */}
							{loginView && (
								<div className={'remember-info'}>
									<FormGroup>
										<FormControlLabel control={<Checkbox defaultChecked size="small" />} label="Remember me" />
									</FormGroup>
									<a>Forgot password?</a>
								</div>
							)}

							{/* SUBMIT BUTTON */}
							{loginView ? (
								<Button variant="contained" disabled={input.email === '' || input.password === ''} onClick={doLogin}>
									LOGIN
								</Button>
							) : (
								<Button
									variant="contained"
									disabled={
										input.name === '' ||
										input.email === '' ||
										input.password === '' ||
										input.phone === ''
									}
									onClick={doSignUp}
								>
									SIGN UP
								</Button>
							)}

							{/* GOOGLE LOGIN */}
							{loginView && (
								<Box sx={{ marginTop: '15px', width: '100%' }}>
									<GoogleLoginButton
										onSuccess={handleGoogleLoginSuccess}
										onError={handleGoogleLoginError}
										showOneTap={true}
										buttonTheme="outline"
										buttonSize="large"
										buttonText="signin_with"
									/>
								</Box>
							)}
						</Box>

						{/* SWITCH TEXT */}
						<Box className={'ask-info'}>
							{loginView ? (
								<p>
									Not registered yet?
									<b onClick={() => viewChangeHandler(false)}> SIGN UP</b>
								</p>
							) : (
								<p>
									Have an account?
									<b onClick={() => viewChangeHandler(true)}> LOGIN</b>
								</p>
							)}
						</Box>
					</Stack>

					{/* RIGHT SIDE IMAGE */}
					<Stack className={'right'}></Stack>
				</Stack>
			</Stack>
		</Stack>
		);
	}
};

export default withLayoutBasic(Join);
