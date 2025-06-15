import React from "react";
import BasicInfo from "../BasicInfo/BasicInfo";
import SuggestedActionsSection from "../SuggestedActionsSection/SuggestedActionsSection";
import type { ActionItem, ActiveTaskFilterType } from "../../types";
import { ProgressStatus } from "../../types";
import type { PaginationInfo } from "../../services/api";

interface DashboardContentProps {
  userProfile: any;
  onboardingCompletion: number;
  T: any;
  suggestedActions: ActionItem[];
  activeTaskFilter: ActiveTaskFilterType;
  handleTaskItemClick: (action: ActionItem) => void;
  actionsPagination: PaginationInfo | null;
  loadMoreActions: () => void;
  isLoadingMore: boolean;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  userProfile,
  onboardingCompletion,
  T,
  suggestedActions,
  activeTaskFilter,
  handleTaskItemClick,
  actionsPagination,
  loadMoreActions,
  isLoadingMore,
}) => (
  <div className="flex-grow">
    <div className="mb-6">
      {userProfile && (
        <BasicInfo onboardingCompletion={onboardingCompletion} T={T} />
      )}
    </div>
    <SuggestedActionsSection
      actions={
        activeTaskFilter === null
          ? suggestedActions.filter(
              (action) => action.status === ProgressStatus.InProgress
            )
          : activeTaskFilter === "nextSteps"
          ? suggestedActions.filter(
              (action) => action.status === ProgressStatus.NotStarted
            )
          : activeTaskFilter === "completed"
          ? suggestedActions.filter(
              (action) => action.status === ProgressStatus.Completed
            )
          : suggestedActions
      }
      onOpenActionDetails={handleTaskItemClick}
      activeFilter={activeTaskFilter}
      T={T}
      hasMore={actionsPagination?.hasMore || false}
      onLoadMore={loadMoreActions}
      isLoadingMore={isLoadingMore}
    />
  </div>
);

export default DashboardContent;