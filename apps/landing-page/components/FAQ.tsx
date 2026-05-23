import React, { useState } from 'react';
import { Accordion } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import Image from 'next/image';
import { useMediaQuery } from '@mantine/hooks';

export const FAQ = () => {
	const [value, setValue] = useState<string | null>(null);
	const mobileScreen = useMediaQuery('(max-width: 30em)');
	return (
		<div id='faq' className='flex min-h-screen items-center justify-center py-10'>
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
					chevron={<IconPlus size='1rem' />}
					styles={{
						chevron: {
							'&[data-rotate]': {
								transform: 'rotate(45deg)'
							}
						}
					}}
					style={{ width: mobileScreen ? undefined : 800 }}
				>
					<Accordion.Item value='exam-boards'>
						<Accordion.Control>Which exam boards do you cover?</Accordion.Control>
						<Accordion.Panel>
							We currently support AQA, Edexcel, OCR, and WJEC Wales (WJEC).
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item value='subjects'>
						<Accordion.Control>Which A-level subjects are available?</Accordion.Control>
						<Accordion.Panel>
							Maths, Physics, Biology, Chemistry, Economics, and Psychology. More subjects are coming soon.
							We do not cover every A-level subject yet—only those listed above for now.
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item value='exam-level'>
						<Accordion.Control>Do you support AS Level as well as A Level?</Accordion.Control>
						<Accordion.Panel>
							Yes. When you sign up you can choose A Level or AS Level for the same subjects and exam
							boards, where that qualification is available in the app.
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item value='choosing-papers'>
						<Accordion.Control>Can I choose which topics to practise?</Accordion.Control>
						<Accordion.Panel>
							Not topic-by-topic from a checklist. You choose your subject and exam board, then pick a
							module (unit) and paper type—such as Paper 1 or Paper 2—for the paper you want generated.
							That matches how real courses are structured. After generation, each question is labelled with
							its topic so you can see what came up, but you do not select individual topics before
							generating.
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item value='similarity'>
						<Accordion.Control>
							Are the predicted exam papers similar to the real exam papers?
						</Accordion.Control>
						<Accordion.Panel>
							They are designed to match real exam style and structure. Our AI learns from patterns across
							roughly the last 10 years of past papers for your board and subject, then generates new
							papers in that style. They are practice papers—not copies of a specific future exam.
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item value='generation'>
						<Accordion.Control>How are the predicted exam papers generated?</Accordion.Control>
						<Accordion.Panel>
							When you request a paper, our AI analyses trends from historical exam papers and builds a
							full question paper for your chosen module and paper type. You can rate papers and give
							feedback, which helps improve future generations for you.
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item value='mark-schemes'>
						<Accordion.Control>Are mark schemes generated for each paper?</Accordion.Control>
						<Accordion.Panel>
							Yes. Once your predicted paper is ready, we generate an AI mark scheme for that paper. While
							it is building you may see a pending state; if generation fails, you can try again or contact
							support. When ready, you can open the full mark scheme or use per-question marking hints on
							structured papers to see how marks are awarded. Mark schemes are for practice and
							self-checking—they are not official examiner mark schemes.
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item value='features'>
						<Accordion.Control>What can I do on ExamGenius today?</Accordion.Control>
						<Accordion.Panel>
							Beyond predicted papers and mark schemes, you can work through papers in study or timed mock
							mode, submit answers for AI marking and feedback where enabled, upload reference PDFs (past
							papers or mark schemes) to steer how future papers are generated, rate papers, and leave
							question-level feedback that improves your next generations. You can also regenerate a paper
							when we ship model improvements.
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item value='paper-limits'>
						<Accordion.Control>
							Is there a limit to how many predicted papers I can generate?
						</Accordion.Control>
						<Accordion.Panel>
							When you purchase a course for a subject and exam board, your first predicted paper for each
							paper type in that course (for example each Paper 1 or Paper 2) is included. Generating
							another paper of the same type costs £5. See our pricing section for the current Genius Plan
							offer.
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item value='accuracy'>
						<Accordion.Control>
							Will the predicted exam papers be the same as the actual exam papers?
						</Accordion.Control>
						<Accordion.Panel>
							No—they will not be identical to a real upcoming paper. They are informed predictions to
							help you practise likely styles and themes. The more papers you work through, the better
							prepared you should feel for the format and types of questions examiners use.
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item value='refund'>
						<Accordion.Control>What is the refund policy?</Accordion.Control>
						<Accordion.Panel>
							If you pay for a paper generation and it fails to complete successfully, contact us and we
							will arrange a refund for that purchase.
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item value='support'>
						<Accordion.Control>
							{"What happens if I'm not satisfied with the predicted exam papers?"}
						</Accordion.Control>
						<Accordion.Panel>
							Email us at support@exam-genius.com with your account email and we will do our best to help.
						</Accordion.Panel>
					</Accordion.Item>
				</Accordion>
			</div>
		</div>
	);
};

export default FAQ;
