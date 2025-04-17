import React, { Dispatch, SetStateAction, useState } from "react";
import { makeStyles } from "@fluentui/react-components";
import ModalComponent from "./ModalWrapperComponent"; // Assuming ModalComponent is your generic modal wrapper.
import HtmlContent from "./HtmlContent"; // Import HtmlContent component
import VideoContent from "./VideoContent"; // Import VideoContent component

interface ContentViewerModalProps {
  isModalOpen: boolean;
  onDismiss: Dispatch<SetStateAction<boolean>>;
  title: string;
  content: string;
  fileName: string;
  className?: string;
}

const ContentViewerModal: React.FC<ContentViewerModalProps> = ({
  isModalOpen,
  onDismiss,
  title,
  content,
  fileName,
  className,
}) => {
  const styles = useStyles();
  const [contentType, setContentType] = useState<"html" | "pdf" | "video">("html");

  return (
    <ModalComponent
      isOpen={isModalOpen}
      onDismiss={() => onDismiss(false)} // Close the modal
      closeButtonText="Close"
      submitButtonText="Done"
      onSubmit={() => console.log("Submit clicked")} // Add this prop
      header={
        <div className={styles.headerContainer}>
          <div className={styles.modalTitle}>{title}</div>
        </div>
      }
      className={className}
    >
      <div className={styles.modalContent}>
        <div>
          <strong>File:</strong> {fileName}
        </div>
        {/* Conditionally render content based on contentType */}
        {contentType === "html" && <HtmlContent content={content} />}
        {contentType === "video" && <VideoContent content={content} />}
      </div>
    </ModalComponent>
  );
};

export default ContentViewerModal;

const useStyles = makeStyles({
  modalTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#424242",
  },
  modalContent: {
    marginTop: "16px",
    fontSize: "14px",
    color: "#666",
    lineHeight: "20px",
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
});