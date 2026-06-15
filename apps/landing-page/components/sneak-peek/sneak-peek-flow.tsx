import Image from 'next/image';
import parse from 'html-react-parser';
import {
	ArrowLeft,
	ArrowRight,
	BookOpenCheck,
	CheckCircle2,
	Clock3,
	FileText,
	LockKeyhole,
	Sparkles,
	Target,
	X
} from 'lucide-react';
import type { CourseInfo, ExamBoard, Subject } from '@exam-genius/shared/utils';
import { BrandLogo } from '../landing/brand-logo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SneakPeakQuestion {
	question: string;
	answer: string;
	chance: number;
}

interface SneakPeekFlowProps {
	activeStep: number;
	subject: string;
	examBoard: string;
	paper: string;
	course: [string, CourseInfo][];
	questions: SneakPeakQuestion[];
	showWjec: boolean;
	signupUrl: string;
	onClose: () => void;
	onBack: () => void;
	onSelectSubject: (subject: Subject) => void;
	onContinueSubject: () => void;
	onSelectExamBoard: (examBoard: ExamBoard) => void;
	onGeneratePaper: (paper: string) => void;
	onUnlock: () => void;
}

interface SubjectOption {
	value: Subject;
	label: string;
	icon: string;
	accent: string;
}

interface ExamBoardOption {
	value: ExamBoard;
	label: string;
}

const subjectOptions: SubjectOption[] = [
	{ value: 'maths', label: 'Maths', icon: '/static/images/maths-icon.svg', accent: 'bg-primary/10' },
	{ value: 'biology', label: 'Biology', icon: '/static/images/biology-icon.svg', accent: 'bg-emerald-100' },
	{ value: 'chemistry', label: 'Chemistry', icon: '/static/images/chemistry-icon.svg', accent: 'bg-violet-100' },
	{ value: 'economics', label: 'Economics', icon: '/static/images/economics-icon.svg', accent: 'bg-[#BEFF2D]/40' },
	{ value: 'physics', label: 'Physics', icon: '/static/images/physics-icon.svg', accent: 'bg-sky-100' },
	{ value: 'psychology', label: 'Psychology', icon: '/static/images/psychology-icon.svg', accent: 'bg-pink-100' }
];

const examBoardOptions: ExamBoardOption[] = [
	{ value: 'aqa', label: 'AQA' },
	{ value: 'edexcel', label: 'Edexcel' },
	{ value: 'ocr', label: 'OCR' },
	{ value: 'wjec', label: 'WJEC' }
];

const stepLabels = ['Subject', 'Board + paper', 'Generating', 'Reveal'];

