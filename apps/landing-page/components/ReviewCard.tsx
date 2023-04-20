import React from 'react';
import { Avatar, Paper, Stack, Text } from '@mantine/core';
import { Review } from '../utils/constants';

const ReviewCard = ({ author, review, subject, age, image }: Review) => {
	return (
		<Paper
			shadow='md'
			p='xl'
			radius='md'
			sx={theme => ({
				borderStyle: 'solid',
				borderWidth: 3,
				borderColor: theme.colors.brand[5]
			})}
		>
			<Stack>
				<div className='flex items-center space-x-4'>
					<Avatar src={image} alt='Posi' />
					<div className='flex flex-col'>
						<div className='flex'>
							<span className='text-lg font-medium'>{author}, &nbsp;</span>
							<span className='text-lg font-medium'>{age}</span>
						</div>

						<span>{subject}</span>
					</div>
				</div>
				<Text>{review}</Text>
			</Stack>
		</Paper>
	);
};

export default ReviewCard;
