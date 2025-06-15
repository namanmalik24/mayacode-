import { useCallback } from "react";
import { FORM_FILLING_WORKFLOW_ID, JOB_MATCHING_WORKFLOW_ID } from "../constants";
import type { ActionItem, ModalType, ActiveTaskFilterType } from "../types";

interface DashboardHandlersOptions {
  setActiveTaskFilter: (filter: ActiveTaskFilterType) => void;
  startWorkflow: (type: "formFilling" | "jobMatching") => void;
  setSelectedActionForDetails: (action: ActionItem) => void;
  setActiveModal: (modal: ModalType) => void;
}

export function useDashboardHandlers({
  setActiveTaskFilter,
  startWorkflow,
  setSelectedActionForDetails,
  setActiveModal,
}: DashboardHandlersOptions) {
  const handleTaskItemClick = useCallback(
    (action: ActionItem) => {
      if (action.id === FORM_FILLING_WORKFLOW_ID) {
        setActiveTaskFilter(null);
        startWorkflow("formFilling");
      } else if (action.id === JOB_MATCHING_WORKFLOW_ID) {
        setActiveTaskFilter(null);
        startWorkflow("jobMatching");
      } else {
        setSelectedActionForDetails(action as any);
        setActiveModal("actionDetail");
      }
    },
    [setActiveTaskFilter, startWorkflow, setSelectedActionForDetails, setActiveModal]
  );

  const navigateToHome = useCallback(() => {
    setActiveTaskFilter(null);
    startWorkflow(null as any); // or call exitWorkflow if you want to exit workflows
  }, [setActiveTaskFilter, startWorkflow]);

  return {
    handleTaskItemClick,
    navigateToHome,
  };
}