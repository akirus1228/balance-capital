import { Alert, AlertTitle, LinearProgress, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { GrowlNotification, clearAlert } from "../../store/reducers/app-slice";
import "./growl.module.scss";

export type GrowlColor = "success" | "info" | "warning" | "error";

export const Linear = ({
  growlNotification,
}: {
  growlNotification: GrowlNotification;
}): JSX.Element => {
  const [progress, setProgress] = useState(100);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Starting linear effect");
    const newTimer = setInterval(() => {
      const secondsSinceStart = Date.now() - growlNotification.startSeconds;
      const percentComplete = (secondsSinceStart / growlNotification.duration) * 100;
      const newProgress = 100 - percentComplete;
      setProgress(newProgress);
      if (newProgress <= 0) {
        window.clearInterval(newTimer);
        dispatch(clearAlert(growlNotification.startSeconds));
      }
    }, 333);
  }, []);

  return <LinearProgress variant="determinate" value={progress} />;
};

export const Growl = (): JSX.Element => {
  const { growlNotifications } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();

  const handleClose = (growlNotification: GrowlNotification) => {
    dispatch(clearAlert(growlNotification.startSeconds));
  };

  return (
    <>
      {growlNotifications.map((growlNotification: GrowlNotification, index: number) => (
        <Snackbar
          open={growlNotification.open}
          key={`alert-${index}`}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            variant="filled"
            icon={false}
            severity={growlNotification.severity as GrowlColor}
            onClose={() => handleClose(growlNotification)}
            style={{ wordBreak: "break-word", borderRadius: "10px" }}
          >
            <AlertTitle>{growlNotification.title}</AlertTitle>
            {growlNotification.message}
            <Linear growlNotification={growlNotification} />
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default Growl;
