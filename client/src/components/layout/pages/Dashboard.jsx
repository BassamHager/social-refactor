import React, { useEffect, useContext, Fragment } from "react";
import { useProfile } from "../../customized/hooks/Profile-hook";
import { ProfileContext } from "../../context/profile-context";
import Button from "../../customized/formElement/Button";

const Dashboard = () => {
  const { getCurrentProfile } = useProfile();
  const profileContext = useContext(ProfileContext);

  let profile, user;

  if (profileContext) {
    profile = profileContext.profile;

    if (profile) {
      user = profile.user;
    }
  }

  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  return (
    <Fragment>
      {profile && profile !== undefined ? (
        <Fragment>
          <h1 className="large text-primary">Dashboard</h1>
          <p className="lead">
            <i className="fas fa-user"></i> Welcome {user && user.name}
          </p>
        </Fragment>
      ) : (
        <Fragment>
          <p>Spinner...</p>
        </Fragment>
      )}
      {!profile && profile !== undefined && (
        <Fragment>
          <hr />
          <h1>don't show this or below</h1>
          <h2>!loading</h2>
          <p>
            Your profile is empty, for a better presentation, please set up your
            info
          </p>
          <Button to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Button>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Dashboard;
