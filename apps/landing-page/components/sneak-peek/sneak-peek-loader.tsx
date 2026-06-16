'use client';

import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

const SNEAK_PEEK_LOADER_SRC = '/static/animations/sneak-peek-loader.lottie';
const SNEAK_PEEK_LOADER_ANIMATION_ID = 'ExamGenius sneak peek generating pulse';

const DotLottieReact = dynamic(
	() => import('@lottiefiles/dotlottie-react').then(mod => mod.DotLottieReact),
	{ ssr: false }
);

interface SneakPeekLoaderProps {
	className?: string;
}

export function SneakPeekLoader({ className }: SneakPeekLoaderProps) {
	return (
		<DotLottieReact
			src={SNEAK_PEEK_LOADER_SRC}
			animationId={SNEAK_PEEK_LOADER_ANIMATION_ID}
			autoplay
			loop
			width={208}
			height={208}
			className={cn('mx-auto h-52 w-52', className)}
		/>
	);
}
