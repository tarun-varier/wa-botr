"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Message } from "@/app/lib/types"

interface IComboboxProps {
    items: Message[],
    itemLabel: string,
    setItem: (m: Message) => void,
    item: Message | undefined
}

export const Combobox: React.FC<IComboboxProps> = ({ items, itemLabel, setItem, item }) => {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {item
                        ? item.label
                        : `Select ${itemLabel}...`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 pointer-events-auto">
                <Command>
                    <CommandInput placeholder={`Search ${itemLabel}...`} />
                    <CommandList>
                        <CommandEmpty>No {itemLabel} found.</CommandEmpty>
                        <CommandGroup>
                            {items.map((curItem) => (
                                <CommandItem
                                    key={curItem.value}
                                    value={curItem.value}
                                    onSelect={() => {
                                        setItem(curItem)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            curItem.id === item?.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {curItem.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
