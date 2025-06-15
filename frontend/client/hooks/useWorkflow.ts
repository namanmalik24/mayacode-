import { useState } from "react";
import type { WorkflowType, WorkflowStepConfig } from "../types";

interface ActiveWorkflowDetails {
  type: WorkflowType;
  title: string;
  steps: WorkflowStepConfig[];
}

export function useWorkflow(T: any, FORM_FILLING_STEPS: WorkflowStepConfig[], JOB_MATCHING_STEPS: WorkflowStepConfig[]) {
  const [activeWorkflowDetails, setActiveWorkflowDetails] = useState<ActiveWorkflowDetails | null>(null);
  const [currentWorkflowStepIndex, setCurrentWorkflowStepIndex] = useState<number>(0);
  const [workflowData, setWorkflowData] = useState<Record<string, any>>({});

  const startWorkflow = (workflowType: WorkflowType) => {
    setWorkflowData({});
    setCurrentWorkflowStepIndex(0);
    if (workflowType === "formFilling") {
      setActiveWorkflowDetails({
        type: "formFilling",
        title: T.workflowTitles.formFilling,
        steps: FORM_FILLING_STEPS,
      });
    } else if (workflowType === "jobMatching") {
      setActiveWorkflowDetails({
        type: "jobMatching",
        title: T.workflowTitles.jobMatching,
        steps: JOB_MATCHING_STEPS,
      });
    }
  };

  const exitWorkflow = () => {
    setActiveWorkflowDetails(null);
    setCurrentWorkflowStepIndex(0);
  };

  const goToNextStep = () => {
    if (
      activeWorkflowDetails &&
      currentWorkflowStepIndex < activeWorkflowDetails.steps.length - 1
    ) {
      setCurrentWorkflowStepIndex((prev) => prev + 1);
    } else if (
      activeWorkflowDetails &&
      currentWorkflowStepIndex === activeWorkflowDetails.steps.length - 1
    ) {
      exitWorkflow();
    }
  };

  const goToPreviousStep = () => {
    if (currentWorkflowStepIndex > 0) {
      setCurrentWorkflowStepIndex((prev) => prev - 1);
    }
  };

  const jumpToStep = (index: number) => {
    if (
      activeWorkflowDetails &&
      index >= 0 &&
      index < activeWorkflowDetails.steps.length
    ) {
      setCurrentWorkflowStepIndex(index);
    }
  };

  const updateWorkflowData = (data: Record<string, any>) => {
    setWorkflowData((prev) => ({ ...prev, ...data }));
  };

  return {
    activeWorkflowDetails,
    currentWorkflowStepIndex,
    workflowData,
    startWorkflow,
    exitWorkflow,
    goToNextStep,
    goToPreviousStep,
    jumpToStep,
    updateWorkflowData,
    setActiveWorkflowDetails,
    setCurrentWorkflowStepIndex,
    setWorkflowData,
  };
}