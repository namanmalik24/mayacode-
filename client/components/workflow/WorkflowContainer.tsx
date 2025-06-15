import React from "react";
import WorkflowHostPage from "../WorkflowHostPage/WorkflowHostPage";
import type { WorkflowType, WorkflowStepConfig } from "../../types";

interface ActiveWorkflowDetails {
  type: WorkflowType;
  title: string;
  steps: WorkflowStepConfig[];
}

interface WorkflowContainerProps {
  activeWorkflowDetails: ActiveWorkflowDetails;
  currentWorkflowStepIndex: number;
  workflowData: Record<string, any>;
  userProfile: any;
  exitWorkflow: () => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  jumpToStep: (index: number) => void;
  updateWorkflowData: (data: Record<string, any>) => void;
  T: any;
}

const WorkflowContainer: React.FC<WorkflowContainerProps> = ({
  activeWorkflowDetails,
  currentWorkflowStepIndex,
  workflowData,
  userProfile,
  exitWorkflow,
  goToNextStep,
  goToPreviousStep,
  jumpToStep,
  updateWorkflowData,
  T,
}) => (
  <WorkflowHostPage
    workflowDetails={activeWorkflowDetails}
    currentStepIndex={currentWorkflowStepIndex}
    workflowData={workflowData}
    userProfile={userProfile}
    onExitWorkflow={exitWorkflow}
    onGoToNextStep={goToNextStep}
    onGoToPreviousStep={goToPreviousStep}
    onJumpToStep={jumpToStep}
    onUpdateWorkflowData={updateWorkflowData}
    T={T}
  />
);

export default WorkflowContainer;
