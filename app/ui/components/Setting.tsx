import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup, DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input";
import { } from "@radix-ui/react-dropdown-menu";
import { FC, useState } from "react";
interface ISettingProps { };

export const Setting: FC<ISettingProps> = (props) => {
    const [data, setData] = useState<{ option: string, value: string }>({ option: "is", value: "" });
    return (
        <div className="flex items-center space-x-2">
            <DropdownMenu>
                <DropdownMenuTrigger className="w-full" onChange={e => setData({ option: (e.target as HTMLInputElement).value, value: "" })}>{data.option}</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuRadioGroup value={data.option} onValueChange={e => setData({ option: e, value: "" })}>
                        <DropdownMenuRadioItem value="is">Is</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="is-not">Is not</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="contains">Contains</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="not-contains">Does not contain</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <Input value={data.value} onChange={e => setData({ option: data.option, value: (e.target as HTMLInputElement).value })} />

        </div>
    );
}
