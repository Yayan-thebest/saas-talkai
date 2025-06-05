import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommandEmpty, CommandInput, CommandItem, CommandList, CommandResponsiveDialog } from "./ui/command";


interface Props {
    options: Array<{id: string, value: string, children: ReactNode}>;
    onSelect: (value: string) => void;
    onSearch?: (value: string) => void;
    value: string;
    placeholder?: string;
    isSearchable?: boolean;
    className?: string;
}

export const CommandSelect = ({options, onSelect, onSearch, value, placeholder="Select an option", className}: Props) => {
    const [open, setOpen] = useState(false);
    const selectedOption = options.find((option) => option.value === value);

    // to reset the search after closing
    const handleOpenChange = (value: boolean) => {
        onSearch?.("");
        setOpen(value);
    };

    return (
        <>
            <Button type="button" variant={"outline"} onClick={() => setOpen(true)}
                className={cn("h-9 justify-between font-normal px-2", !selectedOption && "text-muted-foreground", className,)}>
                <div>
                    {selectedOption?.children ?? placeholder}
                </div>
                <ChevronDownIcon/>
            </Button>
            <CommandResponsiveDialog
                shouldFilter={!onSearch}
                open={open}
                onOpenChange={handleOpenChange}
            >
                <CommandInput placeholder="Search..." onValueChange={onSearch}/>
                <CommandList>
                    <CommandEmpty>
                       <span className="text-muted-foreground text-sm">Not option found</span> 
                    </CommandEmpty>
                    {options.map((option) => (
                        <CommandItem key={option.id} onSelect={() => {onSelect(option.value); setOpen(false)} }>
                           {option.children} 
                        </CommandItem>
                    ))}
                </CommandList>
            </CommandResponsiveDialog>
        </>
    )
}

