import React from "react";
import { useUserProfile } from "./hooks/useUserProfile";
import { useSuggestedActions } from "./hooks/useSuggestedActions";
import { useLanguage } from "./hooks/useLanguage";
import { useModal } from "./hooks/useModal";
import ChatHistorySection from "./components/ChatHistory/ChatHistory";
import Sidebar from "./components/Sidebar/Sidebar";
import DashboardContent from "./components/Dashboard/DashboardContent";
import WorkflowContainer from "./components/workflow/WorkflowContainer";
import { useWorkflow } from "./hooks/useWorkflow";
import type { ModalType, ActiveTaskFilterType, Language } from "./types";

import FullProfileModalContent from "./components/Modals/FullProfileModalContent";
import DocumentsModalContent from "./components/Modals/DocumentsModalContent";
import ActionDetailModal from "./components/Modals/ActionDetailModal";
import LeftSlidingPanel from "./components/Modals/LeftSlidingPanel";

import MayaAiAssistant from "./components/MayaAiAssistant/MayaAiAssistant";

import { DocumentItem } from "./types";
import { FORM_FILLING_STEPS, JOB_MATCHING_STEPS } from "./constants";
import { usePaginatedActions } from "./hooks/usePaginatedActions";
import { useDashboardHandlers } from "./hooks/useDashboardHandlers";

import { SparklesIcon as MayaCodeLogoIcon } from "./components/icons/icons";

const App: React.FC = () => {
  // Language
  const { currentLanguage, setCurrentLanguage, T } = useLanguage();

  // User profile
  const { userProfile, isLoading } = useUserProfile();

  // Modal logic
  const {
    activeModal,
    setActiveModal,
    selectedActionForDetails,
    setSelectedActionForDetails,
    openModal,
    closeModal,
  } = useModal();

  // --- Local only states ---
  const [documentsList] = React.useState<DocumentItem[]>([]);
  const [onboardingCompletion] = React.useState<number>(0);

  // Paginated actions and filter state
  const {
    actionsPagination,
    isLoadingMore,
    activeTaskFilter,
    setActiveTaskFilter,
    loadMoreActions,
  } = usePaginatedActions([], null);

  // Suggested actions
  const { suggestedActions } = useSuggestedActions(
    userProfile,
    activeTaskFilter
  );

  // Workflow logic
  const {
    activeWorkflowDetails,
    currentWorkflowStepIndex,
    workflowData,
    startWorkflow,
    exitWorkflow,
    goToNextStep,
    goToPreviousStep,
    jumpToStep,
    updateWorkflowData,
  } = useWorkflow(T, FORM_FILLING_STEPS, JOB_MATCHING_STEPS);

  // Language change handler (already provided by useLanguage, but exposed for UI)
  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  // Dashboard handlers
  // Wrap setSelectedActionForDetails to match (action: ActionItem) => void
  const handleSetSelectedActionForDetails = (action: any) => {
    setSelectedActionForDetails(action);
  };
  const { handleTaskItemClick, navigateToHome } = useDashboardHandlers({
    setActiveTaskFilter,
    startWorkflow,
    setSelectedActionForDetails: handleSetSelectedActionForDetails,
    setActiveModal,
  });

  if (isLoading || !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f4f0ff] text-text-primary text-lg">
        <MayaCodeLogoIcon className="w-8 h-8 text-accent mr-3 animate-spin" />
        {T.loadingMessage || "Loading Dashboard..."}
      </div>
    );
  }

  if (activeWorkflowDetails) {
    return (
      <WorkflowContainer
        activeWorkflowDetails={activeWorkflowDetails}
        currentWorkflowStepIndex={currentWorkflowStepIndex}
        workflowData={workflowData}
        userProfile={userProfile}
        exitWorkflow={exitWorkflow}
        goToNextStep={goToNextStep}
        goToPreviousStep={goToPreviousStep}
        jumpToStep={jumpToStep}
        updateWorkflowData={updateWorkflowData}
        T={T}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f4f0ff] text-text-primary">
      <Sidebar
        T={T}
        activeModal={activeModal as ModalType | null}
        openModal={openModal as (modal: ModalType) => void}
        activeTaskFilter={activeTaskFilter as ActiveTaskFilterType}
        setActiveTaskFilter={
          setActiveTaskFilter as (filter: ActiveTaskFilterType) => void
        }
        navigateToHome={navigateToHome}
        currentLanguage={currentLanguage as Language}
        handleLanguageChange={handleLanguageChange as (lang: Language) => void}
        ChatHistorySection={<ChatHistorySection />}
      />
      <div className="ml-64 flex-grow flex flex-col">
        <main className="flex-grow p-4 sm:p-6 lg:p-8">
          <DashboardContent
            userProfile={userProfile}
            onboardingCompletion={onboardingCompletion}
            T={T}
            suggestedActions={suggestedActions}
            activeTaskFilter={activeTaskFilter}
            handleTaskItemClick={handleTaskItemClick}
            actionsPagination={actionsPagination}
            loadMoreActions={loadMoreActions}
            isLoadingMore={isLoadingMore}
          />
        </main>
      </div>

      {userProfile && (
        <LeftSlidingPanel
          isOpen={activeModal === "profilePanel"}
          onClose={closeModal}
          title={T.profilePanelTitle}
        >
          <FullProfileModalContent userProfile={userProfile} T={T} />
        </LeftSlidingPanel>
      )}

      <LeftSlidingPanel
        isOpen={activeModal === "documentsPanel"}
        onClose={closeModal}
        title={T.documentsModalTitle}
      >
        <DocumentsModalContent documents={documentsList} T={T} />
      </LeftSlidingPanel>

      {selectedActionForDetails && (
        <ActionDetailModal
          isOpen={activeModal === "actionDetail"}
          onClose={closeModal}
          action={selectedActionForDetails}
          T={T}
        />
      )}

      {/* Maya AI Assistant Floating Chat */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 50 }}>
        <MayaAiAssistant T={T} />
      </div>
    </div>
  );
};

export default App;
