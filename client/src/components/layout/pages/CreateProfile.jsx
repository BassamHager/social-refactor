import React, { Fragment, useState, useContext, useEffect } from "react";
import { withRouter } from "react-router-dom";
// hooks
import { useForm } from "../../customized/hooks/Form-hook";
import { useProfile } from "../../customized/hooks/Profile-hook";
import { VALIDATOR_REQUIRE } from "../../customized/hooks/Validators-hook";
// formElements
import Input from "../../customized/formElement/Input";
import Button from "../../customized/formElement/Button";
// context
import { ProfileContext } from "../../customized/context/profile-context";

const CreateProfile = ({ history }) => {
  const { createOrUpdateProfile } = useProfile();
  const [displaySocials, toggleDisplaySocials] = useState(false);
  // context
  const { profile } = useContext(ProfileContext);
  const {
    company,
    website,
    location,
    skills,
    githubusername,
    bio,
    twitter,
    facebook,
    linkedin,
    youtube,
    instagram,
  } = profile;

  const [formState, inputHandler] = useForm(
    {
      company: { value: company || "" },
      website: {},
      location: {},
      status: {},
      skills: {},
      githubusername: {},
      bio: {},
      twitter: {},
      facebook: {},
      linkedin: {},
      youtube: {},
      instagram: {},
    },
    false
  );

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    createOrUpdateProfile(formState.inputs, history);
  };

  useEffect(() => {
    console.log(formState.inputs);
    console.log(profile);
  }, [profile, formState.inputs]);

  return (
    <Fragment>
      <h1 className="large text-primary">Create Your Profile</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Let's get some information to make your
        profile stand out
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={authSubmitHandler}>
        <div className="form-group">
          <select defaultValue="Developer" name="status">
            <option value="0">* Select Professional Status</option>
            <option value="Developer">Developer</option>
            <option value="Junior Developer">Junior Developer</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Manager">Manager</option>
            <option value="Student or Learning">Student or Learning</option>
            <option value="Instructor">Instructor or Teacher</option>
            <option value="Intern">Intern</option>
            <option value="Other">Other</option>
          </select>
          <small className="form-text">
            Give us an idea of where you are at in your career
          </small>
        </div>

        <div className="form-group">
          <Input
            element="input"
            type="text"
            id="company"
            label="Company Name"
            placeholder="company name..."
            onInput={inputHandler}
            initialValid={true}
            initialValue={company}
          />
          <small className="form-text">
            Could be your own company or one you work for
          </small>
        </div>

        <div className="form-group">
          <Input
            element="input"
            id="website"
            type="text"
            label="Website"
            placeholder="website..."
            onInput={inputHandler}
            initialValid={true}
            initialValue={website}
          />
          <small className="form-text">
            Could be your own or a company website
          </small>
        </div>

        <div className="form-group">
          <Input
            element="input"
            id="location"
            type="text"
            label="Location"
            placeholder="location ..."
            onInput={inputHandler}
            initialValid={true}
            initialValue={location}
          />
          <small className="form-text">
            City & state suggested (eg. Boston, MA)
          </small>
        </div>

        <div className="form-group">
          <Input
            element="input"
            id="skills"
            type="text"
            label="* Skills"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter at least one skill! (separated by comas,,,)"
            placeholder="first skill, second skill, third..."
            onInput={inputHandler}
            initialValue={skills}
          />
          <small className="form-text">
            Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
          </small>
        </div>

        <div className="form-group">
          <Input
            element="input"
            id="githubusername"
            type="text"
            label="Github Username"
            placeholder="your name..."
            onInput={inputHandler}
            initialValid={true}
            initialValue={githubusername}
          />
          <small className="form-text">
            If you want your latest repos and a Github link, include your
            username
          </small>
        </div>

        <div className="form-group">
          <Input
            element="textarea"
            id="bio"
            type="text"
            label="Your Bio"
            placeholder="your Bio..."
            onInput={inputHandler}
            initialValid={true}
            initialValue={bio}
          />
          <small className="form-text">Tell us a little about yourself</small>
        </div>

        <div className="my-2">
          <Button onClick={() => toggleDisplaySocials(!displaySocials)}>
            Add Social Network Links
          </Button>
          <span>Optional</span>
        </div>

        {displaySocials && (
          <Fragment>
            <div className="form-group social-input">
              <i className="fab fa-twitter fa-2x"></i>
              <Input
                element="input"
                id="twitter"
                type="text"
                label="Twitter URL"
                placeholder="your Twitter URL..."
                onInput={inputHandler}
                initialValid={true}
                initialValue={twitter}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-facebook fa-2x"></i>
              <Input
                element="input"
                id="facebook"
                type="text"
                label="Facebook URL"
                placeholder="your Facebook URL..."
                onInput={inputHandler}
                initialValid={true}
                initialValue={facebook}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-youtube fa-2x"></i>
              <Input
                element="input"
                id="youtube"
                type="text"
                label="Youtube URL"
                placeholder="your Youtube URL..."
                onInput={inputHandler}
                initialValid={true}
                initialValue={youtube}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-linkedin fa-2x"></i>
              <Input
                element="input"
                id="linkedin"
                type="text"
                label="Linkedin URL"
                placeholder="your Linkedin URL..."
                onInput={inputHandler}
                initialValid={true}
                initialValue={linkedin}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-instagram fa-2x"></i>
              <Input
                element="input"
                id="instagram"
                type="text"
                label="Instagram URL"
                placeholder="your Instagram URL..."
                onInput={inputHandler}
                initialValid={true}
                initialValue={instagram}
              />
            </div>
          </Fragment>
        )}
        <Button>Submit</Button>

        <Button className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Button>
      </form>
    </Fragment>
  );
};

export default withRouter(CreateProfile);