export function SneakPeekFlow({
	activeStep,
	subject,
	examBoard,
	paper,
	course,
	questions,
	showWjec,
	signupUrl,
	onClose,
	onBack,
	onSelectSubject,
	onContinueSubject,
	onSelectExamBoard,
	onGeneratePaper,
	onUnlock
}: SneakPeekFlowProps) {
	return (
		<div
			className='fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-[#F5F7FF] text-slate-950'
			role='dialog'
			aria-modal='true'
			aria-labelledby='sneak-peek-title'
		>
			<div className='pointer-events-none fixed -left-28 top-20 h-80 w-80 rounded-full bg-[#BEFF2D]/30 blur-3xl' />
			<div className='pointer-events-none fixed -right-32 top-0 h-[30rem] w-[30rem] rounded-full bg-primary-300/25 blur-3xl' />
			<div className='pointer-events-none fixed bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl' />

			<div className='relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10'>
				<header className='flex items-center justify-between gap-4'>
					<BrandLogo />
					<div className='flex items-center gap-3'>
						<div className='hidden rounded-full bg-white/80 px-4 py-2 text-xs font-bold text-primary shadow-sm sm:block'>
							{activeStep + 1} / {stepLabels.length} · {stepLabels[activeStep]}
						</div>
						<button
							type='button'
							className='flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-lg shadow-slate-950/10 transition hover:text-slate-950'
							onClick={onClose}
							aria-label='Close sneak peek'
						>
							<X className='h-4 w-4' />
						</button>
					</div>
				</header>

				<div className='mt-7 grid gap-2 sm:grid-cols-4'>
					{stepLabels.map((label, index) => (
						<div key={label} className='min-w-0'>
							<div className={cn('h-1.5 rounded-full', index <= activeStep ? 'bg-primary' : 'bg-slate-200')} />
							<p
								className={cn(
									'mt-2 hidden text-xs font-bold sm:block',
									index <= activeStep ? 'text-primary' : 'text-slate-400'
								)}
							>
								{label}
							</p>
						</div>
					))}
				</div>

				<main className='flex flex-1 items-center py-8 lg:py-12'>
					{activeStep === 0 ? (
						<SubjectStep subject={subject} onSelectSubject={onSelectSubject} onContinueSubject={onContinueSubject} />
					) : null}
					{activeStep === 1 ? (
						<PaperStep
							subject={subject}
							examBoard={examBoard}
							paper={paper}
							course={course}
							showWjec={showWjec}
							onBack={onBack}
							onSelectExamBoard={onSelectExamBoard}
							onGeneratePaper={onGeneratePaper}
						/>
					) : null}
					{activeStep === 2 ? <GeneratingStep subject={subject} examBoard={examBoard} paper={paper} /> : null}
					{activeStep === 3 ? (
						<RevealStep
							subject={subject}
							examBoard={examBoard}
							paper={paper}
							questions={questions}
							signupUrl={signupUrl}
							onBack={onBack}
							onUnlock={onUnlock}
						/>
					) : null}
				</main>
			</div>
		</div>
	);
}

function SubjectStep({
	subject,
	onSelectSubject,
	onContinueSubject
}: Pick<SneakPeekFlowProps, 'subject' | 'onSelectSubject' | 'onContinueSubject'>) {
	return (
		<div className='grid w-full gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center'>
			<IntroPanel
				kicker='AI paper generator'
				title='Choose the subject you want ExamGenius to build around.'
				copy='Start with one fast choice. The flow should feel like the first step inside the product, not a generic marketing form.'
			/>
			<Card className='border-0 bg-white/90 p-5 shadow-2xl shadow-slate-950/10 backdrop-blur sm:p-7'>
				<div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
					{subjectOptions.map(option => {
						const isSelected = subject === option.value;
						return (
							<button
								key={option.value}
								type='button'
								className={cn(
									'group rounded-[1.65rem] p-4 text-left transition-all',
									isSelected
										? 'bg-slate-950 text-white shadow-2xl shadow-primary/20'
										: 'bg-white text-slate-950 shadow-lg shadow-slate-950/5 hover:-translate-y-1 hover:shadow-xl'
								)}
								onClick={() => onSelectSubject(option.value)}
							>
								<div
									className={cn(
										'mb-5 flex h-14 w-14 items-center justify-center rounded-2xl',
										isSelected ? 'bg-[#BEFF2D]' : option.accent
									)}
								>
									<Image src={option.icon} alt='' width={34} height={34} className='h-9 w-9 object-contain' />
								</div>
								<p className='text-xs font-bold uppercase tracking-[0.18em] text-primary-300'>A-Level</p>
								<p className='mt-2 text-xl font-bold tracking-[-0.05em]'>{option.label}</p>
								<p className={cn('mt-3 text-sm font-medium leading-6', isSelected ? 'text-slate-300' : 'text-slate-500')}>
									Generate targeted predicted practice for this subject.
								</p>
							</button>
						);
					})}
				</div>
				<div className='mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
					<p className='text-sm font-semibold text-slate-500'>
						{subject ? 'Subject selected. Continue to exam board and paper.' : 'Select a subject to continue.'}
					</p>
					<Button
						size='lg'
						className='h-auto min-h-14 whitespace-normal px-6 py-3.5 sm:whitespace-nowrap'
						disabled={!subject}
						onClick={onContinueSubject}
					>
						Continue
						<ArrowRight className='h-4 w-4 shrink-0' />
					</Button>
				</div>
			</Card>
		</div>
	);
}

