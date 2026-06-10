import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
	className?: string;
	markClassName?: string;
	textClassName?: string;
	variant?: 'dark' | 'light';
}

export function BrandLogo({ className, markClassName, textClassName, variant = 'dark' }: BrandLogoProps) {
	return (
		<Link href='/' className={cn('inline-flex items-center gap-2.5', className)} aria-label='ExamGenius home'>
			<Image
				src='/static/favicon/icon.svg'
				alt=''
				width={32}
				height={32}
				className={cn('h-8 w-8 rounded-full', markClassName)}
				priority
			/>
			<span
				className={cn(
					'text-base font-bold tracking-[-0.04em]',
					variant === 'light' ? 'text-white' : 'text-slate-950',
					textClassName
				)}
			>
				ExamGenius
			</span>
		</Link>
	);
}
