import { useEffect, useState } from 'react';


const useDeviceDetect = (): 'mobile' | 'desktop' => {
	const [device, setDevice] = useState<'mobile' | 'desktop'>('desktop');

	useEffect(() => {
		if (typeof navigator === 'undefined') return;

		const ua = navigator.userAgent || '';
		const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
		const isMobileMQ = typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false;

		setDevice(isMobileUA || isMobileMQ ? 'mobile' : 'desktop');
	}, []);

	return device;
};

export default useDeviceDetect;