function PaperStep({
	subject,
	examBoard,
	paper,
	course,
	showWjec,
	onBack,
	onSelectExamBoard,
	onGeneratePaper
}: Pick<
	SneakPeekFlowProps,
	'subject' | 'examBoard' | 'paper' | 'course' | 'showWjec' | 'onBack' | 'onSelectExamBoard' | 'onGeneratePaper'
>) {
	const visibleBoards = examBoardOptions.filter(option => showWjec || option.value !== 'wjec');
	const selectedSubjectLabel = getSubjectLabel(subject);

	return (
		<div className='grid w-full gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center'>
			<IntroPanel
				kicker='Make it exam-specific'
				title='Pick the board and paper so the preview feels made for them.'
				copy='This keeps the interaction fast while still proving ExamGenius understands real A-Level exam structure.'
			/>
			<div className='grid gap-5 xl:grid-cols-[0.9fr_1.1fr]'>
				<Card className='border-0 bg-white/90 p-5 shadow-2xl shadow-slate-950/10 sm:p-7'>
					<div className='flex items-center justify-between gap-3'>
						<div>
							<Badge variant='secondary'>{selectedSubjectLabel}</Badge>
							<h2 className='mt-4 text-2xl font-bold tracking-[-0.06em] text-slate-950'>Choose exam board</h2>
						</div>
						<Button variant='ghost' size='sm' onClick={onBack}>
							<ArrowLeft className='h-4 w-4' />
							Back
						</Button>
					</div>
					<div className='mt-6 grid grid-cols-2 gap-3'>
						{visibleBoards.map(option => {
							const isSelected = examBoard === option.value;
							return (
								<button
									key={option.value}
									type='button'
									className={cn(
										'rounded-full px-4 py-4 text-sm font-bold transition-all',
										isSelected
											? 'bg-primary text-white shadow-lg shadow-primary/25'
											: 'bg-white text-slate-950 shadow-md shadow-slate-950/5 hover:bg-slate-50'
									)}
									onClick={() => onSelectExamBoard(option.value)}
								>
									{option.label}
								</button>
							);
						})}
					</div>

					<h3 className='mt-8 text-xl font-bold tracking-[-0.04em] text-slate-950'>Available papers</h3>
					<div className='mt-4 space-y-3'>
						{course.length > 0 ? (
							course.map(([unitName, unit]) => (
								<PaperOption
									key={unitName}
									unitName={unitName}
									unit={unit}
									isSelected={paper === unitName}
									disabled={!examBoard}
									onGeneratePaper={onGeneratePaper}
								/>
							))
						) : (
							<div className='rounded-3xl border border-dashed border-slate-200 bg-white p-5 text-sm font-semibold text-slate-500'>
								Choose an exam board to see available papers.
							</div>
						)}
					</div>
				</Card>

				<DashboardPreview subject={selectedSubjectLabel} examBoard={examBoard} />
			</div>
		</div>
	);
}

function PaperOption({
	unitName,
	unit,
	isSelected,
	disabled,
	onGeneratePaper
}: {
	unitName: string;
	unit: CourseInfo;
	isSelected: boolean;
	disabled: boolean;
	onGeneratePaper: (paper: string) => void;
}) {
	return (
		<button
			type='button'
			disabled={disabled}
			className={cn(
				'flex w-full min-w-0 flex-col gap-4 rounded-[1.5rem] p-4 text-left transition-all sm:flex-row sm:items-center',
				isSelected
					? 'bg-slate-950 text-white shadow-2xl shadow-primary/20'
					: 'bg-white text-slate-950 shadow-lg shadow-slate-950/5 hover:-translate-y-0.5 hover:shadow-xl',
				disabled && 'cursor-not-allowed opacity-50'
			)}
			onClick={() => onGeneratePaper(unitName)}
		>
			<div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10'>
				<Image src={unit.icon} alt='' width={38} height={38} className='h-10 w-10 object-contain' />
			</div>
			<div className='min-w-0 flex-1'>
				<p className='text-lg font-bold tracking-[-0.04em]'>{unit.label}</p>
				<p className={cn('mt-1 text-sm font-medium leading-6', isSelected ? 'text-slate-300' : 'text-slate-500')}>
					{unit.papers.map(paperInfo => paperInfo.name).join(' · ')}
				</p>
			</div>
			<div
				className={cn(
					'inline-flex shrink-0 items-center rounded-full px-4 py-2 text-xs font-bold',
					isSelected ? 'bg-[#BEFF2D] text-slate-950' : 'bg-primary text-white'
				)}
			>
				Generate
			</div>
		</button>
	);
}

