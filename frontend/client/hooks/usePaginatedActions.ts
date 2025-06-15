import { useState, useCallback } from "react";
import { apiService, PaginationInfo } from "../services/api";
import { ProgressStatus, ActionItem, ActiveTaskFilterType } from "../types";

export function usePaginatedActions(initialActions: ActionItem[], initialFilter: ActiveTaskFilterType) {
  const [actions, setActions] = useState<ActionItem[]>(initialActions);
  const [actionsPagination, setActionsPagination] = useState<PaginationInfo | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeTaskFilter, setActiveTaskFilter] = useState<ActiveTaskFilterType>(initialFilter);

  const loadMoreActions = useCallback(async () => {
    if (!actionsPagination?.hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const statusFilter =
        activeTaskFilter === "nextSteps"
          ? ProgressStatus.NotStarted
          : activeTaskFilter === "completed"
          ? ProgressStatus.Completed
          : activeTaskFilter === null
          ? ProgressStatus.InProgress
          : undefined;

      const response = await apiService.getUserActions({
        page: actionsPagination?.nextPage || 1,
        loadMore: true,
        status: statusFilter,
      });

      if (response.success) {
        setActions((prev: any) => [...prev, ...response.data.actions]);
        setActionsPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Failed to load more actions:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [actionsPagination, isLoadingMore, activeTaskFilter]);

  return {
    actions,
    setActions,
    actionsPagination,
    setActionsPagination,
    isLoadingMore,
    setIsLoadingMore,
    activeTaskFilter,
    setActiveTaskFilter,
    loadMoreActions,
  };
}
