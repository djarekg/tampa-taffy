/**
 * Represents a strongly typed DOM event by combining an event type with a specific target type.
 *
 * @typeParam E - The concrete event type (for example, `MouseEvent` or `KeyboardEvent`).
 * @typeParam T - The concrete event target type (for example, `HTMLButtonElement`).
 *
 * @remarks
 * This utility is useful when handling events in TypeScript and you want `event.target`
 * to be treated as a known, specific target type instead of the broader `EventTarget`.
 */
export type TypedEvent<
  E extends Event = Event,
  T extends EventTarget = EventTarget,
> = E & { target: T };
