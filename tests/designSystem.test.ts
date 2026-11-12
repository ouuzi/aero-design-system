import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { cn } from '../src/lib/utils.js';
import * as styles from '../src/components/styles.js';
import {
  badgeClass,
  btn,
  buttonClass,
  choiceBox,
  choiceBoxDark,
  commandOption,
  choiceBoxInvalid,
  choiceRoot,
  choiceTarget,
  fieldDark,
  fieldInvalid,
  fieldOpen,
  focusField,
  focusRing,
  focusRingInset,
  iconButtonOutline,
  inputBase,
  inputClass,
  inputMdBase,
  inputSizes,
  isStatusTone,
  linkButton,
  listOption,
  listboxPanel,
  nativeSelectHidden,
  selectFilterTrigger,
  selectTrigger,
  menuItem,
  menuPanel,
  motion,
  segmentedItem,
  selectBase,
  selectClass,
  selectFilterBox,
  selectSizes,
  skeletonFill,
  statValue,
  statusBadgeClass,
  scrollRegion,
  statusSelectTrigger,
  tabItem,
  tablePinEnd,
  tablePinEndTd,
  tablePinEndTh,
  tableTd,
  textareaBase,
  tooltipAnchor,
  tooltipPanel,
} from '../src/components/styles.js';
import {
  ACTIVITY_STATUS,
  ASSESSMENT_OUTCOME_STATUS,
  AUTH_LABEL,
  AUTH_TONE,
  DOCUMENT_REVIEW_STATUS,
  FINDING_ISSUE_STATUS,
  READINESS_LABEL,
  READINESS_STATUS,
  READINESS_TONE,
  activityLogStatus,
  authTone,
  findingStatus,
  isAuthorisationStatus,
  normaliseAuthorisationStatus,
  normaliseReadinessStatus,
  outcomeStatus,
  readinessStatus,
  sentenceCase,
} from '../src/components/statusTones.js';
import { pageWindow } from '../src/components/pageWindow.js';
import { parseSelectOptions, selectedOptionIndex, textOf } from '../src/components/selectOptions.js';
import { firstEnabled, lastEnabled, matchTypeahead, nextEnabled } from '../src/components/useListbox.js';
import React from 'react';
import { getThemeInitScript } from '../src/lib/themeScript.js';
import { countReadiness, readinessSentence, worstReadinessState, type ReadinessGroup } from '../src/lib/readiness.js';
import { formatDate, toIsoDate } from '../src/lib/dateFormat.js';

/** The assessment's final decisions, as AeroMetric-Control stores them (its lib/competencyCatalog.ts). */
const FINAL_DECISION_OPTIONS = [
  'Competent',
  'Competent with Limitations / Actions',
  'Deferred - Further Evidence Required',
  'Not Competent',
] as const;

const tokens = (classes: string) => classes.split(/\s+/);
const has = (classes: string, part: string) => tokens(part).every((c) => tokens(classes).includes(c));
const globalsCss = () => readFileSync(join(process.cwd(), 'theme.css'), 'utf8');

test('cn keeps the custom type scale next to a text colour', () => {
  // tailwind-merge reads unknown `text-*` values as colours; without the theme extension
  // in lib/utils.ts it silently dropped `text-32` / `text-13` here.
  assert.ok(tokens(cn(statValue, 'text-ink')).includes('text-32'));
  assert.ok(tokens(cn(buttonClass('primary'))).includes('text-13'));
  const invalidSelect = tokens(cn(selectClass, 'border-danger text-danger'));
  assert.ok(invalidSelect.includes('text-13') && invalidSelect.includes('text-danger') && invalidSelect.includes('border-danger'));
  assert.ok(!invalidSelect.includes('border-line-strong'));
});

test('cn still resolves real conflicts', () => {
  assert.equal(cn('text-ink', 'text-muted'), 'text-muted');
  assert.equal(cn('shadow-xs', 'shadow-popover'), 'shadow-popover');
});

test('cn knows the control heights and motion tokens', () => {
  assert.equal(cn('h-control-lg', 'h-control-md'), 'h-control-md');
  assert.equal(cn('h-10', 'h-control-sm'), 'h-control-sm');
  assert.equal(cn('size-control-sm', 'size-control-md'), 'size-control-md');
  assert.equal(cn('duration-fast', 'duration-slow'), 'duration-slow');
  assert.equal(cn('duration-200', 'duration-base'), 'duration-base');
  assert.equal(cn('ease-linear', 'ease-standard'), 'ease-standard');
  assert.equal(cn(motion.fast, motion.slow), motion.slow);
  // A size override from a screen replaces the recipe's height instead of stacking on it.
  assert.ok(!tokens(cn(inputClass, 'h-control-md')).includes('h-control-lg'));
});

