import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, Checkbox, Stack, Typography, Tabs, Tab, OutlinedInput, Chip, IconButton } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { NextPage } from 'next';
import Review from '../../libs/components/product/Review';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';
import ProductCard from '../../libs/components/common/ProductCard';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useRouter } from 'next/router';
import { Pagination as MuiPagination } from '@mui/material';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import 'swiper/css';
import 'swiper/css/pagination';
import dynamic from 'next/dynamic';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

const ReactImageMagnify = dynamic(() => import('react-image-magnify'), { ssr: false });
const Lightbox = dynamic(() => import('yet-another-react-lightbox'), { ssr: false });

SwiperCore.use([Autoplay, Navigation, Pagination]);

// export const getStaticProps = async ({ locale }: any) => ({
// 	props: {
// 		...(await serverSideTranslations(locale, ['common'])),
// 	},
// });

interface Product {
	id: number;
	images: string[];
	title: string;
	originalPrice?: number;
	salePrice: number;
	isSale: boolean;
	stockStatus: 'In stock' | 'Out of stock';
	brands: string[];
	category: string;
	description: string;
	additionalInfo: Record<string, string>;
	compatibility?: string;
	condition?: 'New' | 'Used' | 'Refurbished';
	saleEndDate?: Date;
	estimatedDelivery?: string;
	viewersCount?: number;
	soldCount?: number;
	rating?: number;
}

