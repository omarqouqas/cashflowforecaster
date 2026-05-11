'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { User, Sliders, Bell, FileText, CreditCard } from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'preferences', label: 'Preferences', icon: Sliders },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'invoicing', label: 'Invoicing', icon: FileText },
  { id: 'billing', label: 'Billing', icon: CreditCard },
] as const;

export type SettingsTab = (typeof tabs)[number]['id'];

interface SettingsTabsProps {
  children: React.ReactNode;
  defaultTab?: SettingsTab;
}

export function SettingsTabs({ children, defaultTab = 'profile' }: SettingsTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<SettingsTab>(defaultTab);

  // Sync with URL on mount and when searchParams change
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as SettingsTab | null;
    if (tabFromUrl && tabs.some((t) => t.id === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: SettingsTab) => {
    setActiveTab(tabId);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tabId);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-zinc-800 mb-6">
        <nav className="-mb-px flex space-x-1 overflow-x-auto scrollbar-hide" aria-label="Settings tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={[
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap',
                  'border-b-2 transition-colors duration-150',
                  isActive
                    ? 'border-teal-500 text-teal-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-600',
                ].join(' ')}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {children}
    </div>
  );
}

export function SettingsTabContent({
  tabId,
  activeTab,
  children,
}: {
  tabId: SettingsTab;
  activeTab: SettingsTab;
  children: React.ReactNode;
}) {
  if (tabId !== activeTab) return null;
  return <div className="animate-in fade-in duration-200">{children}</div>;
}

// Export for use in server component
export { tabs as settingsTabs };
