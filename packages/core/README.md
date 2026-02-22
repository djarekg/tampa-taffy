# @tt/core

Core utilities and primitives for the Tampa Taffy framework.

## Modules

### 🌐 api

Client-side HTTP utilities with built-in retry logic and error handling.

- 📄 **api.ts** - Main fetch wrapper with retry on connection failures, query params, and JSON handling
- 📄 **error.ts** - `ApiError` class for structured HTTP error responses
- 📄 **status.ts** - Common HTTP status code constants

```ts
import { api, ApiError, ApiStatus } from '@tt/core/api';

try {
  const data = await api.get('/products', { query: { page: 1 } });
  console.log(data);
} catch (err) {
  if (err instanceof ApiError) {
    console.error(`HTTP ${err.status}: ${err.message}`);
  }
}
```

### 🔐 crypto

Password hashing and comparison utilities using bcrypt.

- 📄 **hash.ts** - `generateHash()` and `compareHash()` for secure password handling

```ts
import { generateHash, compareHash } from '@tt/core/crypto';

const hashed = generateHash('myPassword');
const isValid = compareHash('myPassword', hashed); // true
```

### ⚡ reactive

Signal-based reactive primitives for Lit elements with automatic initialization.

- 📄 **element.ts** - Auto-initialization hook for reactive elements
- 📄 **property.ts** - `property()` decorator for reactive properties with attribute sync
- 📄 **state.ts** - `state()` decorator for internal reactive state
- 📄 **query.ts** - `query()` helper for DOM queries in renderRoot

**Documentation:**

- 📖 [Reactive utilities overview](src/reactive/REACTIVE_GUIDE.md)
- 📖 [Query usage guide](src/reactive/QUERY_USAGE.md)

```ts
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { property, state, query } from '@tt/core/reactive';

@customElement('my-counter')
export class MyCounter extends LitElement {
  count = property(0, { type: Number });
  private showDetails = state(false);
  private button = query<HTMLButtonElement>('button');

  render() {
    return html`
      <button @click=${() => this.count++}>Count: ${this.count}</button>
    `;
  }
}
```

### 📝 types

Common TypeScript type definitions.

- 📄 **plain-object.ts** - `PlainObject` type for simple key-value objects
- 📄 **type-event.ts** - `TypeEvent<T>` interface for strongly-typed DOM events

### 🛠️ utils

General utility functions for common tasks.

- 📄 **create-reload-tick.ts** - Signal-based reload trigger for forcing re-computation
- 📄 **number.ts** - `randomInRange()` for generating random numbers
- 📄 **object.ts** - Object validation helpers: `isEmpty()`, `isNotEmpty()`, `isNullOrUndefined()`
- 📄 **string.ts** - String utilities: `isNullOrEmpty()`, `format()` for template strings

```ts
import { format, isNullOrEmpty } from '@tt/core/utils';

const msg = format('Hello, {0}!', 'World'); // "Hello, World!"
if (!isNullOrEmpty(userInput)) {
  // process input
}
```

### ✅ validation

Runtime value assertions.

- 📄 **assert.ts** - `throwIfEmpty()` and `throwIfNull()` for validation with type guards

```ts
import { throwIfNull } from '@tt/core/validation';

function processUser(user: User | null) {
  throwIfNull(user, 'User is required');
  // TypeScript now knows user is not null
  console.log(user.name);
}
```
