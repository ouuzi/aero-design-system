/*
 * aero-design-system: the AeroCompetence Hub UI kit as a package. Screens import building
 * blocks from here:
 *
 *   import { Button, Field, Input, Select, StatTile, StatusBadge } from 'aero-design-system';
 *
 * Reach for a component first; use a class recipe from 'aero-design-system/styles' only to
 * build a new component, and add a component here when a pattern appears on two screens.
 */
export { Button, IconButton, LinkButton } from './components/Button.js';
export type { ButtonProps, IconButtonProps, LinkButtonProps } from './components/Button.js';
export { Field, Input, Textarea, useFieldControl } from './components/Field.js';
export type { FieldProps, InputProps, TextareaProps } from './components/Field.js';
export { Select, FilterSelect } from './components/Select.js';
export type { SelectProps, FilterSelectProps } from './components/Select.js';
export { SearchInput } from './components/SearchInput.js';
export type { SearchInputProps } from './components/SearchInput.js';
export { Checkbox, CheckboxGroup } from './components/Checkbox.js';
export type { CheckboxProps, CheckboxGroupProps } from './components/Checkbox.js';
export { Radio, RadioGroup } from './components/Radio.js';
export type { RadioProps, RadioGroupProps } from './components/Radio.js';
export { DatePicker } from './components/DatePicker.js';
export type { DatePickerProps } from './components/DatePicker.js';
export { Tooltip, TooltipProvider } from './components/Tooltip.js';
export type { TooltipProps, TooltipProviderProps, TooltipSide, TooltipAlign } from './components/Tooltip.js';
export { Spinner, LoadingState } from './components/Spinner.js';
export type { SpinnerProps, SpinnerSize, SpinnerTone, LoadingStateProps } from './components/Spinner.js';
export { Skeleton, SkeletonText, SkeletonTableRows } from './components/Skeleton.js';
export type { SkeletonProps, SkeletonShape, SkeletonTextProps, SkeletonTableRowsProps } from './components/Skeleton.js';
export { ConfirmDialog, useConfirmDialog } from './components/ConfirmDialog.js';
export type { ConfirmDialogProps, ConfirmRequest } from './components/ConfirmDialog.js';
export { StatusSelect } from './components/StatusSelect.js';
export type { StatusSelectProps, StatusOption } from './components/StatusSelect.js';
export { FormGrid, formSpan } from './components/FormGrid.js';
export type { FormGridProps } from './components/FormGrid.js';
export { Card } from './components/Card.js';
export type { CardProps, StaticCardProps, ButtonCardProps } from './components/Card.js';
export { StatTile } from './components/StatTile.js';
export type { StatTileProps } from './components/StatTile.js';
export { StatusBadge, CodeChip, authorisationStatusBadge } from './components/StatusBadge.js';
export type { StatusBadgeProps } from './components/StatusBadge.js';
export { Table, THead, Th, Td } from './components/Table.js';
export type { TableFrame, TablePin } from './components/Table.js';
export { PageHeader } from './components/PageHeader.js';
export type { PageHeaderProps } from './components/PageHeader.js';
export { Tabs, SegmentedControl } from './components/Tabs.js';
export type { TabOption } from './components/Tabs.js';
export { Notice } from './components/Notice.js';
export type { NoticeProps, NoticeTone } from './components/Notice.js';
export { AlertList, AlertRow } from './components/AlertList.js';
export type { AlertListProps, AlertRowProps } from './components/AlertList.js';
export { ToggleChip } from './components/ToggleChip.js';
export type { ToggleChipProps } from './components/ToggleChip.js';
export { Chip } from './components/Chip.js';
export type { ChipProps } from './components/Chip.js';
export { NavItem, NavList, NavBrand } from './components/NavItem.js';
export type { NavItemProps, NavListProps, NavBrandProps } from './components/NavItem.js';
export { MenuList, MenuItem, MenuSeparator, useMenuKeyboard } from './components/Menu.js';
export type { MenuListProps, MenuItemProps, MenuCloseReason } from './components/Menu.js';
export { Pagination } from './components/Pagination.js';
export type { PaginationProps } from './components/Pagination.js';
export { ToastProvider, useToast } from './components/Toast.js';
export type { ToastOptions, ToastApi, ToastTone, ToastProviderProps } from './components/Toast.js';
export { DataTable } from './components/DataTable.js';
export type { DataTableColumn, DataTableProps } from './components/DataTable.js';
export { HistoryTimeline } from './components/HistoryTimeline.js';
export type { HistoryEvent, HistoryTimelineProps } from './components/HistoryTimeline.js';
export { RiskMatrix, DEFAULT_RISK_BANDS, riskBand } from './components/RiskMatrix.js';
export type { RiskCode, RiskMatrixProps } from './components/RiskMatrix.js';
export { StatusSymbol } from './components/StatusSymbol.js';
export { Combobox } from './components/Combobox.js';
export type { ComboboxProps } from './components/Combobox.js';
export { Popover, PopoverTrigger, PopoverAnchor, PopoverContent } from './components/Popover.js';
export { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from './components/Command.js';
export { default as Badge } from './components/Badge.js';
export type { BadgeProps } from './components/Badge.js';
export { default as EmptyState } from './components/EmptyState.js';
export { default as ModalShell, modalButton, modalFooterClass } from './components/ModalShell.js';
export type { ModalShellProps, ModalSize } from './components/ModalShell.js';
export { default as RowMenu } from './components/RowMenu.js';
export type { RowMenuItem, RowMenuProps } from './components/RowMenu.js';
export { default as BrandMark } from './components/BrandMark.js';
export { default as EvidenceField, LinkedEvidenceList } from './components/EvidenceField.js';
export { ReadinessStrip, ReadinessSummary, AnnunciatorPanel, ReadinessLegend, ReadinessCellButton, readinessCellClass } from './components/ReadinessStrip.js';
export type { ReadinessCellButtonProps } from './components/ReadinessStrip.js';
export {
  READINESS_TONE,
  READINESS_LABEL,
  READINESS_STATUS,
  readinessStatus,
  normaliseReadinessStatus,
  AUTH_TONE,
  AUTH_LABEL,
  authTone,
  isAuthorisationStatus,
  normaliseAuthorisationStatus,
  DOCUMENT_REVIEW_STATUS,
  FINDING_ISSUE_STATUS,
  findingStatus,
  ASSESSMENT_OUTCOME_STATUS,
  outcomeStatus,
  ACTIVITY_STATUS,
  activityLogStatus,
  ALERT_TONE,
  sentenceCase,
} from './components/statusTones.js';
export type { StatusEntry, FindingIssue, AssessmentOutcome, ActivityLogStatus } from './components/statusTones.js';
export { isStatusTone } from './components/styles.js';
export type {
  Tone,
  StatusTone,
  CategoryTone,
  StatusBadgeWidth,
  ControlSize,
  ButtonVariant,
  ButtonSize,
  LinkButtonSize,
  LinkButtonTone,
  ChoiceSize,
  ChoiceVariant,
  ChoiceOrientation,
} from './components/styles.js';

/* Helpers that used to live in the app's lib/ folder. */
export { cn } from './lib/utils.js';
export { formatDate, toIsoDate } from './lib/dateFormat.js';
export { DensityProvider, useDensity, DEFAULT_DENSITY_STORAGE_KEY } from './lib/density.js';
export type { Density, DensityProviderProps } from './lib/density.js';
export { ThemeProvider, useTheme } from './lib/theme.js';
export type { Theme, ThemeProviderProps } from './lib/theme.js';
export { getThemeInitScript, lastThemeKey, DEFAULT_THEME_STORAGE_KEY } from './lib/themeScript.js';
export type { DefaultTheme, ThemeInitOptions } from './lib/themeScript.js';
export { READINESS_LABELS, countReadiness, readinessSentence, worstReadinessState } from './lib/readiness.js';
export type { ReadinessState, ReadinessCell, ReadinessGroup, ReadinessCounts } from './lib/readiness.js';
export type { ReadinessStatus, PersonnelAuthorisationStatus } from './lib/statusTypes.js';
