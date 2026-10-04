import { api, del, get, patch, post, put } from './client';
import type {
  AdUploadResponse, AppSettings, AppSettingsUpdate, AppState, ChatMessageOut, ChatSend, ChatSendResponse, CheckRequest,
  CookRequest, CookedRequest, CookedResponse, Deal, DealsParams, GroceryList, Health, Job, JobAccepted, ListChangesAction,
  ListChangesResponse, ListItemCreate,
  ListItemPatch, MoveRequest, Ok, OrderViaRequest, Pantry, PantryItem, PantryItemCreate, PantryItemPatch, PantryReadRequest,
  PlanRequest, ProposalAction, ProposalResponse, QueueAddRequest, QueueItem, RecipeCreate, RecipeDetail, RecipeDraftRequest,
  RecipeListParams, RecipePatch, RecipeSummary, RejectRequest, RejectResponse, RequestAnswer, RequestCreate, RequestOut,
  SlotPatch, Store, StoreChangeResponse, SwapOptionsRequest, SwapRequest, VoteRequest,
  Week, WeekStoreRequest,
} from './models';

const e = encodeURIComponent;

/** Builds a query string, skipping empty values and repeating array keys. */
export function qs(params?: object): string {
  if (!params) return '';
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue;
    if (Array.isArray(v)) v.forEach((x) => u.append(k, String(x)));
    else u.set(k, String(v));
  }
  const s = u.toString();
  return s ? `?${s}` : '';
}

// state, settings, health
export const getState = () => get<AppState>('/api/state');
export const getSettings = () => get<AppSettings>('/api/settings');
export const putSettings = (b: AppSettingsUpdate) => put<AppSettings>('/api/settings', b);
export const getHealth = () => get<Health>('/api/health');

// weeks and slots
export const getWeek = (monday: string) => get<Week>(`/api/weeks/${e(monday)}`);
export const planWeek = (monday: string, b: PlanRequest = {}) => post<JobAccepted>(`/api/weeks/${e(monday)}/plan`, b);
export const approveWeek = (monday: string) => post<Week>(`/api/weeks/${e(monday)}/approve`);
export const keepSlot = (id: number) => post<Week>(`/api/slots/${id}/keep`);
export const voteSlot = (id: number, b: VoteRequest) => post<Week>(`/api/slots/${id}/vote`, b);
export const swapSlot = (id: number, b: SwapRequest) => post<Week>(`/api/slots/${id}/swap`, b);
export const swapOptions = (id: number, b: SwapOptionsRequest = {}) => post<JobAccepted>(`/api/slots/${id}/swap-options`, b);
export const rejectSlot = (id: number, b: RejectRequest) => post<RejectResponse>(`/api/slots/${id}/reject`, b);
export const moveSlot = (id: number, b: MoveRequest) => post<Week>(`/api/slots/${id}/move`, b);
export const setSlotCook = (id: number, b: CookRequest) => post<Week>(`/api/slots/${id}/cook`, b);
export const patchSlot = (id: number, b: SlotPatch) => patch<Week>(`/api/slots/${id}`, b);

// recipes and queue
export const listRecipes = (p?: RecipeListParams) => get<RecipeSummary[]>(`/api/recipes${qs(p)}`);
export const createRecipe = (b: RecipeCreate) => post<RecipeDetail>('/api/recipes', b);
export const draftRecipe = (b: RecipeDraftRequest) => post<JobAccepted>('/api/recipes/draft', b);
export const getRecipe = (id: number) => get<RecipeDetail>(`/api/recipes/${id}`);
export const patchRecipe = (id: number, b: RecipePatch) => patch<RecipeDetail>(`/api/recipes/${id}`, b);
export const deleteRecipe = (id: number) => del<Ok>(`/api/recipes/${id}`);
export const saveRecipe = (id: number) => post<RecipeDetail>(`/api/recipes/${id}/save`);
export const markCooked = (id: number, b: CookedRequest = {}) => post<CookedResponse>(`/api/recipes/${id}/cooked`, b);
export const getQueue = () => get<QueueItem[]>('/api/queue');
export const addToQueue = (b: QueueAddRequest) => post<QueueItem[]>('/api/queue', b);
export const removeFromQueue = (recipeId: number) => del<QueueItem[]>(`/api/queue/${recipeId}`);

