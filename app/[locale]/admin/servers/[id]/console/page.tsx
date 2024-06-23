'use client';

import React, {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import ColorText from '@/components/common/color-text';
import InfiniteScrollList from '@/components/common/infinite-scroll-list';
import LoadingSpinner from '@/components/common/loading-spinner';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/context/socket-context';
import useSearchId from '@/hooks/use-search-id-params';
import { isReachedEnd } from '@/lib/utils';
import { useI18n } from '@/locales/client';

import { InfiniteData, useQueryClient } from '@tanstack/react-query';

type ServerMessageData = InfiniteData<Array<string>, unknown> | undefined;

const queryParam = { page: 0, items: 40 };

export default function Page() {
  const { id } = useSearchId();

  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  let [messagesCursor, setMessageCursor] = useState(0);

  const { socket, state } = useSocket();
  const container = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState<string>('');
  const bottomRef = useRef<HTMLSpanElement>(null);
  const queryClient = useQueryClient();

  const t = useI18n();

  useEffect(() => {
    setTimeout(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1000);
  }, []);

  const handleReceiveMessage = useCallback(
    (query: ServerMessageData, message: string) => {
      if (!query) {
        return undefined;
      }

      const { pages, ...data } = query;

      let [firstPage, ...rest] = pages;
      firstPage = [message, ...firstPage];

      return {
        ...data,
        pages: [firstPage, ...rest],
      };
    },
    [],
  );

  const handleScrollOnMessage = useCallback(() => {
    setTimeout(() => {
      if (!bottomRef.current || !container.current) {
        return;
      }

      if (!isReachedEnd(container.current)) {
        return;
      }

      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  useEffect(() => {
    socket.send({ method: 'JOIN_ROOM', data: `SERVER-${id}` });

    socket
      .onRoom(`SERVER-${id}`) //
      .onMessage('SERVER_MESSAGE', (message) => {
        queryClient.setQueryData<ServerMessageData>(
          ['server-message', id],
          (query) => handleReceiveMessage(query, message),
        );

        handleScrollOnMessage();
      });
  }, [queryClient, socket, id, handleReceiveMessage, handleScrollOnMessage]);

  const sendMessage = async () => {
    const data = message.startsWith('/')
      ? message.substring(1)
      : 'say ' + message;

    if (socket && state === 'connected') {
      socket.onRoom(`SERVER-${id}`).send({ data, method: 'SERVER_MESSAGE' });
      setMessageHistory((prev) => [...prev, message]);
      setMessage('');
    }

    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    sendMessage();
    event.preventDefault();
  };

  function handleKeyPress(event: KeyboardEvent<HTMLInputElement>) {
    if (messageHistory.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowUp': {
        setMessageCursor((prev) => {
          prev--;

          if (prev < 0) {
            return messageHistory.length - 1;
          }

          return prev;
        });
        setMessage(messageHistory[messagesCursor]);
        break;
      }

      case 'ArrowDown': {
        setMessageCursor((prev) => {
          prev++;

          prev = prev % messageHistory.length;

          return prev;
        });
        setMessage(messageHistory[messagesCursor]);
        break;
      }
    }
  }

  return (
    <div className="grid h-full w-full grid-rows-[1fr_3rem] gap-2 overflow-hidden bg-card px-2 pt-2">
      <div className="grid h-full w-full overflow-hidden">
        <div className="flex h-full flex-col gap-1 overflow-y-auto overflow-x-hidden bg-black/80 text-white">
          {state !== 'connected' ? (
            <LoadingSpinner className="m-auto h-5 w-5 flex-1" />
          ) : (
            <div className="h-full overflow-y-auto" ref={container}>
              <InfiniteScrollList
                className="flex flex-col gap-1 overflow-hidden h-full"
                queryKey={['server-message', id]}
                reversed
                container={() => container.current}
                params={queryParam}
                end={<></>}
                getFunc={(_, params) =>
                  socket
                    .onRoom(`SERVER-${id}`)
                    .await({ method: 'GET_MESSAGE', ...params })
                }
              >
                {(data, index) => (
                  <ColorText
                    className="w-full text-wrap rounded-lg bg-background p-2"
                    key={index}
                    text={data}
                  ></ColorText>
                )}
              </InfiniteScrollList>
              <span ref={bottomRef}></span>
            </div>
          )}
        </div>
      </div>
      <form
        className="flex h-10 flex-1 gap-1"
        name="text"
        onSubmit={handleFormSubmit}
      >
        <input
          className="h-full w-full rounded-sm border border-border bg-background px-2 outline-none"
          value={message}
          onKeyDown={handleKeyPress}
          onChange={(event) => setMessage(event.currentTarget.value)}
        />
        <Button
          className="h-full"
          variant="primary"
          type="submit"
          title={t('send')}
          disabled={state !== 'connected' || !message}
        >
          {t('send')}
        </Button>
      </form>
    </div>
  );
}
