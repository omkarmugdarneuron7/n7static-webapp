import React, { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  Button,
  makeStyles,
  DialogActions,
  DialogTrigger,
  mergeClasses
} from "@fluentui/react-components";

interface ModalProps {
  isOpen: boolean;
  onDismiss: ()=>void;
  header: React.ReactNode;
  children: React.ReactNode;
  closeButtonText:string;
  submitButtonText:string;
  onSubmit:()=>void;
  className?: string;
}

const ModalComponent: React.FC<ModalProps> = ({
  isOpen,
  onDismiss,
  header,
  children,
  closeButtonText,
  submitButtonText,
  onSubmit,
  className
}) => {
  const styles = useStyles();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(_, { open }) => !open && onDismiss()}
    >
      <DialogSurface className={mergeClasses(styles.modalSurface, className)}>
        <DialogBody className={styles.body}>
          <DialogTitle>{header}</DialogTitle>

          <DialogContent>{children}</DialogContent>
          <DialogActions className={styles.actionContainer}>
            <DialogTrigger>
              <Button className={styles.closeButton}>{closeButtonText}</Button>
            </DialogTrigger>
            <Button onClick={onSubmit} className={styles.submitButton} appearance="primary">
              {submitButtonText}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default ModalComponent;
const useStyles = makeStyles({
  modalSurface: {
    flexDirection: "column",
    padding: "24px",
    backgroundColor: "#FFF",
    borderRadius: "8px",
    alignItems: "flex-start",
    border: "1px solid rgba(255, 255, 255, 0.00)",
    inset:'10px',
   '&.content-viewer-modal':  {
      maxWidth: '95%' 
    },
  },

  headerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  body: {
    "&.fui-DialogBody": {
      gap: "0px",
    },
  },
  actionContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  closeButton: {
    color: "#0F6CBD",
    height: "32px",
    maxWidth: "320px",
    padding: "0px 12px",
    borderRadius: "4px",
    backgroundColor: "#FFF",
    border: "1px solid #0F6CBD",
    fontWeight: "600",
    fontSize: "14px",
    lineHeight: "20px",
  },
  submitButton: {
    color: "#FFF",
    height: "32px",
    maxWidth: "320px",
    padding: "0px 12px",
    borderRadius: "4px",
    backgroundColor: "#0F6CBD",
    fontWeight: "600",
    fontSize: "14px",
    lineHeight: "20px",
  },
});