// requests
export const listRequests = (status?: string) => get<RequestOut[]>(`/api/requests${qs({ status })}`);
export const createRequest = (b: RequestCreate) => post<RequestOut>('/api/requests', b);
export const answerRequest = (id: number, b: RequestAnswer) => post<RequestOut>(`/api/requests/${id}/answer`, b);

// pantry
export const getPantry = () => get<Pantry>('/api/pantry');
export const uploadPantryPhotos = (files: File[], label?: string) => {
  const f = new FormData();
  files.forEach((x) => f.append('files', x));
  if (label) f.append('label', label);
  return api<Pantry>('/api/pantry/photos', { method: 'POST', body: f });
};
export const uploadRecipePhoto = (file: File) => {
  const f = new FormData();
  f.append('file', file);
  return api<{ path: string }>('/api/recipes/photos', { method: 'POST', body: f });
};
export const readPantry = (b: PantryReadRequest = {}) => post<JobAccepted>('/api/pantry/read', b);
export const patchPantryItem = (id: number, b: PantryItemPatch) => patch<PantryItem>(`/api/pantry/items/${id}`, b);
export const addPantryItem = (b: PantryItemCreate) => post<PantryItem>('/api/pantry/items', b);
export const confirmPantry = () => post<Pantry>('/api/pantry/confirm');

// grocery list
export const getList = (monday: string) => get<GroceryList>(`/api/weeks/${e(monday)}/list`);
export const addListItem = (monday: string, b: ListItemCreate) => post<GroceryList>(`/api/weeks/${e(monday)}/list/items`, b);
export const patchListItem = (monday: string, key: string, b: ListItemPatch) => patch<GroceryList>(`/api/weeks/${e(monday)}/list/items/${e(key)}`, b);
export const deleteListItem = (monday: string, key: string) => del<GroceryList>(`/api/weeks/${e(monday)}/list/items/${e(key)}`);
export const checkListItem = (monday: string, key: string, b: CheckRequest) => post<GroceryList>(`/api/weeks/${e(monday)}/list/items/${e(key)}/check`, b);
export const confirmListDiff = (monday: string) => post<GroceryList>(`/api/weeks/${e(monday)}/list/confirm-diff`);
export const getListText = (monday: string, includeChecked?: boolean) =>
  get<unknown>(`/api/weeks/${e(monday)}/list/text${qs({ include_checked: includeChecked })}`);

// stores and deals
export const listStores = () => get<Store[]>('/api/stores');
export const setWeekStore = (monday: string, b: WeekStoreRequest) => put<StoreChangeResponse>(`/api/weeks/${e(monday)}/store`, b);
export const setOrderVia = (monday: string, b: OrderViaRequest) => put<StoreChangeResponse>(`/api/weeks/${e(monday)}/order-via`, b);
export const refreshAds = (storeId: number | string) => post<JobAccepted>(`/api/stores/${e(String(storeId))}/ads/refresh`);
export const uploadAds = (storeId: number | string, files: File[]) => {
  const f = new FormData();
  files.forEach((x) => f.append('files', x));
  return api<AdUploadResponse>(`/api/stores/${e(String(storeId))}/ads/upload`, { method: 'POST', body: f });
};
export const listDeals = (p?: DealsParams) => get<Deal[]>(`/api/deals${qs(p)}`);

// chat
export const getChat = (monday?: string) => get<ChatMessageOut[]>(`/api/chat${qs({ monday })}`);
export const sendChat = (b: ChatSend) => post<ChatSendResponse>('/api/chat', b);
export const resolveProposal = (messageId: number, b: ProposalAction) => post<ProposalResponse>(`/api/chat/${messageId}/proposal`, b);
export const resolveListChanges = (messageId: number, b: ListChangesAction) => post<ListChangesResponse>(`/api/chat/${messageId}/list-changes`, b);

// jobs
export const listJobs = (active = true) => get<Job[]>(`/api/jobs${qs({ active })}`);
export const getJob = (id: number) => get<Job>(`/api/jobs/${id}`);
export const retryJob = (id: number) => post<Job>(`/api/jobs/${id}/retry`);
