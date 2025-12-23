import { AppSidebar } from "@/components/layouts";
import { SidebarProvider } from "@/components/ui/sidebar";

type Props = {
  children: React.ReactNode;
};

export function MainLayout({ children }: Props) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />

      <main className="p-20 w-full">{children}</main>
    </SidebarProvider>
  );
}
