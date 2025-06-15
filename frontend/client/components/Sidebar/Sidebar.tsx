import React from "react";
import ActionButton from "../ActionButton/ActionButton";
import {
  UserCircleIcon,
  FolderIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  SparklesIcon as MayaCodeLogoIcon,
} from "../icons/icons";

import type { ModalType, ActiveTaskFilterType, Language } from "../../types";

interface SidebarProps {
  T: any;
  activeModal: ModalType | null;
  openModal: (modal: ModalType) => void;
  activeTaskFilter: ActiveTaskFilterType;
  setActiveTaskFilter: (filter: ActiveTaskFilterType) => void;
  navigateToHome: () => void;
  currentLanguage: Language;
  handleLanguageChange: (lang: Language) => void;
  ChatHistorySection?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({
  T,
  activeModal,
  openModal,
  activeTaskFilter,
  setActiveTaskFilter,
  navigateToHome,
  currentLanguage,
  handleLanguageChange,
  ChatHistorySection,
}) => (
  <aside className="w-64 bg-card text-text-primary flex flex-col fixed top-0 left-0 h-full shadow-xl z-30 border-r border-border-color overflow-y-auto">
    <div className="p-5 border-b border-border-color">
      <button
        onClick={navigateToHome}
        className="flex items-center space-x-2.5 focus:outline-none focus:ring-2 focus:ring-accent rounded-md p-1 -m-1 hover:bg-accent/10 transition-colors"
        aria-label="Go to dashboard home"
      >
        <MayaCodeLogoIcon className="w-8 h-8 text-accent" />
        <h1 className="text-lg font-semibold text-accent tracking-tight">
          {T.dashboardTitle}
        </h1>
      </button>
    </div>
    <nav className="flex-grow p-3 space-y-1.5">
      <ActionButton
        onClick={() => openModal("profilePanel")}
        variant="sidebar"
        icon={<UserCircleIcon className="w-5 h-5" />}
        isActive={activeModal === "profilePanel"}
      >
        {T.viewFullProfile}
      </ActionButton>
      <ActionButton
        onClick={() => openModal("documentsPanel")}
        variant="sidebar"
        icon={<FolderIcon className="w-5 h-5" />}
        isActive={activeModal === "documentsPanel"}
      >
        {T.documentsAndForms}
      </ActionButton>
      <hr className="my-2 border-border-color" />
      <ActionButton
        onClick={() => {
          setActiveTaskFilter("nextSteps");
        }}
        variant="sidebar"
        icon={<ClipboardDocumentListIcon className="w-5 h-5" />}
        isActive={activeTaskFilter === "nextSteps"}
      >
        {T.sidebarLabels.nextSteps}
      </ActionButton>
      <ActionButton
        onClick={() => {
          setActiveTaskFilter("completed");
        }}
        variant="sidebar"
        icon={<CheckCircleIcon className="w-5 h-5" />}
        isActive={activeTaskFilter === "completed"}
      >
        {T.sidebarLabels.completedTasks}
      </ActionButton>
      {ChatHistorySection}
    </nav>
    <div className="p-3 border-t border-border-color space-y-3">
      <div className="flex justify-between items-center bg-card p-2 rounded-md shadow-sm">
        <span className="text-sm font-medium text-text-secondary">
          Language:
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => handleLanguageChange("en")}
            className={`px-2 py-1 text-xs font-medium rounded ${
              currentLanguage === "en"
                ? "bg-accent text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => handleLanguageChange("es")}
            className={`px-2 py-1 text-xs font-medium rounded ${
              currentLanguage === "es"
                ? "bg-accent text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            ES
          </button>
          <button
            onClick={() => handleLanguageChange("de")}
            className={`px-2 py-1 text-xs font-medium rounded ${
              currentLanguage === "de"
                ? "bg-accent text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            DE
          </button>
        </div>
      </div>
    </div>
  </aside>
);

export default Sidebar;
