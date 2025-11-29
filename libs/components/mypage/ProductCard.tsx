import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import IconButton from '@mui/material/IconButton';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';
import { Product } from '../../types/product/product';
import { formatterStr } from '../../utils';
import Moment from 'react-moment';
import { useRouter } from 'next/router';
import { ProductStatus } from '../../enums/product.enum';
import { REACT_APP_API_URL } from '../../config';

interface ProductCardProps {
	product: Product;
	deleteProductHandler?: any;
	memberPage?: boolean;
	updateProductHandler?: any;
}

export const ProductCard = (props: ProductCardProps) => {
	const { product, deleteProductHandler, memberPage, updateProductHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	/** HANDLERS **/
	const pushEditProduct = async (id: string) => {
		console.log('+pushEditProduct: ', id);
		await router.push({
			pathname: '/mypage',
			query: { category: 'addProduct', productId: id },
		});
	};

	const pushProductDetail = async (id: string) => {
		if (!memberPage || !id) return;

		await router.push({
			pathname: '/product/detail',
			query: { id },
		});
	};

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return <div>MOBILE PRODUCT CARD</div>;
	} else
		return (
			<Stack className="product-card-box">
				<Stack className="image-box" onClick={() => pushProductDetail(product?._id)}>
					<img
						src={`${REACT_APP_API_URL}/${product.productImages?.[0] || ''}`}
						alt={product.productTitle}
					/>
				</Stack>
				<Stack className="information-box" onClick={() => pushProductDetail(product?._id)}>
					<Typography className="name">{product.productTitle}</Typography>
					<Stack className="category-box" direction="row" spacing={1}>
						<Typography className="category">{product.productMainCategory}</Typography>
						<Typography className="category-separator">•</Typography>
						<Typography className="category">{product.productSubCategory}</Typography>
					</Stack>
					<Typography className="price">
						{product.productSalePrice && product.productSalePrice > 0 ? (
							<>
								<strong>${formatterStr(product.productSalePrice)}</strong>
								<span style={{ textDecoration: 'line-through', marginLeft: '8px', color: '#999' }}>
									${formatterStr(product.productPrice)}
								</span>
							</>
						) : (
							<strong>${formatterStr(product?.productPrice)}</strong>
						)}
					</Typography>
				</Stack>
				<Stack className="date-box">
					<Typography className="date">
						<Moment format="DD MMMM, YYYY">{product.createdAt}</Moment>
					</Typography>
				</Stack>
				<Stack className="status-box">
					<Stack className="coloured-box" sx={{ background: '#E5F0FD' }} onClick={handleClick}>
						<Typography className="status" sx={{ color: '#3554d1' }}>
							{product.productStatus}
						</Typography>
					</Stack>
				</Stack>
				{!memberPage && product.productStatus !== ProductStatus.SOLD && (
					<Menu
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						PaperProps={{
							elevation: 0,
							sx: {
								width: '70px',
								mt: 1,
								ml: '10px',
								overflow: 'visible',
								filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							},
							style: {
								padding: 0,
								display: 'flex',
								justifyContent: 'center',
							},
						}}
					>
						{product.productStatus === ProductStatus.ACTIVE && (
							<>
								<MenuItem
									disableRipple
									onClick={() => {
										handleClose();
										updateProductHandler(ProductStatus.SOLD, product?._id);
									}}
								>
									Sold
								</MenuItem>
								<MenuItem
									disableRipple
									onClick={() => {
										handleClose();
										updateProductHandler(ProductStatus.HOLD, product?._id);
									}}
								>
									Hold
								</MenuItem>
							</>
						)}
						{product.productStatus === ProductStatus.HOLD && (
							<MenuItem
								disableRipple
								onClick={() => {
									handleClose();
									updateProductHandler(ProductStatus.ACTIVE, product?._id);
								}}
							>
								Activate
							</MenuItem>
						)}
					</Menu>
				)}

				<Stack className="views-box">
					<Typography className="views">{product.productViews.toLocaleString()}</Typography>
				</Stack>
				{!memberPage && (
					<Stack className="action-box">
						<IconButton className="icon-button" onClick={() => pushEditProduct(product._id)}>
							<ModeIcon className="buttons" />
						</IconButton>
						<IconButton className="icon-button" onClick={() => deleteProductHandler(product._id)}>
							<DeleteIcon className="buttons" />
						</IconButton>
					</Stack>
				)}
			</Stack>
		);
};

