"use client";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { FC, MouseEventHandler } from "react";
import { messageTypes } from "@/app/lib/constants";
import { Message } from "@/app/lib/types";
interface IBlockSidebarProps {
    addClick: MouseEventHandler<HTMLButtonElement>;
    setNodeType: React.Dispatch<React.SetStateAction<string>>;
    setTriggerType: React.Dispatch<React.SetStateAction<Message>>;
    noStartNode: boolean;
    onExport: () => void;
};


export const BlockSidebar: FC<IBlockSidebarProps> = (props) => {
    return (
        <div>
            <Sidebar >
                <SidebarHeader>Triggers</SidebarHeader>
                <SidebarContent style={{ scrollbarWidth: "none" }}>
                    <SidebarGroup className="">
                        <div className="my-4">
                            <Button className="py-4 w-full" variant={"default"} onClick={(e) => {
                                props.setNodeType("flowStartNode")
                                props.addClick(e)
                            }} >Add Start Node</Button>
                        </div>
                        <Separator />

                        <div className="grid grid-cols-2 gap-4 w-full my-4">
                            {messageTypes.map((messageType) => (
                                <Button key={messageType.id} className="p-4 overflow-hidden h-full whitespace-normal" variant={"default"} onClick={(e) => {
                                    props.setNodeType("flowNode")
                                    props.setTriggerType(messageType)
                                    props.addClick(e)
                                }} disabled={props.noStartNode}>{messageType.label}</Button>
                            ))}
                        </div>
                        <Separator />
                        <div className="my-4">
                            <Button className="py-4 w-full" variant={"default"} onClick={props.onExport} disabled={props.noStartNode}>Export</Button>
                        </div>
                    </SidebarGroup>
                    <SidebarGroup />
                </SidebarContent>
                <SidebarFooter />
            </Sidebar>
        </div>
    );
}
