/*
 * Design-system lint rules (aero-design-system/eslint). They keep screens on the tokens in
 * theme.css and the kit, so the drift found in the design audit cannot come back.
 *
 * Messages name the module screens import the kit from: `kitImport` (an option of
 * ds/prefer-kit-components, default 'aero-design-system'; an app that re-exports the kit from
 * its own index, like AeroMetric-Control's '@/components/ui', passes that).
 *
 *   ds/no-off-system-classes   class strings may only use the system's colours, sizes,
 *                              weights and shadows; no white or black, which cannot follow
 *                              the theme (surface and on-solid can), outside print: and the viewer
 *   ds/prefer-kit-components   screens build controls, buttons, choices, dates, tooltips, busy
 *                              states, confirmations, tables, tabs and status labels from the kit
 *                              (status labels need the kit for their symbol), and set no text
 *                              in capitals (`uppercase`, except on a code Input)
 *   ds/no-retired-classes      classes for tokens that were retired: the `faint` grey (merged
 *                              into muted), raw or arbitrary durations and easings (the
 *                              motion tokens replace them)
 *
 * Silence a line only with a reason: `// eslint-disable-next-line ds/<rule> -- why`.
 */

const PALETTE =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
/**
 * Optional variant prefixes, kept in the reported class: plain (hover:, md:, print:,
 * group-hover:), arbitrary and data/aria (data-[state=open]:, [&>svg]:, supports-[display:grid]:),
 * named groups and peers (group-hover/row:, group-data-[state=open]/row:), container (@md:) and *:.
 */
const VARIANTS = '(?:(?:[@*a-z0-9-]*\\[[^\\]\\s]*\\]|[@*a-z0-9-]+)(?:\\/[a-z0-9-]+)?:)*';
const COLOR_UTIL = 'bg|text|border|border-[trblxy]|ring|ring-offset|outline|divide|from|via|to|fill|stroke|decoration|placeholder|caret|accent|shadow';

/** Colours that may carry an opacity modifier: overlays on dark or navy surfaces. */
const ALPHA_FREE = new Set(['white', 'black', 'current', 'transparent']);

/*
 * White and black do not change with the theme, so a panel or a label written with them stays
 * white (or black) in the dark theme. Use the role tokens instead: `surface` for a panel,
 * control or popover fill (and the edge that must match it), `on-solid` for text and icons on a
 * solid brand, accent, danger or success fill. White and black remain for:
 *   - print: variants (paper is always white),
 *   - a class string that draws the always-dark document viewer: it also uses a viewer-*,
 *     accent-soft or *-on-dark token (the dark Button, LinkButton, IconButton and field recipes),
 *   - files with `allowWhiteBlack` (the viewer itself and the paper-form replicas).
 */
const WHITE_BLACK_RE = new RegExp(`(?:^|[\\s"'\`])(${VARIANTS})!?(${COLOR_UTIL})-(white|black)(?:\\/\\d+)?(?=$|[\\s"'\`])`, 'g');
const VIEWER_TOKEN_RE = new RegExp(`(?:^|[\\s"'\`])${VARIANTS}!?(?:${COLOR_UTIL})-(?:viewer(?:-[a-z]+)*|accent-soft|[a-z]+-on-dark)(?:\\/\\d+)?(?=$|[\\s"'\`])`);
const TEXT_UTILS = new Set(['text', 'fill', 'stroke', 'placeholder', 'decoration', 'caret']);

function whiteBlackMessage(cls, util, colour) {
  if (colour === 'black') {
    return `"${cls}" is black, which does not change with the theme. Use ink for text, line-strong or line for rules; black is for paper-form replicas and print: rules only.`;
  }
  const use = TEXT_UTILS.has(util)
    ? `text-on-solid for text or an icon on a solid brand, accent, danger or success fill (or text-ink on a surface)`
    : `${util}-surface for a panel, card, popover or control fill (and an edge that must match it)`;
  return `"${cls}" is white, which stays white in the dark theme. Use ${use}. White is for print: variants and the always-dark document viewer only.`;
}

