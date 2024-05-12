'use client';

import InfinitePage from '@/components/common/infinite-page';
import LoadingScreen from '@/components/common/loading-screen';
import InternalServerMapCard from '@/components/server/internal-server-map-card';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import { Button } from '@/components/ui/button';
import useClientAPI from '@/hooks/use-client';
import useSafeParam from '@/hooks/use-safe-param';
import { useI18n } from '@/locales/client';
import getMaps from '@/query/map/get-maps';
import getInternalServerMaps from '@/query/server/get-internal-server-maps';
import postInternalServerMap from '@/query/server/post-internal-server-map';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { useMutation } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import env from '@/constant/env';
import Preview from '@/components/preview/preview';
import NameTagSearch from '@/components/search/name-tag-search';
import useQueriesData from '@/hooks/use-queries-data';
import { useSearchTags } from '@/hooks/use-tags';
import useSearchPageParams from '@/hooks/use-search-page-params';
import { Skeleton } from '@/components/ui/skeleton';

export default function Page() {
  const scrollContainer = useRef<HTMLDivElement | null>();
  const id = useSafeParam().get('id');

  return (
    <div className="flex flex-col gap-2 overflow-hidden">
      <div className=" flex justify-end bg-card p-2">
        <AddMapDialog serverId={id} />
      </div>
      <div
        className="flex h-full w-full flex-col gap-2 overflow-y-auto bg-card p-2"
        ref={(ref) => {
          scrollContainer.current = ref;
        }}
      >
        <InfinitePage
          params={{ page: 0, items: 20 }}
          queryKey={['internal-server-maps', id]}
          getFunc={(axios, params) => getInternalServerMaps(axios, id, params)}
          scrollContainer={scrollContainer.current}
          skeleton={{
            amount: 20,
            item: <PreviewSkeleton />,
          }}
        >
          {(data) => <InternalServerMapCard key={data.id} map={data} />}
        </InfinitePage>
      </div>
    </div>
  );
}

type AddMapDialogProps = {
  serverId: string;
};

function AddMapDialog({ serverId }: AddMapDialogProps) {
  const { toast } = useToast();
  const { map } = useSearchTags();
  const [show, setShow] = useState(false);
  const { axios } = useClientAPI();
  const t = useI18n();

  const { invalidateByKey } = useQueriesData();

  //TODO: Fix search
  const params = useSearchPageParams();
  const scrollContainer = useRef<HTMLDivElement | null>();

  const { mutate, isPending } = useMutation({
    mutationFn: (mapId: string) =>
      postInternalServerMap(axios, serverId, { mapId }),
    onError: (error) => {
      toast({
        title: t('server.upload-fail'),
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      setShow(false);
      invalidateByKey(['internal-server-maps']);
    },
  });

  if (isPending) {
    return <LoadingScreen />;
  }

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild>
        <Button
          className="ml-auto"
          title={t('internal-server.add-map')}
          variant="secondary"
        >
          {t('internal-server.add-map')}
        </Button>
      </DialogTrigger>
      <DialogContent className="h-full w-full">
        <DialogTitle>{t('internal-server.select-map')}</DialogTitle>
        <div className="flex h-full flex-col justify-start gap-2 overflow-hidden">
          <NameTagSearch tags={map} />
          <div
            className="flex h-full w-full flex-col gap-2 overflow-y-auto bg-card p-2"
            ref={(ref) => {
              scrollContainer.current = ref;
            }}
          >
            <InfinitePage
              params={params}
              queryKey={['internal-server-maps']}
              getFunc={(axios, params) => getMaps(axios, params)}
              scrollContainer={scrollContainer.current}
              skeleton={{
                amount: 20,
                item: <Skeleton className="h-preview-height" />,
              }}
            >
              {({ id, name }) => (
                <Button
                  className="flex h-full max-h-preview-height w-full flex-col items-start justify-start rounded-md border border-border p-2 text-start hover:bg-button"
                  variant="outline"
                  key={id}
                  title={name}
                  onClick={() => mutate(id)}
                >
                  <h3>{name}</h3>
                  <Preview.Image
                    src={`${env.url.image}/maps/${id}.png`}
                    errorSrc={`${env.url.api}/maps/${id}/image`}
                    alt={name}
                  />
                </Button>
              )}
            </InfinitePage>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}