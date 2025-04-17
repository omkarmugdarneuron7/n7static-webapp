import * as React from "react";
import { useEffect, useState } from "react";
import { Modal, PrimaryButton, DefaultButton } from "@fluentui/react";
import { Button, makeStyles } from "@fluentui/react-components";
import CloseIcon from "../assets/icons/close-icon.svg";
import { FilterAccordion } from "./Accordion/FliterAccordian";
import { useMediaQuery } from "react-responsive";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/Store";
import { resetFilters, setFilters } from "../Redux";

interface ModalProps {
  isOpen: boolean;
  onDismiss: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SearchResultFilterModal = ({ isOpen, onDismiss }: ModalProps) => {
  const styles = useStyles();
  const isMobileView = useMediaQuery({ query: "(max-width: 768px)" });
  const queryResult = useSelector(
    (state: RootState) => state.intelligentSearch.queryResult
  );
  const [tempSelectedFilters, setTempSelectedFilters] = useState<{
    [key: string]: string[];
  }>({});
  const selectedFilters = useSelector(
    (state: RootState) => state.intelligentSearch.selectedFilters
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      setTempSelectedFilters(selectedFilters);
    }
  }, [isOpen, selectedFilters]);

  const handleSelectionChange = (title: string, selected: string[]) => {
    setTempSelectedFilters((prev) => ({ ...prev, [title]: selected }));
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  const applyFilters = () => {
    dispatch(setFilters(tempSelectedFilters));
    onDismiss(false);
  };
  const isResetDisabled = Object.values(tempSelectedFilters).every(
    (arr) => arr.length === 0
  );

  const applyButtonDisabled =
    JSON.stringify(tempSelectedFilters) === JSON.stringify(selectedFilters);

    const isFacetsNotEmpty = queryResult.facets && typeof queryResult.facets === 'object' && 
  Object.values(queryResult.facets).some(arr => Array.isArray(arr) && arr.length > 0);
  

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={() => onDismiss(false)}
      isBlocking={true}
      styles={{
        main: {
          position: "fixed",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#FFF",
          padding:'0',
          ...(isMobileView
            ? {
              inset: "26px 16px 16px 16px",
              borderRadius: "8px",
              width: "100%",
              maxHeight: "calc(100% - 42px)",
            }
            : {
              right: 0,
              top: 0,
              width: "345px",
              borderRadius: "8px 0px 0px 8px",
              maxHeight: "100%",
            }),
        },
      }}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Apply Filters</h2>
          <button
            className={styles.closeButton}
            onClick={() => onDismiss(false)}
          >
            <img src={CloseIcon} alt="Close" width="24" height="24" />
          </button>
        </div>
        <div className={styles.body}>
          {isFacetsNotEmpty
&&            Object.entries(queryResult?.facets).map(([key, values]) => (
              <FilterAccordion
                key={key}
                selectedOptions={tempSelectedFilters[key] || []}
                onSelectionChange={handleSelectionChange}
                showCheckbox={true}
                title={key}
                options={(values as { value: string }[]).map(
                  (item) => item.value
                )}
              />
            ))}
        </div>

        <div className={styles.footer}>
          <Button
            className={styles.resetButton}
            appearance="transparent"
            onClick={handleReset}
            disabled={isResetDisabled}
          >
            Reset
          </Button>
          <DefaultButton
            text="Close"
            onClick={() => onDismiss(false)}
            className={styles.closeFooterButton}
          />
          <PrimaryButton
            disabled={applyButtonDisabled}
            className={styles.submitFooterButton}
            text="Apply"
            onClick={applyFilters}
          />
        </div>
      </div>
    </Modal>
  );
};

const useStyles = makeStyles({
  modalContainer: {
    position: "fixed",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    borderRadius: "8px 0px 0px 8px",
    backgroundColor: "#FFF",
    maxHeight: "100%",
  },
  mobileModal: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
  },
  desktopModal: {
    right: 0,
    top: 0,
    width: "345px",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px",
    borderBottom: `1px solid #EBEBEC`,
    background: "#FFF",
    position: "sticky",
    top: 0,
    zIndex: 10,
    height: "48px",
  },
  title: {
    margin: 0,
    fontFamily: "Lato",
    lineHeight: "26px",
    fontSize: "20px",
    fontWeight: "600",
    color: "#424242",
  },
  body: {
    flexGrow: 1,
    overflowY: "auto",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    borderTop: `1px solid #D3D3D4`,
    backgroundColor: "#FFF",
    position: "sticky",
    bottom: 0,
    zIndex: 10,
    height: "48px",
    padding: "8px 12px",
  },
  resetButton: {
    color: "#2868F7",
    cursor: "pointer",
    background: "none",
    border: "none",
    display: "inline",
    fontSize: "14px",
    fontWeight: "600",
    fontFamily: "Lato",
    lineHeight: "20px",
    minWidth: "10px",
    padding: "4px",
    marginRight: "16px",
    "&:disabled": {
      color: "#CCC",
    },
  },
  closeButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0px",
  },
  closeFooterButton: {
    borderRadius: "4px",
    border: "1px solid #0F6CBD",
    backgroundColor: "#FFF",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "8px 16px",
    fontFamily: "Lato",
    fontSize: "14px",
    lineHeight: "20px",
    color: "#0F6CBD",
    "& .ms-Button-label": {
      fontWeight: "600 !important",
    },
  },
  submitFooterButton: {
    borderRadius: "4px",
    border: "1px solid #0F6CBD",
    backgroundColor: "#0F6CBD",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "8px 16px",
    fontFamily: "Lato",
    fontSize: "14px",
    lineHeight: "20px",
    color: "#FFF",
    marginLeft: "18px",
    "& .ms-Button-label": {
      fontWeight: "600 !important",
    },
    "&:disabled": {
      backgroundColor: "#E6E6E6",
      color: "#595959",
      border: "none",
    },
  },
});
