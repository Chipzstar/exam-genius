'use client';

import { Children, isValidElement, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

type AnimatedListProps = {
	children: ReactNode;
	className?: string;
};

export function AnimatedList({ children, className }: AnimatedListProps) {
	const reduceMotion = useReducedMotion();

	return (
		<motion.div
			className={className}
			initial='hidden'
			animate='show'
			variants={{
				hidden: { opacity: reduceMotion ? 1 : 0 },
				show: {
					opacity: 1,
					transition: {
						staggerChildren: reduceMotion ? 0 : 0.07,
						delayChildren: reduceMotion ? 0 : 0.02
					}
				}
			}}
		>
			{Children.map(children, (child, i) =>
				isValidElement(child) ? (
					<motion.div
						key={child.key ?? i}
						variants={{
							hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 },
							show: {
								opacity: 1,
								y: 0,
								transition: { duration: reduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }
							}
						}}
					>
						{child}
					</motion.div>
				) : (
					child
				)
			)}
		</motion.div>
	);
}
