import { showNotification } from '@mantine/notifications';
import { phoneUtil, requirements } from './constants';
import { PhoneNumberFormat as PNF } from 'google-libphonenumber';
import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';
import { ExamBoard, Subject } from '@prisma/client';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 16)

export function genID(prefix: string, size=16) : string {
	return `${prefix}_${nanoid(size)}`
}

export function getRndInteger(min: number, max: number, offset = 1) {
	return Math.floor(Math.random() * (max - min + offset)) + min;
}

export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function sanitize(str: string): string {
	return str.replace(/[_-]/g, ' ').toLowerCase();
}

export function genCourseOrPaperName(
	subject: Subject,
	board: ExamBoard,
	paper: string | null=null
) : string {
	let exam_board;
	switch (board) {
		case 'ocr':
		case 'aqa':
			exam_board = board.toUpperCase();
			break;
		case 'edexcel':
			exam_board = capitalize(board);
			break;
		default:
			exam_board = board;
			break;
	}
	if (paper) {
		return `${exam_board} ${capitalize(subject)} - ${capitalize(paper)}`;
	} else {
		return `${exam_board} ${capitalize(subject)}`;
	}
}

export function includesCaseInsensitive(this: string, str: string): boolean {
	return this.toLowerCase().trim().includes(str.toLowerCase().trim());
}

export function encrypt(word: string, key: string) {
	const encJson = CryptoJS.AES.encrypt(JSON.stringify(word), key.slice(0, 16)).toString();
	return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encJson));
}

export function decrypt(word: string, key: string) {
	const decData = CryptoJS.enc.Base64.parse(word).toString(CryptoJS.enc.Utf8);
	const bytes = CryptoJS.AES.decrypt(decData, key.slice(0, 16)).toString(CryptoJS.enc.Utf8);
	return JSON.parse(bytes);
}

export function isStringEqual(a: string, b: string) {
	return a.toLowerCase().trim() === b.toLowerCase().trim();
}

export async function hashPassword(password: string, salt_rounds = 10): Promise<string> {
	const salt = await bcrypt.genSalt(salt_rounds);
	return await bcrypt.hash(password, salt);
}

export async function comparePassword(plaintextPassword: string, hash: string) {
	return await bcrypt.compare(plaintextPassword, hash);
}

export function getStrength(password: string) {
	let multiplier = password.length > 5 ? 0 : 1;
	requirements.forEach(requirement => {
		if (!requirement.re.test(password)) {
			multiplier += 1;
		}
	});
	return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

export function getE164Number(phoneNumber: string) {
	const phone = phoneUtil.parseAndKeepRawInput(phoneNumber, 'GB');
	if (phoneUtil.getRegionCodeForNumber(phone) === 'GB') {
		const E164Number = phoneUtil.format(phone, PNF.E164);
		console.log('E164Number:', E164Number);
		return E164Number;
	}
	return phoneNumber;
}

export function notifySuccess(id: string, message: string, icon: JSX.Element) {
	showNotification({
		id,
		autoClose: 3000,
		title: 'Success',
		message,
		color: 'green',
		icon,
		loading: false
	});
}

export function notifyError(id: string, message: string, icon: JSX.Element) {
	showNotification({
		id,
		autoClose: 5000,
		title: 'Error',
		message,
		color: 'red',
		icon,
		loading: false
	});
}

export function notifyInfo(id: string, message: string, icon: JSX.Element) {
	showNotification({
		id,
		onClose: () => console.log('unmounted'),
		onOpen: () => console.log('mounted'),
		autoClose: 5000,
		title: 'Info',
		message,
		color: 'blue',
		icon,
		loading: false
	});
}
