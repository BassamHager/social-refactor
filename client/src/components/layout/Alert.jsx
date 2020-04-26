import React, { useContext, Fragment } from "react";
import { AlertContext } from "../context/alert-context";

const Alerts = () => {
  const { alerts } = useContext(AlertContext);

  return (
    <Fragment>
      {alerts.map((alert) => (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
          {alert.alertMsg}
        </div>
      ))}
    </Fragment>
  );
};

export default Alerts;
