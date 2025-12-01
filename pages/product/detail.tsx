import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Box, Button, Checkbox, Stack, Typography, Tabs, Tab, OutlinedInput, Chip, IconButton, CircularProgress } from '@mui/material';
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
import StarIcon from '@mui/icons-material/Star';
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
import { useLazyQuery, useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Product } from '../../libs/types/product/product';
import { ProductsInquiry } from '../../libs/types/product/product.input';
import { GET_COMMENTS, GET_PRODUCT, GET_PRODUCTS, GET_FAVORITES } from '../../apollo/user/query';
import { LIKE_TARGET_PRODUCT, CREATE_COMMENT } from '../../apollo/user/mutation';
import { userVar } from '../../apollo/store';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Direction, Message } from '../../libs/enums/common.enum';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { REACT_APP_API_URL } from '../../libs/config';
import { T } from '../../libs/types/common';
import { useCart } from '../../libs/hooks/useCart';
import { useCompare } from '../../libs/hooks/useCompare';

const ReactImageMagnify = dynamic(() => import('react-image-magnify'), { ssr: false });
const Lightbox = dynamic(() => import('yet-another-react-lightbox'), { ssr: false });

SwiperCore.use([Autoplay, Navigation, Pagination]);

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

type ProductDetailData = Product & {
	saleEndDate?: Date | string;
	compatibility?: string;
	estimatedDelivery?: string;
	viewersCount?: number;
	// Legacy rating field used by existing UI; prefer ratingAverage when available.
	rating?: number;
};

