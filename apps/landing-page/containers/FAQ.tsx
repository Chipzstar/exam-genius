import React, { useState } from 'react';
import { Accordion } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import Image from 'next/image';

export const FAQ = () => {
	const [value, setValue] = useState<string | null>(null);
	return (
		<div id='faq' className='mx-auto py-10'>
			<div className='flex flex-col items-center justify-center space-y-10'>
				<div className='flex flex-col items-center gap-3'>
					<p className='text-2xl font-medium sm:text-4xl md:text-5xl lg:text-6xl'>FAQ</p>
					<Image src='/static/images/swoosh.svg' alt='swoosh-underline' height={10} width={200} />
					<p className='text-sm text-black sm:text-base lg:text-lg'>Frequently Asked Questions</p>
				</div>
				<Accordion
					value={value}
					onChange={setValue}
					radius='xs'
					defaultValue='customization'
					chevron={<IconPlus size='1rem' />}
					styles={{
						chevron: {
							'&[data-rotate]': {
								transform: 'rotate(45deg)'
							}
						}
					}}
					style={{ width: 800 }}
				>
					<Accordion.Item value='item1'>
						<Accordion.Control>Which exam boards do you cover?</Accordion.Control>
						<Accordion.Panel>Edexcel, OCR and AQA</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item value='item2'>
						<Accordion.Control>Can I choose which specific topics I want to practice?</Accordion.Control>
						<Accordion.Panel>Yes, you can select the topics from the subject you’ve chosen</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item value='item3'>
						<Accordion.Control>
							Are the predicted exam papers similar to the real exam papers?
						</Accordion.Control>
						<Accordion.Panel>
							Yes, the AI predicts future papers based on learning from the past 15 years of exam papers
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item value='item4'>
						<Accordion.Control>How often are the predicted exam papers updated?</Accordion.Control>
						<Accordion.Panel>We train the AI every week on new information</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item value='item5'>
						<Accordion.Control>What is the refund policy?</Accordion.Control>
						<Accordion.Panel>
							If a paper you pay for does not generate, we will offer you a refund
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item value='item6'>
						<Accordion.Control>Can I use ExamGenius for all my A-level subjects?</Accordion.Control>
						<Accordion.Panel>
							We support Maths, Physics, Biology, Chemistry, Economics and Psychology
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item value='item7'>
						<Accordion.Control>How are the predicted exam papers generated?</Accordion.Control>
						<Accordion.Panel>
							Our friendly AI has been quietly teaching its self all the style and patterns from past
							papers. Based on its learnings, it is able to predict the exam papers
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item value='item8'>
						<Accordion.Control>
							Will the predicted exam papers be the same as the actual exam papers?
						</Accordion.Control>
						<Accordion.Panel>
							It will not be 100% the same but the more predicted papers you do, the higher the chances of
							the predicted papers being the same as the actual exam papers coming up
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item value='item9'>
						<Accordion.Control>
							Is there a limit to the number of predicted exam papers I can access?
						</Accordion.Control>
						<Accordion.Panel>
							You get one paper per topic per subject when you initially purchase a subject. To have
							access to more, you would have to pay
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item value='item10'>
						<Accordion.Control>
							What happens if I'm not satisfied with the predicted exam papers?
						</Accordion.Control>
						<Accordion.Panel>
							You can contact us at hello@examgenius.co.uk and we will see how we can help
						</Accordion.Panel>
					</Accordion.Item>
				</Accordion>
			</div>
		</div>
	);
};

export default FAQ;
