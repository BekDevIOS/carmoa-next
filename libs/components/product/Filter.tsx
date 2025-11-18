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
	Box,
	Slider,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface FilterType {
	searchFilter: any;
	setSearchFilter: any;
	initialInput: any;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [searchText, setSearchText] = useState<string>('');
	const [selectedBrand, setSelectedBrand] = useState<string>('Bentley');
	const [selectedModel, setSelectedModel] = useState<string>('Bentayga');
	const [selectedYear, setSelectedYear] = useState<string>('2024');
	const [selectedEngine, setSelectedEngine] = useState<string>('');
	const [priceRange, setPriceRange] = useState<number[]>([200, 560]);
	const [selectedColor, setSelectedColor] = useState<string>('Black');
	const [hoveredColor, setHoveredColor] = useState<string | null>(null);
	const [selectedSize, setSelectedSize] = useState<string>('');
	const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
		parts: true,
		categories: false,
		price: false,
		color: false,
		size: false,
		brands: false,
	});

	// Sample data
	const brands = ['Bentley', 'BMW', 'Mercedes', 'Audi', 'Ford'];
	const models = ['Bentayga', 'Continental', 'Flying Spur'];
	const years = ['2024', '2023', '2022', '2021', '2020'];
	const engines = ['V8', 'V12', 'W12', 'Select Engine'];
	const categories = [
		{ name: 'Accessories', count: 11 },
		{ name: 'Body Parts', count: 11 },
		{ name: 'Electronics', count: 7 },
		{ name: 'Engine & Drivetrain', count: 4 },
		{ name: 'Interior', count: 11 },
		{ name: 'Lighting', count: 9 },
		{ name: 'Performance', count: 11 },
		{ name: 'Repair Parts', count: 8 },
		{ name: 'Suspensions', count: 5 },
		{ name: 'Tires & Wheels', count: 8 },
		{ name: 'Tools & Garage', count: 4 },
	];
	const colors = [
		{ name: 'Black', value: '#000000' },
		{ name: 'Blue', value: '#0000FF' },
		{ name: 'Orange', value: '#FFA500' },
		{ name: 'Red', value: '#FF0000' },
	];
	const sizes = ['16 Inch', '18 Inch', '20 Inch', '22 Inch'];
	const filterBrands = ['Ford', 'BMW', 'Mitsubishi', 'Honda', 'KN', 'Nissan'];

	/** HANDLERS **/
	const refreshHandler = async () => {
		setSearchText('');
		setSelectedBrand('Bentley');
		setSelectedModel('Bentayga');
		setSelectedYear('2024');
		setSelectedEngine('');
		setPriceRange([200, 560]);
		setSelectedColor('Black');
		setHoveredColor(null);
		setSelectedSize('');
		setSelectedBrands([]);
		setSelectedCategories([]);
	};

	const toggleSection = (section: string) => {
		setExpandedSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	const handleColorSelect = (colorName: string) => {
		setSelectedColor(colorName);
	};

	const handleCategoryToggle = (categoryName: string) => {
		setSelectedCategories((prev) =>
			prev.includes(categoryName) ? prev.filter((c) => c !== categoryName) : [...prev, categoryName],
		);
	};

	const handleBrandToggle = (brandName: string) => {
		setSelectedBrands((prev) =>
			prev.includes(brandName) ? prev.filter((b) => b !== brandName) : [...prev, brandName],
		);
	};

	const handlePriceChange = (_event: any, newValue: number | number[]) => {
		setPriceRange(newValue as number[]);
	};

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
							onKeyDown={(event: any) => {
								if (event.key == 'Enter') {
									setSearchFilter({
										...searchFilter,
										search: { ...searchFilter.search, text: searchText },
									});
								}
							}}
							endAdornment={
								<>
									<CancelRoundedIcon
										onClick={() => {
											setSearchText('');
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: '' },
											});
										}}
									/>
								</>
							}
						/>
						<img src={'/img/icons/search_icon.png'} alt={''} />
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
									<Select
										value={selectedBrand}
										onChange={(e) => setSelectedBrand(e.target.value)}
										displayEmpty
										className={'select-field'}
									>
										{brands.map((brand) => (
											<MenuItem key={brand} value={brand}>
												{brand}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Stack>
							<Stack className={'input-box'}>
								<FormControl fullWidth>
									<Select
										value={selectedModel}
										onChange={(e) => setSelectedModel(e.target.value)}
										displayEmpty
										className={'select-field'}
									>
										{models.map((model) => (
											<MenuItem key={model} value={model}>
												{model}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Stack>
							<Stack className={'input-box'}>
								<FormControl fullWidth>
									<Select
										value={selectedYear}
										onChange={(e) => setSelectedYear(e.target.value)}
										displayEmpty
										className={'select-field'}
									>
										{years.map((year) => (
											<MenuItem key={year} value={year}>
												{year}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Stack>
							<Stack className={'input-box'}>
								<FormControl fullWidth>
									<Select
										value={selectedEngine}
										onChange={(e) => setSelectedEngine(e.target.value)}
										displayEmpty
										className={'select-field'}
									>
										{engines.map((engine) => (
											<MenuItem key={engine} value={engine}>
												{engine}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Stack>
							<Button className={'search-btn'}>SEARCH</Button>
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
							{categories.map((category) => (
								<Stack className={'category-item'} key={category.name}>
									<Checkbox
										checked={selectedCategories.includes(category.name)}
										onChange={() => handleCategoryToggle(category.name)}
										className={'category-checkbox'}
									/>
									<Typography
										className={`category-name ${selectedCategories.includes(category.name) ? 'selected' : ''}`}
									>
										{category.name} ({category.count})
									</Typography>
									{(category.name === 'Body Parts' ||
										category.name === 'Electronics' ||
										category.name === 'Engine & Drivetrain' ||
										category.name === 'Suspensions' ||
										category.name === 'Tires & Wheels') && <ExpandMoreIcon className={'category-expand-icon'} />}
								</Stack>
							))}
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
								<Button className={'filter-btn'}>FILTER</Button>
							</Stack>
						</Stack>
					)}
				</Stack>

				<Stack className={'color-filter'} mb={'30px'}>
					<Stack className={'section-header'} onClick={() => toggleSection('color')}>
						<Typography className={'section-title'}>Color</Typography>
						<ExpandMoreIcon
							className={`expand-icon ${expandedSections.color ? 'expanded' : ''}`}
							sx={{
								transform: expandedSections.color ? 'rotate(180deg)' : 'rotate(0deg)',
								transition: 'transform 0.3s',
							}}
						/>
					</Stack>
					{expandedSections.color && (
						<Stack className={'color-list'} mt={'20px'}>
							{colors.map((color) => {
								const isSelected = selectedColor === color.name;
								const isHovered = hoveredColor === color.name;
								return (
									<Stack
										className={`color-item ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
										key={color.name}
										onClick={() => handleColorSelect(color.name)}
										onMouseEnter={() => setHoveredColor(color.name)}
										onMouseLeave={() => setHoveredColor(null)}
									>
										<Tooltip
											title={color.name}
											placement="right"
											arrow
											componentsProps={{
												tooltip: {
													sx: {
														backgroundColor: '#424242',
														color: '#ffffff',
														fontFamily: "'Poppins', sans-serif",
														fontSize: '12px',
														padding: '6px 12px',
														borderRadius: '4px',
													},
												},
												arrow: {
													sx: {
														color: '#424242',
													},
												},
											}}
										>
											<Box
												className={'color-swatch'}
												style={{
													'--swatch-color': color.value,
													'--hover-border-color': isHovered && !isSelected ? color.value : undefined,
												} as React.CSSProperties}
											/>
										</Tooltip>
										<Typography className={`color-name ${isSelected ? 'selected' : ''}`}>{color.name}</Typography>
									</Stack>
								);
							})}
						</Stack>
					)}
				</Stack>

				<Stack className={'size-filter'} mb={'30px'}>
					<Stack className={'section-header'} onClick={() => toggleSection('size')}>
						<Typography className={'section-title'}>Size</Typography>
						<ExpandMoreIcon
							className={`expand-icon ${expandedSections.size ? 'expanded' : ''}`}
							sx={{
								transform: expandedSections.size ? 'rotate(180deg)' : 'rotate(0deg)',
								transition: 'transform 0.3s',
							}}
						/>
					</Stack>
					{expandedSections.size && (
						<Stack className={'size-buttons'} mt={'20px'} direction={'row'} spacing={2}>
							{sizes.map((size) => (
								<Button
									key={size}
									className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
									onClick={() => setSelectedSize(size === selectedSize ? '' : size)}
								>
									{size}
								</Button>
							))}
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
							{filterBrands.map((brand) => (
								<Stack className={'brand-item'} key={brand}>
									<Checkbox
										checked={selectedBrands.includes(brand)}
										onChange={() => handleBrandToggle(brand)}
										className={'brand-checkbox'}
									/>
									<Typography className={'brand-name'}>{brand}</Typography>
								</Stack>
							))}
						</Stack>
					)}
				</Stack>
			</Stack>
		);
	}
};

export default Filter;
