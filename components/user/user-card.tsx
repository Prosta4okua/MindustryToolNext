import React from 'react';

import ColorAsRole from '@/components/user/color-as-role';
import UserAvatar from '@/components/user/user-avatar';
import { User } from '@/types/response/User';
import InternalLink from '@/components/common/internal-link';

type UserCardProps = {
  user: Omit<User, 'authorities'> | null;
};
function UserCard({ user }: UserCardProps) {
  if (!user) {
    return;
  }

  const { id, name, roles } = user;

  return (
    <div className="flex h-8 items-end gap-2 overflow-hidden">
      <UserAvatar user={user} />
      <InternalLink href={`/users/${id}`}>
        <ColorAsRole className="font-semibold capitalize" roles={roles}>
          {name}
        </ColorAsRole>
      </InternalLink>
    </div>
  );
}

export default UserCard;