test('tokens: muted, line-strong, aliases, no faint', () => {
  const css = globalsCss();
  assert.match(css, /--color-muted:\s*#626c81;/);
  assert.match(css, /--color-line-strong:\s*#868e9b;/);
  assert.match(css, /--color-info:\s*var\(--color-accent\);/);
  assert.match(css, /--color-subtle:\s*var\(--color-canvas\);/);
  assert.doesNotMatch(css, /--color-faint/);
  // The violet chip is outlined, so its old fill is gone from the colour lock.
  assert.doesNotMatch(css, /--color-violet-bg/);
  // Dead motion: one easing, three durations.
  assert.doesNotMatch(css, /pulse-slow|ease-in-out/);
  // The select chevron is a data URI and cannot read a variable: it repeats muted.
  assert.match(css, /stroke='%23626c81'/);
  assert.doesNotMatch(css, /%23667085/);
});

test('tokens: three shadows, tinted from ink in light', () => {
  const css = globalsCss();
  assert.match(css, /--shadow-\*:\s*initial;/);
  assert.match(css, /--elevation-xs:\s*0 1px 2px 0 rgb\(22 32 46 \/ 0\.05\);/);
  assert.match(css, /--elevation-popover:\s*0 8px 24px -6px rgb\(22 32 46 \/ 0\.18\);/);
  assert.match(css, /--elevation-modal:\s*0 24px 64px -12px rgb\(22 32 46 \/ 0\.35\);/);
  // No colour literal hides in a pattern: the soft hatch is mixed from the danger token.
  assert.doesNotMatch(css, /rgb\(180 35 24/);
  assert.match(css, /\.annunciator-hatch-soft\s*\{[^}]*var\(--color-danger\)/);
});

test('tokens: motion and reduced motion', () => {
  const css = globalsCss();
  assert.match(css, /--transition-duration-fast:\s*120ms;/);
  assert.match(css, /--transition-duration-base:\s*180ms;/);
  assert.match(css, /--transition-duration-slow:\s*260ms;/);
  assert.match(css, /--ease-standard:\s*cubic-bezier\(/);
  assert.match(css, /--default-transition-duration:\s*var\(--transition-duration-fast\);/);
  const reduced = /@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n\}/.exec(css);
  assert.ok(reduced, 'a global prefers-reduced-motion rule exists');
  assert.match(reduced![1], /animation:\s*none !important/);
  assert.match(reduced![1], /transition:\s*none !important/);
});

test('tokens: control heights, with comfortable density', () => {
  const css = globalsCss();
  const block = (selector: string) => new RegExp(`${selector}\\s*\\{([^}]*)\\}`).exec(css)?.[1] ?? '';
  const root = block(':root');
  const comfortable = block('\\[data-density="comfortable"\\]');
  for (const [name, d, c] of [['xs', 28, 36], ['sm', 32, 40], ['md', 36, 44], ['lg', 40, 48]] as const) {
    assert.match(root, new RegExp(`--control-${name}:\\s*${d}px;`), `--control-${name} default`);
    assert.match(comfortable, new RegExp(`--control-${name}:\\s*${c}px;`), `--control-${name} comfortable`);
    assert.match(css, new RegExp(`--spacing-control-${name}:\\s*var\\(--control-${name}\\);`), `h-control-${name} utility`);
  }
});

test('focus: one ring for controls, a full-strength accent ring for fields', () => {
  assert.equal(focusRing, 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent');
  assert.ok(focusRingInset.includes('-outline-offset-2'));
  for (const recipe of [buttonClass('primary'), buttonClass('secondary', 'sm'), btn.link, btn.icon, btn.iconDanger, iconButtonOutline, linkButton(), segmentedItem(true)]) {
    assert.ok(has(recipe, focusRing), recipe);
  }
  assert.ok(has(tabItem(false), focusRingInset));
  for (const field of [inputBase, inputMdBase, selectBase, textareaBase]) {
    assert.ok(has(field, focusField), field);
    assert.ok(has(field, 'placeholder:text-muted') || field === selectBase);
  }
  assert.ok(has(selectFilterBox, 'focus-within:border-accent focus-within:ring-2 focus-within:ring-accent'));
  // Invalid fields keep a danger ring, merged over the accent one.
  const invalid = tokens(cn(inputClass, fieldInvalid));
  assert.ok(invalid.includes('focus:ring-danger') && !invalid.includes('focus:ring-accent'));
  // ...and keep the danger edge on hover and while a list is open (Select, Combobox, DatePicker).
  const invalidSelect = tokens(cn(selectBase, fieldOpen, fieldInvalid));
  assert.ok(invalidSelect.includes('hover:border-danger') && !invalidSelect.includes('hover:border-muted'));
  assert.ok(invalidSelect.includes('data-[state=open]:border-danger') && !invalidSelect.includes('data-[state=open]:border-accent'));
  assert.ok(invalidSelect.includes('data-[state=open]:ring-danger') && !invalidSelect.includes('data-[state=open]:ring-accent'));
  assert.ok(invalidSelect.includes('data-[state=open]:ring-2'));
  // No faded ring is left anywhere in the recipes.
  for (const [name, value] of Object.entries(styles)) {
    const text = typeof value === 'string' ? value : typeof value === 'object' && value ? Object.values(value).join(' ') : '';
    assert.doesNotMatch(text, /ring-(?:accent|danger)\/\d+/, name);
    assert.doesNotMatch(text, /(?:^|\s)[a-z:-]*duration-\d/, name);
  }
});

test('components/ui: focus, motion and faint come only from styles.ts', () => {
  const dir = join(process.cwd(), 'src/components');
  const handWrittenFocus = /(?:^|[\s"'`])(?:group-)?focus(?:-visible|-within)?:[a-z]/;
  for (const file of readdirSync(dir).filter((f) => /\.tsx?$/.test(f) && f !== 'styles.ts')) {
    const source = readFileSync(join(dir, file), 'utf8');
    assert.doesNotMatch(source, handWrittenFocus, `${file} writes its own focus classes: use focusRing / focusRingInset / focusField from styles.ts`);
    assert.doesNotMatch(source, /(?:^|[\s"'`:])duration-(?:\d|\[)/, `${file} uses a raw duration: use motion.fast | base | slow`);
    assert.doesNotMatch(source, /faint/, `${file} uses the retired faint token`);
  }
});

test('readiness: Not Configured is neutral, never a problem colour', () => {
  assert.equal(READINESS_TONE['Not Configured'], 'neutral');
  assert.equal(READINESS_TONE['Non-Compliant'], 'danger');
  assert.equal(READINESS_TONE['Expiring Soon'], 'warning');
});

test('authorisation statuses that stop certification are danger', () => {
  for (const status of ['Lapsed', 'Suspended', 'Revoked', 'Expired'] as const) assert.equal(AUTH_TONE[status], 'danger', status);
  assert.equal(AUTH_TONE['Expiring Soon'], 'warning');
  assert.equal(authTone('Something new'), 'neutral');
  assert.equal(authTone(undefined), 'neutral');
  // Legacy free strings are matched loosely, and unknown ones stay neutral.
  assert.equal(authTone('expired'), 'danger');
  assert.equal(normaliseAuthorisationStatus('valid'), 'Valid');
  assert.equal(normaliseAuthorisationStatus('EXPIRING_SOON'), 'Expiring Soon');
  assert.equal(normaliseAuthorisationStatus(' expiring-soon '), 'Expiring Soon');
  assert.equal(normaliseAuthorisationStatus('Unknown'), undefined);
  assert.equal(normaliseAuthorisationStatus(undefined), undefined);
  assert.ok(isAuthorisationStatus('Revoked'));
  assert.ok(!isAuthorisationStatus('revoked'));
  assert.ok(!isAuthorisationStatus('toString'));
});

test('document review states keep their own names', () => {
  assert.deepEqual(DOCUMENT_REVIEW_STATUS.Rejected, { tone: 'danger', label: 'Rejected' });
  assert.deepEqual(DOCUMENT_REVIEW_STATUS['Pending Verification'], { tone: 'warning', label: 'Pending' });
});

const kitSource = (file: string) => readFileSync(join(process.cwd(), file === 'index.ts' ? 'src' : 'src/components', file), 'utf8');

test('sizes: one control scale, sm 32 / md 36 / lg 40', () => {
  for (const [size, height] of [['sm', 'h-control-sm'], ['md', 'h-control-md'], ['lg', 'h-control-lg']] as const) {
    assert.ok(tokens(inputSizes[size]).includes(height), `input ${size}`);
    assert.ok(tokens(selectSizes[size]).includes(height), `select ${size}`);
    assert.ok(tokens(buttonClass('secondary', size)).includes(height), `button ${size}`);
  }
  assert.deepEqual(Object.keys(inputSizes).sort(), ['lg', 'md', 'sm']);
  assert.equal(inputSizes.lg, inputBase);
  // Toggle chips and small segmented items sit below the scale, on --control-xs.
  assert.ok(tokens(segmentedItem(false, 'sm')).includes('h-control-xs'));
  assert.match(kitSource('ToggleChip.tsx'), /h-control-xs/);
  // Form fields default to lg (40px); the old 'toolbar' size is gone.
  for (const file of ['Field.tsx', 'Select.tsx', 'Combobox.tsx', 'DatePicker.tsx']) {
    const source = kitSource(file);
    assert.match(source, /size = 'lg'/, file);
    assert.doesNotMatch(source, /toolbar:/, file);
  }
});

test('labels: Badge is categories, StatusBadge is the only status label', () => {
  // Category chips are slightly rounded; status pills fully rounded and semibold.
  for (const tone of ['neutral', 'info', 'violet', 'brand'] as const) {
    assert.ok(tokens(badgeClass(tone)).includes('rounded-md'), tone);
    assert.ok(!tokens(badgeClass(tone)).includes('rounded-full'), tone);
  }
  for (const tone of ['success', 'warning', 'danger', 'neutral'] as const) {
    assert.ok(has(statusBadgeClass(tone), 'rounded-full font-semibold text-11'), tone);
    assert.ok(has(statusBadgeClass(tone, 'column'), 'rounded-full font-semibold w-[120px] text-12 justify-center'), tone);
  }
  // Info is filled, violet outlined: they differ by more than hue.
  assert.ok(has(badgeClass('info'), 'bg-info-bg text-info ring-info-line'));
  assert.ok(has(badgeClass('violet'), 'bg-surface text-violet ring-violet-line'));
  assert.ok(isStatusTone('success') && isStatusTone('warning') && isStatusTone('danger'));
  assert.ok(!isStatusTone('neutral') && !isStatusTone('info') && !isStatusTone('violet') && !isStatusTone('brand'));
  // Badge takes category tones only; StatusPill and ModalStatusPill are gone.
  assert.match(kitSource('Badge.tsx'), /tone\?: CategoryTone;/);
  assert.doesNotMatch(kitSource('index.ts'), /StatusPill/);
  assert.doesNotMatch(kitSource('StatusBadge.tsx'), /export function StatusPill/);
  assert.doesNotMatch(kitSource('ModalShell.tsx'), /ModalStatusPill/);
  assert.doesNotMatch(kitSource('StatusBadge.tsx'), /PersonnelAuthorisationStatus \| string/);
  // No kit file builds a status label from the category recipe.
  for (const file of readdirSync(join(process.cwd(), 'src/components')).filter((f) => /\.tsx?$/.test(f))) {
    assert.doesNotMatch(kitSource(file), /badgeClass\(\s*'(?:success|warning|danger)'/, file);
    assert.doesNotMatch(kitSource(file), /<Badge[^>]*tone="(?:success|warning|danger)"/, file);
  }
});

test('dialogs: four widths, md by default', () => {
  const source = kitSource('ModalShell.tsx');
  assert.match(source, /export type ModalSize = 'sm' \| 'md' \| 'lg' \| 'xl';/);
  for (const width of ['480px', '640px', '896px', 'min(1280px,96vw)']) assert.ok(source.includes(`sm:w-[${width}]`), width);
  assert.match(source, /size = 'md',/);
  for (const old of ["'2xl'", "'3xl'", "'4xl'", 'wide:', 'full:']) assert.ok(!source.includes(old), old);
  assert.match(source, /printable\?: boolean;/);
  assert.match(source, /\n\s+id\?: string;/);
});

const kitFiles = () => readdirSync(join(process.cwd(), 'src/components')).filter((f) => /\.tsx?$/.test(f));

test('kit index exports every component', () => {
  const index = kitSource('index.ts');
  for (const name of [
    'Checkbox', 'CheckboxGroup', 'Radio', 'RadioGroup', 'DatePicker', 'Tooltip', 'TooltipProvider', 'Spinner', 'LoadingState',
    'Skeleton', 'SkeletonText', 'SkeletonTableRows', 'ConfirmDialog', 'useConfirmDialog', 'StatusSelect', 'useFieldControl',
  ]) {
    assert.match(index, new RegExp(`\\b${name}\\b`), name);
  }
  // Internal building blocks of the choices stay inside the kit.
  for (const name of ['ChoiceGroupContext', 'ChoiceGroupFrame', 'ChoiceText']) assert.doesNotMatch(index, new RegExp(`\\b${name}\\b`), name);
});

test('choices: native inputs on the shared box, focus ring and target', () => {
  assert.ok(has(choiceBox, focusRing), 'choice box takes focusRing');
  assert.ok(has(choiceBox, 'appearance-none size-4 comfortable:size-5 forced-colors:appearance-auto'));
  assert.ok(has(choiceTarget, 'size-6 comfortable:size-8'), '24px target, 32px comfortable');
  assert.ok(has(choiceRoot('card'), 'has-checked:border-accent has-checked:bg-info-bg'));
  assert.ok(has(choiceRoot('card', { invalid: true }), 'border-danger'));
  assert.ok(!tokens(choiceRoot('card', { disabled: true })).includes('hover:bg-subtle'));
  const invalidBox = tokens(cn(choiceBox, choiceBoxInvalid));
  assert.ok(invalidBox.includes('border-danger') && !invalidBox.includes('border-line-strong'));
  for (const file of ['Checkbox.tsx', 'Radio.tsx']) {
    const source = kitSource(file);
    assert.match(source, /type="(?:checkbox|radio)"/, file);
    assert.doesNotMatch(source, /accent-brand/, file);
  }
  assert.match(kitSource('Checkbox.tsx'), /\.indeterminate = indeterminate/);
  assert.match(kitSource('Radio.tsx'), /role="radiogroup"/);
  // DataTable selects rows with the kit Checkbox, not a native accent-coloured box.
  assert.match(kitSource('DataTable.tsx'), /<Checkbox/);
  assert.doesNotMatch(kitSource('DataTable.tsx'), /type="checkbox"/);
});

test('date picker: moved into the kit, on the select frame, wired to Field', () => {
  // One name for the date field: the old alias is not exported.
  assert.doesNotMatch(kitSource('index.ts'), /DatePickerField/);
  assert.doesNotMatch(kitSource('DatePicker.tsx'), /export const DatePickerField/);
  // A button cannot carry aria-required, so the required state is spoken with the date.
  assert.match(kitSource('DatePicker.tsx'), /', required'/);
  const source = kitSource('DatePicker.tsx');
  assert.match(source, /selectSizes\[size\]/);
  assert.match(source, /fieldInvalid/);
  assert.match(source, /useFieldControl\(/);
  assert.match(kitSource('Combobox.tsx'), /useFieldControl\(/);
  assert.ok(has(fieldDark, 'focus:border-accent-soft focus:ring-2 focus:ring-accent-soft'));
});

test('floating surfaces: one family, radius xl panels, popover shadow', () => {
  assert.match(kitSource('Popover.tsx'), /rounded-xl/);
  assert.ok(has(menuPanel, 'rounded-xl shadow-popover border-line bg-surface'));
  assert.ok(tokens(menuItem()).includes('rounded-md'));
  assert.ok(has(tooltipPanel, 'shadow-popover border-line bg-surface'));
  assert.ok(has(tooltipPanel, motion.fast));
  assert.ok(has(listOption, 'min-h-control-sm data-[active=true]:bg-subtle'));
  // The highlighted row in a list or menu carries a 3:1 indicator, not only a ~1.1:1 fill.
  assert.ok(has(listOption, 'data-[active=true]:outline-2 data-[active=true]:-outline-offset-2 data-[active=true]:outline-accent'));
  assert.ok(has(commandOption, 'min-h-control-sm rounded-md data-[selected=true]:bg-subtle data-[selected=true]:outline-2 data-[selected=true]:outline-accent'));
  for (const item of [menuItem(), menuItem(true)]) {
    assert.ok(has(item, focusRingInset), item);
    // outline-none would set --tw-outline-style to none and cancel the focus outline.
    assert.ok(!tokens(item).includes('outline-none'), item);
  }
  assert.ok(!tokens(commandOption).includes('outline-none'));
  assert.match(kitSource('Command.tsx'), /commandOption/);
  // StatusSelect's panel inherits Popover's radius xl.
  assert.doesNotMatch(kitSource('StatusSelect.tsx'), /PopoverContent[^>]*rounded-lg/);
  assert.match(kitSource('Tooltip.tsx'), /@radix-ui\/react-tooltip/);
  assert.match(kitSource('Tooltip.tsx'), /tooltipPanel/);
});

test('tooltips: IconButton and RowMenu show their name through Tooltip, not title', () => {
  const button = kitSource('Button.tsx');
  assert.doesNotMatch(button, /title=\{/);
  assert.match(button, /<Tooltip content=\{tooltip === undefined \? label : tooltip\} asLabel/);
  assert.match(button, /Omit<NativeButton, 'title'>/);
  const rowMenu = kitSource('RowMenu.tsx');
  assert.doesNotMatch(rowMenu, /title=\{/);
  assert.match(rowMenu, /<Tooltip /);
  // No kit file sets a native title on a button.
  for (const file of kitFiles()) assert.doesNotMatch(kitSource(file), /<button[^>]*\stitle=/, file);
});

test('busy: Button loading, Spinner keeps turning, skeletons stop', () => {
  const button = kitSource('Button.tsx');
  assert.match(button, /loading\?: boolean;/);
  assert.match(button, /aria-busy=\{loading \|\| undefined\}/);
  assert.match(button, /<Spinner decorative/);
  // The ring is the only sign of progress: it keeps turning under reduced motion, and the
  // global rule exempts exactly that class.
  assert.match(kitSource('Spinner.tsx'), /animate-spin/);
  assert.match(globalsCss(), /\*:not\(\.animate-spin\)/);
  assert.ok(has(skeletonFill, 'bg-subtle-2 animate-pulse motion-reduce:animate-none'));
  // No kit file draws its own spinner from an icon.
  for (const file of kitFiles().filter((f) => f !== 'Spinner.tsx')) assert.doesNotMatch(kitSource(file), /\bLoader2\b|LoaderCircle/, file);
});

test('confirm dialog and status select', () => {
  const confirm = kitSource('ConfirmDialog.tsx');
  assert.match(confirm, /placement="center"/);
  assert.match(confirm, /size="sm"/);
  assert.match(confirm, /role="alertdialog"/);
  assert.match(confirm, /loading=\{working\}/);
  assert.match(kitSource('ModalShell.tsx'), /'aria-describedby'\?: string;/);
  const select = kitSource('StatusSelect.tsx');
  for (const part of ['useListbox(', 'statusBadgeClass(tone, width)', 'statusSelectTrigger', 'role="combobox"']) {
    assert.ok(select.includes(part), part);
  }
  // The listbox semantics come from the shared core (useListbox), as for Select.
  const core = kitSource('useListbox.ts');
  for (const part of ["role: 'listbox'", "role: 'option'", "'aria-activedescendant'", "'aria-selected'"]) {
    assert.ok(core.includes(part), part);
  }
  assert.ok(has(statusSelectTrigger, focusRing));
  // A hit area in every density: the 20px inline pill still reaches target-min (24px).
  assert.ok(has(statusSelectTrigger, 'after:absolute after:inset-x-0 after:-inset-y-0.5 comfortable:after:-inset-y-1.5'));
  // The disabled-button tooltip wrapper takes the shared ring.
  assert.ok(has(tooltipAnchor, focusRing));
  // The dark viewer's checkbox: accent-soft fill and focus, never the light focusRing.
  assert.ok(has(choiceBoxDark, 'checked:bg-accent-soft focus-visible:outline-accent-soft'));
  assert.ok(!has(choiceBoxDark, 'focus-visible:outline-accent'));
  assert.match(kitSource('Checkbox.tsx'), /choiceBoxDark/);
});

test('lint: ds/prefer-kit-components knows the replaced patterns', () => {
  const rule = readFileSync(join(process.cwd(), 'eslint/plugin.mjs'), 'utf8');
  for (const part of [
    "type === 'checkbox'",
    "type === 'radio'",
    "type === 'date'",
    "'@/components/common/DatePickerField'",
    "'@radix-ui/react-tooltip'",
    "callee === 'confirm'",
    "callee === 'statusSelectClass'",
    "attr(node, 'title')",
    'animate-spin',
    "tag === 'table'",
    'HAND_BUILT_CARD',
    'KIT_FILE_IMPORT',
  ]) {
    assert.ok(rule.includes(part), part);
  }
  // checkbox and radio are no longer free input types.
  assert.doesNotMatch(rule, /FREE_INPUT_TYPES = new Set\(\[[^\]]*'checkbox'/);
  assert.match(rule, /name === 'DatePickerField'/);
});

// ESM-only modules from a CommonJS-compiled test: a real dynamic import that tsc leaves alone.
const importEsm = new Function('specifier', 'return import(specifier)') as (specifier: string) => Promise<any>;

test('lint: class checks see bracketed, data and named-group variants', async () => {
  const { Linter } = await importEsm('eslint');
  const plugin = (await importEsm(pathToFileURL(join(process.cwd(), 'eslint/plugin.mjs')).href)).default;
  const linter = new Linter({ configType: 'flat' });
  const config = [
    {
      files: ['**/*.tsx'],
      plugins: { ds: plugin },
      languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
      rules: { 'ds/no-retired-classes': 'error', 'ds/no-off-system-classes': 'error' },
    },
  ];
  const messages = (cls: string) =>
    linter.verify(`const x = <div className="${cls}" />;`, config, { filename: 'probe.tsx' }).map((m: { ruleId: string | null }) => m.ruleId);
  for (const cls of ['data-[state=open]:duration-100', 'group-hover/row:duration-300', 'group-hover/row:text-faint', 'ease-linear', 'data-[state=open]:text-faint']) {
    assert.ok(messages(cls).includes('ds/no-retired-classes'), cls);
  }
  assert.ok(messages('data-[state=open]:bg-blue-500').includes('ds/no-off-system-classes'));
  for (const cls of ['data-[state=open]:duration-fast', 'hover:ease-standard', 'data-[active=true]:outline-accent']) {
    assert.deepEqual(messages(cls), [], cls);
  }
});

test('lint: screens use Table, Card and the kit index', async () => {
  const { Linter } = await importEsm('eslint');
  const plugin = (await importEsm(pathToFileURL(join(process.cwd(), 'eslint/plugin.mjs')).href)).default;
  const linter = new Linter({ configType: 'flat' });
  const config = [
    {
      files: ['**/*.tsx'],
      plugins: { ds: plugin },
      languageOptions: { parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module' } },
      rules: { 'ds/prefer-kit-components': 'error' },
    },
  ];
  const count = (code: string) => linter.verify(code, config, { filename: 'probe.tsx' }).length;
  assert.equal(count('const x = <table className="w-full" />;'), 1);
  assert.equal(count('const x = <table className="sr-only" />;'), 0);
  assert.equal(count('const x = <div className="p-4 rounded-xl border border-line bg-surface" />;'), 1);
  assert.equal(count('const x = <div className="p-4 rounded-xl border border-line bg-white" />;'), 1);
  assert.equal(count('const x = <div className="rounded-xl border border-line bg-surface shadow-popover" />;'), 0);
  assert.equal(count("import Badge from '@/components/ui/Badge';"), 1);
  assert.equal(count("import { pageShell } from '@/components/ui/styles';"), 0);
  assert.equal(count("import { Badge } from '@/components/ui';"), 0);
});

test('table and card: one frame each, screens hold no hand-written copy', () => {
  const table = kitSource('Table.tsx');
  assert.match(table, /frame = 'card'/);
  assert.match(table, /inset: 'rounded-lg border border-line overflow-x-auto'/);
  // A frameless table draws no scroller of its own, so a sticky header keeps its scroll parent.
  assert.match(table, /if \(frame === 'none'\) return body;/);
  const cardSource = kitSource('Card.tsx');
  assert.match(cardSource, /as\?: 'section' \| 'div' \| 'form'/);
});

test('status vocabulary: one sentence-case word and one tone per state', () => {
  // Readiness keeps its stored keys but shows sentence case.
  assert.deepEqual(Object.values(READINESS_LABEL), ['Compliant', 'Expiring soon', 'Non-compliant', 'Not configured']);
  for (const [status, entry] of Object.entries(READINESS_STATUS)) {
    assert.equal(entry.tone, READINESS_TONE[status as keyof typeof READINESS_TONE], status);
  }
  for (const loose of ['Non-compliant', 'Not compliant', 'NON_COMPLIANT', 'non compliant']) {
    assert.equal(normaliseReadinessStatus(loose), 'Non-Compliant', loose);
  }
  assert.equal(normaliseReadinessStatus('Expiring soon'), 'Expiring Soon');
  assert.equal(normaliseReadinessStatus('constructor'), undefined);
  assert.deepEqual(readinessStatus('Not compliant'), { label: 'Non-compliant', tone: 'danger' });
  assert.equal(AUTH_LABEL['Expiring Soon'], 'Expiring soon');

  // Compliance findings: the issue strings the app's compliance evaluation writes.
  for (const issue of ['Expired', 'Not completed', 'Missing', 'Revoked', 'Suspended', 'Lapsed'] as const) {
    assert.equal(FINDING_ISSUE_STATUS[issue].tone, 'danger', issue);
  }
  for (const issue of ['Pending verification', 'Scheduled, not yet completed', 'Expiring'] as const) {
    assert.equal(FINDING_ISSUE_STATUS[issue].tone, 'warning', issue);
  }
  assert.equal(FINDING_ISSUE_STATUS.Draft.tone, 'neutral');
  assert.equal(FINDING_ISSUE_STATUS.Expiring.label, 'Expiring soon');
  assert.equal(findingStatus('PENDING VERIFICATION').tone, 'warning');

  // Assessment outcomes: every final decision, and the record's capitals.
  for (const decision of FINAL_DECISION_OPTIONS) {
    assert.ok(ASSESSMENT_OUTCOME_STATUS[decision], decision);
  }
  assert.equal(outcomeStatus('Competent').tone, 'success');
  assert.equal(outcomeStatus('COMPETENT').tone, 'success');
  assert.equal(outcomeStatus('Competent with Limitations / Actions').tone, 'warning');
  assert.deepEqual(outcomeStatus('Deferred - Further Evidence Required'), { label: 'Deferred, further evidence required', tone: 'warning' });
  assert.equal(outcomeStatus('Deferred').tone, 'warning');
  assert.deepEqual(outcomeStatus('NOT COMPETENT'), { label: 'Not competent', tone: 'danger' });

  // Activity log: stored in capitals, shown in sentence case.
  assert.deepEqual(activityLogStatus('PENDING VERIFICATION'), { label: 'Pending verification', tone: 'warning' });
  assert.deepEqual(activityLogStatus('ACTION REQUIRED'), { label: 'Action required', tone: 'danger' });
  assert.equal(activityLogStatus('VERIFIED').tone, 'success');
  assert.equal(activityLogStatus('COMPLETED').label, 'Completed');
  assert.deepEqual(activityLogStatus('ON HOLD'), { label: 'On hold', tone: 'neutral' });

  // Unknown values are neutral, never a problem colour; no table hands out a prototype member.
  for (const lookup of [findingStatus, outcomeStatus, activityLogStatus, readinessStatus]) {
    assert.equal(lookup('Something new').tone, 'neutral');
    assert.equal(lookup(undefined).label, 'Unknown');
    assert.equal(lookup('toString').tone, 'neutral');
  }
  assert.equal(sentenceCase('EWIS refresher'), 'EWIS refresher');

  // Every label in every table is sentence case: no word after the first starts with a capital
  // unless it is an acronym, and nothing is all caps.
  for (const table of [READINESS_STATUS, FINDING_ISSUE_STATUS, ASSESSMENT_OUTCOME_STATUS, ACTIVITY_STATUS]) {
    for (const { label } of Object.values(table)) {
      assert.match(label, /^[A-Z][^A-Z]*$/, label);
    }
  }
  const badge = kitSource('StatusBadge.tsx');
  for (const kind of ["'finding'", "'outcome'", "'activity'"]) assert.ok(badge.includes(kind), kind);
});

test('readiness strip data and dates: the helpers that moved out of the app', () => {
  const groups: ReadinessGroup[] = [
    { key: 'd', label: 'Documents', cells: [{ key: 'a', code: 'A', name: 'A', state: 'valid' }, { key: 'b', code: 'B', name: 'B', state: 'due' }] },
    { key: 't', label: 'Training', cells: [{ key: 'c', code: 'C', name: 'C', state: 'missing' }, { key: 'n', code: 'N', name: 'N', state: 'na' }] },
  ];
  assert.deepEqual(countReadiness(groups), { total: 3, valid: 1, due: 1, missing: 1, pending: 0 });
  assert.equal(readinessSentence(groups), '1 of 3 valid, 1 due soon, 1 missing or expired');
  assert.equal(worstReadinessState(groups), 'missing');
  assert.equal(worstReadinessState([]), 'na');
  assert.equal(formatDate('2026-03-05'), '05-Mar-2026');
  assert.equal(formatDate(''), '—');
  assert.equal(toIsoDate('05-Mar-2026'), '2026-03-05');
  assert.equal(toIsoDate('31/02/2026'), '');
  // The kit takes these from the package, never from an app path.
  for (const file of readdirSync(join(process.cwd(), 'src'), { recursive: true }) as string[]) {
    if (!/\.tsx?$/.test(file)) continue;
    assert.doesNotMatch(readFileSync(join(process.cwd(), 'src', file), 'utf8'), /from '@\//, `${file} imports an app path`);
  }
});

test('table: the actions column pins to the right edge, opaque, with a hairline', () => {
  assert.ok(has(tablePinEnd, 'sticky right-0 before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-line'));
  assert.ok(has(tablePinEndTd, 'bg-surface [tr:hover>&]:bg-subtle z-[1]'));
  assert.ok(has(tablePinEndTh, 'bg-subtle z-20'));
  // cn keeps every part next to the cell padding.
  assert.ok(has(cn(tableTd, tablePinEndTd), tablePinEndTd));
  const table = kitSource('Table.tsx');
  assert.match(table, /pin\?: TablePin/);
  assert.match(table, /pin === 'end' && tablePinEndTh/);
  assert.match(table, /pin === 'end' && tablePinEndTd/);
  const dataTable = kitSource('DataTable.tsx');
  assert.match(dataTable, /pin\?: 'end';/);
  assert.match(dataTable, /data-selected=\{isSelected \|\| undefined\}/);
  assert.match(dataTable, /\[tr\[data-selected=true\]>&\]:bg-info-bg/);
});

test('page header, alert list and scroll region', () => {
  const index = kitSource('index.ts');
  for (const name of ['PageHeader', 'AlertList', 'AlertRow', 'findingStatus', 'outcomeStatus', 'activityLogStatus', 'READINESS_LABEL']) {
    assert.match(index, new RegExp(`\\b${name}\\b`), name);
  }
  const header = kitSource('PageHeader.tsx');
  assert.match(header, /className=\{pageTitle\}/);
  // The actions leave the title's row as one group: a wrapping row, a grown title block, a capped group.
  assert.match(header, /flex flex-wrap items-center justify-between/);
  assert.match(header, /flex-\[1_1_20rem\]/);
  assert.match(header, /flex max-w-full flex-wrap items-center gap-2/);
  // Alerts are white rows: colour on the icon only, no tinted fill and no coloured edge.
  const alerts = kitSource('AlertList.tsx');
  assert.doesNotMatch(alerts, /(?:bg|border|ring)-(?:danger|warning|info|success)(?:-bg|-line)?\b/);
  assert.match(alerts, /divide-y divide-line/);
  assert.match(alerts, /View all \(\{rows\.length\}\)/);
  assert.ok(has(scrollRegion, `overflow-y-auto border-y border-line ${focusRingInset}`));
});

test('lint: no text set in capitals, except a code Input', async () => {
  const { Linter } = await importEsm('eslint');
  const plugin = (await importEsm(pathToFileURL(join(process.cwd(), 'eslint/plugin.mjs')).href)).default;
  const linter = new Linter({ configType: 'flat' });
  const config = [
    {
      files: ['**/*.tsx'],
      plugins: { ds: plugin },
      languageOptions: { parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module' } },
      rules: { 'ds/prefer-kit-components': 'error' },
    },
  ];
  const count = (code: string) => linter.verify(code, config, { filename: 'probe.tsx' }).length;
  assert.equal(count('const x = <span className="text-11 font-semibold uppercase">Pending</span>;'), 1);
  assert.equal(count('const x = <h3 className="md:uppercase text-16">Title</h3>;'), 1);
  assert.equal(count('const x = <p className={`text-12 uppercase ${tone}`}>Status</p>;'), 1);
  assert.equal(count('const x = <Input className="uppercase tabular-nums" />;'), 0);
  assert.equal(count('const x = <span className="normal-case text-12">Ok</span>;'), 0);
});

test('forms: one grid whose rows start at the top', () => {
  const grid = kitSource('FormGrid.tsx');
  assert.match(grid, /grid items-start gap-x-4 gap-y-4/);
  assert.match(kitSource('index.ts'), /FormGrid, formSpan/);
  assert.match(kitSource('styles.ts'), /choiceRowInForm = 'flex flex-wrap items-center gap-x-4 gap-y-1 min-h-control-lg'/);
});

test('tokens: amber has a fill of its own, and read-only is not disabled', () => {
  const css = readFileSync(join(process.cwd(), 'theme.css'), 'utf8');
  assert.match(css, /--color-warning-fill: #c27803;/);
  // Solid amber marks use the fill, never the text colour.
  assert.match(kitSource('ReadinessStrip.tsx'), /due: 'bg-warning-fill'/);
  const styles = kitSource('styles.ts');
  assert.match(styles, /fieldReadOnly = '\[&\[readonly\]\]:bg-subtle \[&\[readonly\]\]:text-ink-2/);
  assert.match(styles, /\$\{fieldReadOnly\} disabled:bg-subtle disabled:text-disabled/);
});

test('dialogs: a click outside closes, except a confirmation', () => {
  const shell = kitSource('ModalShell.tsx');
  assert.match(shell, /const dismissable = closeOnBackdrop \?\? role !== 'alertdialog';/);
  assert.match(shell, /\(onBackdropClose \?\? onClose\)\(\)/);
  // Only a press that starts on the backdrop itself counts.
  assert.match(shell, /e\.target === e\.currentTarget/);
});

test('buttons: dark viewer variants, toggles and the link tones', () => {
  // Dark buttons draw the accent-soft ring, never the light one, and no viewer class leaks into the light recipe.
  for (const variant of ['primary', 'secondary', 'ghost', 'danger', 'danger-ghost'] as const) {
    const dark = styles.buttonClass(variant, 'md', true);
    assert.ok(has(dark, styles.focusRingDark), variant);
    assert.ok(!tokens(dark).includes('focus-visible:outline-accent'), variant);
    assert.ok(tokens(dark).includes('h-control-md'), variant);
    assert.doesNotMatch(buttonClass(variant), /viewer/, variant);
  }
  assert.ok(has(styles.buttonClass('primary', 'md', true), 'bg-viewer-primary'));
  for (const recipe of Object.values(styles.iconButtonDark)) {
    assert.ok(has(recipe, `size-control-sm ${styles.focusRingDark}`), recipe);
  }
  assert.ok(has(styles.tooltipAnchorDark, styles.focusRingDark));
  // A button with aria-pressed is a toggle: secondary, ghost and icon buttons show it.
  assert.ok(has(buttonClass('secondary'), 'aria-pressed:border-accent aria-pressed:bg-info-bg'));
  assert.ok(has(buttonClass('ghost'), 'aria-pressed:bg-subtle-2'));
  assert.ok(has(btn.icon, 'aria-pressed:bg-subtle-2') && has(iconButtonOutline, 'aria-pressed:border-accent'));
  // LinkButton: ink tone for names that open their record, a 13px size for table rows, the 24px target in every tone.
  assert.ok(has(linkButton('lg', 'ink'), 'text-13 comfortable:text-15 text-ink hover:text-accent hover:underline min-h-6'));
  assert.ok(has(linkButton('md', 'accent', true), `text-accent-soft ${styles.focusRingDark}`));
  const button = kitSource('Button.tsx');
  assert.match(button, /dark\?: boolean;/);
  assert.match(button, /truncate\?: boolean;/);
  // The badge is spoken in the IconButton's name and hidden from the tree as a glyph.
  assert.match(button, /aria-label=\{count \? `\$\{label\}, \$\{count\.spoken\}` : label\}/);
  assert.ok(has(styles.iconButtonCount, 'absolute -right-1 -top-1 bg-danger text-on-solid ring-2 ring-surface text-10'));
});

test('navigation, chips and readiness cells: kit sizes, targets and names', () => {
  // Nav rows sit on the md control height with 13px text; the current page is subtle-2, medium.
  assert.ok(has(styles.navItem(true), `h-control-md text-13 comfortable:text-15 bg-subtle-2 text-ink font-medium ${focusRing}`));
  assert.ok(has(styles.navItem(false), 'text-ink-2 hover:bg-subtle'));
  const nav = kitSource('NavItem.tsx');
  assert.match(nav, /aria-current=\{active \? 'page' : undefined\}/);
  assert.match(nav, /<Badge>/);
  assert.match(nav, /countAlert/);
  assert.ok(has(styles.countAlert, 'rounded-full bg-danger-bg text-danger ring-danger-line'));
  // Chips: category tones only, a 24px remove target (32px comfortable) with the shared ring.
  assert.ok(has(styles.chipClass('neutral'), 'min-h-6 rounded-md text-12'));
  assert.ok(has(styles.chipRemove('brand'), `after:size-6 comfortable:after:size-8 ${focusRing} hover:bg-on-solid/20`));
  assert.match(kitSource('Chip.tsx'), /tone\?: CategoryTone;/);
  assert.match(kitSource('StatusBadge.tsx'), /<ChipRemoveButton/);
  // The clickable readiness cell is target-min with a required name.
  const strip = kitSource('ReadinessStrip.tsx');
  assert.match(strip, /export function ReadinessCellButton/);
  assert.match(strip, /'size-6 shrink-0/);
  assert.match(strip, /label: string;/);
  // An interactive card is one button: hover edge, accent when pressed, never a faded ring.
  const cardSource = kitSource('Card.tsx');
  assert.match(cardSource, /aria-pressed=\{pressed\}/);
  assert.match(cardSource, /aria-pressed:border-accent aria-pressed:ring-1 aria-pressed:ring-accent/);
  assert.match(cardSource, /hover:border-line-strong/);
});

test('menus: one keyboard for RowMenu and screen menus', () => {
  const menu = kitSource('Menu.tsx');
  for (const key of ["'ArrowDown'", "'ArrowUp'", "'Home'", "'End'", "'Escape'", "'Tab'"]) assert.ok(menu.includes(key), key);
  assert.match(menu, /role="menu"/);
  assert.match(menu, /role="menuitem"/);
  assert.match(menu, /menuItem\(danger, description !== undefined\)/);
  // A row with a description sets its own height: it must not also carry the fixed row height.
  assert.ok(has(menuItem(false, true), 'items-start min-h-control-sm py-2'));
  assert.ok(!menuItem(false, true).split(' ').includes('h-control-sm'));
  // RowMenu draws its list with MenuList and MenuItem and keeps no key handling of its own.
  const rowMenu = kitSource('RowMenu.tsx');
  assert.match(rowMenu, /<MenuList/);
  assert.match(rowMenu, /<MenuItem/);
  assert.doesNotMatch(rowMenu, /'ArrowUp'|'Home'/);
  assert.match(rowMenu, /trigger\?: React\.ReactElement/);
});

test('search, pagination and toasts', () => {
  const search = kitSource('SearchInput.tsx');
  assert.match(search, /type="search"/);
  assert.match(search, /<IconButton/);
  assert.match(search, /inputRef\.current\?\.focus\(\)/);
  assert.match(search, /size = 'md'/);
  // Pagination: first, last, the current page and its neighbours; seven slots at most.
  assert.deepEqual(pageWindow(1, 5), [1, 2, 3, 4, 5]);
  assert.deepEqual(pageWindow(1, 10), [1, 2, 3, 4, 5, 'gap', 10]);
  assert.deepEqual(pageWindow(5, 10), [1, 'gap', 4, 5, 6, 'gap', 10]);
  assert.deepEqual(pageWindow(10, 10), [1, 'gap', 6, 7, 8, 9, 10]);
  const pagination = kitSource('Pagination.tsx');
  assert.match(pagination, /aria-current=\{p === current \? 'page' : undefined\}/);
  assert.match(pagination, /pageCount > 1 &&/);
  assert.match(pagination, /size="sm"/);
  // Toasts: the popover surface above dialogs and under menus and tooltips; live regions that stay mounted.
  assert.ok(has(styles.toastPanel, 'rounded-xl border border-line bg-surface shadow-popover'));
  assert.ok(has(styles.toastPanel, motion.fast));
  assert.ok(tokens(styles.toastViewport).includes('z-[90]'));
  const toast = kitSource('Toast.tsx');
  assert.match(toast, /role="alert"/);
  assert.match(toast, /role="status"/);
  assert.match(toast, /TOAST_DURATION_MS = 5000/);
  assert.match(toast, /tone === 'danger' \|\| tone === 'warning'/);
  assert.match(toast, /data-modal-portal=""/);
  assert.match(toast, /onMouseEnter=\{\(\) => setPaused\(true\)\}/);
  assert.match(readFileSync(join(process.cwd(), 'src/components/README.md'), 'utf8'), /Toast 90/);
});

test('kit index exports the button family', () => {
  const index = kitSource('index.ts');
  for (const name of [
    'NavItem', 'NavList', 'NavBrand', 'MenuList', 'MenuItem', 'MenuSeparator', 'Chip', 'SearchInput', 'Pagination',
    'ToastProvider', 'useToast', 'ReadinessCellButton',
  ]) {
    assert.match(index, new RegExp(`\\b${name}\\b`), name);
  }
  // The remove button is internal: screens pass onRemove.
  assert.doesNotMatch(index, /ChipRemoveButton/);
});

test('lint: a raw <button> in a screen names the kit component', async () => {
  const { Linter } = await importEsm('eslint');
  const plugin = (await importEsm(pathToFileURL(join(process.cwd(), 'eslint/plugin.mjs')).href)).default;
  const linter = new Linter({ configType: 'flat' });
  const run = (code: string, options?: Record<string, unknown>) =>
    linter.verify(
      code,
      [
        {
          files: ['**/*.tsx'],
          plugins: { ds: plugin },
          languageOptions: { parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module' } },
          rules: { 'ds/prefer-kit-components': options ? ['error', options] : 'error' },
        },
      ],
      { filename: 'probe.tsx' },
    ) as Array<{ message: string }>;
  const message = (code: string) => run(code).map((m) => m.message).join('\n');
  assert.match(message('const x = <button onClick={go}>Save</button>;'), /Hand-built <button>\. Use <Button>/);
  assert.match(message('const x = <button aria-current="page">Dashboard</button>;'), /<NavItem active>/);
  assert.match(message('const x = <button aria-label="Close"><X /></button>;'), /<IconButton icon label>/);
  assert.match(message('const x = <button className="text-ink hover:underline">Ana</button>;'), /<LinkButton>/);
  assert.match(message('const x = <button aria-pressed={on} className={card}>A</button>;'), /<Card onClick pressed>/);
  assert.match(message('const x = <button className="text-viewer-muted">Zoom</button>;'), /`dark`/);
  // Every message lists the whole family.
  assert.match(message('const x = <button>Go</button>;'), /NavItem, MenuItem, Chip, ToggleChip, Card onClick/);
  // Kit components are fine; the error boundaries' option lets their one raw button through.
  assert.equal(run('const x = <Button onClick={go}>Save</Button>;').length, 0);
  assert.equal(run('const x = <button onClick={reset}>Try again</button>;', { allowRawButton: true }).length, 0);
  // The shareable config passes the option for the files an app names.
  const { designSystem } = await importEsm(pathToFileURL(join(process.cwd(), 'eslint/index.mjs')).href);
  const configs = designSystem({ rawButtonFiles: ['app/error.tsx', 'app/global-error.tsx'], kitImport: '@/components/ui' });
  const raw = configs.find((c: { files?: string[] }) => c.files?.includes('app/error.tsx'));
  assert.deepEqual(raw.rules['ds/prefer-kit-components'], ['error', { kitImport: '@/components/ui', allowRawButton: true }]);
});

test('select: options parsed from native children as the browser reads them', () => {
  const h = React.createElement;
  const flag = false;
  const parsed = parseSelectOptions([
    h('option', { key: 'p', value: '' }, 'Select a position'),
    h(React.Fragment, { key: 'f' }, h('option', { value: 'a' }, 'Line ', 'maintenance'), flag && h('option', { value: 'x' }, 'Never')),
    null,
    undefined,
    [h('option', { key: 'n', value: 7 }, 'Seven'), h('option', { key: 'd', value: 'd', disabled: true }, 'Stores (inactive)')],
    h('option', { key: 't' }, '  Text   as\n value '),
    h('option', { key: 'l', value: 'l', label: 'From label' }, 'Ignored text'),
    h('optgroup', { key: 'g1', label: 'CAMO' }, h('option', { value: 'c1' }, '[C1] ', h('b', null, 'Review'))),
    h('optgroup', { key: 'g2', label: 'Closed', disabled: true }, h('option', { value: 'z' }, 'Zulu')),
    h('option', { key: 'h', value: 'h', hidden: true }, 'Hidden'),
    h('div', { key: 'junk' }, 'Not an option'),
  ]);
  assert.deepEqual(
    parsed.options.map((o) => [o.value, o.label, o.disabled, o.group]),
    [
      ['', 'Select a position', false, -1],
      ['a', 'Line maintenance', false, -1],
      ['7', 'Seven', false, -1],
      ['d', 'Stores (inactive)', true, -1],
      ['Text as value', 'Text as value', false, -1],
      ['l', 'From label', false, -1],
      ['c1', '[C1] Review', false, 0],
      ['z', 'Zulu', true, 1],
      ['h', 'Hidden', false, -1],
    ],
  );
  assert.deepEqual(parsed.groups, [{ label: 'CAMO', disabled: false }, { label: 'Closed', disabled: true }]);
  assert.equal(parsed.options[8].hidden, true);
  assert.deepEqual(parsed.options.map((o) => o.index), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal(textOf([1, ' ', h('span', null, 'two'), false]), '1 two');
  assert.deepEqual(parseSelectOptions(null), { options: [], groups: [] });

  // What a single select shows: the matching option, else the first that is not disabled (as React does).
  const opts = parseSelectOptions([
    h('option', { key: 0, value: '', disabled: true }, 'Select a position'),
    h('option', { key: 1, value: 'a' }, 'A'),
    h('option', { key: 2, value: 'b' }, 'B'),
  ]).options;
  assert.equal(selectedOptionIndex(opts, 'b'), 2);
  assert.equal(selectedOptionIndex(opts, ''), 0);
  assert.equal(selectedOptionIndex(opts, 'missing'), 1);
  assert.equal(selectedOptionIndex(opts, undefined), 1);
  assert.equal(selectedOptionIndex([], 'a'), -1);
});

test('listbox core: moves past disabled options and matches typed letters', () => {
  const items = [{ label: 'Base' }, { label: 'CAMO', disabled: true }, { label: 'Cabin' }, { label: 'Line' }, { label: 'Logistics' }];
  assert.equal(firstEnabled(items), 0);
  assert.equal(lastEnabled(items), 4);
  assert.equal(nextEnabled(items, 0, 1), 2, 'skips the disabled option');
  assert.equal(nextEnabled(items, 4, 1), 4, 'no wrap at the end');
  assert.equal(nextEnabled(items, 0, 5), 4, 'page step clamps to the last');
  assert.equal(matchTypeahead(items, 'c', -1), 2, 'disabled options are not matched');
  assert.equal(matchTypeahead(items, 'l', 3), 4, 'a repeated letter cycles from after the current one');
  assert.equal(matchTypeahead(items, 'll', 4), 3, 'and wraps');
  assert.equal(matchTypeahead(items, 'lo', 0), 4, 'several letters match the start of the text');
  assert.equal(matchTypeahead(items, 'x', 0), -1);
});

test('select: a styled listbox over a hidden native select', () => {
  const source = kitSource('Select.tsx');
  assert.match(source, /useListbox\(/);
  assert.match(source, /useFieldControl\(/);
  assert.match(source, /aria-hidden="true"\s+tabIndex=\{-1\}\s+className=\{nativeSelectHidden\}/);
  assert.match(source, /dispatchEvent\(new Event\('change', \{ bubbles: true \}\)\)/);
  assert.match(source, /role="combobox"/);
  assert.ok(has(nativeSelectHidden, 'sr-only appearance-none'));
  assert.ok(has(selectTrigger('lg'), `${selectSizes.lg} pr-9 ${fieldOpen}`));
  assert.ok(has(selectFilterTrigger, selectFilterBox));
  // At least as wide as the trigger, never taller than the room on its side.
  assert.ok(has(listboxPanel, 'min-w-(--radix-popover-trigger-width) max-h-(--radix-popover-content-available-height)'));
  // The kit Select and FilterSelect come from Select.tsx; screens still import them from the index.
  assert.match(kitSource('index.ts'), /export \{ Select, FilterSelect \} from '\.\/components\/Select\.js';/);
});

/* ------------------------------------------------------------------ themes */

/** The colour values of one theme, read from app/globals.css: light is @theme, dark is light overridden by the dark block. */
function themePalette(theme: 'light' | 'dark' | 'pin'): Map<string, string> {
  const css = globalsCss();
  const block = (start: string) => {
    const i = css.indexOf(start);
    assert.ok(i >= 0, `globals.css has ${start}`);
    return css.slice(i, css.indexOf('}', i));
  };
  const read = (text: string, into: Map<string, string>) => {
    for (const m of text.matchAll(/--(color-[a-z0-9-]+|elevation-[a-z]+):\s*([^;]+);/g)) if (m[2].trim() !== 'initial') into.set(m[1], m[2].trim());
    return into;
  };
  const light = read(block('@theme {'), new Map());
  read(block(':root {'), light);
  if (theme === 'light') return light;
  if (theme === 'pin') return read(block('[data-theme="light"] {'), new Map());
  return read(block(':root[data-theme="dark"] {'), new Map(light));
}

function resolveColour(palette: Map<string, string>, name: string): string {
  let value = palette.get(name);
  for (let i = 0; value && i < 5; i++) {
    const alias = /^var\(--([a-z0-9-]+)\)$/.exec(value);
    if (!alias) break;
    value = palette.get(alias[1]);
  }
  assert.ok(value && /^#[0-9a-f]{6}$/i.test(value), `${name} resolves to a hex colour (got ${value})`);
  return value!;
}

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

for (const theme of ['light', 'dark'] as const) {
  test(`contrast (${theme}): text, control edges, status, solid fills and focus`, () => {
    const p = themePalette(theme);
    const c = (name: string) => resolveColour(p, `color-${name}`);
    const atLeast = (fg: string, bg: string, min: number) => {
      const ratio = contrast(c(fg), c(bg));
      assert.ok(ratio >= min, `${theme}: ${fg} on ${bg} is ${ratio.toFixed(2)}:1, needs ${min}:1`);
    };
    const surfaces = ['surface', 'canvas', 'subtle', 'subtle-2'];
    // Text: 4.5:1 on every surface it sits on.
    for (const bg of surfaces) for (const fg of ['ink', 'ink-2', 'muted', 'accent', 'danger', 'success', 'warning', 'violet']) atLeast(fg, bg, 4.5);
    // Control edges: 3:1 on the fills that hold bordered controls.
    for (const bg of ['surface', 'canvas', 'success-bg', 'warning-bg']) atLeast('line-strong', bg, 3);
    // Status text on its own fill, and the info text on info-bg.
    for (const tone of ['success', 'warning', 'danger']) atLeast(tone, `${tone}-bg`, 4.5);
    atLeast('info', 'info-bg', 4.5);
    atLeast('ink', 'info-bg', 4.5);
    // Text on solid fills (buttons and their hover, selected chips, avatars, count discs).
    for (const fill of ['brand', 'brand-2', 'accent', 'danger', 'danger-2', 'success']) atLeast('on-solid', fill, 4.5);
    // An icon on the amber fill (a profile's status dot) is a graphic: 3:1.
    atLeast('on-solid', 'warning-fill', 3);
    // Solid marks (readiness cells, bars) against the surfaces they sit on.
    for (const mark of ['success', 'warning-fill', 'danger', 'brand']) for (const bg of ['surface', 'subtle-2']) atLeast(mark, bg, 3);
    // Due is told from valid and missing by lightness, not hue alone (missing is also hatched).
    for (const other of ['success', 'danger']) {
      const ratio = contrast(c('warning-fill'), c(other));
      assert.ok(ratio >= 1.6, `${theme}: warning-fill and ${other} are ${ratio.toFixed(2)}:1 apart in lightness, need 1.6`);
    }
    // Focus: focusRing, focusRingInset and fieldOpen draw accent; 3:1 on every surface and on info-bg (pressed toggles).
    for (const bg of [...surfaces, 'info-bg']) atLeast('accent', bg, 3);
  });
}

test('themes: dark overrides every flipping colour, the light pin repeats light exactly', () => {
  const light = themePalette('light');
  const dark = themePalette('dark');
  const pin = themePalette('pin');
  // Every light colour that is not fixed (white, black, the viewer family, accent-soft) has a dark value.
  const fixed = /^color-(white|black|viewer.*|.*-on-dark|accent-soft|info|subtle)$/;
  const css = globalsCss();
  const darkBlock = css.slice(css.indexOf(':root[data-theme="dark"] {'), css.indexOf('}', css.indexOf(':root[data-theme="dark"] {')));
  for (const name of light.keys()) {
    if (!name.startsWith('color-') || fixed.test(name)) continue;
    assert.match(darkBlock, new RegExp(`--${name}:`), `${name} has a dark value`);
  }
  assert.match(darkBlock, /color-scheme:\s*dark/);
  for (const name of ['elevation-xs', 'elevation-popover', 'elevation-modal']) assert.match(darkBlock, new RegExp(`--${name}:`));
  // The pin (data-theme="light") holds exactly the light values of every flipping token.
  for (const [name, value] of dark) {
    if (light.get(name) === value && !/^color-(subtle|info)$/.test(name)) continue;
    assert.equal(pin.get(name), light.get(name), `light pin: ${name}`);
  }
  // Print is light: the dark block only applies on screen.
  assert.match(css, /@media screen\s*\{\s*:root\[data-theme="dark"\] \{/);
  // Shadows read the elevation variables, so they can change with the theme.
  for (const s of ['xs', 'popover', 'modal']) assert.match(css, new RegExp(`--shadow-${s}:\\s*var\\(--elevation-${s}\\);`));
  // `dark:` follows the switch, not the operating system.
  assert.match(css, /@custom-variant dark \{/);
  assert.doesNotMatch(css, /prefers-color-scheme/);
});

test('themes: the switch follows the density pattern, with no flash on load', () => {
  const theme = readFileSync(join(process.cwd(), 'src/lib/theme.tsx'), 'utf8');
  assert.match(theme, /`\$\{storageKey\}_\$\{uid\}`/);
  assert.match(theme, /root\.dataset\.theme = 'dark'/);
  assert.doesNotMatch(theme, /matchMedia/, 'the theme never follows the operating system');
  // AeroMetric-Control passes its old prefix and gets exactly the script it inlined before.
  assert.equal(
    getThemeInitScript('aerometric_theme_v1'),
    `try{if(localStorage.getItem("aerometric_theme_v1_last")==='dark')document.documentElement.dataset.theme='dark'}catch(e){}`,
  );
  assert.match(getThemeInitScript(), /"aero_theme_v1_last"/);
  const density = readFileSync(join(process.cwd(), 'src/lib/density.tsx'), 'utf8');
  assert.match(density, /`\$\{storageKey\}_\$\{uid \?\? 'anonymous'\}`/);
  // The script is called from a server component (a root layout): its module is not client code.
  assert.doesNotMatch(readFileSync(join(process.cwd(), 'src/lib/themeScript.ts'), 'utf8'), /^['"]use client['"]/);
});

test('lint: white and black only in print: variants, viewer recipes and allowed files', async () => {
  const { Linter } = await importEsm('eslint');
  const plugin = (await importEsm(pathToFileURL(join(process.cwd(), 'eslint/plugin.mjs')).href)).default;
  const linter = new Linter({ configType: 'flat' });
  const config = (options: Record<string, unknown> = {}) => [
    {
      files: ['**/*.tsx'],
      plugins: { ds: plugin },
      languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
      rules: { 'ds/no-off-system-classes': ['error', options] },
    },
  ];
  const messages = (cls: string, options?: Record<string, unknown>) =>
    linter.verify(`const x = <div className="${cls}" />;`, config(options), { filename: 'probe.tsx' }).map((m: { message: string }) => m.message);
  for (const cls of ['bg-white', 'hover:bg-white', 'text-white', 'ring-2 ring-white', 'border-white/20', 'bg-black', 'text-black', 'divide-black/30', 'data-[state=open]:bg-white']) {
    assert.equal(messages(cls).length, cls.split(' ').filter((c) => /white|black/.test(c)).length, cls);
  }
  assert.match(messages('bg-white')[0], /bg-surface/);
  assert.match(messages('text-white')[0], /text-on-solid/);
  assert.match(messages('border-black')[0], /line-strong/);
  for (const cls of ['bg-surface text-on-solid', 'print:bg-white', 'print:border-black', 'bg-viewer text-white', 'text-viewer-muted hover:text-white', 'text-accent-soft hover:text-white', 'whitespace-nowrap']) {
    assert.deepEqual(messages(cls), [], cls);
  }
  assert.deepEqual(messages('bg-white border-black', { allowWhiteBlack: true }), []);
  // The old backdrop is a faded ink; the scrim token replaces it.
  assert.equal(messages('bg-ink/40').length, 1);
});

test('surfaces: the kit draws panels on surface and solid-fill text in on-solid', () => {
  for (const recipe of [styles.card, styles.menuPanel, styles.tooltipPanel, styles.toastPanel, styles.statTile, styles.selectFilterBox, styles.inputClass, styles.selectClass, styles.iconButtonOutline, styles.choiceBox]) {
    assert.ok(tokens(recipe).includes('bg-surface'), recipe);
  }
  assert.ok(has(buttonClass('primary'), 'bg-brand text-on-solid'));
  assert.ok(has(buttonClass('danger'), 'bg-danger text-on-solid'));
  // The viewer's buttons use fixed colours, so they look the same in both themes.
  assert.ok(has(buttonClass('primary', 'md', true), 'bg-viewer-primary text-white hover:bg-viewer-primary-hover'));
  assert.ok(has(buttonClass('danger', 'md', true), 'bg-viewer-danger text-white hover:bg-viewer-danger-hover'));
  assert.ok(has(styles.segmentedItem(true), 'bg-brand text-on-solid'));
  assert.ok(has(styles.iconButtonCount, 'text-on-solid ring-surface'));
  assert.match(kitSource('ModalShell.tsx'), /bg-scrim/);
  // No kit file paints white or black outside print: and the viewer recipes.
  for (const file of kitFiles()) {
    const src = kitSource(file);
    for (const m of src.matchAll(/(?<![\w-])((?:[\w-]+:)*)(?:bg|text|border|ring|divide|fill|stroke)-(?:white|black)\b/g)) {
      const line = src.slice(src.lastIndexOf('\n', m.index) + 1, src.indexOf('\n', m.index));
      const ok = /print:/.test(m[1]) || /viewer|accent-soft|-on-dark/.test(line) || /eslint-disable-next-line ds\/no-off-system-classes/.test(src.slice(src.lastIndexOf('\n', src.lastIndexOf('\n', m.index) - 1), m.index));
      assert.ok(ok, `${file}: ${m[0]}`);
    }
  }
});
