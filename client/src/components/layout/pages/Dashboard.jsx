import React, { useEffect, useContext, Fragment } from "react";
import Button from "../../customized/formElement/Button";
// hooks
import { useProfile } from "../../customized/hooks/Profile-hook";
// context
import { ProfileContext } from "../../customized/context/profile-context";

const Dashboard = () => {
  const { getCurrentProfile } = useProfile();
  const { profile } = useContext(ProfileContext);

  let user;

  if (profile) {
    user = profile.user;
  }
  // }

  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  return (
    <Fragment>
      <h1>Spinner...</h1>
      <Fragment>
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Welcome {user && user.name}
        </p>
      </Fragment>
      <Fragment>
        <div className="dash-buttons">
          <Button to="create-profile" className="btn btn-light">
            <i className="fas fa-user-circle text-primary"></i> Edit Profile
          </Button>
          <Button to="add-experience" className="btn btn-light">
            <i className="fab fa-black-tie text-primary"></i> Add Experience
          </Button>
          <Button to="add-education" className="btn btn-light">
            <i className="fas fa-graduation-cap text-primary"></i> Add Education
          </Button>
        </div>
      </Fragment>
      <hr />

      {!profile && profile !== undefined ? (
        <Fragment>
          <p>You have no profile yet!</p>
          <Button to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Button>
        </Fragment>
      ) : (
        <Fragment>
          <p>{user && user.name} Profile</p>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Dashboard;
