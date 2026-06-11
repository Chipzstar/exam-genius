'use client';

import {
	ArrowRight,
	BookOpenCheck,
	Brain,
	CheckCircle2,
	Focus,
	PenLine,
	Printer,
	Sparkles,
	Timer
} from 'lucide-react';
import type { ComponentType } from 'react';
import { BrandLogo } from './brand-logo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface LandingRedesignProps {
	onCtaClick: (label: string, location: string) => void;
}

interface FeatureCardItem {
	kicker: string;
	title: string;
	copy: string;
	icon: ComponentType<{ className?: string }>;
	accent: string;
}

interface StepItem {
	title: string;
	copy: string;
}

interface FaqItem {
	value: string;
	question: string;
	answer: string;
}

const navItems = [
	{ label: 'Product', href: '#product' },
	{ label: 'How it works', href: '#how-it-works' },
	{ label: 'Pricing', href: '#pricing' },
	{ label: 'FAQ', href: '#faq' }
];

const featureCards: FeatureCardItem[] = [
	{
		kicker: '01 / Predict',
		title: 'Predicted papers',
		copy: 'Generate exam-board-specific practice papers informed by years of past-paper structure, topic patterns and mark allocations.',
		icon: Brain,
		accent: 'bg-[#BEFF2D]'
	},
	{
		kicker: '02 / Practice',
		title: 'Mock mode',
		copy: 'Timed sessions, answer boxes and a submit-for-marking flow make revision feel closer to the real exam.',
		icon: Timer,
		accent: 'bg-primary-300'
	},
	{
		kicker: '03 / Improve',
		title: 'Study + review',
		copy: 'Structured questions, mark scheme hints, generated diagrams and review states help students see what to fix next.',
		icon: BookOpenCheck,
		accent: 'bg-violet-300'
	}
];

const workflowSteps: StepItem[] = [
	{
		title: 'Choose subject + board',
		copy: 'AQA, Edexcel, OCR and WJEC across A-Level and AS-Level pathways.'
	},
	{
		title: 'Generate a paper',
		copy: 'A full predicted paper appears in a familiar exam-style format.'
	},
	{
		title: 'Switch mode',
		copy: 'Study with hints, sit a timed mock, then review your answer quality.'
	},
	{
		title: 'Print or focus',
		copy: 'PDF export, focus mode and text sizing support real revision sessions.'
	}
];

const supportItems = [
	{ label: 'AQA', detail: 'Exam-board formats' },
	{ label: 'Edexcel', detail: 'Real paper structures' },
	{ label: 'OCR', detail: 'Module-aware papers' },
	{ label: 'WJEC', detail: 'Welsh board support' },
	{ label: 'A-Level', detail: 'Year 12 and 13' },
	{ label: 'AS-Level', detail: 'Available where supported' }
];

const faqItems: FaqItem[] = [
	{
		value: 'boards',
		question: 'Which exam boards do you cover?',
		answer: 'ExamGenius currently supports AQA, Edexcel, OCR and WJEC Wales. Availability depends on the subject and qualification level selected in the app.'
	},
	{
		value: 'subjects',
		question: 'Which A-Level subjects are available?',
		answer: 'Maths, Physics, Biology, Chemistry, Economics and Psychology are available today, with more subjects planned over time.'
	},
	{
		value: 'levels',
		question: 'Do you support AS Level as well as A Level?',
		answer: 'Yes. Students can choose A Level or AS Level for supported subjects and exam boards when that qualification is available in the app.'
	},
	{
		value: 'accuracy',
		question: 'Will predicted papers match the actual exam?',
		answer: 'No. Predicted papers are practice papers, not copies of a future official exam. They are designed around past-paper patterns, exam-board structure and likely styles so students can practise with more direction.'
	},
	{
		value: 'features',
		question: 'What can I do after a paper is generated?',
		answer: 'Students can study with mark scheme hints, sit a timed mock, submit answers for AI marking where enabled, review answers, regenerate diagrams, print PDFs and use focus or text-size tools.'
	},
	{
		value: 'pricing',
		question: 'How does pricing work?',
		answer: 'The Genius Plan keeps the public landing offer simple: one-time payment, no subscription. The exact checkout flow still depends on selected subject, exam board and paper access.'
	}
];

export function LandingRedesign({ onCtaClick }: LandingRedesignProps) {
	return (
		<div className='min-h-screen overflow-x-hidden bg-background text-foreground'>
			<LandingNavbar onCtaClick={onCtaClick} />
			<HeroSection onCtaClick={onCtaClick} />
			<CapabilitySection />
			<WorkflowSection />
			<SupportSection />
			<PricingSection onCtaClick={onCtaClick} />
			<FaqSection />
			<FinalCtaSection onCtaClick={onCtaClick} />
			<LandingFooter />
		</div>
	);
}

