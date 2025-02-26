import React, { Suspense } from 'react';

import ClientChart from '@/components/metric/client-chart';
import LikeChart from '@/components/metric/like-chart';
import LoginChart from '@/components/metric/login-chart';
import LoginHistory from '@/components/metric/login-history';
import LoginLog from '@/components/metric/login-log';
import { Skeleton } from '@/components/ui/skeleton';
import ScrollContainer from '@/components/common/scroll-container';
import { cn } from '@/lib/utils';

export const experimental_ppr = true;

const NUMBER_OF_DAY = 15;

export default async function Page() {
  const start = new Date();
  const end = new Date();
  end.setUTCHours(23, 59, 59, 999);

  start.setDate(new Date().getDate() - NUMBER_OF_DAY);

  return (
    <ScrollContainer className="flex h-full w-full flex-col gap-2 overflow-y-auto overflow-x-hidden bg-background p-2">
      <div className="flex w-full flex-wrap gap-2">
        <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
          <Suspense fallback={<ChartSkeleton className="col-span-2" />}>
            <ClientChart start={start} end={end} dates={NUMBER_OF_DAY} />
          </Suspense>
          <Suspense fallback={<ChartSkeleton />}>
            <LikeChart start={start} end={end} dates={NUMBER_OF_DAY} />
          </Suspense>
          <Suspense fallback={<ChartSkeleton />}>
            <LoginChart start={start} end={end} dates={NUMBER_OF_DAY} />
          </Suspense>
        </div>
        <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
          <Suspense fallback={<ChartSkeleton />}>
            <LoginLog />
          </Suspense>
          <Suspense fallback={<ChartSkeleton />}>
            <LoginHistory />
          </Suspense>
        </div>
      </div>
    </ScrollContainer>
  );
}

function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex aspect-video h-full w-full flex-col gap-2 bg-card', className)}>
      <Skeleton className="h-full w-full" />
    </div>
  );
}
