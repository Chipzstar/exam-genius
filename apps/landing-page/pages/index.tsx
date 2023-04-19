import React from 'react';
import Navbar from '../components/Navbar';
import Pricing from '../components/Pricing';
import Hero from '../components/Hero';
import Body from '../components/Body';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import Reviews from '../components/Reviews';
import SneakPeak from '../components/SneakPeak';

const Index = () => {
	return (
		<div className='w-full'>
			<div className='px-5 pt-5 md:px-16'>
				<Navbar />
				<Hero />
				<Reviews />
				<SneakPeak />
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
