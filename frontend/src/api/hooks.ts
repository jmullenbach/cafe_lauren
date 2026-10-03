import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import * as ep from './endpoints';
import { keys } from './keys';
import { noteJob } from './jobs';
import type {
  AppSettingsUpdate, CheckRequest, CookRequest, CookedRequest, DealsParams, GroceryList, Job, JobAccepted, ListItemCreate,
  ListItemPatch, MoveRequest, OrderViaRequest, PantryItemCreate, PantryItemPatch, PantryReadRequest, PlanRequest, ProposalAction,
  QueueAddRequest, RecipeCreate, RecipeDraftRequest, RecipeListParams, RecipePatch, RejectRequest, RequestAnswer,
  RequestCreate, SlotPatch, StapleCreate, StaplePatch, SwapOptionsRequest, SwapRequest, VoteRequest, Week, WeekStoreRequest,
  ChatSend,
} from './models';
import { useUser } from '../state/UserContext';

/** Queries only run once someone has picked who they are (the backend needs X-Cafe-User). */
function useEnabled(extra = true) {
  const { user } = useUser();
  return !!user && extra;
}

// ---------------------------------------------------------------- queries
export const useAppState = () => {
  const enabled = useEnabled();
  return useQuery({ queryKey: keys.state, queryFn: ep.getState, enabled });
};
export const useWeek = (monday: string | undefined) => {
  const enabled = useEnabled(!!monday);
  return useQuery({ queryKey: keys.week(monday ?? ''), queryFn: () => ep.getWeek(monday!), enabled });
};
export const useGroceryList = (monday: string | undefined) => {
  const enabled = useEnabled(!!monday);
  return useQuery({ queryKey: keys.list(monday ?? ''), queryFn: () => ep.getList(monday!), enabled });
};
export const useRecipes = (params?: RecipeListParams) => {
  const enabled = useEnabled();
  return useQuery({ queryKey: keys.recipes(params), queryFn: () => ep.listRecipes(params), enabled });
};
export const useRecipe = (id: number | undefined) => {
  const enabled = useEnabled(id != null);
  return useQuery({ queryKey: keys.recipe(id ?? 0), queryFn: () => ep.getRecipe(id!), enabled });
};
export const useQueue = () => {
  const enabled = useEnabled();
  return useQuery({ queryKey: keys.queue, queryFn: ep.getQueue, enabled });
};
export const useRequests = (status?: string) => {
  const enabled = useEnabled();
  return useQuery({ queryKey: keys.requests(status), queryFn: () => ep.listRequests(status), enabled });
};
export const useStaples = () => {
  const enabled = useEnabled();
  return useQuery({ queryKey: keys.staples, queryFn: ep.listStaples, enabled });
};
export const usePantry = () => {
  const enabled = useEnabled();
  return useQuery({ queryKey: keys.pantry, queryFn: ep.getPantry, enabled });
};
export const useStores = () => {
  const enabled = useEnabled();
  return useQuery({ queryKey: keys.stores, queryFn: ep.listStores, enabled });
};
export const useDeals = (params?: DealsParams) => {
  const enabled = useEnabled();
  return useQuery({ queryKey: keys.deals(params), queryFn: () => ep.listDeals(params), enabled });
};
export const useChat = (monday?: string) => {
  const enabled = useEnabled();
  return useQuery({ queryKey: keys.chat(monday), queryFn: () => ep.getChat(monday), enabled });
};
export const useSettings = () => {
  const enabled = useEnabled();
  return useQuery({ queryKey: keys.settings, queryFn: ep.getSettings, enabled });
};
/** Health needs no user. Polls lightly so a down backend shows up. */
export const useHealth = () => useQuery({ queryKey: keys.health, queryFn: ep.getHealth, refetchInterval: 60_000 });
export const useJob = (id: number | undefined) => {
  const enabled = useEnabled(id != null);
  return useQuery({ queryKey: keys.job(id ?? 0), queryFn: () => ep.getJob(id!), enabled });
};

// ---------------------------------------------------------------- cache helpers
/** Put a returned Week in the cache; the state (badges) and the list (diff) may have changed too. */
function putWeek(qc: QueryClient, week: Week) {
  qc.setQueryData(keys.week(week.monday), week);
  qc.invalidateQueries({ queryKey: keys.state });
  qc.invalidateQueries({ queryKey: keys.list(week.monday) });
}
function putList(qc: QueryClient, monday: string, list: GroceryList) {
  qc.setQueryData(keys.list(monday), list);
  qc.invalidateQueries({ queryKey: keys.state });
  qc.invalidateQueries({ queryKey: keys.week(monday) });
}
function afterJob(qc: QueryClient, r: JobAccepted | { job?: Job | null }) {
  noteJob(r.job ?? undefined);
  qc.invalidateQueries({ queryKey: keys.state });
}
const useWeekMutation = <V,>(fn: (v: V) => Promise<Week>) => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: fn, onSuccess: (w) => putWeek(qc, w) });
};
const useJobMutation = <V, R extends { job?: Job | null }>(fn: (v: V) => Promise<R>) => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: fn, onSuccess: (r) => afterJob(qc, r) });
};
const useListMutation = <V extends { monday: string }>(fn: (v: V) => Promise<GroceryList>) => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: fn, onSuccess: (l, v) => putList(qc, v.monday, l) });
};

