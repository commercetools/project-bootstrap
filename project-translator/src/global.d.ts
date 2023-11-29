declare module '@commercetools/sync-actions' {
  export type SyncAction = { action: string; [x: string]: unknown };
  function buildActions<NextDraft, OriginalDraft>(
    nextDraft: NextDraft,
    originalDraft: OriginalDraft,
    hints?: any,
  ): SyncAction[];
  export type Syncer = {
    buildActions: typeof buildActions;
  };
  export function createSyncProducts(): Syncer;
  export function createSyncCategories(): Syncer;
  export function createSyncProductTypes(): Syncer;
  export function createSyncShippingMethods(): Syncer;
  export function createSyncProjects(): Syncer;
  export function createSyncChannels(): Syncer;
  export function createSyncStores(): Syncer;
}
