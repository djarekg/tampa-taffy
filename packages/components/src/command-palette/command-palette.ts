import { safeDefine } from '@tt/core';

import { CommandPalette } from './internal/command-palette';
import styles from './internal/command-palette.css';

/** @inheritdoc */
export class TtCommandPalette extends CommandPalette {
  static override styles = [styles];
}

safeDefine('tt-command-palette', TtCommandPalette);

declare global {
  interface HTMLElementTagNameMap {
    'tt-command-palette': TtCommandPalette;
  }
}
