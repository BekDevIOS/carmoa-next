import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				{/* Google Identity Services */}
				<script src="https://accounts.google.com/gsi/client" async defer></script>

				{/* Robots + Favicon */}
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/png" href="/img/logo/favicon.png" />

				{/* SEO Meta */}
				<meta
					name="keywords"
					content={
						'carmoa, carmoa.kr, auto parts korea, car marketplace, car parts store, used auto parts, new car parts, B2B car platform, nestjs nextjs fullstack'
					}
				/>
				<meta
					name="description"
					content={
						'CarMoa — your all-in-one marketplace for auto parts and accessories in South Korea. Buy and sell new or used car parts easily from trusted dealers. | ' +
						'카모아 — 대한민국 최고의 자동차 부품 마켓플레이스. 믿을 수 있는 판매자와 함께 새 부품과 중고 부품을 쉽고 빠르게 사고팔 수 있습니다. | ' +
						'CarMoa — платформа для покупки и продажи автомобильных запчастей в Южной Корее. Новые и б/у запчасти от проверенных дилеров.'
					}
				/>

				{/* Open Graph for social sharing */}
				<meta property="og:title" content="CarMoa — Auto Parts Marketplace" />
				<meta
					property="og:description"
					content="Find and sell auto parts easily in Korea. Engine, brakes, suspension, accessories — all from verified dealers."
				/>
				<meta property="og:image" content="/img/og-preview.png" />
				<meta property="og:url" content="https://carmoa.kr" />
				<meta property="og:type" content="website" />

				{/* Twitter Card */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="CarMoa — Auto Parts Marketplace" />
				<meta
					name="twitter:description"
					content="Explore thousands of new and used auto parts from verified Korean dealers — CarMoa.kr"
				/>
				<meta name="twitter:image" content="/img/og-preview.png" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
