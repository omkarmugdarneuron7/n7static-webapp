import React from "react";
import { Input, Button, makeStyles } from "@fluentui/react-components";
import Search from "../assets/icons/Search.svg";
import { useMediaQuery } from "react-responsive";
const useStyles = makeStyles({
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    marginTop: "24px",
    // paddingBottom: "10px",
    flexDirection: "column",
    alignContent: "center",
    alignItems: "center",
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "100%",
    borderRadius: "24px",
    backgroundColor: "#FFF",
    padding: "8px 0.8px 8px 16px",
    height: "40px",
    gap: "4px",
    border: "1px solid #D1D1D1",
    boxShadow:
      "0px 1px 2px 0px rgba(0, 0, 0, 0.14), 0px 0px 2px 0px rgba(0, 0, 0, 0.12)",
    ":focus-within": {
      outline: "none",
      border: "1px solid #ccc",
    },
  },
  inputField: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    flexGrow: 1,
    fontFamily: "Lato",
    fontSize: "16px",///to prevent zoomin effect in ios mobile devices
    fontWeight: "400",
    lineHeight: "20px",
    backgroundColor: "#FFF",
    border: "none !important",
    color: "#424242 !important",
    ":focus": {
      outline: "none !important",
      boxShadow: "none !important",
      border: "none !important",
    },
    ":focus-visible": {
      outline: "none !important",
      boxShadow: "none !important",
    },
    '& .fui-Input__input': {
      color: "#424242 !important",  
      padding: "0px",
    },

    "&::after": {
      border: "none !important", // Correctly applies the ::after pseudo-element
    },
  },
  searchIconContainer: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0px",
  },
  searchButton: {
    borderRadius: "20px !important",
    display: "flex",
    width: "92px",
    height: "36px",
    maxWidth: "320px",
    padding: "0px 12px",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F6CBD",
    color: "#FFF",
    gap: "4px",
  },
  staticText: {
    color: "#808080",
    textAlign: "center",
    fontFamily: "Lato",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: "22px",
    marginTop: "26px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
interface Props {
  setEnteredText: any;
  enteredText: string;
  onSearch: () => void;
}
const SearchBar = ({
  setEnteredText,
  enteredText,
  onSearch,
}: Props) => {
  const styles = useStyles();
  const isMobileView = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <div className={styles.searchContainer}>
      <div
        className={styles.searchBox}
        style={{ width: isMobileView ? "100%" : "819px" }}
      >
        <button className={styles.searchIconContainer}>
          <img src={Search} alt="Search Icon" width="20" height="20" />
        </button>
        <Input
          className={styles.inputField}
          type="text"
          name="search"         
          autoComplete="on"
          placeholder="Search for resources, topics, or keywords"
          onChange={(e) => {
            setEnteredText(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && enteredText.length > 0) {
              onSearch();
            }
          }}
        />
        <Button
          className={styles.searchButton}
          onClick={()=>{if(enteredText.length>0)onSearch()}}
          role="button"
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
