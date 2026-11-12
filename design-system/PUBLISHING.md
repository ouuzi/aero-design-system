# Publishing the design guide

The design guide is a Claude artifact: https://claude.ai/artifact/XTxgkVMxQs6MwcnngcSETc

It is a published copy. The source is this repository, `aero-design-system` (the guide moved
here from AeroMetric-Control with version 0.1.0; the artifact URL did not change):

| What | Where |
|---|---|
| Tokens (colours, shadows, control heights) | `theme.css` |
| Components | `src/components` (the guide's bundle is built from `src/`, not from `dist/`) |
| The guide's text, one page per component, and each preview | `design-system/` |
| Token usage notes, type styles, spacing and radius lists | `design-system/tokens.json` |
| The pictures each preview must match, light and dark | `design-system/baselines/`, `design-system/baselines/dark/` |

Change the design system in those places, never on the artifact page: the next publish
replaces what the page holds.

## After a change to the design system

1. `npm run guide:build`
   - refreshes `design-system/tokens.json` from `theme.css` (commit it if it changed);
   - builds `.design-system-dist/project/`: the text files, `components/bundle.js` (the kit,
     React and the preview icons in one script) and `components/bundle.css`.
2. In a Claude session (it needs Playwright with Chromium): `npm run guide:previews` renders
   every preview with the new bundle, light and dark, and fails if one throws, draws nothing, or
   no longer matches its baseline picture. When a change is meant to move pixels, look at the
   new pictures (`node scripts/design-system/check-previews.cjs --shots /tmp/shots`), then accept
   them with `node scripts/design-system/check-previews.cjs --update` and commit the baselines.
   Baselines depend on the machine's fonts: make and compare them in the same environment.
3. Ask Claude to "publish the design guide". Claude reads the artifact's index
   (`project/design-system.json`), publishes the files under `.design-system-dist/project/`
   to the artifact URL above with the Artifact tool, and sets the index's `lastChange`.
   `components/index.d.ts` must be sent with `contentType: "text/plain"` (the artifact does
   not serve `.ts` files otherwise). Publishing needs a Claude session; CI cannot do it.

CI runs `npm run guide:check` on every push and pull request. It fails when
`design-system/tokens.json` and `theme.css` disagree, or when a file in `src/components` has no
page under `design-system/components/`. So a change to the kit cannot merge without its page and
token note; the only manual steps left are the preview check and the publish.

## Adding a component

1. Build it in `src/components` and export it from `src/index.ts`.
2. Add `design-system/components/<Name>/README.md` (first sentence is the summary) and
   `preview.html` (line 1 `<!-- @dsCard group="…" height=N -->`, then a small page that
   renders `window.AeroCompetenceHub.<Name>`; copy an existing preview).
3. Add its types to `design-system/components/index.d.ts` (hand-kept, types as documentation).
4. Build (`npm run build` for `dist/`, `npm run guide:build`), check the previews
   (`--update` once for the new picture, after looking at it), release, publish.

Not kept here: the artifact's index (`design-system.json`) and the logo files, which live in
the artifact; the generated `tokens.css` of the page, which the page writes itself (it is not
the package's `tokens.css`).