// ---------------------------------------------------------------- week and slot mutations
export const usePlanWeek = () => useJobMutation(({ monday, ...b }: { monday: string } & PlanRequest) => ep.planWeek(monday, b));
export const useApproveWeek = () => useWeekMutation((monday: string) => ep.approveWeek(monday));
export const useKeepSlot = () => useWeekMutation((id: number) => ep.keepSlot(id));
export const useVoteSlot = () => useWeekMutation(({ id, ...b }: { id: number } & VoteRequest) => ep.voteSlot(id, b));
export const useSwapSlot = () => useWeekMutation(({ id, ...b }: { id: number } & SwapRequest) => ep.swapSlot(id, b));
export const useSwapOptions = () => useJobMutation(({ id, ...b }: { id: number } & SwapOptionsRequest) => ep.swapOptions(id, b));
export const useRejectSlot = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...b }: { id: number } & RejectRequest) => ep.rejectSlot(id, b),
    onSuccess: (r) => { putWeek(qc, r.week); noteJob(r.job); },
  });
};
export const useMoveSlot = () => useWeekMutation(({ id, ...b }: { id: number } & MoveRequest) => ep.moveSlot(id, b));
export const useSetSlotCook = () => useWeekMutation(({ id, ...b }: { id: number } & CookRequest) => ep.setSlotCook(id, b));
export const usePatchSlot = () => useWeekMutation(({ id, ...b }: { id: number } & SlotPatch) => ep.patchSlot(id, b));

// ---------------------------------------------------------------- list mutations
export const useAddListItem = () => useListMutation(({ monday, ...b }: { monday: string } & ListItemCreate) => ep.addListItem(monday, b));
export const usePatchListItem = () => useListMutation(({ monday, key, ...b }: { monday: string; key: string } & ListItemPatch) => ep.patchListItem(monday, key, b));
export const useDeleteListItem = () => useListMutation(({ monday, key }: { monday: string; key: string }) => ep.deleteListItem(monday, key));
export const useCheckListItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ monday, key, ...b }: { monday: string; key: string } & CheckRequest) => ep.checkListItem(monday, key, b),
    // Tick instantly; the server's list replaces this when it answers.
    onMutate: async (v) => {
      await qc.cancelQueries({ queryKey: keys.list(v.monday) });
      const prev = qc.getQueryData<GroceryList>(keys.list(v.monday));
      if (prev) {
        qc.setQueryData<GroceryList>(keys.list(v.monday), {
          ...prev,
          sections: prev.sections.map((s) => ({ ...s, items: s.items.map((i) => (i.key === v.key ? { ...i, checked: v.checked ?? !i.checked } : i)) })),
        });
      }
      return { prev };
    },
    onError: (_e, v, ctx) => { if (ctx?.prev) qc.setQueryData(keys.list(v.monday), ctx.prev); },
    onSuccess: (l, v) => putList(qc, v.monday, l),
  });
};
export const useConfirmListDiff = () => useListMutation(({ monday }: { monday: string }) => ep.confirmListDiff(monday));

// ---------------------------------------------------------------- stores
export const useSetWeekStore = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ monday, ...b }: { monday: string } & WeekStoreRequest) => ep.setWeekStore(monday, b),
    onSuccess: (r) => { putWeek(qc, r.week); noteJob(r.job); qc.invalidateQueries({ queryKey: keys.dealsAll }); },
  });
};
export const useSetOrderVia = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ monday, ...b }: { monday: string } & OrderViaRequest) => ep.setOrderVia(monday, b),
    onSuccess: (r) => { putWeek(qc, r.week); noteJob(r.job); },
  });
};
export const useRefreshAds = () => useJobMutation((storeId: number) => ep.refreshAds(storeId));
export const useUploadAds = () => useJobMutation(({ storeId, files }: { storeId: number; files: File[] }) => ep.uploadAds(storeId, files));

