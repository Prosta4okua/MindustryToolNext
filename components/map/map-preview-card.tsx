'use client';

import React from 'react';

import CopyButton from '@/components/button/copy-button';
import DownloadButton from '@/components/button/download-button';
import DislikeButton from '@/components/like/dislike-button';
import LikeButton from '@/components/like/like-button';
import LikeComponent from '@/components/like/like-component';
import LikeCount from '@/components/like/like-count';
import { Preview, PreviewActions, PreviewDescription, PreviewHeader, PreviewImage } from '@/components/common/preview';
import env from '@/constant/env';
import { MapPreview } from '@/types/response/MapPreview';
import { LinkIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import ColorText from '@/components/common/color-text';

type MapPreviewCardProps = {
  map: MapPreview;
};

function InternalMapPreviewCard({ map: { id, itemId, name, isVerified, likes, userLike } }: MapPreviewCardProps) {
  const link = `${env.url.base}/admin/maps/${id}`;
  const detailLink = `/maps/${id}`;
  const imageLink = `${env.url.image}/map-previews/${id}${env.imageFormat}`;
  const errorImageLink = `${env.url.api}/maps/${id}/image`;
  const downloadLink = `${env.url.api}/maps/${id}/download`;
  const downloadName = `{${name}}.msch`;

  return (
    <Preview>
      <CopyButton position="absolute" variant="ghost" data={link} content={link}>
        <LinkIcon />
      </CopyButton>
      <InternalLink href={detailLink}>
        <PreviewImage src={imageLink} errorSrc={errorImageLink} alt={name} />
      </InternalLink>
      <PreviewDescription>
        <PreviewHeader>
          <ColorText text={name} />
        </PreviewHeader>
        <PreviewActions>
          <DownloadButton href={downloadLink} fileName={downloadName} />
          {isVerified && (
            <LikeComponent itemId={itemId} initialLikeCount={likes} initialLikeData={userLike}>
              <LikeButton />
              <LikeCount />
              <DislikeButton />
            </LikeComponent>
          )}
        </PreviewActions>
      </PreviewDescription>
    </Preview>
  );
}

const MapPreviewCard = React.memo(InternalMapPreviewCard);

export default MapPreviewCard;
