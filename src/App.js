import classes from "./App.module.css";
import Create from "./components/create/Create";
// import Readd from "./components/read/Readd";
import { Route, Routes, NavLink } from "react-router-dom";
import Update from "./components/update/Update";
import { useSelector } from "react-redux";
import { Fragment } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { Navigate } from "react-router";
import { lazy, Suspense } from "react";

const Read = lazy(() => import("./components/read/Readd"));

//Main readd
function App() {
  const isUpdated = useSelector((state) => state.isUpdateClicked);
  return (
    <Fragment>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, marginLeft: 3 }}
          >
            CRUD
          </Typography>
          <div className={classes.links}>
            <NavLink
              to="/"
              className={(navData) => (navData.isActive ? classes.active : "")}
            >
              CREATE
            </NavLink>

            <NavLink
              to="/read"
              className={(navData) => (navData.isActive ? classes.active : "")}
            >
              RECORDS
            </NavLink>
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.main}>
        <Routes>
          <Route path="/" element={<Create />} />
          <Route
            path="/read"
            element={
              <Suspense
                fallback={
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: "#897f7f",
                    }}
                  >
                    Wait...
                  </p>
                }
              >
                <Read />
              </Suspense>
            }
          />
          {isUpdated && <Route path="/update" element={<Update />} />}
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Fragment>
  );
}

export default App;
