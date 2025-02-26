import ColorText from '@/components/common/color-text';
import { Skeleton } from '@/components/ui/skeleton';
import ColorAsRole from '@/components/user/color-as-role';
import UserAvatar from '@/components/user/user-avatar';
import useClientApi from '@/hooks/use-client';
import { cn } from '@/lib/utils';
import { MessageGroup } from '@/types/response/Message';

import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/query/user';

type Props = {
  className?: string;
  message: MessageGroup;
};

const ONE_HOUR = 1000 * 60 * 60;
const ONE_DAY = ONE_HOUR * 24;

export function MessageCard({ className, message }: Props) {
  const { userId, contents, createdAt } = message;
  const axios = useClientApi();

  const { data } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => getUser(axios, { id: userId }),
  });

  const diff = Date.now() - Date.parse(createdAt);
  const time = diff > ONE_DAY ? new Date(createdAt).toLocaleString() : new Date(createdAt).toLocaleTimeString();

  return (
    <div className={cn('flex w-full gap-2 text-wrap rounded-lg p-2 text-xs', className)}>
      {data ? <UserAvatar user={data} /> : <Skeleton className="flex size-8 min-h-8 min-w-8 items-center justify-center rounded-full border border-border capitalize" />}
      <div className="overflow-hidden">
        <div className="flex gap-2">
          {data ? (
            <ColorAsRole className="font-semibold capitalize" roles={data.roles}>
              {data.name}
            </ColorAsRole>
          ) : (
            <Skeleton className="h-4 max-h-1 w-24" />
          )}
          <span>{time}</span>
        </div>
        <div className="no-scrollbar grid w-full gap-1 overflow-hidden">
          {contents.map(({ text }, index) => (
            <ColorText className="overflow-hidden break-words" key={index} text={text} />
          ))}
        </div>
      </div>
    </div>
  );
}
