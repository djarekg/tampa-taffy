export default {
  arrowParens: 'avoid',
  bracketSameLine: true,
  bracketSpacing: true,
  embeddedLanguageFormatting: 'auto',
  endOfLine: 'lf',
  htmlWhitespaceSensitivity: 'ignore',
  printWidth: 100,
  proseWrap: 'preserve',
  quoteProps: 'as-needed',
  semi: true,
  singleAttributePerLine: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
  overrides: [
    {
      files: '*.css',
      options: {
        singleQuote: false,
      },
    },
    {
      files: ['*.json', '*.jsonc'],
      options: {
        trailingComma: 'none',
      },
    },
  ],
};
