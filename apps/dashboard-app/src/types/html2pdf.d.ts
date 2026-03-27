declare module 'html2pdf.js' {
	type Html2PdfWorker = any;
	const html2pdf: () => Html2PdfWorker;
	export default html2pdf;
}
