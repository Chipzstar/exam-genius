declare module 'html2pdf.js' {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	type Html2PdfWorker = any;
	const html2pdf: () => Html2PdfWorker;
	export default html2pdf;
}
