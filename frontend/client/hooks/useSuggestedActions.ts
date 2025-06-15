// hooks/useSuggestedActions.ts
import { useState, useEffect } from "react";
import { SUGGESTED_ACTIONS_DATA } from "../constants";
import { ProgressStatus, ActionItem, ActiveTaskFilterType } from "../types";

const initialProcessedActions = SUGGESTED_ACTIONS_DATA.map((action) => {
  let status: ProgressStatus;
  switch (action.status) {
    case "Not Started":
      status = ProgressStatus.NotStarted;
      break;
    case "In Progress":
      status = ProgressStatus.InProgress;
      break;
    case "Completed":
      status = ProgressStatus.Completed;
      break;
    default:
      status = ProgressStatus.NotStarted;
  }
  if (action.id === "action1" && !action.icon)
    return { ...action, status, icon: "ShieldCheckIcon" };
  if (action.id === "action2" && !action.icon)
    return { ...action, status, icon: "IdentificationIcon", progressValue: action.progressValue || 60 };
  if (action.id === "action3" && !action.icon)
    return { ...action, status, icon: "CreditCardIcon" };
  return { ...action, status };
});

export function useSuggestedActions(userProfile: any, activeTaskFilter: ActiveTaskFilterType) {
  const [suggestedActions, setSuggestedActions] = useState<ActionItem[]>([]);

  useEffect(() => {
    if (userProfile) {
      const statusFilter =
        activeTaskFilter === "nextSteps"
          ? ProgressStatus.NotStarted
          : activeTaskFilter === "completed"
          ? ProgressStatus.Completed
          : activeTaskFilter === null
          ? ProgressStatus.InProgress
          : undefined;

      const filteredActions =
        statusFilter !== undefined
          ? initialProcessedActions.filter((action) => action.status === statusFilter)
          : initialProcessedActions;

      setSuggestedActions(filteredActions);
    }
  }, [activeTaskFilter, userProfile]);

  return { suggestedActions, setSuggestedActions };
}