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
            <Sidebar>
                <SidebarHeader>Block Sidebar</SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <Button className="p-8" variant={"default"} onClick={props.setnodes}></Button>
                    </SidebarGroup>
                    <SidebarGroup />
                </SidebarContent>
                <SidebarFooter />
            </Sidebar>
        </div>
    );
}