// ---------------------------------------------------------------- recipes and queue
export const useCreateRecipe = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (b: RecipeCreate) => ep.createRecipe(b), onSuccess: (r) => { qc.setQueryData(keys.recipe(r.id), r); qc.invalidateQueries({ queryKey: keys.recipesAll }); } });
};
export const useDraftRecipe = () => useJobMutation((b: RecipeDraftRequest) => ep.draftRecipe(b));
const recipeDetailMutation = <V,>(fn: (v: V) => Promise<import('./models').RecipeDetail>) => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: fn, onSuccess: (r) => { qc.setQueryData(keys.recipe(r.id), r); qc.invalidateQueries({ queryKey: keys.recipesAll }); } });
};
export const usePatchRecipe = () => recipeDetailMutation(({ id, ...b }: { id: number } & RecipePatch) => ep.patchRecipe(id, b));
export const useSaveRecipe = () => recipeDetailMutation((id: number) => ep.saveRecipe(id));
export const useDeleteRecipe = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => ep.deleteRecipe(id), onSuccess: () => { qc.invalidateQueries({ queryKey: keys.recipesAll }); qc.invalidateQueries({ queryKey: keys.queue }); } });
};
export const useMarkCooked = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...b }: { id: number } & CookedRequest) => ep.markCooked(id, b),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.recipesAll }); qc.invalidateQueries({ queryKey: keys.state }); },
  });
};
const useQueueMutation = <V,>(fn: (v: V) => Promise<import('./models').QueueItem[]>) => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: fn, onSuccess: (q) => { qc.setQueryData(keys.queue, q); qc.invalidateQueries({ queryKey: keys.state }); } });
};
export const useAddToQueue = () => useQueueMutation((b: QueueAddRequest) => ep.addToQueue(b));
export const useRemoveFromQueue = () => useQueueMutation((recipeId: number) => ep.removeFromQueue(recipeId));

// ---------------------------------------------------------------- requests and staples
export const useCreateRequest = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (b: RequestCreate) => ep.createRequest(b), onSuccess: () => { qc.invalidateQueries({ queryKey: keys.requestsAll }); qc.invalidateQueries({ queryKey: keys.state }); } });
};
export const useAnswerRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...b }: { id: number } & RequestAnswer) => ep.answerRequest(id, b),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.requestsAll }); qc.invalidateQueries({ queryKey: keys.state }); },
  });
};
export const useCreateStaple = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (b: StapleCreate) => ep.createStaple(b), onSuccess: () => qc.invalidateQueries({ queryKey: keys.staples }) });
};
export const usePatchStaple = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, ...b }: { id: number } & StaplePatch) => ep.patchStaple(id, b), onSuccess: () => qc.invalidateQueries({ queryKey: keys.staples }) });
};
export const useDeleteStaple = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => ep.deleteStaple(id), onSuccess: () => qc.invalidateQueries({ queryKey: keys.staples }) });
};

// ---------------------------------------------------------------- pantry
export const useUploadPantryPhotos = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ files, label }: { files: File[]; label?: string }) => ep.uploadPantryPhotos(files, label),
    onSuccess: (p) => { qc.setQueryData(keys.pantry, p); qc.invalidateQueries({ queryKey: keys.state }); },
  });
};
export const useReadPantry = () => useJobMutation((b: PantryReadRequest = {}) => ep.readPantry(b));
export const usePatchPantryItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...b }: { id: number } & PantryItemPatch) => ep.patchPantryItem(id, b),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.pantry }); qc.invalidateQueries({ queryKey: keys.state }); },
  });
};
export const useAddPantryItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (b: PantryItemCreate) => ep.addPantryItem(b),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.pantry }); qc.invalidateQueries({ queryKey: keys.state }); },
  });
};
export const useConfirmPantry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => ep.confirmPantry(),
    onSuccess: (p) => { qc.setQueryData(keys.pantry, p); qc.invalidateQueries({ queryKey: keys.state }); },
  });
};

// ---------------------------------------------------------------- chat, settings, jobs
export const useSendChat = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (b: ChatSend) => ep.sendChat(b),
    onSuccess: (r) => { noteJob(r.job); qc.invalidateQueries({ queryKey: keys.chatAll }); },
  });
};
export const useResolveProposal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ messageId, ...b }: { messageId: number } & ProposalAction) => ep.resolveProposal(messageId, b),
    onSuccess: (r) => { putWeek(qc, r.week); qc.invalidateQueries({ queryKey: keys.chatAll }); },
  });
};
export const usePutSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (b: AppSettingsUpdate) => ep.putSettings(b),
    onSuccess: (s) => { qc.setQueryData(keys.settings, s); qc.invalidateQueries({ queryKey: keys.state }); },
  });
};
export const useRetryJob = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => ep.retryJob(id), onSuccess: (j) => { noteJob(j); qc.setQueryData(keys.job(j.id), j); qc.invalidateQueries({ queryKey: keys.state }); } });
};
