'use client';

import { LogicNavBar, AddingElement } from './_component/common';
import { InputControl, InputControlProp } from './_component/input';
import LogicDisplay from './logic';
import Command, { InputType } from './command';
import { useState, useCallback } from 'react';
import CommandStorage from './function/storage';

export type selectInputProps = {
  commandIndex: number;
  fieldIndex: number;
  defaultValue: string;
  inputType: InputType;
  x: number;
  y: number;
  width?: number;
  height?: number;
};

export default function Editor() {
  const [commands, setCommands] = useState<Command[]>([]);

  const addCommand = useCallback((command: Command) => {
    const newCommand = {
      ...command,
      value: {
        ...command.value,
        fields: command.value.fields.map((field) => ({ ...field })),
        outputs: command.value.outputs.map((output) => ({ ...output })),
      },
      x: 0,
      y: 0,
    };
    setCommands((prevCommands) => [...prevCommands, newCommand]);
  }, []);

  const deleteCommand = useCallback(
    (index: number) => {
      setCommands(prevCommands => {
        return prevCommands
          .filter((_, i) => i !== index)
          .map(cmd => ({
            ...cmd,
            value: {
              ...cmd.value,
              outputs: cmd.value.outputs.map(value => ({
                ...value,
                value: value.value > index ? value.value - 1 : value.value === index ? -1 : value.value
              }))
            }
          }));
      });
    },
    [setCommands]
  );
  

  const replaceCommand = useCallback((command: Command, index: number) => {
    setCommands((prevCommands) => {
      const newCommands = [...prevCommands];
      newCommands[index] = command;
      return newCommands;
    });
  }, []);

  const updateCommand = useCallback(
    (cIndex: number, callback: (c: Command) => Command) => {
      setCommands((prev) => {
        const newCommands = [...prev];
        if (newCommands[cIndex]) {
          const updatedCommand = callback(newCommands[cIndex]);
          newCommands[cIndex] = {
            ...updatedCommand,
            value: {
              ...updatedCommand.value,
              fields: updatedCommand.value.fields.map((field) => ({
                ...field,
              })),
            },
          };
        }
        return newCommands;
      });
    },
    [],
  );

  const copyCommand = useCallback(
    (index: number) => {
      setCommands((prev) => {
        if (prev[index]) {
          addCommand({
            ...prev[index],
            value: {
              ...prev[index].value,
              outputs: prev[index].value.outputs.map((output) => ({
                ...output,
                value: -1,
              })),
            },
          });
        }

        return prev;
      });
    },
    [addCommand],
  );

  const findCommandByIndex = (index: number) => {
    let command = commands[index];
    setCommands((prev) => {
      command = prev[index];
      return prev;
    });

    return command;
  };
  

  //input controller.
  const [inputKeys, setInputKeys] = useState<{
    commandIndex: number | null;
    fieldIndex: number | null;
  }>({ commandIndex: null, fieldIndex: null });

  const [input, setInput] = useState<InputControlProp | null>(null);
  const onSubmit = useCallback(
    (value: string, displayValue?: string) => {
      setInputKeys((prev) => {
        if (prev.commandIndex !== null && prev.fieldIndex !== null) {
          const cIndex = prev.commandIndex;
          const fIndex = prev.fieldIndex;
          updateCommand(cIndex, (command) => {
            const newFields = [...command.value.fields];
            newFields[fIndex] = {
              ...newFields[fIndex],
              value: value,
              displayValue: displayValue,
            };
            return {
              ...command,
              value: { ...command.value, fields: newFields },
            };
          });
          setInput(null);
        }
        return { commandIndex: null, fieldIndex: null };
      });
    },
    [updateCommand],
  );

  const selectInput = useCallback(
    ({
      commandIndex,
      fieldIndex,
      defaultValue,
      inputType,
      x,
      y,
      width,
      height,
    }: selectInputProps) => {
      setInput({
        position: {
          x: x,
          y: y,
          width: width,
          height: height,
        },
        defaultValue: defaultValue,
        inputType: inputType,
        onSubmit: onSubmit,
      });

      setInputKeys({
        commandIndex: commandIndex,
        fieldIndex: fieldIndex,
      });
    },
    [onSubmit],
  );

  return (
    <div className='text-white'>
      <LogicDisplay
        commands={commands}
        setCommands={setCommands}
        addCommand={addCommand}
        deleteCommand={deleteCommand}
        replaceCommand={replaceCommand}
        copyCommand={copyCommand}
        selectInput={selectInput}
        findCommandByIndex={findCommandByIndex}
      />
      <InputControl input={input} setCommands={setCommands} cIndex={inputKeys.commandIndex} />
      <LogicNavBar toggleText={'Click here to toggle'}>
        <AddingElement addCommand={addCommand} />
        <CommandStorage commands={commands} setCommands={setCommands}/>
      </LogicNavBar>

      <LogicNavBar toggleText={'Click here to toggle'} side="right">
        <div></div>
      </LogicNavBar>
    </div>
  );
}