function GeneratingStep({ subject, examBoard, paper }: Pick<SneakPeekFlowProps, 'subject' | 'examBoard' | 'paper'>) {
	return (
		<div className='mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center'>
			<IntroPanel
				kicker='Building preview'
				title='Generating your AI-powered predicted paper...'
				copy='A short, deliberate moment reassures visitors that their preview is being assembled from real choices.'
			/>
			<Card className='relative overflow-hidden border-0 bg-white p-6 text-center shadow-2xl shadow-slate-950/10 sm:p-10'>
				<div className='absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl' />
				<div className='absolute -bottom-20 left-8 h-56 w-56 rounded-full bg-[#BEFF2D]/25 blur-3xl' />
				<div className='relative mx-auto flex h-52 w-52 items-center justify-center rounded-full bg-primary shadow-2xl shadow-primary/25'>
					<div className='absolute h-40 w-40 animate-pulse rounded-full bg-white/10' />
					<div className='flex h-24 w-24 items-center justify-center rounded-full bg-[#BEFF2D]'>
						<Sparkles className='h-9 w-9 text-slate-950' />
					</div>
				</div>
				<h2 className='mt-8 text-3xl font-bold tracking-[-0.06em] text-slate-950'>Preparing your sneak peek</h2>
				<p className='mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-slate-500'>
					{getSubjectLabel(subject)} · {getExamBoardLabel(examBoard)} · {getPaperLabel(paper)}
				</p>
				<div className='mt-8 grid gap-3 sm:grid-cols-3'>
					<GenerationClaim icon={FileText} label='Scanning board format' />
					<GenerationClaim icon={Target} label='Matching topic patterns' active />
					<GenerationClaim icon={BookOpenCheck} label='Preparing mark hints' />
				</div>
			</Card>
		</div>
	);
}

function RevealStep({
	subject,
	examBoard,
	paper,
	questions,
	signupUrl,
	onBack,
	onUnlock
}: Pick<SneakPeekFlowProps, 'subject' | 'examBoard' | 'paper' | 'questions' | 'signupUrl' | 'onBack' | 'onUnlock'>) {
	const previewQuestions = questions.length > 0 ? questions : getFallbackQuestions();

	return (
		<div className='grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center'>
			<Card className='border-0 bg-white/90 p-5 shadow-2xl shadow-slate-950/10 sm:p-7'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<div>
						<Badge variant='lime'>Sneak peek ready</Badge>
						<h2 id='sneak-peek-title' className='mt-4 text-3xl font-bold tracking-[-0.07em] text-slate-950 sm:text-4xl'>
							Your predicted paper preview is ready.
						</h2>
					</div>
					<Button variant='ghost' size='sm' onClick={onBack}>
						<ArrowLeft className='h-4 w-4' />
						Back
					</Button>
				</div>
				<div className='mt-5 flex flex-wrap gap-2'>
					<Badge variant='outline'>{getSubjectLabel(subject)}</Badge>
					<Badge variant='outline'>{getExamBoardLabel(examBoard)}</Badge>
					<Badge variant='outline'>{getPaperLabel(paper)}</Badge>
				</div>
				<ExamQuestionPreview question={previewQuestions[0]} />
			</Card>

			<div className='space-y-4'>
				{previewQuestions.slice(0, 3).map((question, index) => (
					<ChanceCard key={`${question.chance}-${index}`} question={question} index={index} featured={index === 0} />
				))}
				<Card className='border-0 bg-slate-950 p-5 text-white shadow-2xl shadow-primary/20 sm:p-7'>
					<div className='flex items-start gap-4'>
						<div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#BEFF2D] text-slate-950'>
							<LockKeyhole className='h-5 w-5' />
						</div>
						<div>
							<h3 className='text-2xl font-bold tracking-[-0.05em]'>Unlock the full paper in the dashboard.</h3>
							<p className='mt-3 text-sm font-medium leading-6 text-slate-300'>
								Carry this subject, board, and paper into signup so students land closer to the workspace.
							</p>
						</div>
					</div>
					<Button asChild size='lg' className='mt-6 h-auto min-h-14 w-full whitespace-normal px-5 py-3.5 text-center'>
						<a href={signupUrl} onClick={onUnlock}>
							Unlock full paper
							<ArrowRight className='h-4 w-4 shrink-0' />
						</a>
					</Button>
				</Card>
			</div>
		</div>
	);
}

