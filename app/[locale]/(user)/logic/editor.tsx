'use client';

import { LogicNavBar, AddingElement } from './_component/common';
import LogicDisplay from './_component/logic';
import Command from './command';
import { useState, useCallback } from 'react';

export default function Editor() {
  const [commands, setCommands] = useState<Command[]>([]);

  const addCommand = useCallback((command: Command) => {
    setCommands((commands) => {
      commands.push({ ...command, x: 0, y: 0 });
      return [...commands];
    });
  }, []);

  const deleteCommand = useCallback(
    (index: number) => {
      if (commands[index]) {
        setCommands((commands) => {
          commands.splice(index, 1);
          commands.forEach((cmd) =>
            cmd.value.outputs.forEach(
              (value) => value.value > index && value.value--,
            ),
          );
          return [...commands];
        });
      }
    },
    [commands],
  );

  const replaceCommand = useCallback(
    (command: Command, index: number) => {
      if (commands[index]) {
        setCommands((commands) => {
          commands[index] = command;
          return [...commands];
        });
      }
    },
    [commands],
  );

  const copyCommand = useCallback((command: Command) => {
    addCommand({
      ...command,
      value: {
        ...command.value,
        outputs: command.value.outputs.map(output => ({ ...output, value: -1 }))
      },
    });
  }, []);

  return (
    <div>
      <LogicDisplay
        commands={commands}
        setCommands={setCommands}
        addCommand={addCommand}
        deleteCommand={deleteCommand}
        replaceCommand={replaceCommand}
        copyCommand={copyCommand}
      />

      <LogicNavBar toggleText={'Click here to hidden'}>
        <AddingElement addCommand={addCommand} />
      </LogicNavBar>

      <LogicNavBar toggleText={'Click here to hidden'} side="right">
        <div></div>
      </LogicNavBar>
    </div>
  );
}
