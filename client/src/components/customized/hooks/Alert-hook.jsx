import { useCallback, useReducer } from "react";
import { v4 as uuid } from "uuid";
import { SET_ALERT, REMOVE_ALERT } from "../Types";

const alertReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      return (state = state.filter((alert) => alert.id !== payload.id));
    default:
      return state;
  }
};

export const useAlert = () => {
  const [alerts, dispatch] = useReducer(alertReducer, []);

  const setAlert = useCallback((alertType, alertMsg, timeOut = 3000) => {
    const id = uuid();
    dispatch({ type: SET_ALERT, payload: { id, alertMsg, alertType } });

    setTimeout(
      () => dispatch({ type: REMOVE_ALERT, payload: { id } }),
      timeOut
    );
  }, []);

  return [alerts, setAlert];
};
