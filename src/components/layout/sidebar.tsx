'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  Bell,
  Settings,
  FileText,
  MessageSquare,
  LifeBuoy,
} from 'lucide-react';

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { BhumicareLogo } from '@/components/icons';
import { useTranslation } from '@/hooks/use-translation';

export default function AppSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const menuItems = [
    { href: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/farm-map', label: t('farm_map'), icon: Map },
    { href: '/reports', label: t('reports'), icon: FileText },
    { href: '/community', label: t('community_forum'), icon: MessageSquare },
    { href: '/alerts', label: t('alerts'), icon: Bell },
    { href: '/settings', label: t('settings'), icon: Settings },
    { href: '/support', label: t('help_support'), icon: LifeBuoy },
  ];

  return (
    <>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 p-2">
          <BhumicareLogo className="w-8 h-8 text-primary" />
          <span className="font-headline text-lg font-semibold group-data-[collapsible=icon]:hidden">
            {t('bhumicare')}
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
