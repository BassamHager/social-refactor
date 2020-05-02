import React, { useEffect } from "react";
import { useProfile } from "../../customized/hooks/Profile-hook";

const Dashboard = () => {
  const { getCurrentProfile, resProfile } = useProfile();

  useEffect(() => {
    console.log("123: Dashboard -> resProfile", resProfile);
    getCurrentProfile();
    // eslint-disable-next-line
  }, []);

  return <div>Dashboard</div>;
};

export default Dashboard;
