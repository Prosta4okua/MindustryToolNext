'use client';

import React, { Dispatch, SetStateAction } from 'react';
import Command from '../command';
import { Layer, Rect } from 'react-konva';
import { InteractCard, CommandHeader, CommandBody, CommandField } from './konva';

export const padding = 5;
export const doublePadding = padding * 2;
export const width = 300;
export const headerHeight = 30;
export const valueHeight = 30;
export const emptyValueListHeight = 20;
export const widthPadded = width - doublePadding;

const calculateValueHeigh = (rows: number) =>
  rows === 0 ? emptyValueListHeight : valueHeight * rows;
const calculateFullHeigh = (rows: number) =>
  calculateValueHeigh(rows) + headerHeight + doublePadding;

type CommandCardProp = {
  commands: Command[];
  scale: number;
  setCommands: Dispatch<SetStateAction<Command[]>>;
  addCommand: (command: Command) => void;
  deleteCommand: (index: number) => void;
  replaceCommand: (command: Command, index: number) => void;
  copyCommand: (command: Command) => void;
};

export default function CommandCard({
  commands,
  deleteCommand,
  replaceCommand,
  copyCommand,
}: CommandCardProp) {

  return (
    <Layer>
      {commands.map((element, index) => (
        <InteractCard
          key={index}
          index={index}
          command={element}
          replaceFunction={replaceCommand}
        >
          <Rect
            width={width}
            height={calculateFullHeigh(element.value.rows)}
            fill={element.value.color}
            cornerRadius={10}
            stroke="black"
            strokeWidth={2}
          />

          <CommandHeader
            command={element}
            index={index}
            onCopy={copyCommand}
            onDelete={deleteCommand}
          />

          <CommandBody
            x={padding}
            y={headerHeight}
            width={widthPadded}
            height={calculateValueHeigh(element.value.rows)}
          >
            {element.value.fields.map((field, fIndex) => (
              <CommandField
                key={fIndex}
                x={
                  field.x *
                  field.fieldSize *
                  (widthPadded / element.value.columns)
                }
                y={field.y * valueHeight}
                fieldSize={
                  field.fieldSize * (widthPadded / element.value.columns)
                }
                color={element.value.color}
                field={field}
                commandIndex={index}
                fieldIndex={fIndex}
                onClickField={() => {
                  console.log('meow');
                }}
              />
            ))}
          </CommandBody>
        </InteractCard>
      ))}
    </Layer>
  );
}

