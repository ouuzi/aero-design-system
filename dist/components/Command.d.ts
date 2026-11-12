import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
declare function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>): React.JSX.Element;
declare function CommandInput({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Input>): React.JSX.Element;
declare function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>): React.JSX.Element;
/** Shown by cmdk when its own filter leaves nothing. With shouldFilter={false}, render your own empty line instead. */
declare function CommandEmpty({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>): React.JSX.Element;
declare function CommandGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>): React.JSX.Element;
declare function CommandSeparator({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Separator>): React.JSX.Element;
declare function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>): React.JSX.Element;
export { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator };
