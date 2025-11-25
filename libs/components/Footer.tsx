import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import { useReactiveVar } from '@apollo/client';
import { themeVar } from '../../apollo/store';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box, Typography } from '@mui/material';
import moment from 'moment';

const Footer = () => {
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
							<span className="footer-title">Customer Support</span>
							<p>+82 10 5700 4474</p>
						</Box>

						<Box className={'footer-box'}>
							<span className="footer-title">Email</span>
							<p>support@carmoa.kr</p>
						</Box>

						{/* Social Icons */}
						<Box className={'footer-box'}>
							<p>Follow Us</p>
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
								<strong>Customer Service</strong>
								<span>My Orders</span>
								<span>Return Policy</span>
								<span>FAQ</span>
								<span>Contact Us</span>
							</div>

							<div>
								<strong>CarMoa</strong>
								<span>About Us</span>
								<span>Dealer Program</span>
								<span>Community</span>
								<span>Blog</span>
							</div>

							<div>
								<strong>Quick Links</strong>
								<span>Privacy Policy</span>
								<span>Terms & Conditions</span>
								<span>Shipping Info</span>
							</div>
						</Box>
					</Stack>
				</Stack>

				<Stack className={'second'}>
					<span>© CarMoa {moment().year()} – All rights reserved.</span>
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
						<span className="footer-title">Customer Support</span>
						<p>+82 10 5700 4474</p>
					</Box>

					<Box className={'footer-box'}>
						<span className="footer-title">Email</span>
						<p>support@carmoa.kr</p>
					</Box>

					<Box className={'footer-box'}>
						<p>Follow Us</p>
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
						<strong>Join Our Newsletter</strong>
						<div>
							<input type="text" placeholder="Your Email" />
							<span>Subscribe</span>
						</div>
					</Box>

					{/* Links */}
					<Box className={'bottom'}>
						<div>
							<strong>Customer Service</strong>
							<span>Track Order</span>
							<span>Return Policy</span>
							<span>FAQ</span>
							<span>Support</span>
						</div>

						<div>
							<strong>Dealers</strong>
							<span>Become a Dealer</span>
							<span>Dealer Dashboard</span>
							<span>Dealer Support</span>
						</div>

						<div>
							<strong>CarMoa</strong>
							<span>About Us</span>
							<span>Community</span>
							<span>Blog</span>
							<span>Contact</span>
						</div>

						<div>
							<strong>Quick Links</strong>
							<span>Privacy Policy</span>
							<span>Terms of Service</span>
							<span>Shipping Policy</span>
							<span>Help Center</span>
						</div>
					</Box>
				</Stack>
			</Stack>

			{/* Bottom Footer */}
			<Stack className={'second'}>
				<span>© CarMoa {moment().year()} – All rights reserved.</span>
				<span>Privacy · Terms · Sitemap</span>
			</Stack>
		</Stack>
	);
};

export default Footer;
