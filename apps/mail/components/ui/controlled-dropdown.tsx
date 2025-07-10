import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
  import { useState } from 'react';
  
  export function ControlledDropdown({
    trigger,
    children,
  }: {
    trigger: React.ReactNode;
    children: (close: () => void) => React.ReactNode;
  }) {
    const [open, setOpen] = useState(false);
  
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent>
          {children(() => setOpen(false))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  