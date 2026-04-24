'use client';

import { useMemo } from 'react';
import katex, { type KatexOptions } from 'katex';
import parse, {
	type HTMLReactParserOptions,
	Element as DomElement,
	Text as DomText,
	type DOMNode
} from 'html-react-parser';
import DOMPurify from 'dompurify';

type MathMatch = {
	display: boolean;
	source: string;
	start: number;
	end: number;
};

const DELIMITERS: Array<{
	open: string;
	close: string;
	display: boolean;
}> = [
	{ open: '\\[', close: '\\]', display: true },
	{ open: '$$', close: '$$', display: true },
	{ open: '\\(', close: '\\)', display: false }
];

function findMathMatches(input: string): MathMatch[] {
	const matches: MathMatch[] = [];
	let i = 0;
	while (i < input.length) {
		let consumed = false;
		for (const d of DELIMITERS) {
			if (!input.startsWith(d.open, i)) continue;

			const searchStart = i + d.open.length;
			let closeIdx = -1;
			let searchFrom = searchStart;
			while (searchFrom < input.length) {
				const idx = input.indexOf(d.close, searchFrom);
				if (idx === -1) break;
				if (d.close.startsWith('$') && idx > 0 && input[idx - 1] === '\\') {
					searchFrom = idx + d.close.length;
					continue;
				}
				closeIdx = idx;
				break;
			}

			if (closeIdx === -1 || closeIdx === searchStart) continue;

			const body = input.slice(searchStart, closeIdx);
			if (!body.trim()) continue;

			matches.push({
				display: d.display,
				source: body,
				start: i,
				end: closeIdx + d.close.length
			});
			i = closeIdx + d.close.length;
			consumed = true;
			break;
		}
		if (!consumed) i += 1;
	}
	return matches;
}

const BASE_OPTIONS: KatexOptions = {
	throwOnError: false,
	strict: 'ignore',
	output: 'htmlAndMathml',
	trust: false
};

function renderToHtml(source: string, display: boolean): string {
	try {
		return katex.renderToString(source, {
			...BASE_OPTIONS,
			displayMode: display
		});
	} catch {
		const safe = source
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
		return `<span class="eg-latex-error">${safe}</span>`;
	}
}

function hasAnyDelimiter(input: string): boolean {
	return input.indexOf('\\(') !== -1 || input.indexOf('\\[') !== -1 || input.indexOf('$$') !== -1;
}

function renderStringWithLatex(input: string, keyPrefix: string): React.ReactNode {
	if (!input) return input;
	if (!hasAnyDelimiter(input)) {
		return input;
	}
	const matches = findMathMatches(input);
	if (matches.length === 0) return input;

	const nodes: React.ReactNode[] = [];
	let cursor = 0;
	matches.forEach((m, idx) => {
		if (m.start > cursor) {
			nodes.push(
				<span key={`${keyPrefix}-t-${idx}`}>{input.slice(cursor, m.start)}</span>
			);
		}
		const html = renderToHtml(m.source, m.display);
		nodes.push(
			<span
				key={`${keyPrefix}-m-${idx}`}
				className={m.display ? 'eg-latex eg-latex-block' : 'eg-latex eg-latex-inline'}
				role='math'
				aria-label={m.source}
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		);
		cursor = m.end;
	});
	if (cursor < input.length) {
		nodes.push(
			<span key={`${keyPrefix}-t-end`}>{input.slice(cursor)}</span>
		);
	}
	return <>{nodes}</>;
}

export function LatexText({ children, block = false }: { children: string; block?: boolean }) {
	const rendered = useMemo(() => renderStringWithLatex(children ?? '', 'lx'), [children]);
	if (block) {
		return <div className='eg-latex-root whitespace-pre-wrap'>{rendered}</div>;
	}
	return <span className='eg-latex-root'>{rendered}</span>;
}

const PAPER_HTML_SANITIZE: DOMPurify.Config = {
	USE_PROFILES: { html: true }
};

export function LatexHtml({ html }: { html: string }) {
	const options = useMemo<HTMLReactParserOptions>(() => {
		let keyCounter = 0;
		return {
			replace: (node: DOMNode) => {
				if (node instanceof DomText) {
					const text = node.data;
					if (!text || !hasAnyDelimiter(text)) return undefined;
					keyCounter += 1;
					return <>{renderStringWithLatex(text, `lh-${keyCounter}`)}</>;
				}
				if (node instanceof DomElement) {
					// Do not parse LaTeX inside code/pre/script/style blocks
					const tag = node.tagName?.toLowerCase();
					if (tag === 'code' || tag === 'pre' || tag === 'script' || tag === 'style') {
						return undefined;
					}
				}
				return undefined;
			}
		};
	}, [html]);

	const safe = useMemo(() => DOMPurify.sanitize(html ?? '', PAPER_HTML_SANITIZE), [html]);
	return <>{parse(safe, options)}</>;
}
