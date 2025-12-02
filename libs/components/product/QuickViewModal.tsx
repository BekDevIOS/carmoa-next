import React, { useCallback } from 'react';
import { Dialog, DialogContent, Box, IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useReactiveVar, useMutation } from '@apollo/client';
import { quickViewVar, closeQuickView, userVar } from '../../../apollo/store';
import BigProductCard from './BigProductCard';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { GET_FAVORITES } from '../../../apollo/user/query';
import { useCart } from '../../hooks/useCart';
import { useCompare } from '../../hooks/useCompare';
import { sweetTopSmallSuccessAlert, sweetMixinErrorAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';

const QuickViewModal: React.FC = () => {
	const quickViewState = useReactiveVar(quickViewVar);
	const { isOpen, product } = quickViewState;
	const user = useReactiveVar(userVar);
	const { addToCart } = useCart();
	const { toggleCompare } = useCompare();

	// APOLLO CONNECTIONS
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	// HANDLERS
	const handleClose = useCallback(() => {
		closeQuickView();
	}, []);

	const likeProductHandler = useCallback(
		async (currentUser: any, id: string) => {
			try {
				if (!id) return;
				if (!currentUser?._id) {
					throw new Error(Message.NOT_AUTHENTICATED);
				}

				const isCurrentlyLiked = Boolean(product?.meLiked && product?.meLiked[0]?.myFavorite);

				if (product && product._id === id) {
					const updatedProduct = {
						...product,
						meLiked: isCurrentlyLiked ? [] : [{ memberId: currentUser._id, likeRefId: id, myFavorite: true }],
					};

					quickViewVar({
						isOpen: true,
						product: updatedProduct,
					});
				}

				await likeTargetProduct({
					variables: { input: id },
					refetchQueries: [
						{
							query: GET_FAVORITES,
							variables: { input: { page: 1, limit: 1 } },
						},
					],
				});

				await sweetTopSmallSuccessAlert('Success!', 800);
			} catch (err: any) {
				console.log('ERROR, likeProductHandler:', err);

				// Revert optimistic update on error
				if (product && product._id) {
					quickViewVar({
						isOpen: true,
						product: product,
					});
				}

				sweetMixinErrorAlert(err.message).then();
			}
		},
		[likeTargetProduct, product],
	);

	const addToCartHandler = useCallback(
		(productId: string) => {
			if (product && product._id === productId) {
				addToCart(product, 1);
				sweetTopSmallSuccessAlert('Product added to cart');
			}
		},
		[addToCart, product],
	);

	const compareHandler = useCallback(
		(productId: string) => {
			if (product && product._id === productId) {
				toggleCompare(product);
			}
		},
		[product, toggleCompare],
	);

	if (!product) {
		return null;
	}

	return (
		<Dialog
			open={isOpen}
			onClose={handleClose}
			maxWidth="lg"
			fullWidth
			PaperProps={{
				className: 'quickview-modal-paper',
			}}
			BackdropProps={{
				className: 'quickview-modal-backdrop',
			}}
			className="quickview-modal"
		>
			<Box className="quickview-modal-container">
				<IconButton onClick={handleClose} className="quickview-modal-close-btn">
					<CloseIcon />
				</IconButton>

				<DialogContent className="quickview-modal-content">
					<Stack className="quickview-modal-body">
						<BigProductCard
							product={product}
							likeProductHandler={likeProductHandler}
							addToCartHandler={addToCartHandler}
							compareHandler={compareHandler}
						/>
					</Stack>
				</DialogContent>
			</Box>
		</Dialog>
	);
};

export default QuickViewModal;
