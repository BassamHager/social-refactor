import { useReducer, useCallback, useContext, useState } from "react";
import { PROFILE_ERROR, GET_PROFILE } from "../../customized/Types";
// hooks
import { useHttpClient } from "../../customized/hooks/Http-hook";
// context
import { AuthContext } from "../context/auth-context";
import { ProfileContext } from "../context/profile-context";

// Reducer
const profileReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_PROFILE:
      return {
        ...state,
        profile: payload,
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
      };
    default:
      return state;
  }
};

// hook
export const useProfile = () => {
  const { sendRequest } = useHttpClient();
  const { userId, token } = useContext(AuthContext);
  const { setProfile, profile } = useContext(ProfileContext);
  //   console.log("123: useProfile -> userId", userId);

  const [, dispatch] = useReducer(profileReducer, {
    profile: null,
    profiles: [],
    repos: [],
    error: {},
  });

  // GET PROFILE
  const getCurrentProfile = useCallback(async () => {
    try {
      const resProfile = await sendRequest(`/api/profile/${userId}`);

      setProfile(resProfile);

      dispatch({ type: GET_PROFILE, payload: resProfile });
    } catch (err) {
      console.log(err);
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.msg },
      });
    }
  }, [sendRequest, userId, setProfile]);

  // CREATE OR UPDATE PROFILE
  const createOrUpdateProfile = useCallback(
    async (formData, history, edit = false) => {
      try {
        const newProfile = await sendRequest(
          `/api/profile`,
          "POST",
          JSON.stringify(formData),
          {
            "x-auth-token": token,
          }
        );
        // console.log(newProfile);
        // setProfile(newProfile);
        setProfile(newProfile);
        console.log(profile);
      } catch (err) {
        console.log(err.message);
      }
    },
    [sendRequest, token, profile]
  );

  return { getCurrentProfile, createOrUpdateProfile };
};
