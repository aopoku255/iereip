import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

//import images
import userDummyImg from "../../assets/images/users/user-dummy-img.jpg";

const ProfileDropdown = ({ onLockScreen }) => {
  const [userName, setUserName] = useState("Admin");
  const [roleName, setRoleName] = useState("Founder");

  useEffect(() => {
    const authUser = sessionStorage.getItem("authUser");
    if (authUser) {
      try {
        const obj = JSON.parse(authUser);
        // Get user name from various possible locations
    
        const name =
          obj?.admin?.first_name ||
          obj?.admin?.username ||
          obj?.admin?.email ||
          obj?.username ||
          obj?.first_name ||
          obj?.email ||
          "Admin";
        setUserName(name);

        // Get role name from various possible locations
        const role =
          obj?.admin?.role?.name ||
          obj?.role?.name ||
          "Founder";
        setRoleName(role.charAt(0).toUpperCase() + role.slice(1));

      } catch (e) {
        setUserName("Admin");
        setRoleName("Founder");
      }
    }
  }, []);

  //Dropdown Toggle
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };
  return (
    <React.Fragment>
      <Dropdown
        isOpen={isProfileDropdown}
        toggle={toggleProfileDropdown}
        className="ms-sm-3 header-item topbar-user"
      >
        <DropdownToggle tag="button" type="button" className="btn">
          <span className="d-flex align-items-center">
            <img
              className="rounded-circle header-profile-user"
              src={userDummyImg}
              alt="Header Avatar"
            />
            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                {userName}
              </span>
              <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                {roleName}
              </span>
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <h6 className="dropdown-header">Welcome {userName}!</h6>
          <DropdownItem
            tag={Link}
            to={import.meta.env.BASE_URL + "profile"}
            className="dropdown-item"
          >
            <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle">Profile</span>
          </DropdownItem>
          <DropdownItem
            tag={Link}
            to={import.meta.env.BASE_URL + "admin-profile"}
            className="dropdown-item"
          >
            <i className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle">Settings</span>
          </DropdownItem>
          {/* <DropdownItem
            tag="button"
            onClick={onLockScreen}
            className="dropdown-item text-start"
          >
            <i className="mdi mdi-lock text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle">Lock screen</span>
          </DropdownItem> */}
          <DropdownItem
            tag={Link}
            to={import.meta.env.BASE_URL + "logout"}
            className="dropdown-item"
          >
            <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle" data-key="t-logout">
              Logout
            </span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;
