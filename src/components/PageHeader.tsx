import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { linkButton, metaLine, pageTitle } from './styles.js';
import { cn } from '../lib/utils.js';

/*
 * PageHeader: the top of every screen. Title (the pageTitle recipe, 22px) with one muted line
 * under it, an optional meta line, and the page's actions on the right.
 *
 *   <PageHeader
 *     title="Personnel"
 *     description="Maintenance, airworthiness and support personnel."
 *     actions={
 *       <>
 *         <Button icon={Building2} onClick={openOrg}>Departments and bases</Button>
 *         <Button variant="primary" icon={Plus} onClick={add}>Add person</Button>
 *       </>
 *     }
 *   />
 *
 * Layout: the title block and the actions share one row while they fit. When they do not,
 * the WHOLE actions group moves under the title as one left-aligned row (it wraps only if it
 * is wider than the page), so a primary button never drops alone below its secondaries.
 * Put the primary action LAST in `actions`: it is the right-most button on one row and the
 * last in the group under the title. Keep it to three buttons; more go in one RowMenu.
 *
 * `back` is a quiet link above the title ("Back to personnel") for a page opened from a list.
 * `as` is the title's heading level: h2 by default, as on every screen today.
 */

export interface PageHeaderProps {
  title: React.ReactNode;
  /** One muted line under the title. */
  description?: React.ReactNode;
  /** The page's buttons, primary last. */
  actions?: React.ReactNode;
  /** A quiet link above the title back to where the page was opened from. */
  back?: { label: React.ReactNode; onClick: () => void };
  /** A meta line under the description (record code, owner, last updated); items separated by "·". */
  meta?: React.ReactNode;
  /** Heading level of the title. Default `h2`. */
  as?: 'h1' | 'h2';
  /** Layout only (margins). */
  className?: string;
}

export function PageHeader({ title, description, actions, back, meta, as: Heading = 'h2', className }: PageHeaderProps) {
  return (
    <header className={cn('space-y-2', className)}>
      {back && (
        <button type="button" onClick={back.onClick} className={linkButton('md', 'muted')}>
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          {back.label}
        </button>
      )}
      {/*
        One wrapping row. The title block grows from a 20rem basis and the actions keep their
        natural width, so the actions leave the row as one group, never one button at a time.
      */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="min-w-0 flex-[1_1_20rem]">
          <Heading className={pageTitle}>{title}</Heading>
          {description && <p className="mt-1 text-13 text-muted comfortable:text-15">{description}</p>}
          {meta && <div className={cn(metaLine, 'mt-1.5')}>{meta}</div>}
        </div>
        {actions && <div className="flex max-w-full flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
