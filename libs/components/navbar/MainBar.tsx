import React from 'react';
import { Stack, Box } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import Link from 'next/link';

const MainBar = () => {
	return (
		<Stack className={'main-navbar'} sx={{ bgcolor: 'background.paper' }}>
			<Stack className={'container'}>
				<Box component={'div'} className={'left-nav-section'}>
					<Box component={'div'} className={'logo-box'}>
						<Link href={'/'}>
							<img src="/img/logo/logoWhite.png" alt="AutoGarage Logo" />
						</Link>
					</Box>
					<Box component={'div'} className={'nav-tabs'}>
						<Link href={'/'}>
							<Box component={'div'} className={'tab-item active'}>
								<Box component={'span'} sx={{ color: 'primary.main' }}>
									HOME
								</Box>
								<ExpandMoreIcon sx={{ color: 'primary.main', fontSize: 12 }} />
							</Box>
						</Link>
						<Link href={'/shop'}>
							<Box component={'div'} className={'tab-item'}>
								<Box component={'span'} sx={{ color: 'text.primary' }}>
									SHOP
								</Box>
								<ExpandMoreIcon sx={{ color: 'text.primary', fontSize: 12 }} />
							</Box>
						</Link>
						<Link href={'/blog'}>
							<Box component={'div'} className={'tab-item'}>
								<Box component={'span'} sx={{ color: 'text.primary' }}>
									BLOG
								</Box>
								<ExpandMoreIcon sx={{ color: 'text.primary', fontSize: 12 }} />
							</Box>
						</Link>
						<Link href={'/pages'}>
							<Box component={'div'} className={'tab-item'}>
								<Box component={'span'} sx={{ color: 'text.primary' }}>
									PAGES
								</Box>
								<ExpandMoreIcon sx={{ color: 'text.primary', fontSize: 12 }} />
							</Box>
						</Link>
						<Link href={'/marketplace'}>
							<Box component={'div'} className={'tab-item'}>
								<Box component={'span'} sx={{ color: 'text.primary' }}>
									MARKETPLACE
								</Box>
								<ExpandMoreIcon sx={{ color: 'text.primary', fontSize: 12 }} />
							</Box>
						</Link>
						<Link href={'/features'}>
							<Box component={'div'} className={'tab-item no-icon'}>
								<Box component={'span'} sx={{ color: 'text.primary' }}>
									FEATURES
								</Box>
							</Box>
						</Link>
						<Link href={'/contacts'}>
							<Box component={'div'} className={'tab-item no-icon'}>
								<Box component={'span'} sx={{ color: 'text.primary' }}>
									CONTACTS
								</Box>
							</Box>
						</Link>
					</Box>
				</Box>
				<Box component={'div'} className={'right-support-section'}>
					<Box component={'div'} className={'support-icon'}>
						<AccountCircleIcon sx={{ color: 'text.primary', fontSize: 42 }} />
					</Box>
					<Box component={'div'} className={'support-text'}>
						<Box component={'span'} className={'support-phone'} sx={{ color: 'text.primary' }}>
							Support (+009) 908 989 999
						</Box>
						<Box component={'span'} className={'support-email'} sx={{ color: 'text.secondary' }}>
							Email: info@autoparts.com
						</Box>
					</Box>
				</Box>
			</Stack>
		</Stack>
	);
};

export default MainBar;