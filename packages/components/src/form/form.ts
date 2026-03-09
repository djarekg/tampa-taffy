import { safeDefine } from '@tt/core';

import { Form } from './internal/form';
import styles from './internal/form.css';

export class TtForm extends Form {
  static override styles = [styles];
}

safeDefine('tt-form', TtForm);

declare global {
  interface HTMLElementTagNameMap {
    'tt-form': TtForm;
  }
}
