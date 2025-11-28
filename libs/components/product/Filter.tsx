import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	Button,
	OutlinedInput,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Tooltip,
	IconButton,
	Slider,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import { ProductsInquiry } from '../../types/product/product.input';
import { CarBrand, ProductMainCategory, ProductSubCategory, ProductCondition } from '../../enums/product.enum';

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface FilterType {
	searchFilter: ProductsInquiry;
	setSearchFilter: any;
	initialInput: ProductsInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [searchText, setSearchText] = useState<string>('');
	const [selectedMainCategory, setSelectedMainCategory] = useState<ProductMainCategory | ''>('');
	const [selectedSubCategory, setSelectedSubCategory] = useState<ProductSubCategory | ''>('');
	const [selectedBrand, setSelectedBrand] = useState<CarBrand | ''>('');
	const [selectedCondition, setSelectedCondition] = useState<ProductCondition | ''>('');
	const [priceRange, setPriceRange] = useState<number[]>([200, 560]);
	const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
		parts: true,
		categories: false,
		price: false,
		brands: false,
	});

	// Enum data
	const mainCategories = Object.values(ProductMainCategory);
	const carBrands = Object.values(CarBrand);
	const conditions = Object.values(ProductCondition);

	// Get subcategories based on main category
	const getSubCategories = (mainCategory: ProductMainCategory): ProductSubCategory[] => {
		switch (mainCategory) {
			case ProductMainCategory.ENGINE:
				return [
					ProductSubCategory.ENGINE_OIL_FILTER,
					ProductSubCategory.AIR_FILTER,
					ProductSubCategory.FUEL_PUMP,
					ProductSubCategory.RADIATOR,
					ProductSubCategory.ALTERNATOR,
					ProductSubCategory.BATTERY,
				];
			case ProductMainCategory.EXTERIOR:
				return [
					ProductSubCategory.BUMPER,
					ProductSubCategory.HEADLIGHT,
					ProductSubCategory.TAILLIGHT,
					ProductSubCategory.MIRROR,
				];
			case ProductMainCategory.INTERIOR:
				return [ProductSubCategory.STEERING_WHEEL, ProductSubCategory.SEAT, ProductSubCategory.DASHBOARD];
			case ProductMainCategory.SUSPENSION:
				return [ProductSubCategory.SHOCK_ABSORBER, ProductSubCategory.SPRING, ProductSubCategory.CONTROL_ARM];
			case ProductMainCategory.ELECTRICAL:
				return [ProductSubCategory.SENSOR, ProductSubCategory.ECU, ProductSubCategory.CABLE];
			default:
				return [];
		}
	};

	const availableSubCategories = selectedMainCategory ? getSubCategories(selectedMainCategory) : [];

	/** LIFECYCLES **/
	useEffect(() => {
		setSearchText(searchFilter?.search?.text || '');
		if (searchFilter?.search?.pricesRange) {
			setPriceRange([searchFilter.search.pricesRange.start || 0, searchFilter.search.pricesRange.end || 1000]);
		}
	}, [searchFilter]);

	/** HANDLERS **/
	const refreshHandler = async () => {
		try {
			setSearchText('');
			setSelectedMainCategory('');
			setSelectedSubCategory('');
			setSelectedBrand('');
			setSelectedCondition('');
			setPriceRange([200, 560]);
			await router.push(
				`/product?input=${JSON.stringify(initialInput)}`,
				`/product?input=${JSON.stringify(initialInput)}`,
				{ scroll: false },
			);
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	const toggleSection = (section: string) => {
		setExpandedSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	const handleCategoryToggle = useCallback(
		async (categoryEnum: ProductMainCategory) => {
			try {
				const currentList = searchFilter?.search?.mainCategoryList || [];
				const isSelected = currentList.includes(categoryEnum);

				if (isSelected) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								mainCategoryList: currentList.filter((item: ProductMainCategory) => item !== categoryEnum),
							},
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								mainCategoryList: currentList.filter((item: ProductMainCategory) => item !== categoryEnum),
							},
						})}`,
						{ scroll: false },
					);
				} else {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								mainCategoryList: [...currentList, categoryEnum],
							},
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								mainCategoryList: [...currentList, categoryEnum],
							},
						})}`,
						{ scroll: false },
					);
				}
			} catch (err: any) {
				console.log('ERROR, handleCategoryToggle:', err);
			}
		},
		[searchFilter, router],
	);

	const handleBrandToggle = useCallback(
		async (brandEnum: CarBrand) => {
			try {
				const currentList = searchFilter?.search?.brandList || [];
				const isSelected = currentList.includes(brandEnum);

				if (isSelected) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								brandList: currentList.filter((item: CarBrand) => item !== brandEnum),
							},
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								brandList: currentList.filter((item: CarBrand) => item !== brandEnum),
							},
						})}`,
						{ scroll: false },
					);
				} else {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								brandList: [...currentList, brandEnum],
							},
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								brandList: [...currentList, brandEnum],
							},
						})}`,
						{ scroll: false },
					);
				}
			} catch (err: any) {
				console.log('ERROR, handleBrandToggle:', err);
			}
		},
		[searchFilter, router],
	);

	const handlePriceChange = (_event: any, newValue: number | number[]) => {
		setPriceRange(newValue as number[]);
	};

	const handlePriceFilter = useCallback(async () => {
		try {
			await router.push(
				`/product?input=${JSON.stringify({
					...searchFilter,
					search: {
						...searchFilter.search,
						pricesRange: {
							start: priceRange[0],
							end: priceRange[1],
						},
					},
				})}`,
				`/product?input=${JSON.stringify({
					...searchFilter,
					search: {
						...searchFilter.search,
						pricesRange: {
							start: priceRange[0],
							end: priceRange[1],
						},
					},
				})}`,
				{ scroll: false },
			);
		} catch (err: any) {
			console.log('ERROR, handlePriceFilter:', err);
		}
	}, [searchFilter, priceRange, router]);

	if (device === 'mobile') {
		return <div>PRODUCTS FILTER</div>;
	} else {
		return (
			<Stack className={'filter-main'}>
				<Stack className={'find-your-home'} mb={'40px'}>
					<Typography className={'title-main'}>Find Your Product</Typography>
					<Stack className={'input-box'}>
						<OutlinedInput
							value={searchText}
							type={'text'}
							className={'search-input'}
							placeholder={'What are you looking for?'}
							onChange={(e: any) => setSearchText(e.target.value)}
							onKeyDown={async (event: any) => {
								if (event.key == 'Enter') {
									await router.push(
										`/product?input=${JSON.stringify({
											...searchFilter,
											search: { ...searchFilter.search, text: searchText },
										})}`,
										`/product?input=${JSON.stringify({
											...searchFilter,
											search: { ...searchFilter.search, text: searchText },
										})}`,
										{ scroll: false },
									);
								}
							}}
							endAdornment={
								<>
									<CancelRoundedIcon
										onClick={async () => {
											setSearchText('');
											await router.push(
												`/product?input=${JSON.stringify({
													...searchFilter,
													search: { ...searchFilter.search, text: '' },
												})}`,
												`/product?input=${JSON.stringify({
													...searchFilter,
													search: { ...searchFilter.search, text: '' },
												})}`,
												{ scroll: false },
											);
										}}
									/>
								</>
							}
						/>
						<SearchIcon
							sx={{
								position: 'absolute',
								left: '15px',
								top: '18px',
								color: 'var(--carmo-text-secondary)',
								fontSize: '24px',
							}}
						/>
						<Tooltip title="Reset">
							<IconButton onClick={refreshHandler}>
								<RefreshIcon />
							</IconButton>
						</Tooltip>
					</Stack>
				</Stack>
				<Stack className={'parts-search-form'} mb={'30px'}>
					<Stack className={'section-header'} onClick={() => toggleSection('parts')}>
						<Typography className={'section-title'}>Parts For Any Car</Typography>
						<ExpandMoreIcon
							className={`expand-icon ${expandedSections.parts ? 'expanded' : ''}`}
							sx={{
								transform: expandedSections.parts ? 'rotate(180deg)' : 'rotate(0deg)',
								transition: 'transform 0.3s',
							}}
						/>
					</Stack>
					{expandedSections.parts && (
						<Stack className={'parts-form'} mt={'20px'}>
							<Stack className={'input-box'}>
								<FormControl fullWidth>
									<InputLabel>Main Category</InputLabel>
									<Select
										value={selectedMainCategory}
										onChange={(e) => {
											setSelectedMainCategory(e.target.value as ProductMainCategory);
											setSelectedSubCategory(''); // Reset subcategory when main category changes
										}}
										displayEmpty
										className={'select-field'}
										label="Main Category"
									>
										{mainCategories.map((category) => (
											<MenuItem key={category} value={category}>
												{category}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Stack>
							<Stack className={'input-box'}>
								<FormControl fullWidth>
									<InputLabel>Sub Category</InputLabel>
									<Select
										value={selectedSubCategory}
										onChange={(e) => setSelectedSubCategory(e.target.value as ProductSubCategory)}
										displayEmpty
										className={'select-field'}
										label="Sub Category"
										disabled={!selectedMainCategory}
									>
										{availableSubCategories.map((subCategory) => (
											<MenuItem key={subCategory} value={subCategory}>
												{subCategory}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Stack>
							<Stack className={'input-box'}>
								<FormControl fullWidth>
									<InputLabel>Brand</InputLabel>
									<Select
										value={selectedBrand}
										onChange={(e) => setSelectedBrand(e.target.value as CarBrand)}
										displayEmpty
										className={'select-field'}
										label="Brand"
									>
										{carBrands.map((brand) => (
											<MenuItem key={brand} value={brand}>
												{brand}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Stack>
							<Stack className={'input-box'}>
								<FormControl fullWidth>
									<InputLabel>Condition</InputLabel>
									<Select
										value={selectedCondition}
										onChange={(e) => setSelectedCondition(e.target.value as ProductCondition)}
										displayEmpty
										className={'select-field'}
										label="Condition"
									>
										{conditions.map((condition) => (
											<MenuItem key={condition} value={condition}>
												{condition}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Stack>
							<Button
								className={'search-btn'}
								onClick={async () => {
									try {
										const searchUpdates: any = {};
										if (selectedMainCategory) {
											searchUpdates.mainCategoryList = [selectedMainCategory];
										}
										if (selectedSubCategory) {
											searchUpdates.subCategoryList = [selectedSubCategory];
										}
										if (selectedBrand) {
											searchUpdates.brandList = [selectedBrand];
										}
										if (selectedCondition) {
											searchUpdates.conditionList = [selectedCondition];
										}
										await router.push(
											`/product?input=${JSON.stringify({
												...searchFilter,
												search: { ...searchFilter.search, ...searchUpdates },
											})}`,
											`/product?input=${JSON.stringify({
												...searchFilter,
												search: { ...searchFilter.search, ...searchUpdates },
											})}`,
											{ scroll: false },
										);
									} catch (err: any) {
										console.log('ERROR, parts search:', err);
									}
								}}
							>
								SEARCH
							</Button>
						</Stack>
					)}
				</Stack>

				<Stack className={'product-categories'} mb={'30px'}>
					<Stack className={'section-header'} onClick={() => toggleSection('categories')}>
						<Typography className={'section-title'}>Product Categories</Typography>
						<ExpandMoreIcon
							className={`expand-icon ${expandedSections.categories ? 'expanded' : ''}`}
							sx={{
								transform: expandedSections.categories ? 'rotate(180deg)' : 'rotate(0deg)',
								transition: 'transform 0.3s',
							}}
						/>
					</Stack>
					{expandedSections.categories && (
						<Stack className={'categories-list'} mt={'20px'}>
							{mainCategories.map((category) => {
								const isSelected = (searchFilter?.search?.mainCategoryList || []).includes(category);
								return (
									<Stack className={'category-item'} key={category}>
										<Checkbox
											checked={isSelected}
											onChange={() => handleCategoryToggle(category)}
											className={'category-checkbox'}
										/>
										<Typography className={`category-name ${isSelected ? 'selected' : ''}`}>{category}</Typography>
									</Stack>
								);
							})}
						</Stack>
					)}
				</Stack>

				<Stack className={'price-filter'} mb={'30px'}>
					<Stack className={'section-header'} onClick={() => toggleSection('price')}>
						<Typography className={'section-title'}>Price</Typography>
						<ExpandMoreIcon
							className={`expand-icon ${expandedSections.price ? 'expanded' : ''}`}
							sx={{
								transform: expandedSections.price ? 'rotate(180deg)' : 'rotate(0deg)',
								transition: 'transform 0.3s',
							}}
						/>
					</Stack>
					{expandedSections.price && (
						<Stack className={'price-content'} mt={'20px'}>
							<Slider
								value={priceRange}
								onChange={handlePriceChange}
								valueLabelDisplay="off"
								min={0}
								max={1000}
								className={'price-slider'}
							/>
							<Stack className={'price-inputs'}>
								<OutlinedInput
									value={priceRange[0]}
									onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
									className={'price-input'}
								/>
								<OutlinedInput
									value={priceRange[1]}
									onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
									className={'price-input'}
								/>
								<Button className={'filter-btn'} onClick={handlePriceFilter}>
									FILTER
								</Button>
							</Stack>
						</Stack>
					)}
				</Stack>

				<Stack className={'brands-filter'}>
					<Stack className={'section-header'} onClick={() => toggleSection('brands')}>
						<Typography className={'section-title'}>Brands</Typography>
						<ExpandMoreIcon
							className={`expand-icon ${expandedSections.brands ? 'expanded' : ''}`}
							sx={{
								transform: expandedSections.brands ? 'rotate(180deg)' : 'rotate(0deg)',
								transition: 'transform 0.3s',
							}}
						/>
					</Stack>
					{expandedSections.brands && (
						<Stack className={'brands-list'} mt={'20px'}>
							{carBrands.map((brand) => {
								const isSelected = (searchFilter?.search?.brandList || []).includes(brand);
								return (
									<Stack className={'brand-item'} key={brand}>
										<Checkbox
											checked={isSelected}
											onChange={() => handleBrandToggle(brand)}
											className={'brand-checkbox'}
										/>
										<Typography className={'brand-name'}>{brand}</Typography>
									</Stack>
								);
							})}
						</Stack>
					)}
				</Stack>
			</Stack>
		);
	}
};

export default Filter;