function LandingNavbar({ onCtaClick }: LandingRedesignProps) {
	return (
		<header className='relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-10'>
			<BrandLogo />
			<nav className='hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex'>
				{navItems.map(item => (
					<a key={item.href} href={item.href} className='transition hover:text-slate-950'>
						{item.label}
					</a>
				))}
			</nav>
			<div className='hidden items-center gap-3 md:flex'>
				<Button variant='ghost' size='sm' asChild>
					<a href='https://app.exam-genius.com' target='_blank' rel='noopener noreferrer'>
						Log in
					</a>
				</Button>
				<Button size='sm' onClick={() => onCtaClick('Start generating', 'navbar')}>
					Start generating
				</Button>
			</div>
			<Button
				size='sm'
				variant='secondary'
				className='md:hidden'
				onClick={() => onCtaClick('Start', 'mobile-navbar')}
			>
				Start
			</Button>
		</header>
	);
}

function HeroSection({ onCtaClick }: LandingRedesignProps) {
	return (
		<section className='relative mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-24 pt-10 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:pb-32 lg:pt-16'>
			<div className='absolute -left-32 top-24 h-72 w-72 rounded-full bg-[#BEFF2D]/25 blur-3xl' />
			<div className='absolute -right-36 top-0 h-[34rem] w-[34rem] rounded-full bg-primary-300/30 blur-3xl' />
			<div className='relative z-10 min-w-0'>
				<Badge variant='secondary' className='mb-7 border-primary/10 bg-white/80 text-primary shadow-sm'>
					<Sparkles className='mr-2 h-3.5 w-3.5' />
					AI exam-practice workspace
				</Badge>
				<h1 className='max-w-3xl text-5xl font-bold leading-[0.95] tracking-[-0.08em] text-slate-950 sm:text-6xl lg:text-7xl'>
					Walk into exam season with a paper already built for you.
				</h1>
				<p className='mt-7 max-w-2xl text-base font-medium leading-8 text-slate-600 sm:text-lg'>
					ExamGenius turns years of past-paper patterns into predicted papers, mock conditions,
					study hints and review tools built around real A-Level exam-board formats.
				</p>
				<div className='mt-9 flex w-full min-w-0 flex-col gap-3 sm:flex-row'>
					<Button
						size='lg'
						className='h-auto min-h-14 w-full whitespace-normal px-5 py-3.5 text-center sm:w-auto sm:whitespace-nowrap sm:px-8'
						onClick={() => onCtaClick('Start generating your predicted paper', 'hero')}
					>
						Start generating your predicted paper
						<ArrowRight className='h-4 w-4 shrink-0' />
					</Button>
					<Button
						variant='secondary'
						size='lg'
						className='h-auto min-h-14 w-full whitespace-normal px-5 py-3.5 text-center sm:w-auto sm:whitespace-nowrap sm:px-8'
						onClick={() => onCtaClick('See product tour', 'hero-secondary')}
					>
						See product tour
					</Button>
				</div>
				<div className='mt-7 flex flex-wrap gap-3'>
					<Badge variant='outline' className='bg-primary/10 text-primary'>
						One-time payment
					</Badge>
					<Badge variant='outline'>No subscription</Badge>
					<Badge variant='outline'>Practice papers, not official papers</Badge>
				</div>
				<div className='mt-8 grid max-w-xl grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3'>
					{['AQA', 'Edexcel', 'OCR', 'WJEC', 'A-Level', 'AS-Level'].map(label => (
						<div
							key={label}
							className='rounded-full bg-white/80 px-3 py-2 text-center text-xs font-bold shadow-sm sm:whitespace-nowrap'
						>
							{label}
						</div>
					))}
				</div>
			</div>
			<div className='relative z-10 min-h-[34rem] lg:min-h-[45rem]'>
				<div className='absolute left-4 top-8 h-[30rem] w-[86%] rotate-[-4deg] rounded-[2.5rem] bg-gradient-to-br from-[#5C38FF] to-primary shadow-2xl shadow-primary/30 sm:left-12 lg:h-[38rem]' />
				<ProductPreview className='absolute left-0 top-0 w-full max-w-[42rem] rotate-[1.5deg] lg:left-8 lg:top-8' />
				<DiagramPreview className='absolute bottom-2 right-4 hidden w-64 sm:block lg:bottom-24 lg:right-4' />
			</div>
		</section>
	);
}

