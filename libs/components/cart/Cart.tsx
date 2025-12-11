import React, { useState } from 'react';
import {
	Drawer,
	Box,
	Typography,
	IconButton,
	Button,
	Stack,
	TextField,
	Select,
	MenuItem,
	FormControl,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import FreeShippingProgress from '../common/FreeShippingProgress';
import { useCart } from '../../hooks/useCart';
import { useRouter } from 'next/router';
import { REACT_APP_API_URL } from '../../config';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface CartProps {
	open: boolean;
	onClose: () => void;
}

type ActiveView = 'cart' | 'note' | 'coupon' | 'shipping';

const Cart: React.FC<CartProps> = ({ open, onClose }) => {
	const device = useDeviceDetect();
	const { t } = useTranslation('common');
	const router = useRouter();
	const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();
	const [activeView, setActiveView] = useState<ActiveView>('cart');
	const [note, setNote] = useState('');
	const [couponCode, setCouponCode] = useState('');
	const [country, setCountry] = useState('South Korea');
	const [city, setCity] = useState('');
	const [postcode, setPostcode] = useState('');

	const freeShippingThreshold = 200.0;
	const FLAT_RATE = 5.0;
	const currentTotal = getCartTotal();
	const cartCount = getCartCount();

	// Calculate shipping fee based on subtotal
	const calculatedShippingFee = currentTotal >= freeShippingThreshold ? 0 : FLAT_RATE;

	const getImageSrc = (img?: string) => {
		if (!img) return '/img/banner/header1.svg';
		if (img.startsWith('http') || img.startsWith('/img')) return img;
		return `${REACT_APP_API_URL}/${img}`;
	};

	const handleQuantityDecrease = (productId: string, currentQuantity: number) => {
		if (currentQuantity > 1) {
			updateQuantity(productId, currentQuantity - 1);
		} else {
			removeFromCart(productId);
		}
	};

	const handleQuantityIncrease = (productId: string, currentQuantity: number) => {
		updateQuantity(productId, currentQuantity + 1);
	};

	const handleViewChange = (view: ActiveView) => {
		setActiveView(view);
	};

	const handleSaveAndClose = () => {
		// Handle save logic here
		console.log('Saving...', { note, couponCode, country, city, postcode });
		setActiveView('cart');
	};

	const handleViewCart = () => {
		onClose();
		router.push('/order/cart');
	};

	const handleCheckout = () => {
		onClose();
		router.push('/order/checkout');
	};

	if (device === 'mobile') {
		return (
			<div id="cart-drawer-mobile">
				<Drawer 
					anchor="bottom" 
					open={open} 
					onClose={onClose} 
					className="cart-drawer mobile"
					sx={{
						'& .MuiDrawer-paper': {
							height: 'auto',
							maxHeight: '70vh',
							width: '100%',
						}
					}}
				>
					<Box className="cart-drawer-container mobile">
						{/* Header */}
						<Box className="cart-header mobile">
							<Typography className="cart-title mobile">
								{t('Shopping Cart')} ({cartCount})
							</Typography>
							<IconButton onClick={onClose} className="cart-close-btn mobile">
								<CloseIcon />
							</IconButton>
						</Box>

						{activeView === 'cart' ? (
							<>
								{/* Free Shipping Progress */}
								{cartItems.length > 0 && (
									<FreeShippingProgress threshold={freeShippingThreshold} current={currentTotal} currency="$" />
								)}

								{/* Cart Items */}
								<Box className="cart-items mobile">
									{cartItems.length === 0 ? (
										<Box sx={{ p: 3, textAlign: 'center' }}>
											<Typography variant="body1" sx={{ color: 'text.secondary' }}>
												{t('Your cart is empty')}
											</Typography>
										</Box>
									) : (
										cartItems.map((item) => {
											const productImage = item.product?.productImages?.[0]
												? getImageSrc(item.product.productImages[0])
												: '/img/banner/header1.svg';

											return (
												<Box key={item._id} className="cart-item mobile">
													<Box className="cart-item-image mobile">
														<img src={productImage} alt={item.product?.productTitle || 'Product'} />
													</Box>
													<Box className="cart-item-details mobile">
														<Typography className="cart-item-name mobile">
															{item.product?.productTitle || 'Product'}
														</Typography>
														<Typography className="cart-item-price mobile">${item.price.toFixed(2)}</Typography>
														<Box className="cart-item-actions mobile">
															<Box className="quantity-controls mobile">
																<IconButton
																	onClick={() => handleQuantityDecrease(item._id, item.quantity)}
																	className="quantity-btn mobile"
																>
																	<RemoveIcon />
																</IconButton>
																<Typography className="quantity-value mobile">{item.quantity}</Typography>
																<IconButton
																	onClick={() => handleQuantityIncrease(item._id, item.quantity)}
																	className="quantity-btn mobile"
																>
																	<AddIcon />
																</IconButton>
															</Box>
															<IconButton className="delete-btn mobile" onClick={() => removeFromCart(item._id)}>
																<DeleteOutlineIcon />
															</IconButton>
														</Box>
													</Box>
												</Box>
											);
										})
									)}
								</Box>

								{/* Action Buttons */}
								<Box className="cart-action-buttons mobile">
									<Box className="action-button-item mobile" onClick={() => handleViewChange('note')}>
										<EditNoteOutlinedIcon className="action-icon mobile" />
										<Typography className="action-label mobile">{t('Add Note')}</Typography>
									</Box>
									<Box className="action-button-item mobile" onClick={() => handleViewChange('coupon')}>
										<LocalOfferOutlinedIcon className="action-icon mobile" />
										<Typography className="action-label mobile">{t('Coupon')}</Typography>
									</Box>
									<Box className="action-button-item mobile" onClick={() => handleViewChange('shipping')}>
										<LocalShippingOutlinedIcon className="action-icon mobile" />
										<Typography className="action-label mobile">{t('Shipping')}</Typography>
									</Box>
								</Box>
							</>
						) : (
							<>
								{/* Sub-view Tabs */}
								<Box className="cart-subview-tabs mobile">
									<Box
										className={`cart-subview-tab mobile ${activeView === 'note' ? 'active' : ''}`}
										onClick={() => setActiveView('note')}
									>
										<EditNoteOutlinedIcon />
										<Typography>{t('Add Note')}</Typography>
									</Box>
									<Box
										className={`cart-subview-tab mobile ${activeView === 'coupon' ? 'active' : ''}`}
										onClick={() => setActiveView('coupon')}
									>
										<LocalOfferOutlinedIcon />
										<Typography>{t('Coupon')}</Typography>
									</Box>
									<Box
										className={`cart-subview-tab mobile ${activeView === 'shipping' ? 'active' : ''}`}
										onClick={() => setActiveView('shipping')}
									>
										<LocalShippingOutlinedIcon />
										<Typography>{t('Shipping')}</Typography>
									</Box>
								</Box>

								{/* Sub-view Content */}
								<Box className="cart-subview-content mobile">
									{activeView === 'note' && (
										<TextField
											multiline
											rows={8}
											fullWidth
											placeholder={(t('Add your note here...') as string) || 'Add your note here...'}
											value={note}
											onChange={(e) => setNote(e.target.value)}
											className="cart-textarea mobile"
										/>
									)}

									{activeView === 'coupon' && (
										<TextField
											fullWidth
											placeholder={(t('Coupon code') as string) || 'Coupon code'}
											value={couponCode}
											onChange={(e) => setCouponCode(e.target.value)}
											className="cart-input mobile"
										/>
									)}

									{activeView === 'shipping' && (
										<Box className="shipping-form mobile">
											<Box className="shipping-form-group mobile">
												<Typography className="shipping-label mobile">{t('Country / region')}</Typography>
												<FormControl fullWidth>
													<Select
														value={country}
														onChange={(e) => setCountry(e.target.value)}
														className="shipping-select mobile"
													>
														<MenuItem value="South Korea">{t('South Korea')}</MenuItem>
														<MenuItem value="United States">{t('United States')}</MenuItem>
														<MenuItem value="Japan">{t('Japan')}</MenuItem>
														<MenuItem value="China">{t('China')}</MenuItem>
													</Select>
												</FormControl>
											</Box>

											<Box className="shipping-form-group mobile">
												<Typography className="shipping-label mobile">{t('Town / City')} *</Typography>
												<TextField
													fullWidth
													value={city}
													onChange={(e) => setCity(e.target.value)}
													className="shipping-input mobile"
												/>
											</Box>

											<Box className="shipping-form-group mobile">
												<Typography className="shipping-label mobile">{t('Postcode / ZIP')} *</Typography>
												<TextField
													fullWidth
													value={postcode}
													onChange={(e) => setPostcode(e.target.value)}
													className="shipping-input mobile"
												/>
											</Box>
										</Box>
									)}
								</Box>

								{/* Sub-view Actions */}
								<Box className="cart-subview-actions mobile">
									<Button onClick={handleSaveAndClose} className="save-btn mobile">
										{t('Save')}
									</Button>
									<Button onClick={() => setActiveView('cart')} className="close-btn mobile">
										{t('Close')}
									</Button>
								</Box>
							</>
						)}

						{/* Total */}
						<Box className="cart-total mobile">
							<Typography className="total-label mobile">{t('Total')}:</Typography>
							<Typography className="total-value mobile">
								${(currentTotal + calculatedShippingFee).toFixed(2)}
							</Typography>
						</Box>

						{/* Footer Buttons */}
						<Box className="cart-footer mobile">
							<Button className="view-cart-btn mobile" onClick={handleViewCart}>
								{t('View Cart')}
							</Button>
							<Button className="checkout-btn mobile" onClick={handleCheckout} disabled={cartItems.length === 0}>
								{t('Checkout')}
							</Button>
						</Box>
					</Box>
				</Drawer>
			</div>
		);
	} else {
		return (
			<Drawer anchor="right" open={open} onClose={onClose} className="cart-drawer">
				<Box className="cart-drawer-container">
					{/* Header */}
					<Box className="cart-header">
						<Typography className="cart-title">
							{t('Shopping Cart')} ({cartCount})
						</Typography>
						<IconButton onClick={onClose} className="cart-close-btn">
							<CloseIcon />
						</IconButton>
					</Box>

					{activeView === 'cart' ? (
						<>
							{/* Free Shipping Progress */}
							{cartItems.length > 0 && (
								<FreeShippingProgress threshold={freeShippingThreshold} current={currentTotal} currency="$" />
							)}

							{/* Cart Items */}
							<Box className="cart-items">
								{cartItems.length === 0 ? (
									<Box sx={{ p: 3, textAlign: 'center' }}>
										<Typography variant="body1" sx={{ color: 'text.secondary' }}>
											{t('Your cart is empty')}
										</Typography>
									</Box>
								) : (
									cartItems.map((item) => {
										const productImage = item.product?.productImages?.[0]
											? getImageSrc(item.product.productImages[0])
											: '/img/banner/header1.svg';

										return (
											<Box key={item._id} className="cart-item">
												<Box className="cart-item-image">
													<img src={productImage} alt={item.product?.productTitle || 'Product'} />
												</Box>
												<Box className="cart-item-details">
													<Typography className="cart-item-name">{item.product?.productTitle || 'Product'}</Typography>
													<Typography className="cart-item-price">${item.price.toFixed(2)}</Typography>
													<Box className="cart-item-actions">
														<Box className="quantity-controls">
															<IconButton
																onClick={() => handleQuantityDecrease(item._id, item.quantity)}
																className="quantity-btn"
															>
																<RemoveIcon />
															</IconButton>
															<Typography className="quantity-value">{item.quantity}</Typography>
															<IconButton
																onClick={() => handleQuantityIncrease(item._id, item.quantity)}
																className="quantity-btn"
															>
																<AddIcon />
															</IconButton>
														</Box>
														<IconButton className="delete-btn" onClick={() => removeFromCart(item._id)}>
															<DeleteOutlineIcon />
														</IconButton>
													</Box>
												</Box>
											</Box>
										);
									})
								)}
							</Box>

							{/* Action Buttons */}
							<Box className="cart-action-buttons">
								<Box className="action-button-item" onClick={() => handleViewChange('note')}>
									<EditNoteOutlinedIcon className="action-icon" />
									<Typography className="action-label">{t('Add Note')}</Typography>
								</Box>
								<Box className="action-button-item" onClick={() => handleViewChange('coupon')}>
									<LocalOfferOutlinedIcon className="action-icon" />
									<Typography className="action-label">{t('Coupon')}</Typography>
								</Box>
								<Box className="action-button-item" onClick={() => handleViewChange('shipping')}>
									<LocalShippingOutlinedIcon className="action-icon" />
									<Typography className="action-label">{t('Shipping')}</Typography>
								</Box>
							</Box>
						</>
					) : (
						<>
							{/* Sub-view Tabs */}
							<Box className="cart-subview-tabs">
								<Box
									className={`cart-subview-tab ${activeView === 'note' ? 'active' : ''}`}
									onClick={() => setActiveView('note')}
								>
									<EditNoteOutlinedIcon />
									<Typography>{t('Add Note')}</Typography>
								</Box>
								<Box
									className={`cart-subview-tab ${activeView === 'coupon' ? 'active' : ''}`}
									onClick={() => setActiveView('coupon')}
								>
									<LocalOfferOutlinedIcon />
									<Typography>{t('Coupon')}</Typography>
								</Box>
								<Box
									className={`cart-subview-tab ${activeView === 'shipping' ? 'active' : ''}`}
									onClick={() => setActiveView('shipping')}
								>
									<LocalShippingOutlinedIcon />
									<Typography>{t('Shipping')}</Typography>
								</Box>
							</Box>

							{/* Sub-view Content */}
							<Box className="cart-subview-content">
								{activeView === 'note' && (
									<TextField
										multiline
										rows={8}
										fullWidth
										placeholder={(t('Add your note here...') as string) || 'Add your note here...'}
										value={note}
										onChange={(e) => setNote(e.target.value)}
										className="cart-textarea"
									/>
								)}

								{activeView === 'coupon' && (
									<TextField
										fullWidth
										placeholder={(t('Coupon code') as string) || 'Coupon code'}
										value={couponCode}
										onChange={(e) => setCouponCode(e.target.value)}
										className="cart-input"
									/>
								)}

								{activeView === 'shipping' && (
									<Box className="shipping-form">
										<Box className="shipping-form-group">
											<Typography className="shipping-label">{t('Country / region')}</Typography>
											<FormControl fullWidth>
												<Select
													value={country}
													onChange={(e) => setCountry(e.target.value)}
													className="shipping-select"
												>
													<MenuItem value="South Korea">{t('South Korea')}</MenuItem>
													<MenuItem value="United States">{t('United States')}</MenuItem>
													<MenuItem value="Japan">{t('Japan')}</MenuItem>
													<MenuItem value="China">{t('China')}</MenuItem>
												</Select>
											</FormControl>
										</Box>

										<Box className="shipping-form-group">
											<Typography className="shipping-label">{t('Town / City')} *</Typography>
											<TextField
												fullWidth
												value={city}
												onChange={(e) => setCity(e.target.value)}
												className="shipping-input"
											/>
										</Box>

										<Box className="shipping-form-group">
											<Typography className="shipping-label">{t('Postcode / ZIP')} *</Typography>
											<TextField
												fullWidth
												value={postcode}
												onChange={(e) => setPostcode(e.target.value)}
												className="shipping-input"
											/>
										</Box>
									</Box>
								)}
							</Box>

							{/* Sub-view Actions */}
							<Box className="cart-subview-actions">
								<Button onClick={handleSaveAndClose} className="save-btn">
									{t('Save')}
								</Button>
								<Button onClick={() => setActiveView('cart')} className="close-btn">
									{t('Close')}
								</Button>
							</Box>
						</>
					)}

					{/* Total */}
					<Box className="cart-total">
						<Typography className="total-label">{t('Total')}:</Typography>
						<Typography className="total-value">${(currentTotal + calculatedShippingFee).toFixed(2)}</Typography>
					</Box>

					{/* Footer Buttons */}
					<Box className="cart-footer">
						<Button className="view-cart-btn" onClick={handleViewCart}>
							{t('View Cart')}
						</Button>
						<Button className="checkout-btn" onClick={handleCheckout} disabled={cartItems.length === 0}>
							{t('Checkout')}
						</Button>
					</Box>
				</Box>
			</Drawer>
		);
	}
};

export default Cart;
