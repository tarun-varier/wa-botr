"use client";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from "@/components/ui/sidebar";
import { FC, MouseEventHandler } from "react";
interface IBlockSidebarProps {
    setnodes: MouseEventHandler<HTMLButtonElement>
};


export const BlockSidebar: FC<IBlockSidebarProps> = (props) => {
    return (
        <div>
            <Sidebar >
                <SidebarHeader>Triggers</SidebarHeader>
                <SidebarContent style={{ scrollbarWidth: "none" }}>
                    <SidebarGroup className="flex flex-row w-full">
                        <Button className="w-full py-8 mx-2" variant={"default"} onClick={props.setnodes} >Add</Button>
                        <Button className="w-full py-8 mx-2" variant={"default"} >Delete</Button>
                    </SidebarGroup>
                    <SidebarGroup />
                </SidebarContent>
                <SidebarFooter />
            </Sidebar>
        </div>
    );
}
