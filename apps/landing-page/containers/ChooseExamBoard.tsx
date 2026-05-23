'use client'

import React from 'react'
import { Box, Button, Group, Radio, SimpleGrid, Text, Title } from '@mantine/core'
import Page from '../layout/Page'
import { ExamBoardCard } from '@exam-genius/shared/ui'
import { useMediaQuery } from '@mantine/hooks'

interface ChooseExamBoardProps {
	next?: () => void
	prev?: () => void
	disabled?: boolean
	value?: string
	onChange?: (value: string) => void
	showWjec?: boolean
}

const ChooseExamBoard = ({
	next,
	prev,
	disabled,
	value,
	onChange,
	showWjec = false
}: ChooseExamBoardProps) => {
	const mobileScreen = useMediaQuery('(max-width: 30em)')
	const gridCols = showWjec ? { base: 2, sm: 2 } : { base: 1, xs: 3 }
	return (
		<Page.Container classNames='h-full flex flex-col pb-2'>
			<header className='pb-20'>
				<Title ta="center" order={2} size="h1" c="brand.5" fw={600}>
					Choose your exam board
				</Title>
			</header>
			<Page.Body extraClassNames='h-full justify-center'>
				<div className='pb-10'>
					<Radio.Group name='board' value={value} onChange={onChange}>
						<SimpleGrid cols={gridCols}>
							<ExamBoardCard value='aqa' src='/static/images/aqa-icon.svg' />
							<ExamBoardCard value='edexcel' src='/static/images/edexcel-icon.svg' />
							<ExamBoardCard value='ocr' src='/static/images/ocr-icon.svg' />
							{showWjec ? (
								<ExamBoardCard value='wjec' src='/static/images/wjec-icon.png' />
							) : null}
						</SimpleGrid>
					</Radio.Group>
					<Group justify='flex-end' pt='xl'>
						<Box w={140}>
							<Button fullWidth size='xl' disabled={disabled} onClick={next}>
								<Text>Next</Text>
							</Button>
						</Box>
					</Group>
				</div>
			</Page.Body>
		</Page.Container>
	);
};

export default ChooseExamBoard;
