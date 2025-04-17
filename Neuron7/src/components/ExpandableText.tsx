import React, { useState, useEffect } from "react";
import { Button, makeStyles } from "@fluentui/react-components";
import { useMediaQuery } from "react-responsive";

const useStyles = makeStyles({
  textContainer: {
    fontSize: "14px",
    fontWeight: "400",
    fontFamily: "Lato",
    lineHeight: "24px",
    display: "inline",
    color: "#666",
    whiteSpace: "normal",          
    wordBreak: "break-word",  
    overflowWrap: "break-word",
  },
  seeMoreButton: {
    color: "#0F6CBD",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
    paddingLeft:'0px',
    paddingRight:'0px',
    display: "inline", 
    fontSize: "14px",
    fontWeight: "600",
    fontFamily: "Lato",
    lineHeight: "24px",
    minWidth:'10px',
    marginLeft:'2px'
  },
  hideButton: {
    display: "none", 
    "@media (min-width: 769px)": {
      display: "inline", 
    },
  },
});

interface ExpandableTextProps {
  text: string;
  isCardExpanded?: boolean;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, isCardExpanded }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const styles = useStyles();
  const truncatedText = text?.slice(0, 100);
  const isMobileView = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    if (!isCardExpanded) setIsExpanded(false);
  }, [isCardExpanded]);

  return (
    <div className={styles.textContainer}>
      {isExpanded ? text : truncatedText}
      {text?.length > 100 && (
        <Button
          className={`${styles.seeMoreButton} ${
            !isCardExpanded ? styles.hideButton : ""
          }`}
          appearance="transparent"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "See-less..." : "See-more..."}
        </Button>
      )}
    </div>
  );
};

export default ExpandableText;
