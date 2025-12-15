import { cn } from '@/lib/utils'

export function OrDivider({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="h-px flex-1 bg-zinc-200" />
      <span className="text-sm text-zinc-500">or</span>
      <div className="h-px flex-1 bg-zinc-200" />
    </div>
  )
}


