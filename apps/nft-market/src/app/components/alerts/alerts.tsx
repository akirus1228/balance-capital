import { Alert, AlertTitle, LinearProgress, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { AlertMsg, clearAlert } from "../../store/reducers/app-slice";
import "./alerts.module.scss";

export type AlertColor = "success" | "info" | "warning" | "error";

interface LinearProps {
  alert: AlertMsg;
}

export const Linear = (props: LinearProps): JSX.Element => {
  const [progress, setProgress] = useState(100);
  const dispatch = useDispatch();

  useEffect(() => {
    let isSubscribed = true;
    const timer = setInterval(() => {
      if (isSubscribed) {
        setProgress((oldProgress) => {
          if (oldProgress === 0) {
            clearInterval(timer);
            dispatch(clearAlert(props.alert.startSeconds));
            return 0;
          }
          return oldProgress - 5;
        });
      }
    }, 333);

    return () => {
      isSubscribed = false;
      clearInterval(timer);
    };
  }, [dispatch, props?.alert]);

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
