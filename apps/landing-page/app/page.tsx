'use client';

import { useContext } from 'react';
import SneakPeakSlideshow from '../modals/SneakPeakSlideshow';
import { SneakPeakContext } from '../context/SneakPeakContext';
import { LandingRedesign } from '../components/landing/landing-redesign';
import { trackLandingCtaClick, trackSneakPeakOpened, trackStartNowClick } from '../utils/analytics';

export default function HomePage() {
	const [sneak, showSneakPeak] = useContext(SneakPeakContext);

	function handleCtaClick(label: string, location: string) {
		trackLandingCtaClick(label, location);
		trackStartNowClick(location);
		trackSneakPeakOpened(`${location}-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
		showSneakPeak(true);
	}

	return (
		<div className='w-full'>
			<SneakPeakSlideshow opened={sneak} onClose={() => showSneakPeak(false)} />
			<LandingRedesign onCtaClick={handleCtaClick} />
		</div>
	);
}
