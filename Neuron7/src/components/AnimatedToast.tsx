import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideToast } from "../Redux/Slices/toastSlice";
import { makeStyles } from "@fluentui/react-components";
import { RootState } from "../Redux/Store";
import CheckCircleIcon from "../assets/icons/check-circle.svg";
import CloseIcon from "../assets/icons/close-icon.svg";
export const ToastMessage: React.FC = () => {
  const dispatch = useDispatch();
  const { message, isVisible } = useSelector((state: RootState) => state.toast);
  const styles = useStyles();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, dispatch]);

  if (!isVisible) return null;

  return (
    <div className={styles.toastWrapper}>
      <div className={styles.toastContainer}>
        <button className={styles.searchIconContainer}>
          <img src={CheckCircleIcon} alt="check Icon" width="24" height="24" />
        </button>
        <div className={styles.messageText}>{message}</div>
        <button
          className={styles.closeButton}
          onClick={() => dispatch(hideToast())}
        >
          <img
            src={CloseIcon}
            alt="close Icon"
            width="20"
            height="20"
            color="##4E5C80"
          />
        </button>
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  toastWrapper: {
    position: "fixed",
    top: "1%",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 100,
  },
  toastContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#E7FBEF",
    padding: "12px 16px",
    borderRadius: "4px",
    boxShadow:
      "0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.30)",
    width: "421px",
    minWidth: "320px",
    position: "relative",
    borderLeft: "4px solid #13A04E",
  },
  searchIconContainer: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0px",
    marginRight: "8px",
  },
  messageText: {
    flex: 1,
    fontSize: "14px",
    fontWeight: "400",
    color: "#002A48",
    alignItems: "center",
    fontFamily: "Inter",
    lineHeight: "18px",
  },
  closeButton: {
    marginLeft: "16px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0px",
  },
});
