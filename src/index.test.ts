import TextLintTester from 'textlint-tester';

import rule from './index';

const CORRECT_TEXT =
	'すべての人間は、生れながらにして自由であり、かつ、尊厳と権利とについて平等である。';

const tester = new TextLintTester();
tester.run('ja-ten-maru', rule, {
	valid: [CORRECT_TEXT],
	invalid: [
		{
			// fullwidth comma to ideographic comma
			output: CORRECT_TEXT,
			text: 'すべての人間は，生れながらにして自由であり，かつ，尊厳と権利とについて平等である。',
			errors: [
				{
					message: 'Use "、" (U+3001) instead of "，" (U+FF0C).',
					range: [7, 8],
				},
				{
					message: 'Use "、" (U+3001) instead of "，" (U+FF0C).',
					range: [21, 22],
				},
				{
					message: 'Use "、" (U+3001) instead of "，" (U+FF0C).',
					range: [24, 25],
				},
			],
		},
		{
			// fullwidth full stop to ideographic full stop
			output: CORRECT_TEXT,
			text: 'すべての人間は、生れながらにして自由であり、かつ、尊厳と権利とについて平等である．',
			errors: [
				{
					message: 'Use "。" (U+3002) instead of "．" (U+FF0E).',
					range: [40, 41],
				},
			],
		},
		{
			// halfwidth comma to ideographic comma
			output: CORRECT_TEXT,
			text: 'すべての人間は､生れながらにして自由であり､かつ､尊厳と権利とについて平等である。',
			errors: [
				{
					message: 'Use "、" (U+3001) instead of "､" (U+FF64).',
					range: [7, 8],
				},
				{
					message: 'Use "、" (U+3001) instead of "､" (U+FF64).',
					range: [21, 22],
				},
				{
					message: 'Use "、" (U+3001) instead of "､" (U+FF64).',
					range: [24, 25],
				},
			],
		},
		{
			// halfwidth full stop to ideographic full stop
			output: CORRECT_TEXT,
			text: 'すべての人間は、生れながらにして自由であり、かつ、尊厳と権利とについて平等である｡',
			errors: [
				{
					message: 'Use "。" (U+3002) instead of "｡" (U+FF61).',
					range: [40, 41],
				},
			],
		},
		{
			// mixed
			output: CORRECT_TEXT,
			text: 'すべての人間は，生れながらにして自由であり､かつ，尊厳と権利とについて平等である．',
			errors: [
				{
					message: 'Use "、" (U+3001) instead of "，" (U+FF0C).',
					range: [7, 8],
				},
				{
					message: 'Use "、" (U+3001) instead of "､" (U+FF64).',
					range: [21, 22],
				},
				{
					message: 'Use "、" (U+3001) instead of "，" (U+FF0C).',
					range: [24, 25],
				},
				{
					message: 'Use "。" (U+3002) instead of "．" (U+FF0E).',
					range: [40, 41],
				},
			],
		},
	],
});

// Disable comma normalization while keeping full-stop normalization enabled.
tester.run('ja-ten-maru (ten: false)', rule, {
	valid: [
		CORRECT_TEXT,
		{
			text: 'すべての人間は，生れながらにして自由であり，かつ，尊厳と権利とについて平等である。',
			options: { ten: false },
		},
		{
			text: 'すべての人間は､生れながらにして自由であり､かつ､尊厳と権利とについて平等である。',
			options: { ten: false },
		},
	],
	invalid: [
		{
			text: 'すべての人間は、生れながらにして自由であり、かつ、尊厳と権利とについて平等である．',
			output: CORRECT_TEXT,
			options: { ten: false },
			errors: [
				{
					message: 'Use "。" (U+3002) instead of "．" (U+FF0E).',
					range: [40, 41],
				},
			],
		},
		{
			text: 'すべての人間は、生れながらにして自由であり、かつ、尊厳と権利とについて平等である｡',
			output: CORRECT_TEXT,
			options: { ten: false },
			errors: [
				{
					message: 'Use "。" (U+3002) instead of "｡" (U+FF61).',
					range: [40, 41],
				},
			],
		},
	],
});

