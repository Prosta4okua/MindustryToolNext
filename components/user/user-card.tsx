import { Skeleton } from '@/components/ui/skeleton';
import ColorAsRole from '@/components/user/color-as-role';
import UserAvatar from '@/components/user/user-avatar';
import User from '@/types/response/User';
import React from 'react';

type UserCardProps = {
  user: User;
};
function UserCard({ user }: UserCardProps) {
  const { name, role } = user;

  return (
    <div className="flex w-56 items-end gap-2 overflow-hidden">
      <UserAvatar user={user} />
      <ColorAsRole className="capitalize" role={role}>
        {name}
      </ColorAsRole>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex w-56 items-start justify-start gap-2">
      <Skeleton className="block h-8 w-8 rounded-full border border-border" />
      <Skeleton className="flex-1" />
    </div>
  );
}

UserCard.Loading = Loading;

export default UserCard;
