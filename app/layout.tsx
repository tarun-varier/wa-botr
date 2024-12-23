import type { Metadata } from "next";
import "@/ui/globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BlockSidebar } from "@/ui/components/BlockSidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { initialEdges, initialNodes } from "./lib/initialData";
import { ReactFlowProvider } from "@xyflow/react";


export const metadata: Metadata = {
  title: "WA Botr",
  description: "Creates WA Bots",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ReactFlowProvider>
            <main>{children}</main>
          </ReactFlowProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
