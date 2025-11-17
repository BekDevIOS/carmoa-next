import LayoutHome from "../libs/components/layout/LayoutHome";
import PartCategories from "../libs/components/homepage/PartCategories";
import { Stack } from "@mui/material";

function Home() {
	return (
		<Stack className={'home-page'}>
			<PartCategories />
		</Stack>
	);
}

export default LayoutHome(Home);