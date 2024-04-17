'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Button } from '@/components/ui/button';
import LoadingWrapper from '@/components/common/loading-wrapper';
import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useI18n } from '@/locales/client';

type RemoveButtonProps = {
  isLoading: boolean;
  onClick: () => void;
  description: string;
};

export default function RemoveButton({
  isLoading,
  description,
  onClick,
}: RemoveButtonProps) {
  const t = useI18n();

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className="flex items-center justify-center rounded-md border p-2"
        disabled={isLoading}
      >
        <LoadingWrapper isLoading={isLoading}>
          <TrashIcon className="h-5 w-5" />
        </LoadingWrapper>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('are-you-sure')}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive"
            asChild
          >
            <Button title={t('remove')} onClick={onClick}>
              {t('remove')}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}