import React from 'react';
import { Stack, Box } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
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
									Home
								</Box>
								<ExpandMoreIcon sx={{ color: 'primary.main', fontSize: 12 }} />
							</Box>
						</Link>
						<Link href={'/products'}>
							<Box component={'div'} className={'tab-item'}>
								<Box component={'span'} sx={{ color: 'text.primary' }}>
									Products
								</Box>
								<ExpandMoreIcon sx={{ color: 'text.primary', fontSize: 12 }} />
							</Box>
						</Link>
						<Link href={'/categories'}>
							<Box component={'div'} className={'tab-item'}>
								<Box component={'span'} sx={{ color: 'text.primary' }}>
									Categories
								</Box>
								<ExpandMoreIcon sx={{ color: 'text.primary', fontSize: 12 }} />
							</Box>
						</Link>
						<Link href={'/brands'}>
							<Box component={'div'} className={'tab-item'}>
								<Box component={'span'} sx={{ color: 'text.primary' }}>
									Brands
								</Box>
								<ExpandMoreIcon sx={{ color: 'text.primary', fontSize: 12 }} />
							</Box>
						</Link>
						<Link href={'/blog'}>
							<Box component={'div'} className={'tab-item no-icon'}>
								<Box component={'span'} sx={{ color: 'text.primary' }}>
									Blog
								</Box>
							</Box>
						</Link>
						<Link href={'/dealer'}>
							<Box component={'div'} className={'tab-item no-icon'}>
								<Box component={'span'} sx={{ color: 'text.primary' }}>
									Dealer
								</Box>
							</Box>
						</Link>
						<Link href={'/cs'}>
							<Box component={'div'} className={'tab-item no-icon'}>
								<Box component={'span'} sx={{ color: 'text.primary' }}>
									CS
								</Box>
							</Box>
						</Link>
						<Link href={'/partnership'}>
							<Box component={'div'} className={'tab-item no-icon'}>
								<Box component={'span'} sx={{ color: 'text.primary' }}>
									Partnership
								</Box>
							</Box>
						</Link>
					</Box>
				</Box>
			</Stack>
		</Stack>
	);
};

export default MainBar;