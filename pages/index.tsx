import LayoutHome from "../libs/components/layout/LayoutHome";
import PartCategories from "../libs/components/homepage/PartCategories";
import TrendProducts from "../libs/components/homepage/TrendProducts";
import BrandProducts from "../libs/components/homepage/BrandProducts";
import { Stack } from "@mui/material";

function Home() {
	return (
		<Stack className={'home-page'}>
			<PartCategories />
			<TrendProducts />
			<BrandProducts />
		</Stack>
	);
}

export default LayoutHome(Home);