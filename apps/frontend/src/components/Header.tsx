import { NavLink, useNavigate } from 'react-router';

import { useAuth } from '../context/useAuth';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="sticky top-0 left-0 z-50 w-full bg-white p-4 center">
      <div className="w-full max-w-4xl mx-auto flex justify-between">
        <div className="left-section flex justify-start gap-4">
          <NavLink className={({ isActive }) => (isActive ? 'nav-link-active' : 'nav-link')} to="/">
            Homepage
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'nav-link-active' : 'nav-link')} to="/page-one">
            Page 1
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'nav-link-active' : 'nav-link')} to="/page-two">
            Page 2
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'nav-link-active' : 'nav-link')} to="/page-three">
            Page 3
          </NavLink>
        </div>

        <div className="right-section flex items-center justify-end gap-4">
          {isAuthenticated ? (
            <>
              <NavLink className={({ isActive }) => (isActive ? 'nav-link-active' : 'nav-link')} to="/account">
                {user?.first_name || 'Account'}
              </NavLink>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="nav-link cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink className={({ isActive }) => (isActive ? 'nav-link-active' : 'nav-link')} to="/register">
                Register
              </NavLink>
              <NavLink className={({ isActive }) => (isActive ? 'nav-link-active' : 'nav-link')} to="/login">
                Login
              </NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
