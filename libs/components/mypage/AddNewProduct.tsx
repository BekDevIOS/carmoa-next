import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { CarBrand, ProductCondition, ProductMainCategory, ProductSubCategory } from '../../enums/product.enum';
import { REACT_APP_API_URL } from '../../config';
import { ProductInput } from '../../types/product/product.input';
import { getJwtToken } from '../../auth';
import axios from 'axios';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { CREATE_PRODUCT, UPDATE_PRODUCT } from '../../../apollo/user/mutation';
import { GET_PRODUCT } from '../../../apollo/user/query';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../sweetAlert';

const AddNewProduct = ({ initialValues }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const inputRef = useRef<any>(null);
	const token = getJwtToken();
	const user = useReactiveVar(userVar);

	const [insertProductData, setInsertProductData] = useState<ProductInput>(initialValues);

	const [productMainCategory] = useState<ProductMainCategory[]>(Object.values(ProductMainCategory));
	const [productSubCategory] = useState<ProductSubCategory[]>(Object.values(ProductSubCategory));
	const [productCondition] = useState<ProductCondition[]>(Object.values(ProductCondition));
	const [productCarBrand] = useState<CarBrand[]>(Object.values(CarBrand));

	/** APOLLO REQUESTS **/
	const [createProduct] = useMutation(CREATE_PRODUCT);
	const [updateProduct] = useMutation(UPDATE_PRODUCT);

	const { loading, data, error } = useQuery(GET_PRODUCT, {
		fetchPolicy: 'network-only',
		variables: { input: router.query.productId },
		skip: !router.query.productId,
	});

	/** PREFILL DATA WHEN EDITING **/
	useEffect(() => {
		if (!data?.getProduct) return;

		setInsertProductData({
			...insertProductData,
			...data.getProduct,
		});
	}, [data]);

	/** IMAGE UPLOAD **/
	async function uploadImages() {
		try {
			const formData = new FormData();
			const fileList = inputRef.current?.files;

			if (!fileList || fileList.length === 0) {
				await sweetMixinErrorAlert('Please select at least one image');
				return;
			}

			// Convert FileList to Array
			const files: File[] = Array.from(fileList);

			if (files.length > 5) {
				await sweetMixinErrorAlert('Maximum 5 images allowed');
				return;
			}

			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) {
            imagesUploader(files: $files, target: $target)
          }`,
					variables: { files: Array(files.length).fill(null), target: 'product' },
				}),
			);

			const map: any = {};
			for (let i = 0; i < files.length; i++) {
				map[i] = [`variables.files.${i}`];
			}

			formData.append('map', JSON.stringify(map));

			// Append files to FormData
			for (let i = 0; i < files.length; i++) {
				formData.append(`${i}`, files[i]);
			}

			const res = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': 'true',
					Authorization: `Bearer ${token}`,
				},
			});

			if (res.data?.errors) {
				throw new Error(res.data.errors[0]?.message || 'Upload failed');
			}

			const imgs = res.data?.data?.imagesUploader;
			if (!imgs || imgs.length === 0) {
				throw new Error('No images were uploaded');
			}

			// Append new images to existing ones, or replace if editing
			const existingImages = insertProductData.productImages || [];
			const newImages = Array.isArray(imgs) ? imgs : [imgs];
			const allImages = [...existingImages, ...newImages];

			setInsertProductData({
				...insertProductData,
				productImages: allImages,
			});

			// Reset file input to allow re-uploading the same files
			if (inputRef.current) {
				inputRef.current.value = '';
			}
		} catch (err: any) {
			console.error('Image upload error:', err);
			const errorMessage = err.response?.data?.errors?.[0]?.message || err.message || 'Failed to upload images';
			await sweetMixinErrorAlert(errorMessage);
		}
	}

	/** REMOVE IMAGE HANDLER **/
	const removeImageHandler = (imageToRemove: string) => {
		const updatedImages = insertProductData.productImages?.filter((img: string) => img !== imageToRemove) || [];
		setInsertProductData({
			...insertProductData,
			productImages: updatedImages,
		});
	};

	/** DISABLED CHECK **/
	const doDisabledCheck = () => {
		const d = insertProductData;

		return (
			!d.productTitle ||
			!d.productPrice ||
			!d.productMainCategory ||
			!d.productSubCategory ||
			!d.productCarBrand ||
			!d.productCarModel ||
			!d.productCondition ||
			!d.productYearFrom ||
			!d.productYearTo ||
			d.productImages.length === 0 ||
			!d.productDescription
		);
	};

	/** CREATE HANDLER **/
	const insertProductHandler = useCallback(async () => {
		try {
			await createProduct({
				variables: { input: insertProductData },
			});
			await sweetMixinSuccessAlert('This product has been created successfully.');
			await router.push({
				pathname: '/mypage',
				query: {
					category: 'myProducts',
				},
			});
		} catch (err) {
			sweetErrorHandling(err).then();
		}
	}, [insertProductData]);

	/** UPDATE HANDLER **/
	const updateProductHandler = useCallback(async () => {
		try {
			if (!router.query.productId) {
				await sweetMixinErrorAlert('Product ID is required');
				return;
			}

			// Clean up data - remove GraphQL-only fields and only include ProductUpdate fields
			const updatePayload: any = {
				_id: router.query.productId as string,
				productTitle: insertProductData.productTitle,
				productPrice: insertProductData.productPrice,
				productMainCategory: insertProductData.productMainCategory,
				productSubCategory: insertProductData.productSubCategory,
				productCondition: insertProductData.productCondition,
				productCarBrand: insertProductData.productCarBrand,
				productCarModel: insertProductData.productCarModel,
				productYearFrom: insertProductData.productYearFrom,
				productYearTo: insertProductData.productYearTo,
				productOemNumbers: insertProductData.productOemNumbers,
				productImages: insertProductData.productImages,
				productDescription: insertProductData.productDescription,
				productStock: insertProductData.productStock,
			};

			// Only include productSalePrice if it's defined (not null/undefined)
			if (insertProductData.productSalePrice !== null && insertProductData.productSalePrice !== undefined) {
				updatePayload.productSalePrice = insertProductData.productSalePrice;
			}

			await updateProduct({
				variables: {
					input: updatePayload,
				},
			});
			await sweetMixinSuccessAlert('This product has been updated successfully.');
			await router.push({
				pathname: '/mypage',
				query: {
					category: 'myProducts',
				},
			});
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	}, [insertProductData, router, updateProduct]);

	if (user?.memberType !== 'DEALER') {
		router.back();
		return null;
	}

	if (device === 'mobile') return <div>ADD PRODUCT MOBILE</div>;

	return (
		<div id="add-product-page">
			<Stack className="main-title-box">
				<Typography className="main-title">Add New Product</Typography>
				<Typography className="sub-title">Manage your auto parts easily!</Typography>
			</Stack>

			<div>
				<Stack className="config">
					{/* TITLE */}
					<Stack className="description-box">
						<Typography className="product-title">Basic Information</Typography>

						<Stack className="config-column">
							<Typography className="title">Title</Typography>
							<input
								type="text"
								className="description-input"
								placeholder="Product Title"
								value={insertProductData.productTitle}
								onChange={(e) =>
									setInsertProductData({
										...insertProductData,
										productTitle: e.target.value,
									})
								}
							/>
						</Stack>

						{/* CATEGORY */}
						<Stack className="config-row">
							<Stack className="price-year-after-price">
								<Typography className="title">Main Category</Typography>
								<select
									className="select-description"
									value={insertProductData.productMainCategory || 'select'}
									onChange={(e) =>
										setInsertProductData({
											...insertProductData,
											productMainCategory: e.target.value as ProductMainCategory,
										})
									}
								>
									<option value="select" disabled>
										Select
									</option>
									{productMainCategory.map((m) => (
										<option key={m} value={m}>
											{m}
										</option>
									))}
								</select>
							</Stack>

							<Stack className="price-year-after-price">
								<Typography className="title">Sub Category</Typography>
								<select
									className="select-description"
									value={insertProductData.productSubCategory || 'select'}
									onChange={(e) =>
										setInsertProductData({
											...insertProductData,
											productSubCategory: e.target.value as ProductSubCategory,
										})
									}
								>
									<option value="select" disabled>
										Select
									</option>
									{productSubCategory.map((s) => (
										<option key={s} value={s}>
											{s}
										</option>
									))}
								</select>
							</Stack>
						</Stack>

						{/* PRICE + SALE PRICE */}
						<Stack className="config-row">
							<Stack className="price-year-after-price">
								<Typography className="title">Price ($)</Typography>
								<input
									type="number"
									className="description-input"
									placeholder="Price"
									value={insertProductData.productPrice}
									onChange={(e) =>
										setInsertProductData({
											...insertProductData,
											productPrice: parseInt(e.target.value) || 0,
										})
									}
								/>
							</Stack>

							<Stack className="price-year-after-price">
								<Typography className="title">Sale Price ($) <span style={{ fontSize: '12px', fontWeight: 'normal' }}>(Optional)</span></Typography>
								<input
									type="number"
									className="description-input"
									placeholder="Sale Price (Optional)"
									value={insertProductData.productSalePrice || ''}
									onChange={(e) =>
										setInsertProductData({
											...insertProductData,
											productSalePrice: e.target.value ? parseInt(e.target.value) : undefined,
										})
									}
								/>
							</Stack>
						</Stack>

						{/* CONDITION */}
						<Stack className="config-row">
							<Stack className="price-year-after-price">
								<Typography className="title">Condition</Typography>
								<select
									className="select-description"
									value={insertProductData.productCondition || 'select'}
									onChange={(e) =>
										setInsertProductData({
											...insertProductData,
											productCondition: e.target.value as ProductCondition,
										})
									}
								>
									<option value="select" disabled>
										Select
									</option>
									{productCondition.map((c) => (
										<option key={c} value={c}>
											{c}
										</option>
									))}
								</select>
							</Stack>
						</Stack>

						{/* BRAND / MODEL */}
						<Typography className="product-title">Car Compatibility</Typography>

						<Stack className="config-row">
							<Stack className="price-year-after-price">
								<Typography className="title">Brand</Typography>
								<select
									className="select-description"
									value={insertProductData.productCarBrand || 'select'}
									onChange={(e) =>
										setInsertProductData({
											...insertProductData,
											productCarBrand: e.target.value as CarBrand,
										})
									}
								>
									<option value="select" disabled>
										Select
									</option>
									{productCarBrand.map((brand) => (
										<option key={brand} value={brand}>
											{brand}
										</option>
									))}
								</select>
							</Stack>

							<Stack className="price-year-after-price">
								<Typography className="title">Model</Typography>
								<input
									type="text"
									className="description-input"
									placeholder="Carnival, Avante, Sorento..."
									value={insertProductData.productCarModel}
									onChange={(e) =>
										setInsertProductData({
											...insertProductData,
											productCarModel: e.target.value,
										})
									}
								/>
							</Stack>
						</Stack>

						{/* YEAR RANGE */}
						<Stack className="config-row">
							<Stack className="price-year-after-price">
								<Typography className="title">Year From</Typography>
								<input
									type="number"
									className="description-input"
									value={insertProductData.productYearFrom}
									onChange={(e) =>
										setInsertProductData({
											...insertProductData,
											productYearFrom: parseInt(e.target.value),
										})
									}
								/>
							</Stack>

							<Stack className="price-year-after-price">
								<Typography className="title">Year To</Typography>
								<input
									type="number"
									className="description-input"
									value={insertProductData.productYearTo}
									onChange={(e) =>
										setInsertProductData({
											...insertProductData,
											productYearTo: parseInt(e.target.value),
										})
									}
								/>
							</Stack>
						</Stack>

						{/* OEM NUMBERS */}
						<Stack className="config-column">
							<Typography className="title">OEM Numbers</Typography>
							<input
								type="text"
								className="description-input"
								placeholder="Comma separated (e.g. 28100-2S000, 21719-3X000)"
								value={insertProductData.productOemNumbers?.join(',') || ''}
								onChange={(e) =>
									setInsertProductData({
										...insertProductData,
										productOemNumbers: e.target.value.split(',').map((x) => x.trim()),
									})
								}
							/>
						</Stack>

						{/* STOCK */}
						<Stack className="config-column">
							<Typography className="title">Stock</Typography>
							<input
								type="number"
								className="description-input"
								value={insertProductData.productStock}
								onChange={(e) =>
									setInsertProductData({
										...insertProductData,
										productStock: parseInt(e.target.value),
									})
								}
							/>
						</Stack>

						{/* DESCRIPTION */}
						<Typography className="product-title">Description</Typography>
						<textarea
							className="description-text"
							placeholder="Product details..."
							value={insertProductData.productDescription}
							onChange={(e) =>
								setInsertProductData({
									...insertProductData,
									productDescription: e.target.value,
								})
							}
						></textarea>
					</Stack>

					{/* IMAGES */}
					<Typography className="upload-title">Upload Product Images</Typography>

					<Stack className="images-box">
						<Stack className="upload-box">
							<Button className="browse-button" onClick={() => inputRef.current.click()}>
								<Typography className="browse-button-text">Browse Files</Typography>
								<input
									ref={inputRef}
									type="file"
									hidden
									multiple
									accept="image/jpg, image/jpeg, image/png"
									onChange={uploadImages}
								/>
							</Button>
						</Stack>

						<Stack className="gallery-box">
							{insertProductData.productImages?.map((img: string) => (
								<Stack key={img} className="image-box" style={{ position: 'relative', cursor: 'pointer' }}>
									<img 
										src={`${REACT_APP_API_URL}/${img}`} 
										alt="" 
										onClick={() => removeImageHandler(img)}
										style={{ width: '100%', height: '100%', objectFit: 'cover' }}
									/>
									<Button
										onClick={(e) => {
											e.stopPropagation();
											removeImageHandler(img);
										}}
										style={{
											position: 'absolute',
											top: '5px',
											right: '5px',
											minWidth: '30px',
											width: '30px',
											height: '30px',
											borderRadius: '50%',
											backgroundColor: 'rgba(255, 0, 0, 0.7)',
											color: 'white',
											padding: 0,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											cursor: 'pointer',
										}}
									>
										×
									</Button>
								</Stack>
							))}
						</Stack>
					</Stack>

					{/* BUTTON */}
					<Stack className="buttons-row">
						{router.query.productId ? (
							<Button className="next-button" disabled={doDisabledCheck()} onClick={updateProductHandler}>
								<Typography className="next-button-text">Save</Typography>
							</Button>
						) : (
							<Button className="next-button" disabled={doDisabledCheck()} onClick={insertProductHandler}>
								<Typography className="next-button-text">Save</Typography>
							</Button>
						)}
					</Stack>
				</Stack>
			</div>
		</div>
	);
};

AddNewProduct.defaultProps = {
	initialValues: {
		productTitle: '',
		productPrice: 0,
		productSalePrice: undefined,
		productMainCategory: '',
		productSubCategory: '',
		productCondition: '',
		productCarBrand: '',
		productCarModel: '',
		productDescription: '',
		productOemNumbers: [],
		productYearFrom: 0,
		productYearTo: 0,
		productStock: 1,
		productImages: [],
	},
};

export default AddNewProduct;
