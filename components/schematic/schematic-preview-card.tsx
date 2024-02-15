'use client';

import React, { HTMLAttributes } from 'react';
import Preview from '@/components/preview/preview';
import { Schematic } from '@/types/response/Schematic';
import env from '@/constant/env';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import LikeComponent from '@/components/like/like-component';
import { toast } from '@/hooks/use-toast';
import CopyButton from '@/components/button/copy-button';
import DownloadButton from '@/components/button/download-button';
import useClientAPI from '@/hooks/use-client';
import getSchematicData from '@/query/schematic/get-schematic-data';
import DislikeButton from '@/components/like/dislike-button';
import LikeButton from '@/components/like/like-button';
import LikeCount from '@/components/like/like-count';
import { useI18n } from '@/locales/client';
import useToastAction from '@/hooks/use-toast-action';

type SchematicPreviewCardProps = HTMLAttributes<HTMLDivElement> & {
  schematic: Schematic;
};

export default function SchematicPreviewCard({
  className,
  schematic,
  ...rest
}: SchematicPreviewCardProps) {
  const t = useI18n();
  const { axios } = useClientAPI();

  const link = `${env.url.base}/schematics/${schematic.id}`;

  const getData = useToastAction({
    title: t('copying'),
    content: t('downloading-data'),
    action: async () => await getSchematicData(axios, schematic.id),
  });


  return (
    <Preview
      className={cn('group relative flex flex-col', className)}
      {...rest}
    >
      <CopyButton
        className="absolute left-1 top-1 aspect-square transition-opacity duration-500 group-hover:opacity-100 md:opacity-0"
        title="Copy"
        variant="ghost"
        data={link}
        content={link}
      />
      <Link href={`/schematics/${schematic.id}`}>
        <Preview.Image
          src={`${env.url.image}/schematics/${schematic.id}.png`}
          errorSrc={`${env.url.api}/schematics/${schematic.id}/image`}
          alt={schematic.name}
        />
      </Link>
      <Preview.Description>
        <Preview.Header className="h-12">{schematic.name}</Preview.Header>
        <Preview.Actions>
          <CopyButton
            className="border border-border "
            title="Copied"
            variant="outline"
            content={`Copied schematic ${schematic.name}`}
            data={getData}
          />
          <DownloadButton
            href={`${env.url.api}/schematics/${schematic.id}/download`}
          />
          <LikeComponent
            targetId={schematic.id}
            targetType="SCHEMATICS"
            initialLikeCount={schematic.like}
            initialLikeData={schematic.userLike}
          >
            <LikeButton />
            <LikeCount />
            <DislikeButton />
          </LikeComponent>
        </Preview.Actions>
      </Preview.Description>
    </Preview>
  );
}
