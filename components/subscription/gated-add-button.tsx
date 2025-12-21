// components/subscription/gated-add-button.tsx
// ============================================
// Gated Add Button - Shows upgrade prompt when limit reached
// ============================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UpgradePrompt } from './upgrade-prompt';

interface GatedAddButtonProps {
  href: string;
  feature: 'bills' | 'income';
  currentCount: number;
  limit: number;
  label?: string;
}

export function GatedAddButton({ 
  href, 
  feature, 
  currentCount, 
  limit,
  label 
}: GatedAddButtonProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const isAtLimit = limit !== Infinity && currentCount >= limit;
  const buttonLabel = label || (feature === 'bills' ? 'Add Bill' : 'Add Income');

  if (isAtLimit) {
    return (
      <>
        <Button 
          variant="primary" 
          onClick={() => setShowUpgradeModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          {buttonLabel}
        </Button>
        
        <UpgradePrompt
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          feature={feature}
          currentCount={currentCount}
          limit={limit}
        />
      </>
    );
  }

  return (
    <Link href={href}>
      <Button variant="primary">
        <Plus className="w-4 h-4 mr-2" />
        {buttonLabel}
      </Button>
    </Link>
  );
}
