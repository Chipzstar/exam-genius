'use client';

import Image from 'next/image';
import { useState } from 'react';

interface SubjectIconProps {
	subject: string;
	wrapperClassName: string;
	imageSize: number;
	imageClassName: string;
	fallbackClassName: string;
}

export function SubjectIcon({ subject, wrapperClassName, imageSize, imageClassName, fallbackClassName }: SubjectIconProps) {
	const label = formatLabel(subject);
	const [hasIconError, setHasIconError] = useState(false);

	return (
		<div className={wrapperClassName}>
			{hasIconError ? (
				<span className={fallbackClassName}>{label.slice(0, 1)}</span>
			) : (
				<Image
					src={`/static/images/${subject}-icon.svg`}
					width={imageSize}
					height={imageSize}
					alt=''
					className={imageClassName}
					onError={() => setHasIconError(true)}
				/>
			)}
		</div>
	);
}

function formatLabel(value: string) {
	return value
		.split(/[_-]/)
		.filter(Boolean)
		.map(part => part.slice(0, 1).toUpperCase() + part.slice(1))
		.join(' ');
}
