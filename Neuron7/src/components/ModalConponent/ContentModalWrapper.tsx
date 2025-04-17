import * as React from "react";
import { Modal } from "@fluentui/react";
import { useMediaQuery } from "react-responsive";
import { useEffect } from "react";
import { pages, app } from "@microsoft/teams-js";

import { makeStyles } from "@fluentui/react-components";
interface ModalProps {
    isOpen: boolean;
    onDismiss: ()=> void;
    children?: React.ReactNode;
}
const useStyles = makeStyles({
    modalWrapper: {
        height: "100%",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch", // Smooth scrolling for iOS
    display: "flex",
    flexDirection: "column",
    },
});
export const ContentModalWrapper = ({
    isOpen,
    onDismiss,
    children,
}: ModalProps) => {
    const isMobileView = useMediaQuery({ query: "(max-width: 768px)" });
 
    useEffect(() => {
        if (isOpen) {
            app.initialize().then(() => {                
                pages.backStack.registerBackButtonHandler(() => {
                    onDismiss();
                    return true; 
                });
            });
        }

        return () => {
            app.initialize().then(() => {
                pages.backStack.registerBackButtonHandler(() => false); 
            });
        };
    }, [isOpen, onDismiss]);

    const styles = useStyles();
    return (
        <Modal
            isOpen={isOpen}
            onDismiss={() => onDismiss()}
            isBlocking={true}
            className={styles.modalWrapper}
            styles={{
                main: {
                    position: "fixed",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "8px",
                    backgroundColor: "#FFF",
                    maxHeight: "100%",
                    padding: 0,
                    // flexGrow: 1,
                    touchAction: "auto", 
                    WebkitOverflowScrolling: "touch",
                    background: "#000",
                    ...(isMobileView
                        ? {
                            inset: "16px 16px 16px 16px",
                        }
                        : {
                            inset: "26px 30px 34px 30px",
                        }),
                },
            }}
        >
            {children}
        </Modal>
    );
};
