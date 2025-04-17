import React, { useEffect } from "react";
import ModalComponent from "./ModalWrapperComponent";
import CloseIcon from "../../assets/icons/close-icon.svg";
import { makeStyles, Textarea } from "@fluentui/react-components";
import { useDispatch, useSelector } from "react-redux";
import { setFeebackText, setIsNegativeFeedbackModalOpen, setIsNegativeFeedbackPushed } from "../../Redux";
import { SagaIntelligentSearchActionType } from "../../Redux/Sagas/inteliigentSearchActions";
import { RootState } from "../../Redux/Store";
import { useAuth } from "../../context/AuthContext";

interface ModalProps {
  isModalOpen: boolean;
  onDismiss: ()=> void;
}
const NegativeFeedbackModal = ({ isModalOpen, onDismiss }: ModalProps) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const feedbackText = useSelector(
    (state: RootState) => state.intelligentSearch.feedbackText )
  const { token,baseUrl } = useAuth();
  const negativeFeedbackData = useSelector(
    (state: RootState) => state.intelligentSearch.negativeFeedbackData
  );

  const handleFeedbackSubmission = () => {
    console.log(feedbackText.length,feedbackText);
    
    if(feedbackText.length>0)
 {   onDismiss();
  if (token && baseUrl) {
    dispatch({
      type: SagaIntelligentSearchActionType.pushSpecificFeedback,
      payload: {
        comment: feedbackText,
        feedback_id: negativeFeedbackData.id,
        token: token,
        baseUrl
      },
    });
  }
    dispatch(setIsNegativeFeedbackPushed(false));
    dispatch(setFeebackText(""));
  }
  };

  //This will ensure that the feedback is reset when the modal is closed
  // and the modal is opened again. when negative feedback is pressed
  useEffect(() => {
    return () => {
      dispatch(setIsNegativeFeedbackPushed(false));
    };
  }, [isModalOpen]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setFeebackText(event.target.value));
  };

  return (
    <ModalComponent
      isOpen={isModalOpen}
      onDismiss={()=>{dispatch(setIsNegativeFeedbackModalOpen(false))}}
      closeButtonText="Cancel"
      submitButtonText="Submit"
      onSubmit={handleFeedbackSubmission}
      header={
        <div className={styles.headerContainer}>
          <div className={styles.addCommentText}>
            {"Add Comment "}
            <span className={styles.optionalText}>{"(optional)"}</span>
          </div>
          <div className={styles.closeIconContainer}>
            <button
              className={styles.closeButton}
              onClick={() =>{dispatch(setIsNegativeFeedbackModalOpen(false))}}
            >
              <img src={CloseIcon} alt="Search Icon" width="20" height="20" />
            </button>
          </div>
        </div>
      }
    >
      <div>
        <Textarea
          className={styles.textArea}
          onChange={handleChange}
          placeholder="Please share more details about why this resource is not helpful, considering the specifics of the search phrase provided"
        />
      </div>
    </ModalComponent>
  );
};

export default NegativeFeedbackModal;

const useStyles = makeStyles({
  textArea: {
    "&::placeholder": {
      color: "#8F8F8F !important",
      fontStyle: "italic",
    },
    "& textarea::placeholder": {
      color: "#8F8F8F !important",
      fontStyle: "italic",
    },
    "&::after": {
      border: "none !important",
    },
    "&.fui-Textarea": {
      color: "#666",
      backgroundColor: "transparent",
    },
    "& .fui-Textarea__textarea": {
      overflow: "hidden",
      color: "#666",
      padding: "0px",
    },
    marginTop: "8px",
    marginBottom: "8px",
    display: "flex",
    padding: "8px",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid #D2D0CE",
    fontFamily: "Lato",
    fontSize: "16px",//to prevent zoom in effect in ios mobile
    fontWeight: "400",
    lineHeight: "20px",
    height: "120px",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    color: "black ",
  },
  addCommentText: {
    color: "#424242",
    fontFamily: "Lato",
    fontSize: "20px",
    fontWeight: "600",
    lineHeight: "26px",
  },
  optionalText: {
    color: "#424242",
    fontFamily: "Lato",
    fontSize: "12px",
    fontWeight: "400",
    lineHeight: "16px",
  },
  closeButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0px",
  },
  closeIconContainer: { display: "flex" },
});