const CHECKS = [
  {
    re: new RegExp(`(?:^|[\\s"'\`])${VARIANTS}!?(?:${COLOR_UTIL})-(?:${PALETTE})-\\d{2,3}(?:\\/\\d+)?(?=$|[\\s"'\`])`, 'g'),
    msg: (m) => `"${m}" is Tailwind's default palette, which the theme removes. Use a token (ink, ink-2, muted, subtle, line, success, warning, danger, info, brand…).`,
  },
  {
    re: /-\[(?:#|rgba?\(|hsla?\(|color:)[^\]]*\]/g,
    msg: (m) => `Arbitrary colour "${m}". Use a colour token from the theme (aero-design-system/theme.css).`,
  },
  {
    re: new RegExp(`(?:^|[\\s"'\`])${VARIANTS}!?text-\\[\\d[^\\]]*\\]`, 'g'),
    msg: (m) => `Arbitrary font size "${m.trim()}". Use the type scale: text-10, 11, 12, 13, 14, 16, 18, 22, 32.`,
  },
  {
    re: new RegExp(
      `(?:^|[\\s"'\`])${VARIANTS}!?(?:font-(?:thin|extralight|light|bold|extrabold|black)|text-(?:xs|sm|base|lg|xl|[2-9]xl)|tracking-(?:tighter|normal|wide|widest))(?=$|[\\s"'\`])`,
      'g',
    ),
    msg: (m) => `"${m.trim()}" does not exist here (@theme resets it) and renders nothing. Weights: font-normal, font-medium, font-semibold. Sizes: text-10…text-32.`,
  },
  {
    re: new RegExp(`(?:^|[\\s"'\`])${VARIANTS}!?(?:shadow-(?:sm|md|lg|xl|2xl|inner)|shadow-\\[[^\\]]*\\]|shadow)(?=$|[\\s"'\`])`, 'g'),
    msg: (m) => `"${m.trim()}" is outside the elevation set. Use shadow-xs (cards, controls), shadow-popover (menus), shadow-modal (dialogs) or shadow-none.`,
  },
];

/*
 * The spacing scale: padding, margin, gap and space-between use these steps only
 * (Tailwind's 4px unit): 0, px, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24
 * = 0, 1, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px. No other step (3.5, 7, 9…)
 * and no arbitrary length. The kit may add steps for its own geometry (`extraSpacingSteps`:
 * 7 and 9, the insets that clear an icon inside a field). Print-form replicas are exempt
 * (allowPrintSizes).
 */
const SPACING_STEPS = new Set(['0', 'px', '0.5', '1', '1.5', '2', '2.5', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24']);
const SPACING_RE = new RegExp(
  `(?:^|[\\s"'\`])${VARIANTS}!?-?(?:p[xytrblse]?|m[xytrblse]?|gap(?:-[xy])?|space-[xy])-(\\[[^\\]\\s]*\\]|\\d+(?:\\.\\d+)?|px)(?=$|[\\s"'\`])`,
  'g',
);

const ALPHA_RE = new RegExp(`(?:^|[\\s"'\`])${VARIANTS}!?(?:${COLOR_UTIL})-([a-z][a-z0-9-]*)\\/(\\d+)(?=$|[\\s"'\`])`, 'g');

function checkClassText(context, node, text, allowAlpha, allowPrintSizes, extraSpacing, allowWhiteBlack) {
  if (!allowWhiteBlack && !VIEWER_TOKEN_RE.test(text)) {
    WHITE_BLACK_RE.lastIndex = 0;
    for (const m of text.matchAll(WHITE_BLACK_RE)) {
      const [whole, variants, util, colour] = m;
      if (/(?:^|:)print:/.test(variants) || variants.startsWith('print:')) continue;
      context.report({ node, message: whiteBlackMessage(whole.replace(/^[\s"'`]/, ''), util, colour) });
    }
  }
  for (const [i, { re, msg }] of CHECKS.entries()) {
    if (allowPrintSizes && i === 2) continue;
    re.lastIndex = 0;
    for (const m of text.matchAll(re)) context.report({ node, message: msg(m[0].replace(/^[\s"'`]/, '')) });
  }
  if (!allowPrintSizes) {
    SPACING_RE.lastIndex = 0;
    for (const m of text.matchAll(SPACING_RE)) {
      if (SPACING_STEPS.has(m[1]) || extraSpacing.has(m[1])) continue;
      context.report({
        node,
        message: `"${m[0].replace(/^[\s"'\`]/, '')}" is off the spacing scale. Use a step of 0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20 or 24 (2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px).`,
      });
    }
  }
  ALPHA_RE.lastIndex = 0;
  for (const m of text.matchAll(ALPHA_RE)) {
    const [whole, color, alpha] = m;
    if (color.endsWith('-current')) continue;
    if (ALPHA_FREE.has(color) || allowAlpha.has(`${color}/${alpha}`)) continue;
    context.report({
      node,
      message: `"${whole.trim()}" fades a token into an unlisted shade. Use the token at full strength (or its -bg / -line partner).`,
    });
  }
}

const noOffSystemClasses = {
  meta: {
    type: 'problem',
    docs: { description: 'Class strings use only the design system colours, type scale, weights and shadows.' },
    schema: [
      {
        type: 'object',
        properties: {
          /** Token/opacity pairs with a fixed job, e.g. "brand/40" for the dialog backdrop. */
          allowAlpha: { type: 'array', items: { type: 'string' } },
          /** Paper-form replicas only: allow text-[Npx] sizes below the screen scale. */
          allowPrintSizes: { type: 'boolean' },
          /** The kit only: extra spacing steps for its own geometry, e.g. ["7", "9"] for icon insets in fields. */
          extraSpacingSteps: { type: 'array', items: { type: 'string' } },
          /** The document viewer and paper-form replicas only: white and black are allowed (always-dark chrome, paper). */
          allowWhiteBlack: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const allowAlpha = new Set(context.options[0]?.allowAlpha ?? []);
    const allowPrintSizes = Boolean(context.options[0]?.allowPrintSizes);
    const extraSpacing = new Set(context.options[0]?.extraSpacingSteps ?? []);
    const allowWhiteBlack = Boolean(context.options[0]?.allowWhiteBlack);
    return {
      Literal(node) {
        if (typeof node.value === 'string' && node.value.includes('-')) checkClassText(context, node, node.value, allowAlpha, allowPrintSizes, extraSpacing, allowWhiteBlack);
      },
      TemplateElement(node) {
        checkClassText(context, node, node.value.cooked ?? node.value.raw, allowAlpha, allowPrintSizes, extraSpacing, allowWhiteBlack);
      },
    };
  },
};

/* ---------------------------------------------------------------------------------- */

/*
 * Retired tokens. Kept apart from no-off-system-classes so its messages can name the
 * replacement token; on for app/ and components/ in eslint.config.mjs.
 */
const RETIRED = [
  {
    re: new RegExp(`(?:^|[\\s"'\`])${VARIANTS}!?(?:${COLOR_UTIL})-faint(?:\\/\\d+)?(?=$|[\\s"'\`])`, 'g'),
    msg: (m) =>
      `"${m}" no longer exists: faint was merged into muted (#626c81, 4.5:1 on every fill). Use ${m.replace(/faint(?:\/\d+)?$/, 'muted')}.`,
  },
  {
    re: new RegExp(`(?:^|[\\s"'\`])${VARIANTS}!?(?:animation-)?duration-(?:\\d+|\\[[^\\]]*\\]|\\([^)]*\\))(?=$|[\\s"'\`])`, 'g'),
    msg: (m) =>
      `"${m}" is an off-system duration. Use duration-fast (120ms), duration-base (180ms) or duration-slow (260ms), or motion.fast | base | slow from the kit's styles; transition-colors needs none (it defaults to fast).`,
  },
  {
    re: new RegExp(`(?:^|[\\s"'\`])${VARIANTS}!?ease-(?:linear|in|out|in-out|\\[[^\\]]*\\]|\\([^)]*\\))(?=$|[\\s"'\`])`, 'g'),
    msg: (m) => `"${m}" does not exist here (@theme keeps one easing). Use ease-standard, or nothing: transitions default to it.`,
  },
];

const noRetiredClasses = {
  meta: {
    type: 'problem',
    docs: { description: 'No classes for retired tokens: faint, raw durations, default easings.' },
    schema: [],
  },
  create(context) {
    const check = (node, text) => {
      for (const { re, msg } of RETIRED) {
        re.lastIndex = 0;
        for (const m of text.matchAll(re)) context.report({ node, message: msg(m[0].replace(/^[\s"'`]/, '')) });
      }
    };
    return {
      Literal(node) {
        if (typeof node.value === 'string' && node.value.includes('-')) check(node, node.value);
      },
      TemplateElement(node) {
        check(node, node.value.cooked ?? node.value.raw);
      },
    };
  },
};

/* ---------------------------------------------------------------------------------- */

const FREE_INPUT_TYPES = new Set(['file', 'hidden', 'range', 'color', 'submit', 'reset', 'button', 'image']);
const FILLED_BUTTON = /(?:^|\s)bg-(?:brand|brand-2|accent|danger|success|warning|violet|info)(?=\s|$)/;
/** Kit buttons whose hint is a Tooltip, never the native title. */
const KIT_BUTTONS = new Set(['Button', 'IconButton', 'LinkButton']);
/** Hand-made busy and choice styling: the kit draws these (Spinner, Skeleton, Button loading, Checkbox). */
const HAND_BUILT_CLASSES = [
  { re: new RegExp(`(?:^|\\s)${VARIANTS}animate-spin(?=\\s|$)`), what: 'spinner (animate-spin)', use: '<Spinner>, <LoadingState> or Button `loading`' },
  { re: new RegExp(`(?:^|\\s)${VARIANTS}animate-pulse(?=\\s|$)`), what: 'placeholder (animate-pulse)', use: '<Skeleton>, <SkeletonText> or <SkeletonTableRows>' },
  { re: new RegExp(`(?:^|\\s)${VARIANTS}accent-(?:auto|brand|brand-2|accent|ink|muted|current)(?=\\s|$)`), what: 'checkbox colour (accent-*)', use: '<Checkbox> or <Radio>' },
];
/** Imports that have a kit replacement. */
const REPLACED_MODULES = {
  '@/components/common/DatePickerField': (kit) => `DatePicker from ${kit} (components/common/DatePickerField moved into the kit)`,
  '@radix-ui/react-tooltip': (kit) => `Tooltip from ${kit} (or IconButton, which shows its label as one)`,
};
/** Every class of the card recipe, in any order. */
const HAND_BUILT_CARD = ['bg-(?:surface|white)', 'border', 'border-line', 'rounded-xl'].map((c) => new RegExp(`(?:^|\\s)${c}(?=\\s|$)`));
/**
 * A kit file imported by path. `styles` (the recipes) is the one file screens may name. Covers
 * an app's own kit folder (@/components/ui/Button) and deep paths into the package
 * (aero-design-system/dist/components/Button.js); its public entry points stay allowed.
 */
const KIT_FILE_IMPORT = /^(?:@\/components\/ui\/(?!styles$)[\w-]+|aero-design-system\/(?!(?:styles|eslint|theme\.css|tokens\.css|tokens\.json|package\.json)$).+)$/;
const SPINNER_ICONS = new Set(['Loader', 'Loader2', 'LoaderCircle', 'LoaderPinwheel']);
/**
 * All-caps text. Everything is sentence case; the one exception is a code field (a part or
 * licence number typed in capitals), so the class stays legal on the kit `Input`.
 */
const UPPERCASE_CLASS = new RegExp(`(?:^|\\s)${VARIANTS}uppercase(?=\\s|$)`);

/** True when `name` at this node is not declared in any enclosing scope (a browser global). */
function isGlobalName(context, node, name) {
  let scope = context.sourceCode.getScope(node);
  while (scope) {
    const variable = scope.set.get(name);
    if (variable && variable.defs.length > 0) return false;
    scope = scope.upper;
  }
  return true;
}

function attr(node, name) {
  return node.attributes.find((a) => a.type === 'JSXAttribute' && a.name && a.name.name === name);
}
function staticString(value) {
  if (!value) return undefined;
  if (value.type === 'Literal') return String(value.value);
  if (value.type === 'JSXExpressionContainer') {
    const e = value.expression;
    if (e.type === 'Literal') return String(e.value);
    if (e.type === 'TemplateLiteral') return e.quasis.map((q) => q.value.cooked ?? q.value.raw).join(' ');
  }
  return undefined;
}

/** Text content of a JSX element's direct children (whitespace dropped). */
function hasText(element) {
  return element.children.some((c) => (c.type === 'JSXText' && c.value.trim() !== '') || (c.type === 'JSXExpressionContainer' && c.expression.type !== 'JSXEmptyExpression' && c.expression.type !== 'JSXElement'));
}

/**
 * The kit component that replaces a hand-built <button>, guessed from its attributes and
 * classes, so the message names one; the list of every button-like component follows.
 */
function kitButtonFor(context, node, cls) {
  const element = node.parent;
  const inner = element && element.type === 'JSXElement' ? context.sourceCode.getText(element) : '';
  const has = (re) => re.test(cls);
  if (has(/viewer|accent-soft/)) return 'Button, IconButton or LinkButton with `dark` (a toggle: Button with aria-pressed)';
  if (attr(node, 'aria-current')) return '<NavItem active> (in a <NavList>) for navigation, or <Pagination> for page numbers';
  if (/<BrandMark\b/.test(inner)) return '<NavBrand logo name>';
  if (attr(node, 'aria-pressed')) return '<Card onClick pressed> for a card, <ToggleChip> for a chip, or a Button / IconButton with aria-pressed';
  if (attr(node, 'aria-haspopup')) return '<IconButton badge> or <Button> as the PopoverTrigger, with <MenuList> and <MenuItem> inside (or RowMenu `trigger`)';
  if (has(/badgeBase/)) return '<ToggleChip>';
  if (has(/(?:^|[\s`'"])(?:hover:)?underline(?=[\s`'"]|$)/)) return '<LinkButton> (tone="ink" size="lg" truncate for a name that opens its record)';
  if (has(/readiness|annunciator/i)) return '<ReadinessCellButton state label onSelect>';
  if ((has(/chipRemove|after:size-6/)) && attr(node, 'aria-label')) return '<Chip onRemove> (or StatusBadge `onRemove`), or <SearchInput onClear> for a clear button';
  if (has(/(?:^|[\s`'"])w-full(?=\s)/) && has(/(?:^|\s)h-9(?=\s)/)) return '<NavItem> (in a <NavList>)';
  if (has(/(?:^|[\s`'"])w-full(?=\s)/) && has(/text-left/)) return '<MenuItem> in a <MenuList>';
  if (attr(node, 'aria-label') && element && element.type === 'JSXElement' && !hasText(element)) return '<IconButton icon label>';
  return '<Button>';
}

/** The className attribute as written (a template or cn() call included), for the hint only. */
function classSource(context, node) {
  const value = attr(node, 'className')?.value;
  return value ? context.sourceCode.getText(value) : '';
}

const KIT_BUTTON_LIST = 'Kit buttons: Button, IconButton, LinkButton, NavItem, MenuItem, Chip, ToggleChip, Card onClick, ReadinessCellButton, Pagination, SearchInput onClear';

const preferKitComponents = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Screens build controls, buttons, tables, tabs and filled buttons from the kit.' },
    schema: [
      {
        type: 'object',
        properties: {
          /**
           * Error boundaries only (app/error.tsx, app/global-error.tsx): they render when the app
           * itself failed, so they stay minimal and keep a raw <button> with buttonClass().
           */
          allowRawButton: { type: 'boolean' },
          /** The module screens import the kit from, named in messages. Default 'aero-design-system'. */
          kitImport: { type: 'string' },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const allowRawButton = Boolean(context.options[0]?.allowRawButton);
    const kit = context.options[0]?.kitImport ?? 'aero-design-system';
    const report = (node, what, use) => context.report({ node, message: `Hand-built ${what}. Use ${use} from '${kit}'.` });
    const STATUS_TONES = new Set(['success', 'warning', 'danger']);
    const removed = (node, what, use) => context.report({ node, message: `${what} was removed from the kit. Use ${use}.` });
    return {
      // Status labels must carry their symbol (check, triangle, cross): only the kit's
      // StatusBadge renders it, so raw status classes are not allowed.
      CallExpression(node) {
        const callee = node.callee.type === 'Identifier' ? node.callee.name : undefined;
        // window.confirm and a bare global confirm(): the kit's ConfirmDialog asks instead. A
        // local `confirm` (from useConfirmDialog) is the replacement and is left alone.
        const isWindowConfirm =
          node.callee.type === 'MemberExpression' &&
          !node.callee.computed &&
          node.callee.object.type === 'Identifier' &&
          (node.callee.object.name === 'window' || node.callee.object.name === 'globalThis') &&
          node.callee.property.type === 'Identifier' &&
          node.callee.property.name === 'confirm';
        if (isWindowConfirm || (callee === 'confirm' && isGlobalName(context, node, 'confirm'))) {
          return report(node, 'confirmation (window.confirm)', '<ConfirmDialog> or useConfirmDialog()');
        }
        if (callee === 'statusSelectClass') {
          return report(node, 'status dropdown from statusSelectClass()', '<StatusSelect> (the status pill as a dropdown, with its symbol)');
        }
        if (callee === 'statusPill' || callee === 'statusBadgeClass') {
          return report(node, 'status pill from classes', '<StatusBadge tone width="column"> (it adds the status symbol)');
        }
        if (callee === 'badgeClass') {
          const arg = node.arguments[0];
          if (arg && arg.type === 'Literal' && STATUS_TONES.has(arg.value)) {
            return report(node, `status badge from badgeClass('${arg.value}')`, `<StatusBadge tone="${arg.value}"> (it adds the status symbol)`);
          }
        }
      },
      ImportDeclaration(node) {
        const use = Object.prototype.hasOwnProperty.call(REPLACED_MODULES, node.source.value) ? REPLACED_MODULES[node.source.value](kit) : undefined;
        if (use) return context.report({ node, message: `Import of '${node.source.value}'. Use ${use}.` });
        // Screens take kit components from the index, so a component can move or be renamed
        // in one place. Recipes still come from '@/components/ui/styles'.
        if (KIT_FILE_IMPORT.test(node.source.value)) {
          return context.report({ node, message: `Import of the kit file '${node.source.value}'. Import it from '${kit}' (the kit index).` });
        }
        if (node.source.value === 'lucide-react') {
          for (const spec of node.specifiers) {
            const name = spec.type === 'ImportSpecifier' && spec.imported && spec.imported.name;
            if (name && SPINNER_ICONS.has(name)) report(spec, `spinner from the ${name} icon`, '<Spinner>, <LoadingState> or Button `loading`');
          }
        }
      },
      ImportSpecifier(node) {
        const name = node.imported && node.imported.name;
        if (name === 'statusSelectClass') return report(node, 'status dropdown from statusSelectClass', '<StatusSelect>');
        if (name === 'StatusPill') return removed(node, 'StatusPill', '<StatusBadge tone={…} width="column">');
        if (name === 'ModalStatusPill') return removed(node, 'ModalStatusPill', '<StatusBadge tone={…}> (or kind + status)');
        if (name === 'statusPill') return removed(node, 'statusPill()', '<StatusBadge tone={…} width="column">');
        if (name === 'DatePickerField') return removed(node, 'DatePickerField', '<DatePicker> (same props; its default size `lg` is the old default)');
        if (name === 'statusBadgeBase' || name === 'toneClasses' || name === 'statusBadgeClass') {
          return report(node, `status label from ${name}`, '<StatusBadge> (it adds the status symbol) or <Badge> for a category');
        }
      },
      JSXOpeningElement(node) {
        if (node.name.type !== 'JSXIdentifier') return;
        const tag = node.name.name;
        // Removed kit APIs (the type checker catches most; these say what to use instead).
        const size = staticString(attr(node, 'size')?.value);
        if (tag === 'StatusPill') return removed(node, '<StatusPill>', '<StatusBadge tone={…} width="column">');
        if (tag === 'Badge') {
          const tone = staticString(attr(node, 'tone')?.value);
          if (tone && STATUS_TONES.has(tone)) {
            return context.report({ node, message: `<Badge tone="${tone}"> is a status. Badge is categories and counts only: use <StatusBadge tone="${tone}"> (or kind + status).` });
          }
        }
        if ((tag === 'Input' || tag === 'Select' || tag === 'Combobox' || tag === 'DatePicker') && size === 'toolbar') {
          return removed(node, 'size="toolbar"', 'size="md" (36px; the old 40px "md" is now "lg", the default)');
        }
        if (tag === 'ModalShell' && size) {
          const NEW_SIZE = { '2xl': 'lg', '3xl': 'lg', '4xl': 'xl', wide: 'xl', full: 'xl' };
          if (NEW_SIZE[size]) return removed(node, `ModalShell size="${size}"`, `size="${NEW_SIZE[size]}" (sm 480, md 640, lg 896, xl 1280px)`);
        }
        if (tag === 'DatePickerField') {
          return context.report({ node, message: `<DatePickerField> is the old name of the kit date field. Use <DatePicker> from ${kit} (same props; its default size \`lg\` is the old default).` });
        }
        if (tag === 'Input' && staticString(attr(node, 'type')?.value) === 'date') return report(node, '<Input type="date">', '<DatePicker> (DD-MMM-YYYY display, ISO value)');
        // A native title is not a tooltip (no keyboard, no touch, unstyled): kit buttons use Tooltip.
        if ((KIT_BUTTONS.has(tag) || tag === 'button') && attr(node, 'title')) {
          return report(
            node,
            `tooltip from title= on <${tag}>`,
            tag === 'IconButton' ? 'IconButton `tooltip` (its label already shows as a Tooltip)' : '<Tooltip content="…"> around the button (or IconButton for an icon-only button)',
          );
        }
        if (tag === 'select') return report(node, '<select>', '<Select> (or <FilterSelect> in toolbars, <StatusSelect> for a status)');
        if (tag === 'textarea') return report(node, '<textarea>', '<Textarea>');
        if (tag === 'table') {
          // A screen-reader-only data table (the text twin of a chart) has no look to keep.
          if (/(?:^|\s)sr-only(?=\s|$)/.test(staticString(attr(node, 'className')?.value) ?? '')) return;
          return report(node, '<table>', '<Table> (frame="card" | "inset" | "none") with <THead>, <Th> and <Td>, or <DataTable>');
        }
        if (tag === 'th') return report(node, '<th>', '<THead> and <Th> inside <Table>');
        if (tag === 'input') {
          const type = staticString(attr(node, 'type')?.value) ?? 'text';
          if (type === 'checkbox') return report(node, '<input type="checkbox">', '<Checkbox> (or <CheckboxGroup> for a set)');
          if (type === 'radio') return report(node, '<input type="radio">', '<RadioGroup> with <Radio> options');
          if (type === 'date') return report(node, '<input type="date">', '<DatePicker>');
          if (!FREE_INPUT_TYPES.has(type) && attr(node, 'className')) return report(node, `<input type="${type}">`, '<Input>');
          return;
        }
        const cls = staticString(attr(node, 'className')?.value);
        if (cls) {
          for (const { re, what, use } of HAND_BUILT_CLASSES) if (re.test(cls)) return report(node, what, use);
          if (tag !== 'Input' && UPPERCASE_CLASS.test(cls)) {
            return context.report({
              node,
              message:
                '"uppercase" sets text in capitals; the system is sentence case. Write the words in sentence case, and show a stored status through <StatusBadge kind=…>, which sentence-cases it. Only a code field (<Input className="uppercase">) may use it.',
            });
          }
        }
        // The card surface written out by hand: surface, hairline, radius xl. Floating panels
        // (shadow-popover, shadow-modal) are a different surface and are left alone.
        if ((tag === 'div' || tag === 'section' || tag === 'form') && cls && HAND_BUILT_CARD.every((re) => re.test(cls)) && !/(?:^|\s)shadow-(?:popover|modal)(?=\s|$)/.test(cls)) {
          return report(node, 'card (bg-surface border border-line rounded-xl)', '<Card> (padding "md" | "sm" | "none"; as="div" | "form")');
        }
        const role = staticString(attr(node, 'role')?.value);
        if (role === 'tab' || role === 'tablist') return report(node, `role="${role}"`, '<Tabs> or <SegmentedControl>');
        if (tag === 'button' && cls && FILLED_BUTTON.test(cls)) return report(node, 'filled button', '<Button variant="primary" | "danger">');
        // Every clickable thing has a kit component, so its look, focus ring, target size and
        // name are the same on every screen.
        if (tag === 'button' && !allowRawButton) {
          return context.report({
            node,
            message: `Hand-built <button>. Use ${kitButtonFor(context, node, classSource(context, node))} from '${kit}'. ${KIT_BUTTON_LIST}.`,
          });
        }
      },
    };
  },
};

const designSystemPlugin = {
  meta: { name: 'design-system' },
  rules: {
    'no-off-system-classes': noOffSystemClasses,
    'prefer-kit-components': preferKitComponents,
    'no-retired-classes': noRetiredClasses,
  },
};

export default designSystemPlugin;
