import React from 'react';
import Navbar from '../containers/Navbar';
import Pricing from '../containers/Pricing';
import Hero from '../containers/Hero';
import Body from '../containers/Body';
import FAQ from '../containers/FAQ';
import CTA from '../containers/CTA';
import Footer from '../containers/Footer';
import Reviews from '../containers/Reviews';
import SneakPeak from '../containers/SneakPeak';

const Index = () => {
	return (
		<div className='container'>
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
