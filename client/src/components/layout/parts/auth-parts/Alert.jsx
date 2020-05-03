import React, { useContext, Fragment } from "react";
// context
import { AlertContext } from "../../../customized/context/alert-context";

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
