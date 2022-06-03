import { Alert, AlertTitle, LinearProgress, Snackbar } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { AlertMsg, clearAlert } from "../../store/reducers/app-slice";
import "./alerts.module.scss";

export type AlertColor = "success" | "info" | "warning" | "error";

export const Linear = ({ alert }: { alert: AlertMsg }): JSX.Element => {
  const [progress, setProgress] = useState(100);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Starting linear effect");
    const newTimer = setInterval(() => {
      const secondsSinceStart = Date.now() - alert.startSeconds;
      const percentComplete = (secondsSinceStart / alert.duration) * 100;
      const newProgress = 100 - percentComplete;
      console.log(`newProgress ${newProgress}`);
      setProgress(newProgress);
      if (newProgress <= 0) {
        console.log(`clear interval ${newTimer}`);
        window.clearInterval(newTimer);
        dispatch(clearAlert(alert.startSeconds));
      }
      console.log(newProgress);
    }, 333);
    console.log(`newTimer ${newTimer}`);
  }, []);

  return <LinearProgress variant="determinate" value={progress} />;
};

export const Alerts = (): JSX.Element => {
  const { alerts } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();

  const handleClose = (alert: AlertMsg) => {
    dispatch(clearAlert(alert.startSeconds));
  };

  return (
    <>
      {alerts.map((alert: AlertMsg, index: number) => (
        <Snackbar
          open={alert.open}
          key={`alert-${index}`}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            variant="filled"
            icon={false}
            severity={alert.severity as AlertColor}
            onClose={() => handleClose(alert)}
            style={{ wordBreak: "break-word", borderRadius: "10px" }}
          >
            <AlertTitle>{alert.title}</AlertTitle>
            {alert.message}
            <Linear alert={alert} />
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default Alerts;
