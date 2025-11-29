export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}`;

/**
 * Get the full image URL for a member image
 * Handles both full URLs (from Google) and relative paths (from backend storage)
 * 
 * @param memberImage - Image path or URL from backend
 * @param defaultImage - Default image path if memberImage is empty
 * @returns Full URL to the image
 */
export const getMemberImageUrl = (memberImage: string | null | undefined, defaultImage: string = '/img/profile/defaultUser.svg'): string => {
	if (!memberImage) {
		return defaultImage;
	}

	// If it's already a full URL (starts with http:// or https://), use it directly
	// This handles Google profile images and other external URLs
	if (memberImage.startsWith('http://') || memberImage.startsWith('https://')) {
		return memberImage;
	}

	// Otherwise, it's a relative path from backend storage, prepend API URL
	return `${REACT_APP_API_URL}/${memberImage}`;
};

export const availableOptions = ['productBarter', 'productRent'];

const thisYear = new Date().getFullYear();

export const productYears: any = [];

for (let i = 1970; i <= thisYear; i++) {
	productYears.push(String(i));
}

export const productSquare = [0, 25, 50, 75, 100, 125, 150, 200, 300, 500];

export const Messages = {
	error1: 'Something went wrong!',
	error2: 'Please login first!',
	error3: 'Please fulfill all inputs!',
	error4: 'Message is empty!',
	error5: 'Only images with jpeg, jpg, png format allowed!',
};

const topProductRank = 50;
