import type { CalendarDay } from './types';

export interface BillCollision {
  date: Date;
  bills: Array<{
    id: string;
    name: string;
    amount: number;
  }>;
  totalAmount: number;
  severity: 'warning' | 'critical'; // warning: 2-3 bills, critical: 4+ bills or total > threshold
}

export interface CollisionSummary {
  collisions: BillCollision[];
  hasCollisions: boolean;
  criticalCount: number;
  warningCount: number;
  highestCollisionAmount: number;
  highestCollisionDate: Date | null;
}

export function detectBillCollisions(
  days: CalendarDay[],
  options?: {
    minBillsForWarning?: number; // default: 2
    minBillsForCritical?: number; // default: 4
    amountThresholdForCritical?: number; // default: 1000
  }
): CollisionSummary {
  const minBillsForWarning = options?.minBillsForWarning ?? 2;
  const minBillsForCritical = options?.minBillsForCritical ?? 4;
  const amountThresholdForCritical = options?.amountThresholdForCritical ?? 1000;

  const collisions: BillCollision[] = [];

  for (const day of days) {
    // Filter out zero-amount bills since they don't contribute to financial collisions
    const bills = (day.bills ?? []).filter(b => (b.amount ?? 0) > 0);
    if (bills.length < minBillsForWarning) continue;

    const totalAmount = bills.reduce((sum, b) => sum + (b.amount ?? 0), 0);
    const severity: BillCollision['severity'] =
      bills.length >= minBillsForCritical || totalAmount > amountThresholdForCritical
        ? 'critical'
        : 'warning';

    collisions.push({
      date: new Date(day.date),
      bills: bills.map((b) => ({
        id: b.id,
        name: b.name,
        amount: b.amount,
      })),
      totalAmount,
      severity,
    });
  }

  collisions.sort((a, b) => a.date.getTime() - b.date.getTime());

  let criticalCount = 0;
  let warningCount = 0;
  let highestCollisionAmount = 0;
  let highestCollisionDate: Date | null = null;

  for (const c of collisions) {
    if (c.severity === 'critical') criticalCount++;
    else warningCount++;

    if (c.totalAmount > highestCollisionAmount) {
      highestCollisionAmount = c.totalAmount;
      highestCollisionDate = new Date(c.date);
    }
  }

  return {
    collisions,
    hasCollisions: collisions.length > 0,
    criticalCount,
    warningCount,
    highestCollisionAmount,
    highestCollisionDate,
  };
}


