// https://fluentsite.z22.web.core.windows.net/quick-start
import {
  FluentProvider,
  teamsLightTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  Spinner,
  tokens,
} from "@fluentui/react-components";
import { HashRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { useTeamsUserCredential } from "@microsoft/teamsfx-react";
import { TeamsFxContext } from "./Context";
import config from '../services/config';
import RouterComponent from "../routes/RouterComponent";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/Store";
import { ToastMessage } from "./AnimatedToast";

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export default function App() {
  const message = useSelector((state: RootState) => state.toast.message);
  const { loading, theme, themeString, teamsUserCredential } = useTeamsUserCredential({
    initiateLoginEndpoint: config.initiateLoginEndpoint!,
    clientId: config.clientId!,
  });
  return (
    <TeamsFxContext.Provider value={{ theme, themeString, teamsUserCredential }}>
      <FluentProvider
        theme={
          themeString === "dark"
            ? teamsDarkTheme
            : themeString === "contrast"
              ? teamsHighContrastTheme
              : {
                ...teamsLightTheme,
                colorNeutralBackground3: "#eeeeee",
              }
        }
        style={{ background: tokens.colorNeutralBackground3 }}
      >
        {loading ? (
          <Spinner style={{ margin: 100 }} />
        ) : (
          <> <RouterComponent />
            {message && <ToastMessage />}

          </>
        )}
      </FluentProvider>
    </TeamsFxContext.Provider>
  );
}
