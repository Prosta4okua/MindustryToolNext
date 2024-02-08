'use client';

import Markdown from '@/components/common/markdown';
import LikeComponent from '@/components/like/like-component';
import TagCard from '@/components/tag/tag-card';
import BackButton from '@/components/ui/back-button';
import IdUserCard from '@/components/user/id-user-card';
import { Tags } from '@/types/response/Tag';
import { Post } from '@/types/response/Post';
import React from 'react';
import Detail from '@/components/detail/detail';

type PostDetailProps = {
  post: Post;
  padding?: boolean;
};

export default function PostDetail({ post, padding }: PostDetailProps) {
  const displayTags = Tags.parseStringArray(post.tags);

  return (
    <Detail padding={padding}>
      <header className="grid gap-2">
        <p className="text-4xl">{post.header}</p>
        <IdUserCard id={post.authorId} />
        <section className="flex flex-wrap items-center gap-1">
          {displayTags.map((value) => (
            <TagCard key={value.name + value.value} tag={value} />
          ))}
        </section>
      </header>
      <Markdown>{post.content}</Markdown>
      <footer>
        <div className="flex items-center justify-end gap-2">
          <LikeComponent
            targetId={post.id}
            targetType="POSTS"
            initialLikeCount={post.like}
            initialLikeData={post.userLike}
          >
            <LikeComponent.LikeButton />
            <LikeComponent.LikeCount  />
            <LikeComponent.DislikeButton  />
          </LikeComponent>
          <BackButton />
        </div>
      </footer>
    </Detail>
  );
}