function IntroPanel({ kicker, title, copy }: { kicker: string; title: string; copy: string }) {
	return (
		<div className='max-w-xl'>
			<Badge variant='secondary' className='mb-6 bg-white/80 shadow-sm'>
				<Sparkles className='mr-2 h-3.5 w-3.5' />
				{kicker}
			</Badge>
			<h1 id='sneak-peek-title' className='text-4xl font-bold leading-[0.95] tracking-[-0.08em] text-slate-950 sm:text-5xl lg:text-6xl'>
				{title}
			</h1>
			<p className='mt-6 text-base font-medium leading-8 text-slate-600 sm:text-lg'>{copy}</p>
			<div className='mt-8 grid max-w-md grid-cols-3 gap-3'>
				<TrustMetric value='89%' label='example likelihood' />
				<TrustMetric value='12' label='mark hints' />
				<TrustMetric value='1' label='paper path' />
			</div>
		</div>
	);
}

function TrustMetric({ value, label }: { value: string; label: string }) {
	return (
		<div className='rounded-3xl bg-white/80 p-4 shadow-lg shadow-slate-950/5'>
			<p className='text-2xl font-bold tracking-[-0.06em] text-slate-950'>{value}</p>
			<p className='mt-1 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-slate-400'>{label}</p>
		</div>
	);
}

function DashboardPreview({ subject, examBoard }: { subject: string; examBoard: string }) {
	return (
		<Card className='relative min-w-0 overflow-hidden border-0 bg-white p-4 shadow-2xl shadow-slate-950/10 sm:p-6'>
			<div className='absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/15 blur-3xl' />
			<div className='relative flex flex-wrap items-center justify-between gap-3'>
				<BrandLogo markClassName='h-5 w-5' textClassName='text-xs' />
				<div className='flex items-center gap-2'>
					<Badge className='bg-slate-950 text-white'>
						<Clock3 className='mr-1.5 h-3 w-3' />
						89:56
					</Badge>
					<Badge variant='default'>Mock ready</Badge>
				</div>
			</div>
			<div className='relative mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/5'>
				<div className='flex flex-wrap gap-2'>
					{['Structured', 'Study', 'Mock', 'Review'].map((mode, index) => (
						<span
							key={mode}
							className={cn(
								'rounded-lg px-3 py-1.5 text-xs font-bold',
								index === 0 || index === 1 ? 'bg-white text-slate-950 shadow-md' : 'bg-slate-100 text-slate-500'
							)}
						>
							{mode}
						</span>
					))}
				</div>
				<h3 className='mt-6 text-xl font-bold tracking-[-0.05em] text-slate-950'>Preview workspace</h3>
				<p className='mt-3 text-sm font-semibold leading-6 text-slate-600'>
					{subject} {examBoard ? `· ${getExamBoardLabel(examBoard)}` : ''} paper with mark hints, mock timer, and review tools.
				</p>
				<MiniTable />
				<div className='mt-5 grid grid-cols-3 gap-2 text-xs font-bold text-slate-600'>
					{['Focus mode', 'Print PDF', 'AI review'].map(label => (
						<div key={label} className='rounded-2xl bg-slate-50 p-3'>
							<CheckCircle2 className='mb-2 h-4 w-4 text-primary' />
							{label}
						</div>
					))}
				</div>
			</div>
		</Card>
	);
}

