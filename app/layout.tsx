import type { Metadata } from "next";
import "@/ui/globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BlockSidebar } from "@/ui/components/BlockSidebar";
import { ThemeProvider } from "@/components/theme-provider";


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
      <body
      >
        <SidebarProvider>
          <BlockSidebar />
          <main>
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
