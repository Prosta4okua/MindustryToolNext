import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type UserAvatarProps = {
  className?: string;
  user: {
    name?: string | null;
    id: string;
    imageUrl: string;
  };
};

const colorArray = [
  '#FF6633',
  '#FFB399',
  '#FF33FF',
  '#FFFF99',
  '#00B3E6',
  '#E6B333',
  '#3366E6',
  '#999966',
  '#99FF99',
  '#B34D4D',
  '#80B300',
  '#809900',
  '#E6B3B3',
  '#6680B3',
  '#66991A',
  '#FF99E6',
  '#CCFF1A',
  '#FF1A66',
  '#E6331A',
  '#33FFCC',
  '#66994D',
  '#B366CC',
  '#4D8000',
  '#B33300',
  '#CC80CC',
  '#66664D',
  '#991AFF',
  '#E666FF',
  '#4DB3FF',
  '#1AB399',
  '#E666B3',
  '#33991A',
  '#CC9999',
  '#B3B31A',
  '#00E680',
  '#4D8066',
  '#809980',
  '#E6FF80',
  '#1AFF33',
  '#999933',
  '#FF3380',
  '#CCCC00',
  '#66E64D',
  '#4D80CC',
  '#9900B3',
  '#E64D66',
  '#4DB380',
  '#FF4D4D',
  '#99E6E6',
  '#6666FF',
];

export default function UserAvatar({
  className,
  user: { id, imageUrl, name },
}: UserAvatarProps) {
  const [isError, setError] = useState(false);

  const username = name ?? '';

  const render = () => {
    if (isError || !imageUrl) {
      let total = 0;
      for (let i = 0; i < username.length; i++) {
        total += username.charCodeAt(i);
      }
      const color = colorArray[total % colorArray.length];
      return (
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full border border-border capitalize',
            className,
          )}
          style={{ backgroundColor: color }}
        >
          {username.at(0)}
        </div>
      );
    }

    return (
      <Image
        className={cn('rounded-full border border-border', className)}
        height={32}
        width={32}
        src={imageUrl}
        alt={username}
        onError={() => setError(true)}
      />
    );
  };

  return <Link href={`users/${id}`}>{render()}</Link>;
}
