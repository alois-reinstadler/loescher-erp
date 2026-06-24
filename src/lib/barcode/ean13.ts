const L_PATTERNS = [
	[0, 0, 0, 1, 1, 0, 1],
	[0, 0, 1, 1, 0, 0, 1],
	[0, 1, 0, 0, 1, 0, 1],
	[0, 1, 1, 0, 0, 0, 1],
	[1, 0, 0, 0, 1, 0, 1],
	[1, 0, 1, 0, 0, 0, 1],
	[1, 1, 0, 0, 0, 0, 1],
	[0, 0, 1, 0, 1, 0, 1],
	[0, 1, 0, 1, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 1]
];

const G_PATTERNS = [
	[0, 1, 0, 0, 1, 1, 1],
	[0, 1, 1, 0, 0, 1, 1],
	[0, 0, 1, 1, 0, 1, 1],
	[0, 1, 0, 0, 0, 1, 1],
	[0, 0, 1, 1, 1, 1, 1],
	[0, 1, 1, 1, 0, 1, 1],
	[0, 0, 0, 0, 1, 1, 1],
	[0, 0, 1, 0, 0, 1, 1],
	[0, 0, 0, 1, 0, 1, 1],
	[0, 0, 1, 0, 1, 1, 1]
];

const R_PATTERNS = [
	[1, 1, 1, 0, 0, 1, 0],
	[1, 1, 0, 0, 1, 1, 0],
	[1, 1, 0, 1, 1, 0, 0],
	[1, 0, 0, 0, 0, 1, 0],
	[1, 0, 1, 1, 1, 0, 0],
	[1, 0, 0, 1, 1, 1, 0],
	[1, 0, 1, 0, 0, 0, 0],
	[1, 0, 0, 0, 1, 0, 0],
	[1, 0, 0, 1, 0, 0, 0],
	[1, 1, 1, 0, 1, 0, 0]
];

const FIRST_DIGIT_PATTERNS = [
	[0, 0, 0, 0, 0],
	[0, 0, 1, 0, 1],
	[0, 0, 1, 1, 0],
	[0, 0, 1, 1, 1],
	[0, 1, 0, 0, 1],
	[0, 1, 1, 0, 0],
	[0, 1, 1, 1, 0],
	[0, 1, 0, 1, 0],
	[0, 1, 0, 1, 1],
	[0, 1, 1, 0, 1],
	[0, 0, 0, 1, 0]
];

export function calculateCheckDigit(digits: number[]): number {
	const weights = [1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3];
	let sum = 0;
	for (let i = 0; i < 12; i++) {
		sum += digits[i] * weights[i];
	}
	return (10 - (sum % 10)) % 10;
}

export function encodeEan13(code: string): boolean[][] {
	const digits = code.split('').map(Number);

	if (digits.length === 12) {
		digits.push(calculateCheckDigit(digits));
	}

	if (digits.length !== 13) {
		throw new Error('EAN-13 requires exactly 12 or 13 digits');
	}

	const firstDigit = digits[0];
	const leftDigits = digits.slice(1, 7);
	const rightDigits = digits.slice(7, 13);

	const leftPattern = FIRST_DIGIT_PATTERNS[firstDigit];
	const bars: boolean[][] = [];

	for (let i = 0; i < 6; i++) {
		const digit = leftDigits[i];
		const pattern = leftPattern[i] === 0 ? L_PATTERNS[digit] : G_PATTERNS[digit];
		bars.push(pattern.map(Boolean));
	}

	for (let i = 0; i < 6; i++) {
		const digit = rightDigits[i];
		bars.push(R_PATTERNS[digit].map(Boolean));
	}

	return bars;
}

export function generateSvgString(
	code: string,
	options: { height?: number; showText?: boolean } = {}
): string {
	const { height = 80, showText = true } = options;
	const digits = code.split('').map(Number);

	if (digits.length === 12) {
		digits.push(calculateCheckDigit(digits));
	}

	const barWidth = 1;
	const totalWidth = (3 + 6 * 7 + 5 + 6 * 7 + 3) * barWidth;
	const svgWidth = totalWidth + 20;
	const svgHeight = height + (showText ? 20 : 0);

	let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">`;
	svg += `<rect width="${svgWidth}" height="${svgHeight}" fill="white"/>`;

	let x = 10;

	const drawBars = (pattern: boolean[], barH: number) => {
		for (const bar of pattern) {
			if (bar) {
				svg += `<rect x="${x}" y="0" width="${barWidth}" height="${barH}" fill="black"/>`;
			}
			x += barWidth;
		}
	};

	const startGuard = [true, false, true];
	drawBars(startGuard, height);

	for (let i = 0; i < 6; i++) {
		const digit = digits[i + 1];
		const pattern =
			FIRST_DIGIT_PATTERNS[digits[0]][i] === 0 ? L_PATTERNS[digit] : G_PATTERNS[digit];
		drawBars(pattern.map(Boolean), height);
	}

	const centerGuard = [false, true, false, true, false];
	drawBars(centerGuard, height);

	for (let i = 0; i < 6; i++) {
		const digit = digits[i + 7];
		drawBars(R_PATTERNS[digit].map(Boolean), height);
	}

	const endGuard = [true, false, true];
	drawBars(endGuard, height);

	if (showText) {
		svg += `<text x="10" y="${height + 14}" font-family="monospace" font-size="11" fill="black">${digits[0]}</text>`;
		let textX = 40;
		for (let i = 0; i < 6; i++) {
			svg += `<text x="${textX}" y="${height + 14}" font-family="monospace" font-size="11" fill="black">${digits[i + 1]}</text>`;
			textX += 7;
		}
		textX += 5;
		for (let i = 0; i < 6; i++) {
			svg += `<text x="${textX}" y="${height + 14}" font-family="monospace" font-size="11" fill="black">${digits[i + 7]}</text>`;
			textX += 7;
		}
	}

	svg += '</svg>';
	return svg;
}

export function isValidEan13(code: string): boolean {
	return /^\d{12,13}$/.test(code);
}
