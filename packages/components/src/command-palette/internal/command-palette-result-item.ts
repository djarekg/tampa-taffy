/**
 * Command palette result item type definition. This type is used to define the
 * tt-list-item-link that is rendered for each search result in the command palette.
 */
export type CommandPaletteResultItem = {
  id: string;
  href?: string;
  headline: string;
  supportingText?: string | undefined;
  icon?: string | undefined;
};
