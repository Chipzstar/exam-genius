import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import Pricing from '../components/Pricing';
import Hero from '../components/Hero';
import Body from '../components/Body';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import Reviews from '../components/Reviews';
import HowItWorks from '../components/HowItWorks';
import SneakPeakSlideshow from '../modals/SneakPeakSlideshow';
import { SneakPeakContext } from '../context/SneakPeakContext';

const Index = () => {
	const [sneak, showSneakPeak] = useContext(SneakPeakContext);
	return (
		<div className='w-full'>
			<SneakPeakSlideshow opened={sneak} onClose={() => showSneakPeak(false)} />
			<div className='px-5 pt-5 md:px-16'>
				<Navbar />
				<Hero />
				<Reviews />
				<HowItWorks />
				<Body />
				<Pricing />
				<FAQ />
				<CTA />
			</div>
			<Footer />
		</div>
	);
};

export default Index;
