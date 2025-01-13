"use client";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from "@/components/ui/sidebar";
import { FC, MouseEventHandler } from "react";
interface IBlockSidebarProps {
    addClick: MouseEventHandler<HTMLButtonElement>;
    setNodeType: React.Dispatch<React.SetStateAction<string>>;
    onExport: () => void;
};


export const BlockSidebar: FC<IBlockSidebarProps> = (props) => {
    return (
        <div>
            <Sidebar >
                <SidebarHeader>Triggers</SidebarHeader>
                <SidebarContent style={{ scrollbarWidth: "none" }}>
                    <SidebarGroup className="grid grid-cols-2 gap-4 w-full">
                        <Button className="py-4" variant={"default"} onClick={(e) => {
                            props.setNodeType("flowStartNode")
                            props.addClick(e)
                        }} >Add Start Node</Button>
                        <Button className="py-4" variant={"default"} onClick={(e) => {
                            props.setNodeType("flowNode")
                            props.addClick(e)
                        }} >Add Node</Button>
                        <Button className="py-4" variant={"default"} onClick={props.onExport} >Export</Button>
                    </SidebarGroup>
                    <SidebarGroup />
                </SidebarContent>
                <SidebarFooter />
            </Sidebar>
        </div>
    );
}
