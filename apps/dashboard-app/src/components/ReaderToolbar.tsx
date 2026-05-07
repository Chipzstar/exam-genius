'use client';

import { useRef, useState } from 'react';
import { Box, Button, Group, Pagination, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useValue } from '@legendapp/state/react';
import { IconArrowsMaximize, IconPrinter, IconX } from '@tabler/icons-react';
import { appStore$, type ReaderFontScale } from '~/store/app.store';
import { notifyError } from '~/utils/functions';

const SCALES: ReaderFontScale[] = [1, 1.125, 1.25];

export type ReaderToolbarProps = {
	/** Root element id whose inner HTML is rasterized into a multi-page PDF, then sent to the print dialog. */
	pdfSourceId: string | null;
	/** Suggested download / print job filename */
	pdfFilename: string;
	slideIndex: number;
	activeSlideIndex: number;
	/** Non-production only: show destructive delete for this slide’s paper */
	showDevDelete?: boolean;
	onDelete?: () => void;
	deleteLoading?: boolean;
	/** Shown in the delete confirmation modal */
	paperTitle?: string | null;
	/** Unique id for Mantine modal instance (e.g. paper_id) */
	paperId?: string;
	/** When >1, show pagination to switch between generated copies for this paper code */
	paperVariantTotal?: number;
	/** 1-based page index from Mantine Pagination */
	onPaperVariantPageChange?: (page: number) => void;
};