const ProductDetail: NextPage = ({ ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [productId, setProductId] = useState<string | null>(null);
	const [product, setProduct] = useState<Product | null>(null);
	const [selectedImage, setSelectedImage] = useState<string>('');
	const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
	const [quantity, setQuantity] = useState<number>(1);
	const [activeTab, setActiveTab] = useState<number>(0);
	const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
	const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
	const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
	const [productComments, setProductComments] = useState<any[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [insertCommentData, setInsertCommentData] = useState<{
		commentContent: string;
		commentRefId: string;
	}>({
		commentContent: '',
		commentRefId: '',
	});
	const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
	const [lightboxIndex, setLightboxIndex] = useState<number>(0);

	// Sample product data - replace with API call
	useEffect(() => {
		// Always load sample data (in production, check if router.query.id exists before API call)
		const productIdToUse = (router.query.id as string) || '1';
		setProductId(productIdToUse);

		// Sample product data
		const sampleProduct: Product = {
			id: 1,
			images: ['/img/product/image1.png', '/img/product/image2.png', '/img/product/image1.png'],
			title: 'Auto Headlamp Conversion Light Kit',
			originalPrice: 489.0,
			salePrice: 456.0,
			isSale: true,
			stockStatus: 'In stock',
			brands: ['Chevrolet', 'Ford', 'Honda', 'KN', 'Volkswagen'],
			category: 'Lighting',
			description: `* PALM-SIZED, ON THE GO: Measuring just 6.49*2.75*1.96 inches and weighing just 1.12 pounds, the tire inflator is handheld, allowing it to perfectly fit in glove boxes or garages, and be taken anywhere. With the included quick connector, you can easily snap it onto the valve and enjoy one-step inflation wherever you roam.
* UP TO 40MINS BATTERY LIFE: The tire air pump has a large 6600mAh battery capacity that unleashes massive energy and extends usage time. With just one full charge, you can inflate 8 car tires (225/75/R17) over its 40-minute non-stop runtime. Say goodbye to quick battery draining, and insufficient power.
* 90s ULTRA-FAST INFLATION: The portable tire inflator delivers powerful inflation up to 150PSI. It can quickly refill a car tire (225/75 R17) from 30PSI to 36PSI in just 90 seconds. This portable tire inflator is a must-have for emergency preparedness and efficient refilling.
* 5 PRESET MODES, ONE-PRESS START: The air compressor portable tire inflator provides 5 smart inflation modes (car, motorcycle, bike, ball, and custom) and 4 pressure units (PSI, kPa, Bar, kg/cm²). The beginner-friendly one-click start provides easy operation, it will automatically shut off once it reaches the preset value. Ensuring you have a quick and convenient inflation process.
* FOR MULTIPURPOSE USE: Thanks to its 3 light modes (SOS, flashlight, and strobe), the pocket air pro tire Inflator makes it easy to handle any outdoor activity. Its USB output also works as a power bank, preventing your phone from dying while you're off-grid.`,
			additionalInfo: {
				Color: 'Black',
			},
			compatibility: 'Hyundai Avante 2016–2020',
			condition: 'New',
			saleEndDate: new Date(Date.now() + 470 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000 + 20 * 60 * 1000 + 9 * 1000),
			estimatedDelivery: 'Nov 18 - Nov 23',
			viewersCount: 131,
			soldCount: 80,
			rating: 5,
		};
		setProduct(sampleProduct);
		setSelectedImage(sampleProduct.images[0]);
		setCurrentImageIndex(0);

		// Sample related products
		setRelatedProducts([
			{
				id: 2,
				images: ['/img/product/image2.png'],
				title: 'Auto Dynasty RAV4 Headlight Kit',
				salePrice: 523.0,
				isSale: false,
				stockStatus: 'In stock',
				brands: ['Toyota'],
				category: 'Lighting',
				description: 'Sample description',
				additionalInfo: {},
				rating: 5,
			},
			{
				id: 3,
				images: ['/img/product/image1.png'],
				title: 'Car Easy Installation Beauty Light Orland',
				salePrice: 512.0,
				isSale: false,
				stockStatus: 'In stock',
				brands: ['Generic'],
				category: 'Lighting',
				description: 'Sample description',
				additionalInfo: {},
				rating: 5,
			},
			{
				id: 4,
				images: ['/img/product/image2.png'],
				title: 'Factory Style Halogen Headlights',
				salePrice: 555.0,
				isSale: false,
				stockStatus: 'In stock',
				brands: ['Generic'],
				category: 'Lighting',
				description: 'Sample description',
				additionalInfo: {},
				rating: 5,
			},
			{
				id: 5,
				images: ['/img/product/image1.png'],
				title: 'Pair of HWstar H6054 LED Headlights',
				salePrice: 543.0,
				isSale: false,
				stockStatus: 'In stock',
				brands: ['HWstar'],
				category: 'Lighting',
				description: 'Sample description',
				additionalInfo: {},
				rating: 5,
			},
			{
				id: 6,
				images: ['/img/product/image2.png'],
				title: 'Auto Dynasty Cadillac Escalade Headlight Kit',
				originalPrice: 414.0,
				salePrice: 390.0,
				isSale: true,
				stockStatus: 'In stock',
				brands: ['Cadillac'],
				category: 'Lighting',
				description: 'Sample description',
				additionalInfo: {},
				rating: 5,
			},
		]);

		// Sample recently viewed products
		setRecentlyViewed([
			{
				id: 7,
				images: ['/img/product/image1.png'],
				title: '2 In 1 Booster Car Seat',
				originalPrice: 300.0,
				salePrice: 268.0,
				isSale: true,
				stockStatus: 'In stock',
				brands: ['Generic'],
				category: 'Accessories',
				description: 'Sample description',
				additionalInfo: {},
				rating: 5,
			},
			{
				id: 8,
				images: ['/img/product/image2.png'],
				title: 'Astro 4 Portable Tire Inflator Air compressor Easy',
				originalPrice: 275.0,
				salePrice: 200.0,
				isSale: true,
				stockStatus: 'In stock',
				brands: ['Astro'],
				category: 'Tools',
				description: 'Sample description',
				additionalInfo: {},
				rating: 5,
			},
			{
				id: 9,
				images: ['/img/product/image1.png'],
				title: '15 Piece Car Interior Cleaning Kit',
				salePrice: 287.0,
				isSale: false,
				stockStatus: 'In stock',
				brands: ['Generic'],
				category: 'Accessories',
				description: 'Sample description',
				additionalInfo: {},
				rating: 5,
			},
			{
				id: 10,
				images: ['/img/product/image1.png'],
				title: 'Auto Headlamp Conversion Light Kit',
				originalPrice: 489.0,
				salePrice: 456.0,
				isSale: true,
				stockStatus: 'In stock',
				brands: ['Chevrolet', 'Ford', 'Honda'],
				category: 'Lighting',
				description: 'Sample description',
				additionalInfo: {},
				rating: 5,
			},
		]);

		setInsertCommentData({
			commentContent: '',
			commentRefId: productIdToUse,
		});
	}, [router.query.id]);

	/** HANDLERS **/
	const handleImageChange = (image: string, index: number) => {
		setSelectedImage(image);
		setCurrentImageIndex(index);
	};

	const handlePreviousImage = () => {
		if (product?.images && product.images.length > 0) {
			const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : product.images.length - 1;
			setCurrentImageIndex(newIndex);
			setSelectedImage(product.images[newIndex]);
		}
	};

	const handleNextImage = () => {
		if (product?.images && product.images.length > 0) {
			const newIndex = currentImageIndex < product.images.length - 1 ? currentImageIndex + 1 : 0;
			setCurrentImageIndex(newIndex);
			setSelectedImage(product.images[newIndex]);
		}
	};

	const handleQuantityChange = (value: number) => {
		if (value >= 1) {
			setQuantity(value);
		}
	};

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue);
	};

	const handleAddToCart = () => {
		console.log('Add to cart:', product?.id, 'Quantity:', quantity);
	};

	const handleWishlist = () => {
		setIsWishlisted(!isWishlisted);
		console.log('Wishlist:', product?.id);
	};

	const handleOpenLightbox = () => {
		setLightboxIndex(currentImageIndex);
		setLightboxOpen(true);
	};

	const handleBuyNow = () => {
		console.log('Buy now:', product?.id, 'Quantity:', quantity);
	};

	const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		// Handle pagination when comment API is integrated
		console.log('Page changed to:', value);
	};

	// Countdown timer calculation
	const getTimeRemaining = () => {
		if (!product?.saleEndDate) return null;
		const now = new Date().getTime();
		const end = new Date(product.saleEndDate).getTime();
		const difference = end - now;

		if (difference <= 0) return null;

		const days = Math.floor(difference / (1000 * 60 * 60 * 24));
		const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((difference % (1000 * 60)) / 1000);

		return { days, hours, minutes, seconds };
	};

	const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining());

	// useEffect(() => {
	// 	if (product?.saleEndDate) {
	// 		const timer = setInterval(() => {
	// 			setTimeRemaining(getTimeRemaining());
	// 		}, 1000);

	// 		return () => clearInterval(timer);
	// 	}
	// }, [product?.saleEndDate]);

	console.log('product?.images', product?.images[0]);
	if (device === 'mobile') {
		return <div>PRODUCT DETAIL PAGE</div>;
	} else {
		return (
			<Stack id={'product-detail-page'}>
				<Stack className={'container'}>
					{/* Main Product Section */}
					<Stack className={'product-detail-main'} direction={'row'} spacing={4} mb={'60px'}>
						{/* Image Gallery */}
						<Stack className="product-gallery">
							<div className="main-image-wrapper">
								{/* SALE BADGE */}
								{product?.isSale && (
									<div className="sale-badge">
										<span className="sale-text">SALE</span>
									</div>
								)}

							{/* NEXT / PREV BUTTONS */}
							{product?.images && product.images.length > 1 && (
								<>
									<button className="image-nav-btn prev-btn" onClick={handlePreviousImage}>
										<WestIcon />
									</button>
									<button className="image-nav-btn next-btn" onClick={handleNextImage}>
										<EastIcon />
									</button>
								</>
							)}

							{/* MAGNIFY IMAGE */}
							<div className="magnify-container" onClick={handleOpenLightbox}>
								<ReactImageMagnify
									{...{
										smallImage: {
											alt: product?.title || '',
											isFluidWidth: true,
											src: selectedImage || product?.images?.[0] || '',
										},
										largeImage: {
											src: selectedImage || product?.images?.[0] || '',
											width: 1200,
											height: 1200,
										},
										lensStyle: {
											backgroundColor: 'rgba(255,255,255,0.4)',
											border: '2px solid rgba(0,0,0,0.2)',
											borderRadius: '50%',
										},
										shouldUsePositiveSpaceLens: true,
										enlargedImagePosition: 'over',
									}}
								/>
							</div>
							</div>

						{/* THUMBNAILS */}
						{product?.images && product.images.length > 1 && (
							<div className="thumbnail-section">
								<div className="thumbnail-images">
									{product.images.map((image, index) => (
										<div
											key={index}
											className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
											onClick={() => handleImageChange(image, index)}
										>
											<img src={image} alt={`Thumbnail ${index + 1}`} />
										</div>
									))}
								</div>
							</div>
						)}
						</Stack>

						{/* Product Information */}
						<Stack className={'product-info'} flex={1}>
							<Typography variant="h4" className={'product-title'}>
								{product?.title}
							</Typography>

							{/* Brands */}
							{product?.brands && product.brands.length > 0 && (
								<Stack className={'brands-section'} mt={'12px'} mb={'16px'}>
									<Stack direction={'row'} spacing={1} flexWrap={'wrap'}>
										<Typography className={'brands-label'}>Brands:</Typography>
										{product.brands.map((brand, index) => (
											<Chip key={index} label={brand} className={'brand-chip'} />
										))}
									</Stack>
								</Stack>
							)}

							{/* Social Proof */}
							<Stack className={'social-proof'} mb={'16px'} gap={'16px'}>
								<Stack sx={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
									{product?.viewersCount && (
										<Stack direction={'row'} alignItems={'center'} spacing={1} className={'social-proof-item'}>
											<RemoveRedEyeIcon className={'view-icon'} />
											<Typography className={'viewers-count'}>{product.viewersCount} views</Typography>
										</Stack>
									)}
									{product?.soldCount && (
										<Stack direction={'row'} alignItems={'center'} spacing={1} className={'social-proof-item'}>
											<LocalFireDepartmentIcon className={'fire-icon'} />
											<Typography className={'sold-count'}>{product.soldCount} sold</Typography>
										</Stack>
									)}
								</Stack>
								{product?.stockStatus === 'In stock' && (
									<Stack direction={'row'} alignItems={'center'} spacing={1} className={'social-proof-item'}>
										<CheckCircleIcon className={'stock-icon'} />
										<Typography className={'stock-status'}>{product.stockStatus}</Typography>
									</Stack>
								)}
							</Stack>

							{/* Description */}
							<Typography className={'product-description'} mb={'20px'}>
								Premium headlamp conversion kit with high-brightness LED, durable housing, and full compatibility with
								Hyundai Avante 2016–2020.
							</Typography>

							{/* Pricing */}
							<Stack className={'pricing-section'} mb={'20px'}>
								{product?.originalPrice && (
									<Typography className={'original-price'}>${product.originalPrice.toFixed(2)}</Typography>
								)}
								<Typography className={'current-price'}>${product?.salePrice.toFixed(2)}</Typography>
							</Stack>

							{/* Countdown Timer */}
							{product?.isSale && timeRemaining && (
								<Stack className={'countdown-timer'} mb={'24px'}>
									<Stack direction={'row'} alignItems={'center'} spacing={1} className={'countdown-title'}>
										<AccessTimeIcon className={'clock-icon'} />
										<Typography>Hurry up! Sale end in:</Typography>
									</Stack>
									<Stack className={'countdown-display'} direction={'row'} spacing={0} alignItems={'center'}>
										<Box className={'countdown-item'}>
											<Typography className={'countdown-value'}>{timeRemaining.days}d</Typography>
										</Box>
										<Typography className={'countdown-separator'}>:</Typography>
										<Box className={'countdown-item'}>
											<Typography className={'countdown-value'}>{timeRemaining.hours}h</Typography>
										</Box>
										<Typography className={'countdown-separator'}>:</Typography>
										<Box className={'countdown-item'}>
											<Typography className={'countdown-value'}>{timeRemaining.minutes}m</Typography>
										</Box>
									</Stack>
								</Stack>
							)}

							{/* Quantity Selector & Action Buttons */}
							<Stack className={'quantity-and-actions'} direction={'row'} alignItems={'center'} spacing={2} mb={'24px'}>
								<Stack className={'quantity-section'}>
									<Typography className={'quantity-label'}>Quantity:</Typography>
									<Stack direction={'row'} alignItems={'center'} className={'quantity-controls'}>
										<Button
											variant="outlined"
											onClick={() => handleQuantityChange(quantity - 1)}
											disabled={quantity <= 1}
											className={'quantity-btn'}
										>
											-
										</Button>
										<OutlinedInput
											type="number"
											value={quantity}
											onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
											className={'quantity-input'}
											inputProps={{ min: 1 }}
										/>
										<Button
											variant="outlined"
											onClick={() => handleQuantityChange(quantity + 1)}
											className={'quantity-btn'}
										>
											+
										</Button>
									</Stack>
								</Stack>
								<Button
									className={'add-to-cart-btn'}
									onClick={handleAddToCart}
									startIcon={<ShoppingCartOutlinedIcon />}
								>
									ADD TO CART
								</Button>
								<IconButton className={'wishlist-btn'} onClick={handleWishlist}>
									{isWishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
								</IconButton>
								<IconButton className={'compare-btn'} onClick={() => console.log('Compare:', product?.id)}>
									<CompareArrowsIcon />
								</IconButton>
							</Stack>

							{/* Buy Now */}
							<Stack className={'buy-now-section'} mb={'20px'}>
								<Stack direction={'row'} alignItems={'center'} spacing={1} mb={'12px'}>
									<Checkbox className={'terms-checkbox'} />
									<Typography className={'terms-text'}>
										I agree with the{' '}
										<Link href={'/terms'} className={'terms-link'}>
											Terms and Conditions
										</Link>
									</Typography>
								</Stack>
								<Button className={'buy-now-btn'} onClick={handleBuyNow}>
									BUY NOW
								</Button>
							</Stack>

							{/* Estimated Delivery */}
							{product?.estimatedDelivery && (
								<Typography className={'estimated-delivery'}>
									Estimated Delivery: <span className={'delivery-date-range'}>{product.estimatedDelivery}</span>
								</Typography>
							)}

							{/* Category */}
							{product?.category && (
								<Typography className={'product-category'}>
									Category: <Link href={`/products?category=${product.category}`}>{product.category}</Link>
								</Typography>
							)}
						</Stack>
					</Stack>
				</Stack>

				{/* Product Tabs */}
				<Stack className={'product-tabs-section'} mb={'60px'}>
					<Stack className={'container'}>
						{/* Vertical Tabs on Left */}
						<Tabs
							value={activeTab}
							onChange={handleTabChange}
							orientation="vertical"
							variant="scrollable"
							className={'product-tabs'}
						>
							<Tab label="Description" />
							<Tab label="Additional Information" />
							<Tab label={`Reviews (${commentTotal})`} />
						</Tabs>

						{/* Tab Panels on Right */}
						<Stack className={'tab-panels'}>
							<Box className={'tab-panel'} hidden={activeTab !== 0}>
								{product?.description && (
									<Stack className={'description-content'}>
										{product.description.split('\n').map((paragraph, index) => {
											if (paragraph.trim().startsWith('*')) {
												// Bullet point format
												const bulletText = paragraph.trim().substring(1).trim();
												const parts = bulletText.split(':');
												if (parts.length >= 2) {
													const title = parts[0].trim();
													const content = parts.slice(1).join(':').trim();
													return (
														<Stack key={index} className={'description-item'} direction={'row'} spacing={1}>
															<Typography className={'bullet'}>•</Typography>
															<Stack>
																<Typography className={'description-title'} component={'span'}>
																	{title}:
																</Typography>{' '}
																<Typography className={'description-text'} component={'span'}>
																	{content}
																</Typography>
															</Stack>
														</Stack>
													);
												}
											}
											return (
												<Typography key={index} className={'tab-content'} mb={'12px'}>
													{paragraph}
												</Typography>
											);
										})}
									</Stack>
								)}
							</Box>

							<Box className={'tab-panel'} hidden={activeTab !== 1}>
								<Stack className={'additional-info'}>
									{product?.additionalInfo &&
										Object.entries(product.additionalInfo).map(([key, value]) => (
											<Stack key={key} direction={'row'} className={'info-row'}>
												<Typography className={'info-key'}>{key}:</Typography>
												<Typography className={'info-value'}>{value}</Typography>
											</Stack>
										))}
								</Stack>
							</Box>

							<Box className={'tab-panel'} hidden={activeTab !== 2}>
								<Stack className={'reviews-section'}>
									<Typography className={'reviews-heading'}>Reviews</Typography>

									{commentTotal === 0 ? (
										<Stack className={'no-reviews'}>
											<Typography className={'no-reviews-text'}>There are no reviews yet.</Typography>
										</Stack>
									) : (
										<Stack className={'reviews-list'}>
											{productComments?.map((comment: any, index: number) => (
												<Review comment={comment} key={comment?._id || index} rating={product?.rating} />
											))}
											{commentTotal > 5 && (
												<Box component={'div'} className={'pagination-box'}>
													<MuiPagination
														page={1}
														count={Math.ceil(commentTotal / 5)}
														onChange={commentPaginationChangeHandler}
														shape="circular"
														color="primary"
													/>
												</Box>
											)}
										</Stack>
									)}

									{/* Leave Review Form */}
									<Stack className={'leave-review-form'}>
										<Typography className={'review-form-title'}>Be the first to review "{product?.title}"</Typography>

										<Stack className={'rating-section'}>
											<Typography className={'rating-label'}>
												Your rating <span className={'required'}>*</span>
											</Typography>
											<Stack direction={'row'} className={'star-rating-selector'}>
												{[1, 2, 3, 4, 5].map((star) => (
													<IconButton key={star} className={'star-btn'}>
														<StarBorderIcon className={'star-icon'} />
													</IconButton>
												))}
											</Stack>
										</Stack>

										<textarea
											className={'review-textarea'}
											placeholder={'Your review *'}
											onChange={({ target: { value } }: any) => {
												setInsertCommentData({ ...insertCommentData, commentContent: value });
											}}
											value={insertCommentData.commentContent}
										/>

										<Button className={'submit-review-btn'} disabled={insertCommentData.commentContent === ''}>
											Submit
										</Button>
									</Stack>
								</Stack>
							</Box>
						</Stack>
					</Stack>
				</Stack>

				{/* Related Products */}
				{relatedProducts.length > 0 && (
					<Stack className={'related-products-section'}>
						<Stack className={'container'}>
							<Typography variant="h3" className={'section-title'}>
								Related Products
							</Typography>
							<Stack className={'related-products-wrapper'} direction={'row'} spacing={2}>
								<Box component={'div'} className={'swiper-nav-btn swiper-related-prev'}>
									<WestIcon />
								</Box>
								<Box component={'div'} className={'swiper-container'}>
									<Swiper
										className={'related-products-swiper'}
										slidesPerView={4}
										spaceBetween={24}
										modules={[Navigation]}
										navigation={{
											nextEl: '.swiper-related-next',
											prevEl: '.swiper-related-prev',
										}}
									>
										{relatedProducts.map((relatedProduct) => (
											<SwiperSlide key={relatedProduct.id} className={'related-product-slide'}>
												<ProductCard
													product={{
														id: relatedProduct.id,
														image: relatedProduct.images[0],
														title: relatedProduct.title,
														salePrice: relatedProduct.salePrice,
														originalPrice: relatedProduct.originalPrice,
														isSale: relatedProduct.isSale,
													}}
													addToCartHandler={(id) => console.log('Add to cart:', id)}
													wishlistHandler={(id) => console.log('Add to wishlist:', id)}
													compareHandler={(id) => console.log('Add to compare:', id)}
													quickViewHandler={(id) => console.log('Quick view:', id)}
												/>
											</SwiperSlide>
										))}
									</Swiper>
								</Box>
								<Box component={'div'} className={'swiper-nav-btn swiper-related-next'}>
									<EastIcon />
								</Box>
							</Stack>
						</Stack>
					</Stack>
				)}

				{/* Recently Viewed Products */}
				{recentlyViewed.length > 0 && (
					<Stack className={'recently-viewed-section'}>
						<Stack className={'container'}>
							<Typography variant="h3" className={'section-title'}>
								Recent Viewed Products
							</Typography>
							<Stack className={'recently-viewed-wrapper'} direction={'row'} spacing={2}>
								<Box component={'div'} className={'swiper-nav-btn swiper-recent-prev'}>
									<WestIcon />
								</Box>
								<Box component={'div'} className={'swiper-container'}>
									<Swiper
										className={'recently-viewed-swiper'}
										slidesPerView={4}
										spaceBetween={24}
										modules={[Navigation]}
										navigation={{
											nextEl: '.swiper-recent-next',
											prevEl: '.swiper-recent-prev',
										}}
									>
										{recentlyViewed.map((recentProduct) => (
											<SwiperSlide key={recentProduct.id} className={'recent-product-slide'}>
												<ProductCard
													product={{
														id: recentProduct.id,
														image: recentProduct.images[0],
														title: recentProduct.title,
														salePrice: recentProduct.salePrice,
														originalPrice: recentProduct.originalPrice,
														isSale: recentProduct.isSale,
													}}
													addToCartHandler={(id) => console.log('Add to cart:', id)}
													wishlistHandler={(id) => console.log('Add to wishlist:', id)}
													compareHandler={(id) => console.log('Add to compare:', id)}
													quickViewHandler={(id) => console.log('Quick view:', id)}
												/>
											</SwiperSlide>
										))}
									</Swiper>
								</Box>
								<Box component={'div'} className={'swiper-nav-btn swiper-recent-next'}>
									<EastIcon />
								</Box>
							</Stack>
						</Stack>
					</Stack>
				)}

				{/* Fullscreen Image Lightbox */}
				{product?.images && (
					<Lightbox
						open={lightboxOpen}
						close={() => setLightboxOpen(false)}
						index={lightboxIndex}
						slides={product.images.map((img) => ({ src: img }))}
						plugins={[Thumbnails, Zoom]}
						thumbnails={{
							position: 'bottom',
							width: 120,
							height: 80,
							border: 0,
							borderRadius: 4,
							padding: 0,
							gap: 16,
						}}
						zoom={{
							maxZoomPixelRatio: 3,
							scrollToZoom: true,
						}}
						on={{
							view: ({ index }) => {
								setLightboxIndex(index);
								setCurrentImageIndex(index);
								setSelectedImage(product.images[index]);
							},
						}}
						styles={{
							container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' },
						}}
						carousel={{
							finite: product.images.length <= 1,
						}}
					/>
				)}
			</Stack>
		);
	}
};

ProductDetail.defaultProps = {
	initialComment: {},
};

export default withLayoutBasic(ProductDetail);
