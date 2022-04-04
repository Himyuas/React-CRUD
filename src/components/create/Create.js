import React, { useState, useReducer, useEffect } from "react";
import { useNavigate } from "react-router";
import { TextField, Button } from "@mui/material";
import { Stack, Alert, Paper } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha";

const moment = require("moment");

const axios = require("axios");

// Make a request for a user with a given ID
const createAPI = (details) =>
  axios
    .post("https://620bf820ab956ad805681514.mockapi.io/Crud", {
      firstName: details.firstName,
      lastName: details.lastName,
      number: details.number,
      email: details.email,
      date: details.date,
    })
    .then(function (response) {
      // handle success
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      alert("Something Went Wrong!");
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });

//Main Component
const Create = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState(null);
  const [cptValue, setCptValue] = useState("");

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  const [formCorrect, dispatch] = useReducer(
    (state, action) => {
      let newState = {};
      if (action.type === "invalid") {
        newState = action.payload;
      } else if (action.type === "number") {
        newState = {
          ...state,
          numberValid: action.payload,
        };
      } else if (action.type === "form") {
        newState = {
          ...state,
          formValid: action.payload,
        };
      }

      return newState;
    },
    {
      formValid: true,
      fNameValid: true,
      lNameValid: true,
      emailValid: true,
      numberValid: true,
    }
  );

  const firstNameHandler = (event) => {
    setFirstName(event.target.value);
  };

  const lastNameHandler = (event) => {
    setLastName(event.target.value);
  };

  const numberHandler = (event) => {
    const re = /^[0-9\b]+$/;

    // if value is not blank, then test the regex

    if (event.target.value === "" || re.test(event.target.value)) {
      if (event.target.value.length !== 10) {
        dispatch({ type: "number", payload: false });
      } else if (event.target.value.length === 10) {
        dispatch({ type: "number", payload: true });
        dispatch({ type: "form", payload: true });
      }
      setNumber(event.target.value);
    }
  };
  const emailHandler = (event) => {
    setEmail(event.target.value);
  };

  const formSubmitHandler = (event) => {
    event.preventDefault();

    let payload = {};

    if (firstName.trim().length === 0) {
      payload["fNameValid"] = true;
    } else {
      payload["fNameValid"] = true;
    }
    if (lastName.trim().length === 0) {
      payload["lNameValid"] = false;
    } else {
      payload["lNameValid"] = true;
    }
    if (number.trim().length === 10) {
      payload["numberValid"] = true;
    } else {
      payload["numberValid"] = false;
    }
    if (email.trim().length === 0) {
      payload["emailValid"] = false;
    } else {
      payload["emailValid"] = true;
    }

    if (
      !Object.values(payload).reduce((preV, curV) => {
        return preV && curV;
      }, true)
    ) {
      payload["formValid"] = false;
      dispatch({ type: "invalid", payload: payload });
      return;
    }
    const dateRe = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
    const frmtDate = moment(date).format("MM/DD/YYYY").toString();

    if (!dateRe.test(frmtDate) || date > new Date()) {
      payload["formValid"] = false;
      dispatch({ type: "invalid", payload: payload });
      return;
    }

    if (validateCaptcha(cptValue) === true) {
      alert("captcha matched");
      loadCaptchaEnginge(6);
      setCptValue("");
    } else {
      alert("captcha not matched");
      payload["formValid"] = false;
      dispatch({ type: "invalid", payload: payload });
      setCptValue("");
      return;
    }

    const details = {
      firstName: firstName,
      lastName: lastName,
      number: number,
      email: email,
      date: frmtDate,
    };
    createAPI(details);
    setFirstName("");
    setLastName("");
    setNumber("");
    setEmail("");
    navigate("/read", { replace: true });
  };

  return (
    <Paper elevation={8} style={{ width: "30%", padding: "20px" }}>
      <header
        style={{
          fontSize: "1.5rem",
          fontFamily: "Roboto,Helvetica,Arial,sans-serif",
          color: "#1976d2",
        }}
      >
        Create Form
      </header>
      <form onSubmit={formSubmitHandler}>
        {!formCorrect.formValid && (
          <Stack sx={{ width: "100%", marginTop: "10px" }} spacing={2}>
            <Alert severity="error">Please Enter Valid Details!</Alert>
          </Stack>
        )}
        <div>
          <TextField
            placeholder="First Name"
            value={firstName}
            onChange={firstNameHandler}
            label="First Name"
            variant="outlined"
            style={{ marginTop: "20px" }}
            autoComplete="off"
            fullWidth
            required
          />
        </div>
        <div>
          <TextField
            placeholder="Last Name"
            value={lastName}
            onChange={lastNameHandler}
            label="Last Name"
            variant="outlined"
            style={{ marginTop: "25px" }}
            autoComplete="off"
            fullWidth
            required
          />
        </div>
        <div>
          <TextField
            placeholder="Phone Number *"
            error={!formCorrect.numberValid ? true : false}
            onBlur={() => {
              dispatch({ type: "number", payload: true });
            }}
            helperText={
              !formCorrect.numberValid
                ? "Please Enter 10 digit Phone Number"
                : ""
            }
            label="Phone Number *"
            value={number}
            variant="outlined"
            onChange={numberHandler}
            style={{
              marginTop: "25px",
            }}
            fullWidth
            autoComplete="off"
          />
        </div>
        <div>
          <TextField
            type="email"
            placeholder="Email"
            label="Email"
            value={email}
            variant="outlined"
            onChange={emailHandler}
            style={{
              marginTop: "25px",
            }}
            fullWidth
            autoComplete="off"
            required
          />
        </div>
        <div
          style={{
            marginTop: "25px",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Submission Date"
              openTo="year"
              views={["year", "month", "day"]}
              value={date}
              onChange={(newValue) => {
                setDate(newValue);
              }}
              disableFuture
              renderInput={(params) => (
                <TextField
                  style={{ width: "100%" }}
                  autoComplete="off"
                  required
                  {...params}
                  helperText={params?.inputProps?.placeholder}
                />
              )}
            />
          </LocalizationProvider>
        </div>
        <div
          style={{
            marginTop: "25px",
          }}
        >
          <LoadCanvasTemplate />
          <input
            type="text"
            placeholder="enter captcha"
            onChange={(event) => {
              setCptValue(event.target.value);
            }}
            value={cptValue}
          />
        </div>
        <Button
          variant="contained"
          type="submit"
          style={{ marginTop: "20px", float: "right" }}
        >
          Submit
        </Button>
      </form>
    </Paper>
  );
};

export default Create;
