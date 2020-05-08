import { useReducer, useCallback, useContext } from "react";
// import { PROFILE_ERROR, GET_PROFILE } from "../../customized/Types";
import { SET_ALERT } from "../../customized/Types";
// hooks
import { useHttpClient } from "../../customized/hooks/Http-hook";
// context
import { AuthContext } from "../context/auth-context";
import { ProfileContext } from "../context/profile-context";
import { AlertContext } from "../context/alert-context";

// Reducer
// const profileReducer = (state, action) => {
//   const { type, payload } = action;
//   switch (type) {
//     case GET_PROFILE:
//       return {
//         ...state,
//         profile: payload,
//       };
//     case PROFILE_ERROR:
//       return {
//         ...state,
//         error: payload,
//       };
//     default:
//       return state;
//   }
// };

// hook
export const useProfile = () => {
  const { setAlert } = useContext(AlertContext);
  const { sendRequest } = useHttpClient();
  const { userId, token } = useContext(AuthContext);
  const { setProfile } = useContext(ProfileContext);

  // const [, dispatch] = useReducer(profileReducer, {
  //   profile: {},
  //   profiles: [],
  //   repos: [],
  //   error: {},
  // });

  // GET PROFILE
  const getCurrentProfile = useCallback(async () => {
    try {
      const resProfile = await sendRequest(`/api/profile/${userId}`);

      setProfile(resProfile);

      // dispatch({ type: GET_PROFILE, payload: resProfile });
    } catch (err) {
      console.log(err);
      // dispatch({
      //   type: PROFILE_ERROR,
      //   payload: { msg: err.msg },
      // });
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
            "Content-Type": "Application/json",
            "x-auth-token": token,
          }
        );
        setAlert("success", edit ? "profile created!" : "profile updated!");

        setProfile(newProfile);
      } catch (err) {
        console.log(err.message);
      }
      history.push("/dashboard");
    },
    [sendRequest, token, setProfile]
  );

  // useEffect(() => {
  //   console.log(profile);
  //   // if (token) createOrUpdateProfile();
  // }, [getCurrentProfile, createOrUpdateProfile]);

  return { getCurrentProfile, createOrUpdateProfile };
};
