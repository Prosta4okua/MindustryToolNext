'use client';

import { Like } from '@/types/response/Like';
import React, { useState } from 'react';
import { ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { LikeAction, LikeTarget } from '@/constant/enum';
import { useMutation } from '@tanstack/react-query';
import postLike from '@/query/like/post-like';
import useClientAPI from '@/hooks/use-client';
import { FakeLike, LikeContext } from '@/context/like-context';


type LikeComponentProps = {
  children: ReactNode;
  initialLikeCount: number;
  initialLikeData: Like;
  targetType: LikeTarget;
  targetId: string;
};

function LikeComponent({
  initialLikeCount = 0,
  initialLikeData,
  children,
  targetType,
  targetId,
}: LikeComponentProps) {
  const { data: session, status } = useSession();
  const { axios } = useClientAPI();
  const [likeData, setLikeData] = useState({
    ...(initialLikeData ?? FakeLike),
    count: initialLikeCount,
  });
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (action: LikeAction) =>
      await postLike(axios, {
        action,
        targetType,
        targetId,
      }),
  });

  const requireLogin = () => {
    toast({
      title: 'You are not logged in',
      description: 'Login in to like',
    });
  };

  const handleLike = () => {
    if (isPending) {
      return;
    }

    if (status !== 'authenticated' || !session?.user) {
      return requireLogin();
    }

    const change = likeData.state === -1 ? 2 : likeData.state === 0 ? 1 : -1;
    const state = likeData.state === -1 ? 1 : likeData.state === 0 ? 1 : 0;

    setLikeData({
      ...likeData,
      state,
      count: likeData.count + change,
    });
    return mutate('LIKE', {
      onError: () => setLikeData({ ...likeData }),
      onSuccess: (result) =>
        setLikeData({ count: likeData.count + result.amount, ...result.like }),
    });
  };

  const handleDislike = () => {
    if (isPending) {
      return;
    }

    if (status !== 'authenticated' || !session?.user) {
      return requireLogin();
    }

    const change = likeData.state === 1 ? 2 : likeData.state === 0 ? 1 : -1;
    const state = likeData.state === 1 ? -1 : likeData.state === 0 ? -1 : 0;

    setLikeData({
      ...likeData,
      state,
      count: likeData.count - change,
    });

    return mutate('DISLIKE', {
      onError: () => setLikeData({ ...likeData }),
      onSuccess: (result) =>
        setLikeData({ count: likeData.count + result.amount, ...result.like }),
    });
  };

  return (
    <LikeContext.Provider
      value={{
        likeData,
        isLoading: status === 'loading' || isPending,
        handleLike,
        handleDislike,
      }}
    >
      {children}
    </LikeContext.Provider>
  );
}

export default LikeComponent;