const ProductDetail: NextPage = ({ initialComment, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { addToCart } = useCart();
	const { isCompared, toggleCompare } = useCompare();
	const [productId, setProductId] = useState<string | null>(null);
	const [product, setProduct] = useState<ProductDetailData | null>(null);
	const [selectedImage, setSelectedImage] = useState<string>('');
	const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
	const [quantity, setQuantity] = useState<number>(1);
	const [activeTab, setActiveTab] = useState<number>(0);
	const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
	const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
	const [productComments, setProductComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
	const [lightboxIndex, setLightboxIndex] = useState<number>(0);
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [selectedRating, setSelectedRating] = useState<number | null>(null);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.PRODUCT,
		commentContent: '',
		commentRefId: '',
	});

	const [likeTargetProductMutation] = useMutation(LIKE_TARGET_PRODUCT);
	const [createComment] = useMutation(CREATE_COMMENT);

	const [loadRelatedProducts] = useLazyQuery(GET_PRODUCTS, {
		fetchPolicy: 'network-only',
		onCompleted: (data: T) => {
			const list: Product[] = data?.getProducts?.list || [];
			setRelatedProducts(list);
		},
		onError: (error) => {
			sweetMixinErrorAlert(error.message).then();
		},
	});

	const [loadRecentProducts] = useLazyQuery(GET_PRODUCTS, {
		fetchPolicy: 'network-only',
		onCompleted: (data: T) => {
			const list: Product[] = data?.getProducts?.list || [];
			setRecentlyViewed(list);
		},
		onError: (error) => {
			sweetMixinErrorAlert(error.message).then();
		},
	});

	const { loading: getProductLoading, refetch: getProductRefetch } = useQuery(GET_PRODUCT, {
		fetchPolicy: 'network-only',
		variables: productId ? { input: productId } : undefined,
		skip: !productId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getProduct) {
				const p = data.getProduct as ProductDetailData;
				const ratingAvg = p.ratingAverage ?? p.productRank ?? 0;
				setProduct({
					...p,
					viewersCount: p.productViews,
					rating: ratingAvg,
				});
			} else {
				setProduct(null);
			}
		},
		onError: (error) => {
			sweetMixinErrorAlert(error.message).then();
		},
	});

	const { refetch: getCommentsRefetch } = useQuery(GET_COMMENTS, {
		fetchPolicy: 'network-only',
		variables: { input: commentInquiry },
		skip: !commentInquiry.search.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getComments?.list) setProductComments(data.getComments.list);
			setCommentTotal(data?.getComments?.metaCounter?.[0]?.total ?? 0);
		},
		onError: (error) => {
			sweetMixinErrorAlert(error.message).then();
		},
	});

	useEffect(() => {
		if (!router.isReady) return;
		if (router.query.id) {
			const id = router.query.id as string;
			setProductId(id);
			setCommentInquiry((prev) => ({
				...prev,
				search: {
					commentRefId: id,
				},
			}));
			setInsertCommentData((prev) => ({
				...prev,
				commentRefId: id,
			}));
		}
	}, [router.isReady, router.query.id]);

	useEffect(() => {
		if (commentInquiry.search.commentRefId) {
			getCommentsRefetch({ input: commentInquiry });
		}
	}, [commentInquiry, getCommentsRefetch]);

	const relatedProductsInput = useMemo<ProductsInquiry | null>(() => {
		if (!product) return null;
		const search: ProductsInquiry['search'] = {};
		
		// Use main category and brand for broader results (exclude subcategory to get more products)
		//:TODO: use options instead of conditionList(condition is for developing purpose)
		if (product.productCondition) search.conditionList = [product.productCondition];
		
		return {
			page: 1,
			limit: 10, // Request more products to ensure we have enough after filtering
			sort: 'createdAt',
			direction: Direction.DESC,
			search,
		};
	}, [product]);

	const recentProductsInput = useMemo<ProductsInquiry>(
		() => ({
			page: 1,
			limit: 8,
			sort: 'createdAt',
			direction: Direction.DESC,
			search: {},
		}),
		[],
	);

	useEffect(() => {
		if (relatedProductsInput) {
			loadRelatedProducts({
				variables: { input: relatedProductsInput },
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [relatedProductsInput]);

	useEffect(() => {
		loadRecentProducts({
			variables: { input: recentProductsInput },
		});
	}, [loadRecentProducts, recentProductsInput]);

	const formatText = (value?: string | number | null) => {
		if (value === undefined || value === null) return '';
		if (typeof value === 'number') return value.toString();
		return value
			.split('_')
			.map((word) => word.charAt(0) + word.slice(1).toLowerCase())
			.join(' ');
	};

	const productImages = useMemo(() => {
		if (!product?.productImages?.length) {
			return ['/img/product/image1.png'];
		}
		return product.productImages.map((img) => (img?.startsWith('http') ? img : `${REACT_APP_API_URL}/${img}`));
	}, [product?.productImages]);

	useEffect(() => {
		if (productImages.length) {
			setSelectedImage(productImages[0]);
			setCurrentImageIndex(0);
		}
	}, [productImages]);

	const brandChips = useMemo(() => {
		const chips: string[] = [];
		if (product?.productCarBrand) chips.push(formatText(product.productCarBrand));
		if (product?.productCarModel) chips.push(product.productCarModel);
		if (product?.productMainCategory) chips.push(formatText(product.productMainCategory));
		return chips;
	}, [product]);

	const additionalInfoEntries = useMemo(() => {
		if (!product) return [];
		const info: [string, string][] = [];
		if (product.productCarBrand) info.push(['Brand', formatText(product.productCarBrand)]);
		if (product.productCarModel) info.push(['Model', product.productCarModel]);
		if (product.productYearFrom || product.productYearTo) {
			const range =
				product.productYearFrom && product.productYearTo
					? `${product.productYearFrom} - ${product.productYearTo}`
					: product.productYearFrom
					? `${product.productYearFrom}+`
					: `${product.productYearTo}`;
			info.push(['Year Range', range]);
		}
		if (product.productCondition) info.push(['Condition', formatText(product.productCondition)]);
		if (product.productMainCategory) info.push(['Main Category', formatText(product.productMainCategory)]);
		if (product.productSubCategory) info.push(['Sub Category', formatText(product.productSubCategory)]);
		if (product.productOemNumbers?.length) info.push(['OEM Numbers', product.productOemNumbers.join(', ')]);
		return info;
	}, [product]);

	const compatibilityText = useMemo(() => {
		if (!product) return '';
		const brand = product.productCarBrand ? formatText(product.productCarBrand) : '';
		const model = product.productCarModel || '';
		const years =
			product.productYearFrom && product.productYearTo
				? `${product.productYearFrom}–${product.productYearTo}`
				: product.productYearFrom
				? `${product.productYearFrom}+`
				: '';
		return [brand, model, years].filter(Boolean).join(' ');
	}, [product]);

	const stockStatus = useMemo(() => {
		if (product?.productStock === undefined) return undefined;
		return product.productStock > 0 ? 'In stock' : 'Out of stock';
	}, [product?.productStock]);

	const isOnSale = Boolean(product?.productSalePrice && product.productSalePrice > 0);

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

	useEffect(() => {
		if (product?.saleEndDate) {
			const timer = setInterval(() => {
				setTimeRemaining(getTimeRemaining());
			}, 1000);

			return () => clearInterval(timer);
		}
		setTimeRemaining(null);
	}, [product?.saleEndDate]);

	const handleImageChange = (image: string, index: number) => {
		setSelectedImage(image);
		setCurrentImageIndex(index);
	};

	const handlePreviousImage = () => {
		if (productImages.length > 0) {
			const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : productImages.length - 1;
			setCurrentImageIndex(newIndex);
			setSelectedImage(productImages[newIndex]);
		}
	};

	const handleNextImage = () => {
		if (productImages.length > 0) {
			const newIndex = currentImageIndex < productImages.length - 1 ? currentImageIndex + 1 : 0;
			setCurrentImageIndex(newIndex);
			setSelectedImage(productImages[newIndex]);
		}
	};

	const handleQuantityChange = (value: number) => {
		if (value >= 1) {
			// Limit quantity to available product stock
			const maxStock = product?.productStock || 0;
			if (value > maxStock) {
				sweetMixinErrorAlert(`Only ${maxStock} item${maxStock !== 1 ? 's' : ''} available in stock`).then();
				setQuantity(maxStock);
				return;
			}
			setQuantity(value);
		}
	};

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue);
	};

	const handleAddToCart = () => {
		if (!product) return;
		addToCart(product, quantity);
		sweetTopSmallSuccessAlert('Product added to cart').then();
	};

	const handleWishlist = async () => {
		try {
			if (!product?._id) return;
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetProductMutation({
				variables: { input: product._id },
				refetchQueries: [
					{
						query: GET_FAVORITES,
						variables: { input: { page: 1, limit: 1 } },
					},
				],
			});
			await getProductRefetch({ input: product._id });
			await sweetTopSmallSuccessAlert('Success!', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const handleOpenLightbox = () => {
		setLightboxIndex(currentImageIndex);
		setLightboxOpen(true);
	};

	const handleBuyNow = () => {
		console.log('Buy now:', product?._id, 'Quantity:', quantity);
	};

	const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		setCommentInquiry((prev) => ({
			...prev,
			page: value,
		}));
	};

	const likeProductHandler = async (currentUser: T, id: string) => {
		try {
			if (!id) return;
			if (!currentUser?._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetProductMutation({
				variables: { input: id },
				refetchQueries: [
					{
						query: GET_FAVORITES,
						variables: { input: { page: 1, limit: 1 } },
					},
				],
			});
			await sweetTopSmallSuccessAlert('Success!', 800);
			if (id === product?._id) {
				await getProductRefetch({ input: id });
			} else {
				if (relatedProductsInput) {
					loadRelatedProducts({ variables: { input: relatedProductsInput } });
				}
				loadRecentProducts({ variables: { input: recentProductsInput } });
			}
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const createCommentHandler = async () => {
		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);
			if (!insertCommentData.commentRefId || insertCommentData.commentContent === '') return;
			const input: CommentInput = {
				...insertCommentData,
			};

			// Only send rating for PRODUCT comments when user selected a rating
			if (input.commentGroup === CommentGroup.PRODUCT) {
				if (selectedRating && selectedRating >= 1 && selectedRating <= 5) {
					input.rating = selectedRating;
				} else {
					// Explicitly null to be clear that no rating was provided
					input.rating = null;
				}
			}

			await createComment({
				variables: { input },
			});
			setInsertCommentData({ ...insertCommentData, commentContent: '' });
			setSelectedRating(null);
			await getCommentsRefetch({ input: commentInquiry });

			// Keep product rating stats in sync after a rated product comment
			if (input.commentGroup === CommentGroup.PRODUCT && input.rating && productId) {
				await getProductRefetch({ input: productId });
			}

			await sweetTopSmallSuccessAlert('Review submitted!', 800);
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const activeProductId = product?._id || '';

	const ratingAverage = product?.ratingAverage ?? product?.rating ?? product?.productRank ?? 0;
	const ratingCount = product?.ratingCount ?? commentTotal ?? 0;
	const displayedRelatedProducts = useMemo(() => {
		if (!activeProductId) {
			return relatedProducts.slice(0, 8);
		}
		const filtered = relatedProducts.filter((item) => item._id !== activeProductId);
		return filtered.slice(0, 8);
	}, [relatedProducts, activeProductId]);
	const filteredRecentlyViewed = useMemo(() => {
		if (!activeProductId) return recentlyViewed;
		return recentlyViewed.filter((item) => item._id !== activeProductId);
	}, [recentlyViewed, activeProductId]);

	const displaySelectedImage = selectedImage || productImages[0] || '/img/product/image1.png';
	const isWishlisted = Boolean(product?.meLiked?.[0]?.myFavorite);
	const isInCompare = product?._id ? isCompared(product._id) : false;
	const viewersCount = product?.viewersCount ?? product?.productViews;
	const productLikes = product?.productLikes;

	const shortDescription = useMemo(() => {
		if (!product?.productDescription) return '';
		const lines = product.productDescription.split('\n').filter((line) => line.trim());
		return lines.slice(0, 2).join('\n');
	}, [product?.productDescription]);

	if (getProductLoading && !product) {
		return (
			<Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
				<CircularProgress size={'4rem'} />
			</Stack>
		);
	}

	if (device === 'mobile') {
		return <div>PRODUCT DETAIL PAGE</div>;
	}

	if (!product) {
		return (
			<Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
				<Typography variant="h6">Product not found.</Typography>
			</Stack>
		);
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
								{isOnSale && (
									<div className="sale-badge">
										<span className="sale-text">SALE</span>
									</div>
								)}

							{/* NEXT / PREV BUTTONS */}
							{productImages.length > 1 && (
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
											alt: product?.productTitle || '',
											isFluidWidth: true,
											src: displaySelectedImage,
										},
										largeImage: {
											src: displaySelectedImage,
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
						{productImages.length > 1 && (
							<div className="thumbnail-section">
								<div className="thumbnail-images">
									{productImages.map((image, index) => (
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
								{product?.productTitle}
							</Typography>

							{/* Brands */}
							{brandChips.length > 0 && (
								<Stack className={'brands-section'} mt={'12px'} mb={'16px'}>
									<Stack direction={'row'} spacing={1} flexWrap={'wrap'}>
										<Typography className={'brands-label'}>Brands:</Typography>
										{brandChips.map((brand, index) => (
											<Chip key={index} label={brand} className={'brand-chip'} />
										))}
									</Stack>
								</Stack>
							)}

							{/* Social Proof */}
							<Stack className={'social-proof'} mb={'16px'} gap={'16px'}>
								<Stack sx={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
									{viewersCount !== undefined && (
										<Stack direction={'row'} alignItems={'center'} spacing={1} className={'social-proof-item'}>
											<RemoveRedEyeIcon className={'view-icon'} />
											<Typography className={'viewers-count'}>{viewersCount} views</Typography>
										</Stack>
									)}
									{productLikes !== undefined && (
										<Stack direction={'row'} alignItems={'center'} spacing={1} className={'social-proof-item'}>
											<FavoriteIcon className={'like-icon'} />
											<Typography className={'likes-count'}>{productLikes} likes</Typography>
										</Stack>
									)}
								</Stack>
								{stockStatus && (
									<Stack direction={'row'} alignItems={'center'} spacing={1} className={'social-proof-item'}>
										<CheckCircleIcon className={'stock-icon'} />
										<Typography className={'stock-status'}>{stockStatus}</Typography>
									</Stack>
								)}
							</Stack>

							{/* Description */}
							{shortDescription && (
								<Typography
									className={'product-description'}
									mb={'20px'}
									sx={{
										display: '-webkit-box',
										WebkitLineClamp: 2,
										WebkitBoxOrient: 'vertical',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
									}}
								>
									{shortDescription}
								</Typography>
							)}
							{compatibilityText && (
								<Typography className={'compatibility-text'} mb={'20px'}>
									Compatible with {compatibilityText}
								</Typography>
							)}

							{/* Pricing */}
							<Stack className={'pricing-section'} mb={'20px'}>
								{isOnSale && product?.productPrice !== undefined && (
									<Typography className={'original-price'}>${product.productPrice.toFixed(2)}</Typography>
								)}
								<Typography className={'current-price'}>
									$
									{isOnSale && product?.productSalePrice !== undefined
										? product.productSalePrice.toFixed(2)
										: product?.productPrice?.toFixed(2)}
								</Typography>
							</Stack>

							{/* Countdown Timer */}
							{isOnSale && timeRemaining && (
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
											inputProps={{ min: 1, max: product?.productStock || 1 }}
										/>
										<Button
											variant="outlined"
											onClick={() => handleQuantityChange(quantity + 1)}
											disabled={quantity >= (product?.productStock || 0)}
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
								<IconButton 
									className={`compare-btn ${isInCompare ? 'compared' : ''}`} 
									onClick={() => {
										if (product) {
											toggleCompare(product);
										}
									}}
								>
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
							{product?.productMainCategory && (
								<Typography className={'product-category'}>
									Category:{' '}
									<Link href={`/product?category=${product.productMainCategory}`}>
										{formatText(product.productMainCategory)}
									</Link>
								</Typography>
							)}

							{/* Rating summary */}
							<Stack className={'product-rating-summary'} direction="row" alignItems="center" spacing={1} mt={1}>
								{ratingCount > 0 ? (
									<>
										<Stack direction="row" spacing={0.5} alignItems="center">
											{[1, 2, 3, 4, 5].map((star) => (
												<StarIcon
													key={star}
													className={star <= Math.round(ratingAverage) ? 'star-filled' : 'star-empty'}
													fontSize="small"
												/>
											))}
										</Stack>
										<Typography variant="body2" className={'rating-value'}>
											{ratingAverage.toFixed(1)}
										</Typography>
										<Typography variant="body2" className={'rating-count'}>
											({ratingCount} {ratingCount === 1 ? 'review' : 'reviews'})
										</Typography>
									</>
								) : (
									<Typography variant="body2" className={'rating-count'}>
										No ratings yet
									</Typography>
								)}
							</Stack>
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
								{product?.productDescription && (
									<Stack className={'description-content'}>
										{product.productDescription.split('\n').map((paragraph, index) => {
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
									{additionalInfoEntries.length === 0 ? (
										<Typography className={'info-value'}>No additional information available.</Typography>
									) : (
										additionalInfoEntries.map(([key, value]) => (
											<Stack key={key} direction={'row'} className={'info-row'}>
												<Typography className={'info-key'}>{key}:</Typography>
												<Typography className={'info-value'}>{value}</Typography>
											</Stack>
										))
									)}
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
											{productComments?.map((comment: Comment, index: number) => (
												<Review comment={comment} key={comment?._id || index} rating={comment.rating ?? null} />
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
										<Typography className={'review-form-title'}>Be the first to review "{product?.productTitle}"</Typography>

										<Stack className={'rating-section'}>
											<Typography className={'rating-label'}>
												Your rating <span className={'required'}>(optional)</span>
											</Typography>
											<Stack direction={'row'} className={'star-rating-selector'}>
												{[1, 2, 3, 4, 5].map((star) => (
													<IconButton
														key={star}
														className={`star-btn${selectedRating && star <= selectedRating ? ' selected' : ''}`}
														onClick={() =>
															setSelectedRating((prev) => (prev === star ? null : star))
														}
													>
														{selectedRating && star <= selectedRating ? (
															<StarIcon className={'star-icon'} />
														) : (
															<StarBorderIcon className={'star-icon'} />
														)}
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

										<Button
											className={'submit-review-btn'}
											disabled={insertCommentData.commentContent === '' || !user?._id}
											onClick={createCommentHandler}
										>
											Submit
										</Button>
									</Stack>
								</Stack>
							</Box>
						</Stack>
					</Stack>
				</Stack>

				{/* Related Products */}
				{displayedRelatedProducts.length > 0 && (
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
										{displayedRelatedProducts.map((relatedProduct) => (
											<SwiperSlide key={relatedProduct._id} className={'related-product-slide'}>
												<ProductCard
													product={relatedProduct}
													likeProductHandler={likeProductHandler}
													addToCartHandler={(id: string) => {
														const productToAdd = displayedRelatedProducts.find((p) => p._id === id);
														if (productToAdd) {
															addToCart(productToAdd, 1);
															sweetTopSmallSuccessAlert('Product added to cart').then();
														}
													}}
													compareHandler={(id: string) => console.log('Add to compare:', id)}
													quickViewHandler={(id: string) => console.log('Quick view:', id)}
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
				{filteredRecentlyViewed.length > 0 && (
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
										{filteredRecentlyViewed.map((recentProduct) => (
											<SwiperSlide key={recentProduct._id} className={'recent-product-slide'}>
												<ProductCard
													product={recentProduct}
													likeProductHandler={likeProductHandler}
													addToCartHandler={(id: string) => {
														const productToAdd = filteredRecentlyViewed.find((p) => p._id === id);
														if (productToAdd) {
															addToCart(productToAdd, 1);
															sweetTopSmallSuccessAlert('Product added to cart').then();
														}
													}}
													compareHandler={(id: string) => console.log('Add to compare:', id)}
													quickViewHandler={(id: string) => console.log('Quick view:', id)}
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
				{productImages.length > 0 && (
					<Lightbox
						open={lightboxOpen}
						close={() => setLightboxOpen(false)}
						index={lightboxIndex}
						slides={productImages.map((img) => ({ src: img }))}
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
								setSelectedImage(productImages[index]);
							},
						}}
						styles={{
							container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' },
						}}
						carousel={{
							finite: productImages.length <= 1,
						}}
					/>
				)}
			</Stack>
		);
	}
};

ProductDetail.defaultProps = {
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			commentRefId: '',
		},
	},
};

export default withLayoutBasic(ProductDetail);
