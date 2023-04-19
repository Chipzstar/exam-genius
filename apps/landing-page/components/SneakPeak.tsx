import React, { useCallback, useEffect, useState } from 'react';
import { Button, Image, Text } from '@mantine/core';
import { IconPlayerPlay } from '@tabler/icons-react';
import SneakPeakSlideshow from '../modals/SneakPeakSlideshow';
import { useMediaQuery, useViewportSize } from '@mantine/hooks';
import { Carousel, Embla } from '@mantine/carousel';

const images = [
	{
		path: '/static/images/oxford.svg',
		alt: 'Oxford',
		width: 198,
		height: 60
	},
	{
		path: '/static/images/cambridge.svg',
		alt: 'Cambridge',
		width: 154,
		height: 80
	},
	{
		path: '/static/images/imperial.svg',
		alt: 'Imperial',
		width: 196,
		height: 48
	},
	{
		path: '/static/images/UCL.svg',
		alt: 'UCL',
		width: 176,
		height: 66
	},
	{
		path: '/static/images/KCL.svg',
		alt: 'Kings College',
		width: 125,
		height: 66
	},
	{
		path: '/static/images/manchester.svg',
		alt: 'Manchester',
		width: 100,
		height: 66
	},
	{
		path: '/static/images/warwick.svg',
		alt: 'Warwick',
		width: 99,
		height: 66
	}
];

const SneakPeak = () => {
	const [sneak, showSneakPeak] = useState(false);
	const { width } = useViewportSize();
	const mobileScreen = useMediaQuery('(max-width: 30em)');
	const [embla, setEmbla] = useState<Embla | null>(null);
	// const autoplay = useRef(Autoplay({delay: 0, stopOnMouseEnter: true}));

	const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
	const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
	const [scrollProgress, setScrollProgress] = useState(0);

	const onSelect = useCallback(() => {
		if (!embla) return;
		setPrevBtnEnabled(embla.canScrollPrev());
		setNextBtnEnabled(embla.canScrollNext());
	}, [embla]);

	const onScroll = useCallback(() => {
		if (!embla) return;
		const progress = Math.max(0, Math.min(1, embla.scrollProgress()));
		setScrollProgress(progress * 100);
	}, [embla, setScrollProgress]);

	useEffect(() => {
		if (!embla) return;
		onSelect();
		onScroll();
		embla.on('select', onSelect);
		embla.on('scroll', onScroll);

		// Start scrolling slowly
		const engine = embla.internalEngine();
		engine.scrollBody.useSpeed(0.2);
		engine.scrollTo.index(embla.scrollSnapList().length - 1, -1);
	}, [embla, onSelect, onScroll]);

	return (
		<div
			id='how-it-works'
			className='flex min-h-screen flex-col items-center justify-center gap-y-8 py-10 md:gap-y-20'
		>
			<SneakPeakSlideshow opened={sneak} onClose={() => showSneakPeak(false)} />
			<p className='text-center text-2xl font-medium sm:text-3xl md:text-5xl lg:text-6xl'>
				<span className='inline-block leading-normal'>
					📚 Study smarter with ExamGenius’ AI
					<div className='flex inline-flex shrink flex-col items-center pl-4'>
						<span> predicted papers</span>
						<Image src='/static/images/swoosh.svg' alt='swoosh-underline' height={10} width={250} />
					</div>
				</span>
			</p>
			<div style={{ width: mobileScreen ? '100%' : 800 }} className='text-center md:text-xl'>
				<span>
					Our AI has read exam papers for the previous 10 years and uses this data to predict which questions
					are likely to come up in this years papers with <br />
					<span className='text-primary'>85% accuracy.</span>
				</span>
			</div>
			<div>
				<Button
					size={mobileScreen ? 'md' : 'xl'}
					variant='outline'
					leftIcon={<IconPlayerPlay stroke={1.5} />}
					onClick={() => showSneakPeak(true)}
				>
					<Text>See example questions</Text>
				</Button>
			</div>
			<div className='flex-col space-y-8'>
				<span className='flex justify-center text-center'>Trusted by our students at</span>
				<div className='flex items-center justify-around space-x-6'>
					{mobileScreen ? (
						<Carousel
							dragFree
							maw={width - 20}
							getEmblaApi={setEmbla}
							withControls={false}
							slideSize='50%'
							align='start'
							slideGap='md'
							loop
							/*plugins={[autoplay.current]}
							onMouseEnter={autoplay.current.stop}
							onMouseLeave={autoplay.current.reset}*/
							slidesToScroll={1}
						>
							{images.map((image, index) => (
								<Carousel.Slide key={index}>
									<Image src={image.path} alt={image.alt} width={image.width} height={image.height} />
								</Carousel.Slide>
							))}
						</Carousel>
					) : (
						<>
							{images.map((image, index) => (
								<Image src={image.path} alt={image.alt} width={image.width} height={image.height} />
							))}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default SneakPeak;
