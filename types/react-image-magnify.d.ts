declare module 'react-image-magnify' {
	import { CSSProperties } from 'react';

	export interface ReactImageMagnifyProps {
		smallImage: {
			alt: string;
			isFluidWidth: boolean;
			src: string;
		};
		largeImage: {
			src: string;
			width: number;
			height: number;
		};
		enlargedImageContainerDimensions?: {
			width: string;
			height: string;
		};
		enlargedImagePosition?: string;
		lensStyle?: CSSProperties;
		shouldUsePositiveSpaceLens?: boolean;
		imageClassName?: string;
		enlargedImageClassName?: string;
		className?: string;
	}

	export default function ReactImageMagnify(props: ReactImageMagnifyProps): JSX.Element;
}

