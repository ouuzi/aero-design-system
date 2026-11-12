/*
 * aero-design-system/eslint: the design-system lint rules as a shareable flat config.
 *
 *   // eslint.config.mjs
 *   import { designSystem } from 'aero-design-system/eslint';
 *   export default [
 *     // ...your framework config (eslint-config-next, typescript-eslint…) first: it sets the parser
 *     ...designSystem({ files: ['src/**\/*.{ts,tsx}'] }),
 *   ];
 *
 * Three rules, all errors: ds/no-off-system-classes, ds/prefer-kit-components,
 * ds/no-retired-classes (see plugin.mjs). This config adds no parser: it runs on whatever
 * parser your config already sets for those files (TSX needs one).
 */
import plugin from './plugin.mjs';

export { plugin };

/**
 * Opacity on a token is allowed only where it has one fixed job: accent/20 text selection
 * (and the hairline of a monogram tile), surface/90 a translucent sticky top bar, on-solid/10,
 * /20 and /80 the panel, edge, chip-remove hover and subtitle on a solid brand fill. The dialog
 * backdrop is its own token (bg-scrim). Field focus rings are full-strength accent.
 */
export const ALLOWED_ALPHA = ['accent/20', 'surface/90', 'on-solid/10', 'on-solid/20', 'on-solid/80'];

/**
 * @typedef {object} DesignSystemOptions
 * @property {string[]} [files]            Files the rules apply to. Default: every JS/TS file.
 * @property {string[]} [ignores]          Files left out (e.g. ['app/api/**']).
 * @property {string[]} [allowAlpha]       Token/opacity pairs allowed. Default ALLOWED_ALPHA; extend it, e.g. [...ALLOWED_ALPHA, 'ink/5'].
 * @property {string} [kitImport]          The module screens import the kit from, named in messages. Default 'aero-design-system'.
 * @property {string[]} [rawButtonFiles]   Files that may keep a raw <button> (error boundaries).
 * @property {string[]} [whiteBlackFiles]  Files that may use white and black (an always-dark viewer, paper replicas).
 * @property {string[]} [printFormFiles]   Paper-form replicas: print sizes and spacing allowed, kit components not required.
 * @property {string[]} [kitFiles]         Files that build kit components themselves: raw controls allowed, plus the kit's spacing steps 7 and 9.
 */

/**
 * The flat-config objects for the design-system rules. The per-file exceptions combine: a file
 * in both whiteBlackFiles and printFormFiles gets both allowances.
 * @param {DesignSystemOptions} [options]
 * @returns {import('eslint').Linter.Config[]}
 */
export function designSystem(options = {}) {
  const {
    files = ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],
    ignores = [],
    allowAlpha = ALLOWED_ALPHA,
    kitImport = 'aero-design-system',
    rawButtonFiles = [],
    whiteBlackFiles = [],
    printFormFiles = [],
    kitFiles = [],
  } = options;
  const preferKit = ['error', { kitImport }];
  const configs = [
    {
      name: 'aero-design-system/rules',
      files,
      ...(ignores.length ? { ignores } : {}),
      plugins: { ds: plugin },
      rules: {
        'ds/no-off-system-classes': ['error', { allowAlpha }],
        'ds/prefer-kit-components': preferKit,
        'ds/no-retired-classes': 'error',
      },
    },
  ];
  if (kitFiles.length) {
    configs.push({
      name: 'aero-design-system/kit-files',
      files: kitFiles,
      rules: {
        'ds/prefer-kit-components': 'off',
        // 7 and 9 are the insets that clear an icon inside a field (pl-9, pr-9, pl-7): kit geometry only.
        'ds/no-off-system-classes': ['error', { allowAlpha, extraSpacingSteps: ['7', '9'] }],
      },
    });
  }
  if (rawButtonFiles.length) {
    configs.push({
      name: 'aero-design-system/raw-button-files',
      files: rawButtonFiles,
      rules: { 'ds/prefer-kit-components': ['error', { kitImport, allowRawButton: true }] },
    });
  }
  // One entry per file that has class exceptions, so its allowances combine.
  for (const file of [...new Set([...printFormFiles, ...whiteBlackFiles])]) {
    const print = printFormFiles.includes(file);
    const whiteBlack = whiteBlackFiles.includes(file);
    configs.push({
      name: `aero-design-system/exceptions:${file}`,
      files: [file],
      rules: {
        'ds/no-off-system-classes': [
          'error',
          { allowAlpha, ...(print ? { allowPrintSizes: true } : {}), ...(whiteBlack ? { allowWhiteBlack: true } : {}) },
        ],
        ...(print ? { 'ds/prefer-kit-components': 'off' } : {}),
      },
    });
  }
  return configs;
}

/** The rules with their defaults, for `export default [...framework, ...recommended]`. */
export const recommended = designSystem();

export default designSystem;