function MiniTable() {
	return (
		<div className='mt-5 overflow-hidden rounded-xl border border-slate-200 text-xs font-semibold text-slate-600'>
			<div className='grid grid-cols-3 bg-slate-100 text-slate-950'>
				<div className='p-3'>Year</div>
				<div className='p-3'>Nominal GDP</div>
				<div className='p-3'>Deflator</div>
			</div>
			<div className='grid grid-cols-3 border-t border-slate-200'>
				<div className='p-3'>2019</div>
				<div className='p-3'>200</div>
				<div className='p-3'>100</div>
			</div>
			<div className='grid grid-cols-3 border-t border-slate-200'>
				<div className='p-3'>2020</div>
				<div className='p-3'>210</div>
				<div className='p-3'>105</div>
			</div>
		</div>
	);
}

function GenerationClaim({
	icon: Icon,
	label,
	active = false
}: {
	icon: typeof FileText;
	label: string;
	active?: boolean;
}) {
	return (
		<div className={cn('rounded-2xl p-4', active ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-600')}>
			<Icon className={cn('mx-auto mb-3 h-5 w-5', active ? 'text-[#BEFF2D]' : 'text-primary')} />
			<p className='text-xs font-bold'>{label}</p>
		</div>
	);
}

function ExamQuestionPreview({ question }: { question: SneakPeakQuestion }) {
	return (
		<div className='mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/5 sm:p-6'>
			<div className='flex flex-wrap items-center gap-2'>
				<p className='text-lg font-bold text-slate-950'>Question 1.</p>
				<Badge variant='secondary' className='py-0.5 text-[0.62rem]'>12 MARKS</Badge>
				<Badge variant='lime' className='py-0.5 text-[0.62rem]'>{question.chance}% likely style</Badge>
			</div>
			<div className='mt-4 text-base font-bold leading-7 text-slate-800'>{parse(question.question, { trim: true })}</div>
			<MiniTable />
			<div className='mt-5 rounded-2xl bg-primary/10 p-4 text-sm font-semibold leading-6 text-primary'>
				Mark scheme hints and full answer review unlock in the dashboard.
			</div>
		</div>
	);
}

function ChanceCard({ question, index, featured }: { question: SneakPeakQuestion; index: number; featured: boolean }) {
	return (
		<Card
			className={cn(
				'border-0 p-5 shadow-xl shadow-slate-950/10',
				featured ? 'bg-slate-950 text-white' : 'bg-white text-slate-950'
			)}
		>
			<div className='flex gap-4'>
				<div
					className={cn(
						'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold',
						featured ? 'bg-[#BEFF2D] text-slate-950' : 'bg-primary/10 text-primary'
					)}
				>
					{question.chance}%
				</div>
				<div className='min-w-0'>
					<p className={cn('text-xs font-bold uppercase tracking-[0.16em]', featured ? 'text-[#BEFF2D]' : 'text-primary')}>
						Predicted question {index + 1}
					</p>
					<div className={cn('mt-2 line-clamp-3 text-sm font-semibold leading-6', featured ? 'text-slate-100' : 'text-slate-600')}>
						{parse(question.question, { trim: true })}
					</div>
				</div>
			</div>
		</Card>
	);
}

function getSubjectLabel(subject: string) {
	return subjectOptions.find(option => option.value === subject)?.label ?? 'A-Level subject';
}

function getExamBoardLabel(examBoard: string) {
	return examBoardOptions.find(option => option.value === examBoard)?.label ?? 'Exam board';
}

function getPaperLabel(paper: string) {
	if (!paper) return 'Selected paper';
	return paper
		.split(/[-_]/g)
		.filter(Boolean)
		.map(part => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

function getFallbackQuestions(): SneakPeakQuestion[] {
	return [
		{
			question: 'Use data from the extract to explain one likely change in market conditions.',
			answer: 'A concise answer should connect the data to the relevant exam-board command word.',
			chance: 86
		}
	];
}
