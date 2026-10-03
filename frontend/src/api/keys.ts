/** Query keys mirror the URL path segments. */
import type { DealsParams, RecipeListParams } from './models';

export const keys = {
  state: ['api', 'state'] as const,
  settings: ['api', 'settings'] as const,
  health: ['api', 'health'] as const,
  weeks: ['api', 'weeks'] as const,
  week: (monday: string) => ['api', 'weeks', monday] as const,
  list: (monday: string) => ['api', 'weeks', monday, 'list'] as const,
  recipesAll: ['api', 'recipes'] as const,
  recipes: (p?: RecipeListParams) => ['api', 'recipes', 'list', p ?? {}] as const,
  recipe: (id: number) => ['api', 'recipes', id] as const,
  queue: ['api', 'queue'] as const,
  requests: (status?: string) => ['api', 'requests', status ?? 'all'] as const,
  requestsAll: ['api', 'requests'] as const,
  staples: ['api', 'staples'] as const,
  pantry: ['api', 'pantry'] as const,
  stores: ['api', 'stores'] as const,
  deals: (p?: DealsParams) => ['api', 'deals', p ?? {}] as const,
  dealsAll: ['api', 'deals'] as const,
  chat: (monday?: string) => ['api', 'chat', monday ?? 'all'] as const,
  chatAll: ['api', 'chat'] as const,
  job: (id: number) => ['api', 'jobs', id] as const,
};
