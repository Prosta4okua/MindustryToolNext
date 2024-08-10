'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import DeleteButton from '@/components/button/delete-button';
import TakeDownButton from '@/components/button/take-down-button';
import Markdown from '@/components/common/markdown';
import { Detail } from '@/components/detail/detail';
import DislikeButton from '@/components/like/dislike-button';
import LikeButton from '@/components/like/like-button';
import LikeComponent from '@/components/like/like-component';
import LikeCount from '@/components/like/like-count';
import TagContainer from '@/components/tag/tag-container';
import BackButton from '@/components/ui/back-button';
import IdUserCard from '@/components/user/id-user-card';
import { useSession } from '@/context/session-context';
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import ProtectedElement from '@/layout/protected-element';
import { useI18n } from '@/locales/client';
import deletePost from '@/query/post/delete-post';
import putRemovePost from '@/query/post/put-remove-post';
import { PostDetail } from '@/types/response/PostDetail';
import { Tags } from '@/types/response/Tag';

import { useMutation } from '@tanstack/react-query';

type PostDetailCardProps = {
  post: PostDetail;
};

export default function PostDetailCard({ post }: PostDetailCardProps) {
  const displayTags = Tags.parseStringArray(post.tags);
  const axios = useClientAPI();
  const {  invalidateByKey } = useQueriesData();
  const { back } = useRouter();
  const { toast } = useToast();
  const { session } = useSession();

  const t = useI18n();

  const { mutate: removePost, isPending: isRemoving } = useMutation({
    mutationFn: (id: string) => putRemovePost(axios, id),
    onSuccess: () => {
      invalidateByKey(['post-uploads']);
      back();
      toast({
        title: t('take-down-success'),
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: t('take-down-fail'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const { mutate: deletePostById, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deletePost(axios, id),
    onSuccess: () => {
      invalidateByKey(['total-post-uploads']);
      invalidateByKey(['posts']);
      back();
      toast({
        title: t('delete-success'),
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: t('delete-fail'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const isLoading = isDeleting || isRemoving;

  return (
    <Detail>
      <header className="grid gap-2 pb-4">
        <p className="text-4xl">{post.title}</p>
        <div className="grid gap-2">
          <IdUserCard id={post.userId} />
          <span>{new Date(post.createdAt).toLocaleString()}</span>
          <TagContainer tags={displayTags} />
        </div>
        <div className="h-full flex flex-1">
          <Markdown>{post.content}</Markdown>
        </div>
      </header>
      <footer className="flex gap-1 rounded-md bg-card p-2">
        <LikeComponent
          itemId={post.itemId}
          initialLikeCount={post.likes}
          initialLikeData={post.userLike}
        >
          <LikeButton />
          <LikeCount />
          <DislikeButton />
        </LikeComponent>
        <ProtectedElement
          session={session}
          ownerId={post.userId}
          show={post.isVerified}
        >
          <TakeDownButton
            isLoading={isLoading}
            description={`Take down this post: ${post.title}`}
            onClick={() => removePost(post.id)}
          />
        </ProtectedElement>
        <ProtectedElement session={session} ownerId={post.userId}>
          <DeleteButton
            description={`${t('delete')} ${post.title}`}
            isLoading={isLoading}
            onClick={() => deletePostById(post.id)}
          />
        </ProtectedElement>
        <BackButton className="ml-auto" />
      </footer>
    </Detail>
  );
}
