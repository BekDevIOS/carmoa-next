import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import { useReactiveVar } from '@apollo/client';
import { themeVar } from '../../apollo/store';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box, Typography } from '@mui/material';
import moment from 'moment';
import { useTranslation } from 'next-i18next';

const Footer = () => {
	const { t } = useTranslation('common');
	const device = useDeviceDetect();
	const themeMode = useReactiveVar(themeVar);
	const logoSrc = themeMode === 'dark' ? '/img/logo/logoFooterDark.png' : '/img/logo/logoFooterLight.png';

	// ---------------------------------------
	// MOBILE FOOTER
	// ---------------------------------------
	if (device === 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					{/* Logo + Contact */}
					<Stack className={'left'}>
						<Box className={'footer-box'}>
							<img src={logoSrc} alt="Carmoa Logo" className="logo" />
						</Box>

					<Box className={'footer-box'}>
						<span className="footer-title">{t('Customer Support')}</span>
						<p>+82 10 5700 4474</p>
					</Box>

					<Box className={'footer-box'}>
						<span className="footer-title">{t('Email')}</span>
						<p>support@carmoa.kr</p>
					</Box>

					{/* Social Icons */}
					<Box className={'footer-box'}>
						<p>{t('Follow Us')}</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>

					{/* Links Section */}
					<Stack className={'right'}>
						<Box className={'bottom'}>
							<div>
								<strong>{t('Customer Service')}</strong>
								<span>{t('My Orders')}</span>
								<span>{t('Return Policy')}</span>
								<span>{t('FAQ')}</span>
								<span>{t('Contact Us')}</span>
							</div>

							<div>
								<strong>{t('CarMoa')}</strong>
								<span>{t('About Us')}</span>
								<span>{t('Dealer Program')}</span>
								<span>{t('Community')}</span>
								<span>{t('Blog')}</span>
							</div>

							<div>
								<strong>{t('Quick Links')}</strong>
								<span>{t('Privacy Policy')}</span>
								<span>{t('Terms & Conditions')}</span>
								<span>{t('Shipping Info')}</span>
							</div>
						</Box>
					</Stack>
				</Stack>

				<Stack className={'second'}>
					<span>© {t('CarMoa')} {moment().year()} – {t('All rights reserved')}.</span>
				</Stack>
			</Stack>
		);
	}

	// ---------------------------------------
	// PC FOOTER
	// ---------------------------------------
	return (
		<Stack className={'footer-container'}>
			<Stack className={'main'}>
				{/* LEFT SECTION */}
				<Stack className={'left'}>
					<Box className={'footer-box'}>
						<img src={logoSrc} alt="Carmoa Logo" className="logo" />
					</Box>

				<Box className={'footer-box'}>
					<span className="footer-title">{t('Customer Support')}</span>
					<p>+82 10 5700 4474</p>
				</Box>

				<Box className={'footer-box'}>
					<span className="footer-title">{t('Email')}</span>
					<p>support@carmoa.kr</p>
				</Box>

				<Box className={'footer-box'}>
					<p>{t('Follow Us')}</p>
						<div className={'media-box'}>
							<FacebookOutlinedIcon />
							<TelegramIcon />
							<InstagramIcon />
							<TwitterIcon />
						</div>
					</Box>
				</Stack>

				{/* RIGHT SECTION */}
				<Stack className={'right'}>
					{/* Newsletter */}
					<Box className={'top'}>
						<strong>{t('Join Our Newsletter')}</strong>
						<div>
							<input type="text" placeholder={(t('Your Email') as string) || 'Your Email'} />
							<span>{t('Subscribe')}</span>
						</div>
					</Box>

					{/* Links */}
					<Box className={'bottom'}>
						<div>
							<strong>{t('Customer Service')}</strong>
							<span>{t('Track Order')}</span>
							<span>{t('Return Policy')}</span>
							<span>{t('FAQ')}</span>
							<span>{t('Support')}</span>
						</div>

						<div>
							<strong>{t('Dealers')}</strong>
							<span>{t('Become a Dealer')}</span>
							<span>{t('Dealer Dashboard')}</span>
							<span>{t('Dealer Support')}</span>
						</div>

						<div>
							<strong>{t('CarMoa')}</strong>
							<span>{t('About Us')}</span>
							<span>{t('Community')}</span>
							<span>{t('Blog')}</span>
							<span>{t('Contact')}</span>
						</div>

						<div>
							<strong>{t('Quick Links')}</strong>
							<span>{t('Privacy Policy')}</span>
							<span>{t('Terms of Service')}</span>
							<span>{t('Shipping Policy')}</span>
							<span>{t('Help Center')}</span>
						</div>
					</Box>
				</Stack>
			</Stack>

			{/* Bottom Footer */}
			<Stack className={'second'}>
				<span>© {t('CarMoa')} {moment().year()} – {t('All rights reserved')}.</span>
				<span>{t('Privacy')} · {t('Terms')} · {t('Sitemap')}</span>
			</Stack>
		</Stack>
	);
};

export default Footer;
