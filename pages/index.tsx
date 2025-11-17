import LayoutHome from '../libs/components/layout/LayoutHome';
import PartCategories from '../libs/components/homepage/PartCategories';
import TrendProducts from '../libs/components/homepage/TrendProducts';
import BrandProducts from '../libs/components/homepage/BrandProducts';
import FeaturedProducts from '../libs/components/homepage/FeaturedProducts';
import Advertisement from '../libs/components/homepage/Advertisement';
import TopDealers from '../libs/components/homepage/TopDealers';
import TopProducts from '../libs/components/homepage/TopProducts';
import { Stack } from '@mui/material';

function Home() {
	return (
		<Stack className={'home-page'}>
			<PartCategories />
			<TrendProducts />
			<BrandProducts />
			<Advertisement />
			<FeaturedProducts />
			<TopDealers />
			<TopProducts />
		</Stack>
	);
}

export default LayoutHome(Home);
