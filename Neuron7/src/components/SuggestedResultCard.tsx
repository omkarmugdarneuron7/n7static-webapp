import React, { useState } from "react";
import {
  makeStyles,
} from "@fluentui/react-components";
import ExpandableText from "./ExpandableText";
import { useMediaQuery } from "react-responsive";
import Chevronup from "../assets/icons/Chevron-up.svg";
import Chevrondown from "../assets/icons/Chevron-down.svg";
const useStyles = makeStyles({
  cardContainer: {
    marginTop: "18px",
    marginBottom: "18px",
    padding: "16px",
    border: "1px solid #F4F4F4",
    borderRadius: "8px",
    backgroundColor: "#FAFAFA !important",
    boxShadow:
      " 0px 1px 2px 0px rgba(0, 0, 0, 0.14), 0px 0px 2px 0px rgba(0, 0, 0, 0.12)",
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "700",
    fontSize: "16px",
    color: "#424242",
    lineHeight: "24px",
    fontFamily: "Lato",
  },
  iconContainer: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0px",
  },
});

interface Props{
  text:string;
}

const SuggestedResultCard = ({text}:Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobileView = useMediaQuery({ query: "(max-width: 768px)" });
  const [data,setData] = useState<any>([]);
  const styles = useStyles();
  const longText = `This is a long piece of text that needs to be truncated. It contains more than 250 characters so that we can demonstrate the see more and see less functionality.
  When you click "See More", the full text will be displayed. Otherwise, only the first 250 characters will be visible. This makes the UI cleaner and more readable.`;
   
  
  return (
    <div className={styles.cardContainer}>
      <div className={styles.header}>
        Suggested Results from Generative AI
        {isMobileView && (
          <button
            className={styles.iconContainer}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <img
              src={isExpanded ? Chevronup : Chevrondown}
              alt="Search Icon"
              width="20"
              height="20"
            />
          </button>
        )}
      </div>

      <div style={{ display: isMobileView && !isExpanded ? "none" : "block" }}>
        <ExpandableText text={text} isCardExpanded={isExpanded} />
      </div>
    </div>
  );
};

export default SuggestedResultCard;
