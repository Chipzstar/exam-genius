import React from 'react';
import { DEFAULT_HEADER_HEIGHT } from '../utils/constants';

interface PageContainerProps {
	children: JSX.Element | JSX.Element[];
	header?: JSX.Element;
	classNames?: string;
	extraClassNames?: string;
	data_cy?: string;
}

const Page = ({ children }) => {
	return { children };
};

const Container = ({
	children,
	header = undefined,
	classNames = 'h-screen flex flex-col',
	extraClassNames = '',
	data_cy = undefined
}: PageContainerProps) => {
	return (
		<div className={`${classNames} ${extraClassNames}`} data-cy={data_cy}>
			{header}
			{children}
		</div>
	);
};

Page.Container = Container;

const Header = ({
	children,
	classNames = 'bg-white mb-4 flex items-center px-6',
	extraClassNames = '',
	height = DEFAULT_HEADER_HEIGHT
}) => {
	return (
		<div
			className={`${classNames} ${extraClassNames}`}
			style={{
				height,
				minHeight: height
			}}
		>
			{children}
		</div>
	);
};

Page.Header = Header;

const Body = ({ children, classNames = 'px-6 flex flex-col grow', extraClassNames = '' }) => {
	return <div className={`${classNames} ${extraClassNames}`}>{children}</div>;
};

Page.Body = Body;

const Footer = ({
	children,
	classNames = 'my-4 flex px-6',
	extraClassNames = '',
	height = DEFAULT_HEADER_HEIGHT
}) => {
	return (
		<div
			className={`${classNames} ${extraClassNames}`}
			style={{
				height,
				minHeight: height
			}}
		>
			{children}
		</div>
	);
};

Page.Footer = Footer;

export default Page;
