// hooks/useModal.ts
import { useState } from "react";
import { ModalType } from "../types";

export function useModal() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedActionForDetails, setSelectedActionForDetails] = useState(null);

  const openModal = (modalType: ModalType) => setActiveModal(modalType);
  const closeModal = () => {
    setActiveModal(null);
    setSelectedActionForDetails(null);
  };

  return { activeModal, setActiveModal, selectedActionForDetails, setSelectedActionForDetails, openModal, closeModal };
}