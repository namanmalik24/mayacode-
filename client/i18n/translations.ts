import { Language, ProgressStatus } from '../types';

export const texts: Record<Language, any> = {
  en: {
    dashboardTitle: "MayaCode Dashboard",
    loadingMessage: "Loading Dashboard...",
    profilePanelTitle: "Full Profile",
    documentsModalTitle: "Documents & Forms",
    actionDetailModalTitle: "Task Details",
    viewFullProfile: "Profile",
    documentsAndForms: "Documents & Forms",
    sidebarLabels: {
      nextSteps: "Pending",
      completedTasks: "Completed Tasks",
      formFillingWorkflow: "",
      jobMatchingWorkflow: "",
    },
    basicInfo: {
      onboardingCompletion: "Onboarding {percentage}% Complete",
      welcomeMessage: "Welcome!",
    },
    progressStatus: {
      [ProgressStatus.NotStarted]: "Not Started",
      [ProgressStatus.InProgress]: "In Progress",
      [ProgressStatus.Completed]: "Completed",
    },
    suggestedActions: {
      nextStepsTitle: "Pending",
      completedTasksTitle: "Completed Tasks",
      suggestedActionsTitle: "Suggested Actions",
      currentTasksTitle: "Current Tasks",
    },
    actionTitles: {
      formFillingWorkflowActionTitle: "",
      jobMatchingWorkflowActionTitle: "",
    },
    emptyDashboard: {
      generic: "No actions to display for this category.",
      noInProgressTasks: "No tasks are currently in progress. Well done!",
      noNotStartedTasks: "You're all caught up with your next steps!",
      noCompletedTasks: "No tasks have been completed yet.",
    },
    fullProfileContent: {
      fullName: "Full Name",
      alias: "Alias",
      age: "Age",
      gender: "Gender",
      dateOfBirth: "Date of Birth",
      email: "Email Address",
      phone: "Phone Number",
      countryOfOrigin: "Country of Origin",
      dateOfRegistration: "Date of Registration",
      keyChallenges: "Key Challenges",
      bio: "Biography",
      onboardingSummary: "Onboarding Summary",
    },
    documentsContent: {
      documentTypes: {
        'PDF': "PDF Document",
        'DOCX': "Word Document",
        'TXT': "Text File",
        'Email': "Email Message",
        'Image': "Image File",
      },
      previewNotAvailable: "Preview not available for this document.",
      downloadNotAvailable: "Download not available for this document.",
      simulatingSend: "Simulating send for: {docName}",
      noDocumentsFound: "No documents found.",
      docTypeLabel: "Type:",
      docAddedLabel: "Added:",
      docSizeLabel: "Size:",
      previewButton: "Preview",
      downloadButton: "Download",
      sendButton: "Send",
    },
    exportProfileOptions: {
      pdf: "PDF",
      json: "JSON",
      text: "TXT"
    },
    pdfExportAlert: "PDF export simulation: Downloading as TXT.",
    languageNames: { en: "English", es: "Español", de: "Deutsch" },
    actionDetailModal: {
      title: "Task Details",
      what: "What this step involves:",
      why: "Why it's important:",
      preparedByMaya: "Prepared by Maya:",
      stillMissing: "What's still needed:",
      progress: "Current Progress:",
      helpfulLinks: "Helpful Links:",
      relevantDocuments: "Relevant Documents:",
      deadlines: "Deadlines:",
    },
    sidebarCombinedMenu: {
      triggerAriaLabel: "Open settings",
      exportSectionTitle: "Export Profile",
      languageSectionTitle: "Select Language"
    },
    mayaAiAssistant: {
      greetingMessage: "Hello! I'm Maya, your AI assistant. How can I help you today?",
      errorMessage: "Sorry, I encountered an error. Please try again.",
      apiKeyMissingError: "Chat unavailable: API_KEY is not configured in the environment.", // New
      chatInputPlaceholder: "Ask Maya anything...",
      chatUnavailablePlaceholder: "Chat unavailable: Check configuration", // Kept as a more general fallback
      typingIndicator: "Maya is typing...",
      chatWindowTitle: "Maya AI Assistant",
      openChatLabel: "Open Maya AI Assistant",
      closeChatLabel: "Close chat",
      sendButtonLabel: "Send message",
    },
    workflowTitles: {
      formFilling: "",
      jobMatching: "Job Matching - Career Placement"
    },
    workflowSteps: {
      welcome: "Welcome",
      personalData: "Personal Data",
      documents: "Documents",
      transmitForm: "Transmit Form",
      jobMatching: "Job Matching",
      transmitApplication: "Transmit Application",
      ama: "AMA (Ask Maya Anything)",
      complete: "Complete",
    },
    workflowNav: {
      backToDashboard: "Back to Dashboard",
      next: "Next",
      previous: "Previous",
      finish: "Finish",
    },
    workflowMessages: {
      welcomeIntro: "Welcome to this guided process. Let's get started!",
      completionMessage: "You have successfully completed this process. Maya will keep you updated on any next steps."
    },
    workflowPageLabels: {
      formFillingSummaryTitle: "Asylum Form Collection",
      jobMatchingSummaryTitle: "Job Matching Profile",
      mayaAvatarText: "Maya Avatar",
      summaryLabels: {
        name: "Name",
        dateOfBirth: "Date of Birth",
        nationality: "Nationality",
        placeOfBirth: "Place of Birth",
        maritalStatus: "Marital Status",
        vulnerabilities: "Vulnerabilities",
        skills: "Skills",
        experience: "Experience",
        education: "Education",
        languages: "Languages",
        jobMatches: "Job Matches",
        application: "Application",
        notCollected: "not collected yet",
        assessmentPending: "assessment pending",
        positionsFound: "{count} positions found",
        notStarted: "not started",
      }
    }
  },
  // ... (Paste the "es" and "de" objects here as in your App.tsx)
  es: { /* ... */ },
  de: { /* ... */ }
};

// Improved translation merging logic
const T_EN = texts.en;
(['es', 'de'] as Language[]).forEach(langCode => {
  const T_LANG = texts[langCode];
  Object.keys(T_EN).forEach(key => {
    const enValue = T_EN[key];
    const langValue = T_LANG[key];

    if (typeof enValue === 'object' && enValue !== null && !Array.isArray(enValue)) {
      T_LANG[key] = { ...enValue, ...(typeof langValue === 'object' && langValue !== null ? langValue : {}) };
      Object.keys(enValue).forEach(nestedKey => {
        if (typeof enValue[nestedKey] === 'object' && enValue[nestedKey] !== null && !Array.isArray(enValue[nestedKey])) {
          T_LANG[key][nestedKey] = {
            ...enValue[nestedKey],
            ...(T_LANG[key][nestedKey] && typeof T_LANG[key][nestedKey] === 'object' ? T_LANG[key][nestedKey] : {})
          };
        } else if (T_LANG[key] && T_LANG[key][nestedKey] === undefined) {
          T_LANG[key][nestedKey] = enValue[nestedKey];
        }
      });
    } else if (langValue === undefined) {
      T_LANG[key] = enValue;
    }
  });
});