// Disable full-stop normalization while keeping comma normalization enabled.
tester.run('ja-ten-maru (maru: false)', rule, {
	valid: [
		CORRECT_TEXT,
		{
			text: 'すべての人間は、生れながらにして自由であり、かつ、尊厳と権利とについて平等である．',
			options: { maru: false },
		},
		{
			text: 'すべての人間は、生れながらにして自由であり、かつ、尊厳と権利とについて平等である｡',
			options: { maru: false },
		},
	],
	invalid: [
		{
			text: 'すべての人間は，生れながらにして自由であり，かつ，尊厳と権利とについて平等である。',
			output: CORRECT_TEXT,
			options: { maru: false },
			errors: [
				{
					message: 'Use "、" (U+3001) instead of "，" (U+FF0C).',
					range: [7, 8],
				},
				{
					message: 'Use "、" (U+3001) instead of "，" (U+FF0C).',
					range: [21, 22],
				},
				{
					message: 'Use "、" (U+3001) instead of "，" (U+FF0C).',
					range: [24, 25],
				},
			],
		},
		{
			text: 'すべての人間は､生れながらにして自由であり､かつ､尊厳と権利とについて平等である。',
			output: CORRECT_TEXT,
			options: { maru: false },
			errors: [
				{
					message: 'Use "、" (U+3001) instead of "､" (U+FF64).',
					range: [7, 8],
				},
				{
					message: 'Use "、" (U+3001) instead of "､" (U+FF64).',
					range: [21, 22],
				},
				{
					message: 'Use "、" (U+3001) instead of "､" (U+FF64).',
					range: [24, 25],
				},
			],
		},
	],
});

// Disable all punctuation normalization.
tester.run('ja-ten-maru (ten: false, maru: false)', rule, {
	valid: [
		CORRECT_TEXT,
		{
			text: 'すべての人間は，生れながらにして自由であり､かつ，尊厳と権利とについて平等である．',
			options: { ten: false, maru: false },
		},
	],
	invalid: [],
});

// Keep reported ranges correct when a text node starts after the document origin.
tester.run('ja-ten-maru (multiple paragraphs / node offset)', rule, {
	valid: [],
	invalid: [
		{
			text: '最初の段落。\n\n次の段落，です',
			output: '最初の段落。\n\n次の段落、です',
			errors: [
				{
					message: 'Use "、" (U+3001) instead of "，" (U+FF0C).',
					range: [12, 13],
				},
			],
		},
	],
});

// Ignore punctuation in inline code and fenced code blocks.
tester.run('ja-ten-maru (does not touch code)', rule, {
	valid: ['`，` は変換されない。', '```\n，。\n```'],
	invalid: [],
});

// Preserve canonical Japanese punctuation and ASCII punctuation.
tester.run('ja-ten-maru (preserves unsupported punctuation)', rule, {
	valid: ['正規の句読点、。とASCII punctuation,.'],
	invalid: [],
});

// Normalize punctuation in nested Markdown text while preserving global ranges.
tester.run('ja-ten-maru (nested Markdown)', rule, {
	valid: [],
	invalid: [
		{
			text: '# **強調，です** と [リンク｡](https://example.com)',
			output: '# **強調、です** と [リンク。](https://example.com)',
			errors: [
				{
					message: 'Use "、" (U+3001) instead of "，" (U+FF0C).',
					range: [6, 7],
				},
				{
					message: 'Use "。" (U+3002) instead of "｡" (U+FF61).',
					range: [18, 19],
				},
			],
		},
	],
});

// Apply multiple non-overlapping fixes to consecutive punctuation.
tester.run('ja-ten-maru (consecutive punctuation)', rule, {
	valid: [],
	invalid: [
		{
			text: 'あ，，い。',
			output: 'あ、、い。',
			errors: [
				{
					message: 'Use "、" (U+3001) instead of "，" (U+FF0C).',
					range: [1, 2],
				},
				{
					message: 'Use "、" (U+3001) instead of "，" (U+FF0C).',
					range: [2, 3],
				},
			],
		},
	],
});
