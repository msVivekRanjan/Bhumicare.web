import AppSidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppFooter } from '@/components/layout/footer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon">
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          <AppFooter />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
