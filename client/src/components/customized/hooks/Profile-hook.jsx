import { useReducer, useCallback, useContext } from "react";
import { useHttpClient } from "../../customized/hooks/Http-hook";
import { PROFILE_ERROR, GET_PROFILE } from "../../customized/Types";
import { AuthContext } from "../../context/auth-context";
import { ProfileContext } from "../../context/profile-context";

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

export const useProfile = () => {
  const { sendRequest } = useHttpClient();
  const { userId } = useContext(AuthContext);
  const { setProfile } = useContext(ProfileContext);
  //   console.log("123: useProfile -> userId", userId);

  const [profiles, dispatch] = useReducer(profileReducer, {
    profile: null,
    profiles: [],
    repos: [],
    error: {},
  });

  const getCurrentProfile = useCallback(async () => {
    try {
      const resProfile = await sendRequest(`/api/profile/${userId}`);

      setProfile(resProfile);
      // console.log("123: getCurrentProfile -> resProfile", resProfile);

      dispatch({ type: GET_PROFILE, payload: resProfile });
    } catch (err) {
      console.log(err);
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.msg },
      });
    }
  }, [sendRequest, userId, setProfile]);

  if (profiles & dispatch) console.log("remove me");
  return { getCurrentProfile };
};
