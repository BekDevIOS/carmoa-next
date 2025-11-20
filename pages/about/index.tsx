import React, { useState } from 'react';
import { NextPage } from 'next';
import { Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import DealerCard from '../../libs/components/common/DealerCard';
import FeatureCard from '../../libs/components/common/FeatureCard';
import Advertisement from '../../libs/components/common/Advertisement';
import { T } from '../../libs/types/common';

const AboutUs: NextPage = (props: T) => {
	const device = useDeviceDetect();

	// Statistics data
	const statistics = [
		{ label: 'Product Types', value: 500 },
		{ label: 'Years of Experience', value: 15 },
		{ label: 'Trust Customers', value: 12000 },
		{ label: 'Stores Nationwide', value: 25 },
	];

	// Team members data
	const teamMembers = [
		{
			id: 1,
			name: 'James Anderson',
			type: 'CEO & Founder',
			image: '/img/profile/agent.png',
		},
		{
			id: 2,
			name: 'Sarah Mitchell',
			type: 'Sales Director',
			image: '/img/property/girlBrunette.png',
		},
		{
			id: 3,
			name: 'Michael Chen',
			type: 'Service Manager',
			image: '/img/profile/agent.png',
		},
		{
			id: 4,
			name: 'Emily Rodriguez',
			type: 'Marketing Head',
			image: '/img/property/girlBrunette.png',
		},
	];

	// Features data
	const features = [
		{
			icon: '/img/icons/home.svg',
			title: 'Free Shipping',
			description: 'Free shipping for orders over $99',
		},
		{
			icon: '/img/icons/securePayment.svg',
			title: 'Money Guarantee',
			description: 'Within 30 days for an exchange',
		},
		{
			icon: '/img/icons/call.svg',
			title: 'Online Support',
			description: '24 hours a day, 7 days a week',
		},
		{
			icon: '/img/icons/security.svg',
			title: 'Flexible Payment',
			description: 'Pay with Multiple Credit Cards',
		},
	];

	if (device === 'mobile') {
		return <div>ABOUT US PAGE MOBILE</div>;
	} else {
		return (
			<div id="about-page">
				{/* Hero Section */}
				<Stack className="hero-section">
					<img src="/img/aboutus.webp" alt="About Carmoa" className="hero-image" />
				</Stack>

				<div className="container">
					{/* Introduction Section */}
					<Stack className="intro-section">
						<Typography className="intro-text">
							Welcome to CarMoa — Korea’s trusted marketplace for high-quality automotive parts, accessories, and
							professional dealer services. We are committed to making car maintenance, repair, and upgrades easier,
							faster, and more reliable for everyone — from daily drivers to passionate car enthusiasts.
						</Typography>
						<Typography className="intro-text">
							At CarMoa, we focus on quality, transparency, and customer satisfaction. Every product listed on our
							platform is carefully reviewed to meet strict standards, ensuring customers receive only durable and
							reliable auto parts. Our dealer partners and service providers are selected with the same level of care,
							offering expert knowledge and professional support across every category.
						</Typography>
						<Typography className="intro-text">
							Backed by years of industry understanding and a growing network of trusted suppliers, CarMoa is designed
							to give you a simple, safe, and modern shopping experience, whether you're searching for essential
							replacements, performance upgrades, or specialized components.
						</Typography>
						<Typography className="intro-text">
							Our mission is to connect drivers with the right parts at the right time — with trusted dealers, fast
							response, and a platform that puts convenience first.
						</Typography>
						<Typography className="intro-text">
							Welcome to the future of auto-parts shopping. Welcome to CarMoa.
						</Typography>
					</Stack>

					{/* Statistics Section */}
					<Stack className="statistics-section">
						{statistics.map((stat, index) => (
							<Stack key={index} className="stat-item">
								<Typography className="stat-value">{stat.value}+</Typography>
								<Typography className="stat-label">{stat.label}</Typography>
							</Stack>
						))}
					</Stack>
				</div>

				{/* Advertisement Section */}
				<Advertisement videoSrc="/video/aboutUS.mp4" />

				<div className="container">
					{/* Team Section */}
					<Stack className="team-section">
						<Typography className="section-title">Meet Our Team</Typography>
						<Stack className="team-grid">
							{teamMembers.map((member) => (
								<DealerCard key={member.id} dealer={member} />
							))}
						</Stack>
					</Stack>

					{/* Features Section */}
					<Stack className="features-section">
						{features.map((feature, index) => (
							<FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
						))}
					</Stack>
				</div>
			</div>
		);
	}
};

export default withLayoutBasic(AboutUs);
