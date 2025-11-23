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
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import FreeShippingProgress from './common/FreeShippingProgress';

interface CartProps {
	open: boolean;
	onClose: () => void;
}

type ActiveView = 'cart' | 'note' | 'coupon' | 'shipping';

const Cart: React.FC<CartProps> = ({ open, onClose }) => {
	const [quantity, setQuantity] = useState(1);
	const [activeView, setActiveView] = useState<ActiveView>('cart');
	const [note, setNote] = useState('');
	const [couponCode, setCouponCode] = useState('');
	const [country, setCountry] = useState('South Korea');
	const [city, setCity] = useState('');
	const [postcode, setPostcode] = useState('');

	// Mock cart data
	const cartItem = {
		id: 1,
		name: 'AMAZ Air Compressor Combo Kit with Brad Nailer DWC1KIT',
		price: 200.0,
		image: '/img/product/image1.png',
	};

	const freeShippingThreshold = 300.0;
	const currentTotal = cartItem.price * quantity;

	const handleQuantityDecrease = () => {
		if (quantity > 1) {
			setQuantity(quantity - 1);
		}
	};

	const handleQuantityIncrease = () => {
		setQuantity(quantity + 1);
	};

	const handleViewChange = (view: ActiveView) => {
		setActiveView(view);
	};

	const handleSaveAndClose = () => {
		// Handle save logic here
		console.log('Saving...', { note, couponCode, country, city, postcode });
		setActiveView('cart');
	};

	return (
		<Drawer anchor="right" open={open} onClose={onClose} className="cart-drawer">
			<Box className="cart-drawer-container">
				{/* Header */}
				<Box className="cart-header">
					<Typography className="cart-title">Shopping Cart (1)</Typography>
					<IconButton onClick={onClose} className="cart-close-btn">
						<CloseIcon />
					</IconButton>
				</Box>

				{activeView === 'cart' ? (
					<>
						{/* Free Shipping Progress */}
						<FreeShippingProgress 
							threshold={freeShippingThreshold} 
							current={currentTotal} 
							currency="$" 
						/>

						{/* Cart Items */}
						<Box className="cart-items">
							<Box className="cart-item">
								<Box className="cart-item-image">
									<img src={cartItem.image} alt={cartItem.name} />
								</Box>
								<Box className="cart-item-details">
									<Typography className="cart-item-name">{cartItem.name}</Typography>
									<Typography className="cart-item-price">${cartItem.price.toFixed(2)}</Typography>
									<Box className="cart-item-actions">
										<Box className="quantity-controls">
											<IconButton onClick={handleQuantityDecrease} className="quantity-btn">
												<RemoveIcon />
											</IconButton>
											<Typography className="quantity-value">{quantity}</Typography>
											<IconButton onClick={handleQuantityIncrease} className="quantity-btn">
												<AddIcon />
											</IconButton>
										</Box>
										<IconButton className="delete-btn">
											<DeleteOutlineIcon />
										</IconButton>
									</Box>
								</Box>
							</Box>
						</Box>

						{/* Action Buttons */}
						<Box className="cart-action-buttons">
							<Box className="action-button-item" onClick={() => handleViewChange('note')}>
								<EditNoteOutlinedIcon className="action-icon" />
								<Typography className="action-label">Add Note</Typography>
							</Box>
							<Box className="action-button-item" onClick={() => handleViewChange('coupon')}>
								<LocalOfferOutlinedIcon className="action-icon" />
								<Typography className="action-label">Coupon</Typography>
							</Box>
							<Box className="action-button-item" onClick={() => handleViewChange('shipping')}>
								<LocalShippingOutlinedIcon className="action-icon" />
								<Typography className="action-label">Shipping</Typography>
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
								<Typography>Add Note</Typography>
							</Box>
							<Box
								className={`cart-subview-tab ${activeView === 'coupon' ? 'active' : ''}`}
								onClick={() => setActiveView('coupon')}
							>
								<LocalOfferOutlinedIcon />
								<Typography>Coupon</Typography>
							</Box>
							<Box
								className={`cart-subview-tab ${activeView === 'shipping' ? 'active' : ''}`}
								onClick={() => setActiveView('shipping')}
							>
								<LocalShippingOutlinedIcon />
								<Typography>Shipping</Typography>
							</Box>
						</Box>

						{/* Sub-view Content */}
						<Box className="cart-subview-content">
							{activeView === 'note' && (
								<TextField
									multiline
									rows={8}
									fullWidth
									placeholder="Add your note here..."
									value={note}
									onChange={(e) => setNote(e.target.value)}
									className="cart-textarea"
								/>
							)}

							{activeView === 'coupon' && (
								<TextField
									fullWidth
									placeholder="Coupon code"
									value={couponCode}
									onChange={(e) => setCouponCode(e.target.value)}
									className="cart-input"
								/>
							)}

							{activeView === 'shipping' && (
								<Box className="shipping-form">
									<Box className="shipping-form-group">
										<Typography className="shipping-label">Country / region</Typography>
										<FormControl fullWidth>
											<Select
												value={country}
												onChange={(e) => setCountry(e.target.value)}
												className="shipping-select"
											>
												<MenuItem value="South Korea">South Korea</MenuItem>
												<MenuItem value="United States">United States</MenuItem>
												<MenuItem value="Japan">Japan</MenuItem>
												<MenuItem value="China">China</MenuItem>
											</Select>
										</FormControl>
									</Box>

									<Box className="shipping-form-group">
										<Typography className="shipping-label">Town / City *</Typography>
										<TextField
											fullWidth
											value={city}
											onChange={(e) => setCity(e.target.value)}
											className="shipping-input"
										/>
									</Box>

									<Box className="shipping-form-group">
										<Typography className="shipping-label">Postcode / ZIP *</Typography>
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
								Save
							</Button>
							<Button onClick={() => setActiveView('cart')} className="close-btn">
								Close
							</Button>
						</Box>
					</>
				)}

				{/* Total */}
				<Box className="cart-total">
					<Typography className="total-label">Total:</Typography>
					<Typography className="total-value">${(currentTotal + 20).toFixed(2)}</Typography>
				</Box>

				{/* Footer Buttons */}
				<Box className="cart-footer">
					<Button className="view-cart-btn">View Cart</Button>
					<Button className="checkout-btn">Checkout</Button>
				</Box>
			</Box>
		</Drawer>
	);
};

export default Cart;

