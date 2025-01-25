import { getOperators } from "@/app/lib/constants";
import { Field, Rule } from "@/app/lib/types";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuLabel, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input";
import { FC, useEffect, useState } from "react";
interface ISettingProps { fields: Field[], data: Rule, setData: (r: Rule) => void };

export const Setting: FC<ISettingProps> = (props) => {
    const options: { id: string, label: string, field: string }[] = props.fields.map((field) => getOperators(field.type).map((operator) => ({ ...operator, field: field.id }))).flat();
    const [selectedField, setSelectedField] = useState<Field>();
    useEffect(() => {
        setSelectedField(props.fields.find((field) => field.id === props.data.field))
    }, [props.data.field]);

    return (
        <div className="flex items-center space-x-2">
            <div className="flex-1">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button className="w-full">
                        {
                            (!props.data.field || !props.data.operator) && "Select"
                        }
                        {props.fields.find((field) => field.id === props.data.field)?.label} {options.find((option) => option.id === props.data.operator && option.field === props.data.field)?.label}
                    </Button></DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuRadioGroup value={props.data.operator} onValueChange={e => props.setData({ operator: e.split(":")[1], value: "", field: e.split(":")[0] })}>
                            {props.fields.map((field) => (
                                <div key={field.id}>
                                    <DropdownMenuLabel>{field.label}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {
                                        getOperators(field.type).map((operator) => (
                                            <DropdownMenuRadioItem key={operator.id} value={field.id + ":" + operator.id}>{operator.label}</DropdownMenuRadioItem>
                                        ))
                                    }
                                </div>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {
                selectedField?.possibleValues ?
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button className="w-full">
                            {props.data.value ? selectedField.possibleValues.find((value) => value.id === props.data.value)?.label : "Select"}
                        </Button></DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuRadioGroup value={props.data.value} onValueChange={e => props.setData({ ...props.data, value: e })}>
                                {selectedField?.possibleValues?.map((value) => (
                                    <DropdownMenuRadioItem key={value.id} value={value.id}>{value.label}</DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    : <Input value={props.data.value} onChange={e => props.setData({ ...props.data, value: (e.target as HTMLInputElement).value })} className="flex-1" />
            }

        </div >
    );
}
