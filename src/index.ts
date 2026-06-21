import type { TextlintRuleModule, TextlintRuleReporter } from '@textlint/types';

/** Canonical Japanese comma used as the replacement for nonstandard commas. */
const IDEOGRAPHIC_COMMA = '、';
/** Canonical Japanese full stop used as the replacement for nonstandard stops. */
const IDEOGRAPHIC_FULL_STOP = '。';

/** Halfwidth ideographic comma normalized to `、` when `ten` is enabled. */
const HALFWIDTH_IDEOGRAPHIC_COMMA = '､';
/** Halfwidth ideographic full stop normalized to `。` when `maru` is enabled. */
const HALFWIDTH_IDEOGRAPHIC_FULL_STOP = '｡';
/** Fullwidth comma normalized to `、` when `ten` is enabled. */
const FULLWIDTH_COMMA = '，';
/** Fullwidth full stop normalized to `。` when `maru` is enabled. */
const FULLWIDTH_FULL_STOP = '．';

export interface Options {
	/** Whether to normalize comma variants to the Japanese comma `、`. Defaults to `true`. */
	ten?: boolean;
	/** Whether to normalize full-stop variants to the Japanese full stop `。`. Defaults to `true`. */
	maru?: boolean;
}

type OptionName = keyof Required<Options>;

const PUNCTUATION_RULES = {
	[FULLWIDTH_COMMA]: {
		expected: IDEOGRAPHIC_COMMA,
		option: 'ten',
	},
	[HALFWIDTH_IDEOGRAPHIC_COMMA]: {
		expected: IDEOGRAPHIC_COMMA,
		option: 'ten',
	},
	[FULLWIDTH_FULL_STOP]: {
		expected: IDEOGRAPHIC_FULL_STOP,
		option: 'maru',
	},
	[HALFWIDTH_IDEOGRAPHIC_FULL_STOP]: {
		expected: IDEOGRAPHIC_FULL_STOP,
		option: 'maru',
	},
} satisfies Record<
	string,
	{
		expected: string;
		option: OptionName;
	}
>;

type ActualPunctuation = keyof typeof PUNCTUATION_RULES;

const isActualPunctuation = (text: string): text is ActualPunctuation => text in PUNCTUATION_RULES;

const escapeRegExp = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const PUNCTUATION_PATTERN = new RegExp(
	`[${Object.keys(PUNCTUATION_RULES).map(escapeRegExp).join('')}]`,
	'g',
);

const formatCodePoint = (text: string): string => {
	const codePoint = text.codePointAt(0);
	return `U+${(codePoint ?? 0).toString(16).toUpperCase().padStart(4, '0')}`;
};

const reporter: TextlintRuleReporter<Options> = (context, options) => {
	const { ten = true, maru = true } = options ?? {};
	const enabledOptions: Record<OptionName, boolean> = { ten, maru };

	const { Syntax, RuleError, report, getSource, locator, fixer } = context;

	return {
		[Syntax.Str](node) {
			const text = getSource(node);

			for (const match of text.matchAll(PUNCTUATION_PATTERN)) {
				const actual = match[0];
				if (!isActualPunctuation(actual)) continue;

				const rule = PUNCTUATION_RULES[actual];
				if (!enabledOptions[rule.option]) continue;

				const { expected } = rule;
				const range: [number, number] = [match.index, match.index + actual.length];

				report(
					node,
					new RuleError(
						`Use "${expected}" (${formatCodePoint(expected)}) instead of "${actual}" (${formatCodePoint(actual)}).`,
						{
							fix: fixer.replaceTextRange(range, expected),
							padding: locator.range(range),
						},
					),
				);
			}
		},
	};
};

const rule: TextlintRuleModule<Options> = {
	fixer: reporter,
	linter: reporter,
};

export default rule;
