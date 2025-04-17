import React, { useState } from "react";
import {
  Checkbox,
  makeStyles,
  shorthands,
  CheckboxOnChangeData,
} from "@fluentui/react-components";
import Chevronup from "../../assets/icons/Chevron-up.svg";
import Chevrondown from "../../assets/icons/Chevron-down.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/Store";

interface AccordionProps {
  title: string;
  options: string[];
  showCheckbox: boolean;
  selectedOptions?: string[];
  onSelectionChange?: (title: string, selected: string[]) => void;
}

const useStyles = makeStyles({
  accordionContainer: {
    borderRadius: "4px",
    overflow: "hidden",
    marginTop: "8px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    cursor: "pointer",
    padding: "0px 16px 16px 16px",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "0px 16px 16px 16px",
  },
  divider: {
    width: "100%",
    height: "1px",
    backgroundColor: "#CCC",
  },
  chevronIconContainer: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0px",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
  },
  checkboxLabel: {
    color: "#424242",
    fontWeight: "400",
    fontSize: "12px",
    lineHeight: "16px",
    fontFamily: "Lato",
    textOverflow: "ellipsis",
  },
  customCheckbox: {
    "& input ~ .fui-Checkbox__indicator": {
      backgroundColor: "#FFF",
      border: "1.5px solid #D2D0CE",
      borderRadius: "4px",
    },
    "& input:checked ~ .fui-Checkbox__indicator": {
      backgroundColor: "#0F6CBD",
      color: "white",
      ...shorthands.borderColor("blue"),
    },
    "& .fui-Label": {
      color: "#424242",
      fontWeight: "400",
      fontSize: "12px",
      lineHeight: "16px",
      fontFamily: "Lato",
      textOverflow: "ellipsis",
    },
    marginRight: "8px",
  },
  titleText: {
    fontSize: "14px",
    fontWeight: "600",
    lineHeight: "20px",
    fontFamily: "Lato",
    color: "#616161",
  },
});

export const FilterAccordion: React.FC<AccordionProps> = ({
  title,
  options,
  showCheckbox,
  selectedOptions,
  onSelectionChange,
}) => {
  const [expanded, setExpanded] = useState(true);
  const styles = useStyles();
  const handleSecondarySearchClick = () => {
    if (!showCheckbox) {
      alert("clicked");
    }
  };
  const handleCheckboxChange = (option: string, checked: boolean) => {
    if (selectedOptions && onSelectionChange) {
      const updatedSelection = checked
        ? [...selectedOptions, option]
        : selectedOptions.filter((item) => item !== option);

      onSelectionChange(title, updatedSelection);
    }
  };

  return (
    <div className={styles.accordionContainer}>
      <div className={styles.header} onClick={() => setExpanded(!expanded)}>
        <span className={styles.titleText}>{title}</span>
        <button className={styles.chevronIconContainer}>
          <img
            src={expanded ? Chevrondown : Chevronup}
            alt="chevron Icon"
            width="18"
            height="18"
            color="#999999"
          />
        </button>
      </div>

      {expanded && (
        <div className={styles.content}>
          {options.map((option, index) => (
            <div key={index} className={styles.checkboxContainer}>
              {showCheckbox && (
                <Checkbox
                  checked={selectedOptions?.includes(option)}
                  className={styles.customCheckbox}
                  width={20}
                  height={20}
                  onChange={(e, data: CheckboxOnChangeData) =>
                    handleCheckboxChange(option, data.checked as boolean)
                  }
                />
              )}
              <span
                className={styles.checkboxLabel}
                onClick={handleSecondarySearchClick}
              >
                {option}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className={styles.divider} />
    </div>
  );
};
