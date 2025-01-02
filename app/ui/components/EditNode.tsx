import { FC, useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { Combobox } from "./Combobox";
import { messageTypes } from "@/app/lib/progData";
import { Edit, Plus } from "lucide-react";
import { Setting } from "./Setting";
import { FlowNodeData } from "@/app/lib/types";
import { Input } from "@/components/ui/input";
interface IEditNodeProps { nodeData: FlowNodeData, updateNodeData: (d: FlowNodeData) => void };

export const EditNode: FC<IEditNodeProps> = (props) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant={"ghost"} className="w-full nodrag">
                    <Edit />
                </Button>
            </SheetTrigger>
            <SheetContent >
                <SheetHeader>
                    <SheetTitle>Change Node Settings</SheetTitle>
                </SheetHeader>
                <div className="my-8 space-y-8">
                    <div>
                        <div className="text-2xl font-bold mb-4">Trigger</div>
                        <Combobox itemLabel="trigger" items={messageTypes} item={props.nodeData.trigger} setItem={(e) => props.updateNodeData({ trigger: e, rules: [] })} />
                        <div className="flex items-center justify-between my-4">
                            <span className="text-base font-bold">Rules</span>
                            <Button variant="ghost" className="flex items-center space-x-2 shadow-sm" onClick={() => props.updateNodeData({ rules: [...(props.nodeData.rules ?? []), { field: "", operator: "", value: "" }] })}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-col space-y-4">
                            {
                                props.nodeData.rules?.map((rule) => (
                                    <Setting key={props.nodeData.rules?.indexOf(rule)} fields={props.nodeData.trigger?.fields ?? []} data={rule} setData={(e) => props.updateNodeData({ rules: props.nodeData.rules?.map((r) => props.nodeData.rules?.indexOf(r) === props.nodeData.rules?.indexOf(rule) ? e : r) ?? [] })} />
                                ))
                            }

                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold mb-4">Response</div>
                        <Combobox itemLabel="response" items={messageTypes} item={props.nodeData.response} setItem={(e) => props.updateNodeData({ response: { ...e, fields: e.fields.map(f => ({ ...f, value: "" })), }, properties: e.fields.map(f => ({ ...f, value: "" })) })} />
                        <div className="flex items-center justify-between my-4">
                            <span className="text-base font-bold">Properties</span>
                        </div>
                        {
                            props.nodeData.properties?.map((property) => (
                                <div className="flex items-center space-x-2 my-2" key={property.id}>
                                    <span className="flex-1">{property.label}</span>
                                    <Input onChange={(e) => props.updateNodeData({ properties: props.nodeData.properties?.map((p) => p.id === property.id ? { ...p, value: e.target.value } : p) ?? [] })} value={property.value} />
                                    <span className="flex-2">
                                    </span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </SheetContent>
        </Sheet>

    );
}
