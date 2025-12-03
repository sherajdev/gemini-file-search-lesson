'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Database, Home, Search } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Stores',
    href: '/stores',
    icon: Database,
  },
  {
    name: 'Explorer',
    href: '/explorer',
    icon: Search,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col border-r border-gray-200 bg-white md:flex shadow-sm">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-100 px-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-sm">
              <Search className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">
              Gemini File Search
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5',
                    isActive ? 'text-blue-700' : 'text-gray-400'
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4">
          <p className="text-xs text-gray-500">
            Powered by Google Gemini API
          </p>
        </div>
      </div>

      {/* Mobile sidebar (hidden for now, can be enhanced later) */}
      <div className="md:hidden">
        <div className="fixed inset-0 z-50 hidden bg-gray-900/80" />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="flex h-16 items-center border-b border-gray-200 bg-white px-4 md:hidden">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Search className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">
              Gemini File Search
            </span>
          </Link>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