function CapabilitySection() {
	return (
		<section id='product' className='mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10'>
			<div className='max-w-3xl'>
				<h2 className='text-4xl font-bold leading-tight tracking-[-0.07em] text-slate-950 sm:text-5xl'>
					Everything students need after the paper appears.
				</h2>
				<p className='mt-5 text-lg font-medium leading-8 text-slate-600'>
					The landing page now sells the full workspace: generate, study, sit a timed mock, review answers,
					print, and come back exactly where you left off.
				</p>
			</div>
			<div className='mt-12 grid gap-6 md:grid-cols-3'>
				{featureCards.map(feature => {
					const Icon = feature.icon;
					return (
						<Card key={feature.title} className='border-0 bg-white p-7 shadow-2xl shadow-slate-950/10'>
							<CardContent className='p-0'>
								<div className={cn('mb-8 flex h-12 w-12 items-center justify-center rounded-2xl', feature.accent)}>
									<Icon className='h-5 w-5 text-slate-950' />
								</div>
								<p className='text-xs font-bold uppercase tracking-[0.18em] text-primary'>{feature.kicker}</p>
								<h3 className='mt-4 text-2xl font-bold tracking-[-0.05em] text-slate-950'>{feature.title}</h3>
								<p className='mt-5 text-sm font-medium leading-7 text-slate-600'>{feature.copy}</p>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</section>
	);
}

function WorkflowSection() {
	return (
		<section id='how-it-works' className='mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10'>
			<div className='relative overflow-hidden rounded-[2.75rem] bg-slate-950 p-7 text-white shadow-2xl shadow-slate-950/20 sm:p-12 lg:p-16'>
				<div className='absolute -right-28 -top-28 h-80 w-80 rounded-full bg-primary/40 blur-3xl' />
				<div className='absolute -bottom-28 left-1/4 h-64 w-64 rounded-full bg-[#BEFF2D]/10 blur-3xl' />
				<div className='relative grid gap-12 lg:grid-cols-[1fr_0.85fr]'>
					<div>
						<p className='text-xs font-bold uppercase tracking-[0.22em] text-[#BEFF2D]'>How it works</p>
						<h2 className='mt-5 max-w-2xl text-4xl font-bold leading-tight tracking-[-0.07em] sm:text-5xl'>
							A calmer path from revision panic to exam-ready practice.
						</h2>
						<div className='mt-10 grid gap-4 sm:grid-cols-2'>
							{workflowSteps.map((step, index) => (
								<div key={step.title} className='rounded-3xl bg-white/8 p-5 ring-1 ring-white/10'>
									<div className='mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#BEFF2D] text-xs font-bold text-slate-950'>
										{index + 1}
									</div>
									<h3 className='text-lg font-bold tracking-[-0.03em]'>{step.title}</h3>
									<p className='mt-2 text-sm font-medium leading-6 text-slate-300'>{step.copy}</p>
								</div>
							))}
						</div>
					</div>
					<ProductPreview compact className='relative mx-auto w-full max-w-md self-center' />
				</div>
			</div>
		</section>
	);
}

function SupportSection() {
	return (
		<section className='mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10'>
			<div className='grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end'>
				<div>
					<Badge variant='lime' className='mb-5'>Built around exam reality</Badge>
					<h2 className='text-4xl font-bold leading-tight tracking-[-0.07em] text-slate-950'>
						Real formats, not generic AI chat.
					</h2>
				</div>
				<p className='text-lg font-medium leading-8 text-slate-600'>
					The experience should feel familiar to students because the structure mirrors how they actually revise:
					board, subject, unit, paper, question, answer, mark scheme, review.
				</p>
			</div>
			<div className='mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
				{supportItems.map(item => (
					<div key={item.label} className='rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5'>
						<p className='text-2xl font-bold tracking-[-0.05em] text-slate-950'>{item.label}</p>
						<p className='mt-2 text-sm font-semibold text-slate-500'>{item.detail}</p>
					</div>
				))}
			</div>
		</section>
	);
}

function PricingSection({ onCtaClick }: LandingRedesignProps) {
	return (
		<section id='pricing' className='mx-auto grid w-full max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_0.75fr] lg:px-10'>
			<div className='self-center'>
				<h2 className='max-w-2xl text-4xl font-bold leading-tight tracking-[-0.07em] text-slate-950 sm:text-5xl'>
					Simple pricing after the value is clear.
				</h2>
				<p className='mt-5 max-w-2xl text-lg font-medium leading-8 text-slate-600'>
					Keep the current trust cue: one-time payment, no subscription. Show price after students understand
					that they are getting a complete practice workspace, not just a static PDF.
				</p>
			</div>
			<Card className='border-0 bg-white p-8 shadow-2xl shadow-slate-950/10'>
				<CardContent className='p-0'>
					<Badge variant='secondary'>Genius Plan</Badge>
					<div className='mt-7 flex items-end gap-3'>
						<span className='text-6xl font-bold tracking-[-0.08em] text-slate-950'>£5</span>
						<span className='pb-2 text-sm font-semibold text-slate-500'>one-time access</span>
					</div>
					<ul className='mt-8 space-y-4 text-sm font-semibold text-slate-600'>
						{[
							'Full access per subject and exam board',
							'Predicted papers, study and mock modes',
							'Mark scheme hints and printable PDFs',
							'No subscription lock-in'
						].map(item => (
							<li key={item} className='flex gap-3'>
								<CheckCircle2 className='mt-0.5 h-4 w-4 shrink-0 text-primary' />
								<span>{item}</span>
							</li>
						))}
					</ul>
					<Button className='mt-8 w-full' size='lg' onClick={() => onCtaClick('Start now', 'pricing')}>
						Start now
						<ArrowRight className='h-4 w-4' />
					</Button>
				</CardContent>
			</Card>
		</section>
	);
}

function FaqSection() {
	return (
		<section id='faq' className='mx-auto w-full max-w-4xl px-5 py-20 sm:px-8 lg:px-10'>
			<div className='text-center'>
				<Badge variant='secondary'>FAQ</Badge>
				<h2 className='mt-5 text-4xl font-bold tracking-[-0.07em] text-slate-950 sm:text-5xl'>
					Questions students and parents ask first.
				</h2>
			</div>
			<Card className='mt-10 border-0 bg-white px-6 shadow-2xl shadow-slate-950/10 sm:px-8'>
				<Accordion type='single' collapsible className='w-full'>
					{faqItems.map(item => (
						<AccordionItem key={item.value} value={item.value}>
							<AccordionTrigger>{item.question}</AccordionTrigger>
							<AccordionContent>{item.answer}</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</Card>
		</section>
	);
}

function FinalCtaSection({ onCtaClick }: LandingRedesignProps) {
	return (
		<section className='mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10'>
			<div className='relative overflow-hidden rounded-[2.75rem] bg-gradient-to-br from-primary to-[#6C4DFF] p-8 text-white shadow-2xl shadow-primary/30 sm:p-12 lg:flex lg:items-center lg:justify-between'>
				<div className='absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/20 blur-3xl' />
				<div className='relative max-w-3xl'>
					<h2 className='text-4xl font-bold leading-tight tracking-[-0.07em] sm:text-5xl'>
						Give students a paper, a plan, and a way to prove they are ready.
					</h2>
					<p className='mt-5 text-base font-medium leading-7 text-white/80'>
						ExamGenius should feel like the product has already assembled the revision desk for them.
					</p>
				</div>
				<Button
					variant='secondary'
					size='lg'
					className='relative mt-8 h-auto min-h-14 w-full shrink-0 whitespace-normal px-5 py-3.5 text-center sm:w-auto sm:whitespace-nowrap sm:px-8 lg:mt-0'
					onClick={() => onCtaClick('Generate your first predicted paper', 'final-cta')}
				>
					Generate your first predicted paper
				</Button>
			</div>
		</section>
	);
}

function LandingFooter() {
	return (
		<footer className='bg-slate-950 text-white'>
			<div className='mx-auto grid w-full max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.2fr_1fr] lg:px-10'>
				<div>
					<BrandLogo variant='light' />
					<p className='mt-5 max-w-md text-sm font-medium leading-7 text-slate-400'>
						AI-powered exam practice for A-Level students who want revision to feel structured, focused and
						closer to the real paper.
					</p>
				</div>
				<div className='grid grid-cols-2 gap-8 text-sm sm:grid-cols-3'>
					<div>
						<p className='font-bold text-white'>Product</p>
						<div className='mt-4 space-y-3 text-slate-400'>
							<a href='#product' className='block hover:text-white'>Features</a>
							<a href='#how-it-works' className='block hover:text-white'>How it works</a>
							<a href='#pricing' className='block hover:text-white'>Pricing</a>
						</div>
					</div>
					<div>
						<p className='font-bold text-white'>Subjects</p>
						<div className='mt-4 space-y-3 text-slate-400'>
							<p>Maths</p>
							<p>Economics</p>
							<p>Sciences</p>
						</div>
					</div>
					<div>
						<p className='font-bold text-white'>Support</p>
						<div className='mt-4 space-y-3 text-slate-400'>
							<a href='#faq' className='block hover:text-white'>FAQ</a>
							<a href='mailto:support@exam-genius.com' className='block hover:text-white'>Contact</a>
						</div>
					</div>
				</div>
			</div>
			<Separator className='bg-white/10' />
			<div className='mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-6 text-xs font-medium text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10'>
				<p>© {new Date().getFullYear()} ExamGenius. All rights reserved.</p>
				<p>Practice content only. Not affiliated with official exam boards.</p>
			</div>
		</footer>
	);
}

function ProductPreview({ className, compact = false }: { className?: string; compact?: boolean }) {
	return (
		<Card className={cn('min-w-0 border-0 bg-white p-4 shadow-2xl shadow-slate-950/20 sm:p-6', className)}>
			<div className='flex flex-wrap items-center justify-between gap-3'>
				<BrandLogo markClassName='h-5 w-5' textClassName='text-xs' />
				<div className='flex flex-wrap items-center gap-2'>
					<Badge className='bg-slate-950 text-white'>89:56</Badge>
					<Badge variant='default'>Start mock</Badge>
				</div>
			</div>
			<div className='mt-5 flex flex-wrap gap-2'>
				{['Structured', 'Classic', 'Study', 'Mock', 'Review'].map((mode, index) => (
					<span
						key={mode}
						className={cn(
							'rounded-lg px-3 py-1.5 text-[0.66rem] font-bold',
							index === 0 || index === 2 ? 'bg-white text-slate-950 shadow-md' : 'bg-slate-100 text-slate-500'
						)}
					>
						{mode}
					</span>
				))}
			</div>
			<div className='mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/5'>
				<div className='flex flex-wrap items-center gap-2'>
					<p className='text-sm font-bold text-slate-950'>Question 1.</p>
					<Badge variant='secondary' className='py-0.5 text-[0.62rem]'>12 MARKS</Badge>
				</div>
				<p className='mt-4 text-sm font-semibold leading-6 text-slate-700'>
					Study the data in the table below and answer parts (a) and (b).
				</p>
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
				<div className='mt-5 flex items-start justify-between gap-4'>
					<div>
						<p className='text-sm font-bold text-slate-950'>(a).</p>
						<p className='mt-2 text-sm font-semibold leading-6 text-slate-700'>
							Define gross domestic product at market prices.
						</p>
					</div>
					{!compact ? (
						<div className='hidden rounded-2xl bg-primary/10 p-4 text-xs font-semibold text-primary sm:block'>
							Mark scheme hints ready
						</div>
					) : null}
				</div>
			</div>
			{!compact ? (
				<div className='mt-4 grid grid-cols-3 gap-2 text-xs font-bold text-slate-600 sm:gap-3'>
					<div className='rounded-2xl bg-slate-50 p-2.5 sm:p-4'>
						<Focus className='mb-2 h-4 w-4 text-primary' />
						Focus mode
					</div>
					<div className='rounded-2xl bg-slate-50 p-2.5 sm:p-4'>
						<Printer className='mb-2 h-4 w-4 text-primary' />
						Print PDF
					</div>
					<div className='rounded-2xl bg-slate-50 p-2.5 sm:p-4'>
						<PenLine className='mb-2 h-4 w-4 text-primary' />
						AI review
					</div>
				</div>
			) : null}
		</Card>
	);
}

function DiagramPreview({ className }: { className?: string }) {
	return (
		<Card className={cn('border-0 bg-white p-5 shadow-2xl shadow-slate-950/20', className)}>
			<div className='flex items-center justify-between'>
				<p className='text-sm font-bold text-slate-950'>Generated diagram</p>
				<Badge variant='secondary'>AI / AS</Badge>
			</div>
			<div className='mt-5 h-28 rounded-2xl bg-slate-50 p-4'>
				<div className='relative h-full'>
					<div className='absolute bottom-4 left-4 right-4 h-px bg-slate-950' />
					<div className='absolute bottom-2 left-10 top-2 w-px bg-slate-950' />
					<div className='absolute left-12 top-9 h-px w-32 rotate-[-16deg] bg-primary' />
					<div className='absolute left-12 top-9 h-px w-32 rotate-[16deg] bg-primary-300' />
				</div>
			</div>
		</Card>
	);
}