export function ReaderToolbar({
	pdfSourceId,
	pdfFilename,
	slideIndex,
	activeSlideIndex,
	showDevDelete,
	onDelete,
	deleteLoading,
	paperTitle,
	paperId,
	paperVariantTotal,
	onPaperVariantPageChange
}: ReaderToolbarProps) {
	const focusMode = useValue(appStore$.reader.focusMode);
	const fontScale = useValue(appStore$.reader.fontScale);
	const [pdfLoading, setPdfLoading] = useState(false);
	const printOnceRef = useRef(false);

	const toggleFocus = () => {
		appStore$.reader.focusMode.set(f => !f);
	};

	const setScale = (s: ReaderFontScale) => {
		appStore$.reader.fontScale.set(s);
	};

	const printPaperAsPdf = async () => {
		if (!pdfSourceId || slideIndex !== activeSlideIndex) return;
		const el = document.getElementById(pdfSourceId);
		if (!el) {
			notifyError('pdf-print-missing', 'Could not find paper content to print.', <IconX size={20} />);
			return;
		}

		setPdfLoading(true);
		printOnceRef.current = false;
		try {
			const html2pdf = (await import('html2pdf.js')).default;
			const opt = {
				margin: [10, 10, 10, 10],
				filename: pdfFilename,
				image: { type: 'jpeg', quality: 0.92 },
				html2canvas: {
					scale: 2,
					useCORS: true,
					logging: false,
					backgroundColor: '#ffffff',
					onclone: (clonedDoc: Document) => {
						const root = clonedDoc.getElementById(pdfSourceId);
						if (!root) return;
						root.style.backgroundColor = '#ffffff';
						root.style.color = '#111111';
						root.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(node => {
							if (node instanceof HTMLElement) node.style.color = '#0a0a0a';
						});
						root.querySelectorAll('p, li, span, td, th, label, figcaption').forEach(node => {
							if (node instanceof HTMLElement) node.style.color = '#111111';
						});
						clonedDoc.querySelectorAll('[data-paper-print-footer]').forEach(node => {
							if (node instanceof HTMLElement) {
								node.style.display = 'block';
								node.style.marginTop = '2rem';
								node.style.paddingTop = '1rem';
								node.style.borderTop = '1px solid #cccccc';
								node.style.fontSize = '0.85rem';
								node.style.color = '#444444';
							}
						});
					}
				},
				jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
				pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
			};

			const blob: Blob = await html2pdf()
				.set(opt)
				.from(el)
				.outputPdf('blob');

			const url = URL.createObjectURL(blob);
			const iframe = document.createElement('iframe');
			iframe.style.cssText =
				'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;pointer-events:none;';
			iframe.setAttribute('aria-hidden', 'true');
			iframe.src = url;
			document.body.appendChild(iframe);

			const cleanup = () => {
				URL.revokeObjectURL(url);
				iframe.remove();
			};

			const triggerPrint = () => {
				if (printOnceRef.current) return;
				printOnceRef.current = true;
				try {
					iframe.contentWindow?.focus();
					iframe.contentWindow?.print();
				} catch (e) {
					console.error(e);
					notifyError(
						'pdf-print-failed',
						'PDF was created but printing failed. Try opening the download from your browser.',
						<IconX size={20} />
					);
				}
			};

			iframe.onload = () => {
				triggerPrint();
				window.setTimeout(cleanup, 120_000);
			};
			// Blob PDF iframes sometimes skip onload in Safari — fallback print once.
			window.setTimeout(() => {
				if (iframe.isConnected) triggerPrint();
			}, 800);
		} catch (err: unknown) {
			console.error(err);
			const message = err instanceof Error ? err.message : 'Could not build PDF.';
			notifyError('pdf-build-failed', message, <IconX size={20} />);
		} finally {
			setPdfLoading(false);
		}
	};

	const canPrintPdf = Boolean(pdfSourceId) && slideIndex === activeSlideIndex;
	const isActiveSlide = slideIndex === activeSlideIndex;

	const showPaperVariants =
		typeof paperVariantTotal === 'number' &&
		paperVariantTotal > 1 &&
		isActiveSlide &&
		typeof onPaperVariantPageChange === 'function';

	const openDeleteConfirm = () => {
		if (!onDelete) return;
		const label = paperTitle?.trim() ? `"${paperTitle.trim()}"` : 'this paper';
		modals.openConfirmModal({
			modalId: paperId ? `confirm-delete-paper-${paperId}` : 'confirm-delete-paper',
			title: 'Delete paper?',
			children: (
				<Text size='sm' c='dimmed'>
					{label} will be permanently removed. This cannot be undone.
				</Text>
			),
			labels: { confirm: 'Delete paper', cancel: 'Cancel' },
			confirmProps: { color: 'red' },
			onConfirm: onDelete
		});
	};

	return (
		<Group
			data-cy='reader-toolbar'
			justify='space-between'
			wrap='wrap'
			gap='xs'
			p='xs'
			className='paper-no-print'
			style={{
				position: 'sticky',
				top: 0,
				zIndex: 15,
				borderBottom: '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))',
				backgroundColor: 'light-dark(var(--mantine-color-body), var(--mantine-color-dark-7))'
			}}
		>
			<Group gap='xs' wrap='nowrap'>
				<Button size='sm' variant='light' onClick={toggleFocus} leftSection={<IconArrowsMaximize size={16} />}>
					{focusMode ? 'Exit focus' : 'Focus'}
				</Button>
				<Button
					size='sm'
					variant='default'
					onClick={() => void printPaperAsPdf()}
					leftSection={<IconPrinter size={16} />}
					loading={pdfLoading}
					disabled={!canPrintPdf || pdfLoading}
				>
					Print PDF
				</Button>
				{showDevDelete && isActiveSlide && onDelete ? (
					<Button
						data-cy='paper-delete-button'
						size='sm'
						color='red'
						variant='outline'
						onClick={openDeleteConfirm}
						loading={deleteLoading}
						disabled={deleteLoading}
					>
						Delete
					</Button>
				) : null}
			</Group>

			{showPaperVariants ? (
				<Box
					style={{
						flex: '1 1 12rem',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						minWidth: 0
					}}
				>
					<Group gap='xs' wrap='nowrap' align='center' justify='center'>
						<Text size='xs' c='dimmed' ff='sans-serif' fw={500} visibleFrom='sm' style={{ letterSpacing: '0.02em' }}>
							Copies
						</Text>
						<Pagination
							total={paperVariantTotal}
							value={activeSlideIndex + 1}
							onChange={onPaperVariantPageChange}
							size='sm'
							color='brand'
							radius='md'
							gap='xs'
							siblings={1}
							boundaries={1}
							withEdges={false}
							getControlProps={control => {
								if (control === 'next') return { 'aria-label': 'Next generated paper' };
								if (control === 'previous') return { 'aria-label': 'Previous generated paper' };
								return {};
							}}
							styles={{
								root: { flexWrap: 'nowrap' }
							}}
						/>
					</Group>
				</Box>
			) : null}

			<Group gap={4} align='center' wrap='nowrap'>
				<Text size='xs' c='dimmed' visibleFrom='xs'>
					Text size
				</Text>
				{SCALES.map(s => (
					<Button
						key={s}
						size='xs'
						variant={fontScale === s ? 'filled' : 'subtle'}
						onClick={() => setScale(s)}
						aria-pressed={fontScale === s}
					>
						{s === 1 ? 'A' : s === 1.125 ? 'A+' : 'A++'}
					</Button>
				))}
			</Group>
		</Group>
	);
}
