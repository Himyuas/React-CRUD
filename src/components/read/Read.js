import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useDispatch } from "react-redux";
import { updateAction } from "../../store/use-redux";
import { NavLink } from "react-router-dom";
import { Button } from "@mui/material";

const initialState = "Loading...";

//Main Component
function Read() {
  const [tableData, setTableData] = useState([]);
  const dispatch = useDispatch();
  const [content, setContent] = useState(initialState);

  useEffect(() => {
    const timer = setTimeout(() => {
      axios
        .get("https://620bf820ab956ad805681514.mockapi.io/Crud")
        .then((responseData) => setTableData(responseData.data))
        .catch(function (error) {
          // handle error
          console.log(error);
          alert("Something Went Wrong!");
        });
    }, 1000);
    return () => {
      if (tableData.length === 0) {
        setContent("No Data Found!!");
      }
      clearTimeout(timer);
    };
  });

  const setLocalStorage = (data) => {
    localStorage.setItem("updateId", data.id);
    localStorage.setItem("fName", data.fName);
    localStorage.setItem("lName", data.lName);
    localStorage.setItem("number", data.number);
    localStorage.setItem("email", data.email);
    localStorage.setItem("date", data.date);
    dispatch(updateAction.update());
  };

  const deleteData = (id) => {
    axios
      .delete(`https://620bf820ab956ad805681514.mockapi.io/Crud/${id}`)
      .then((response) => {
        if (response.statusText === "OK") {
          alert("Deleted Successfully!");
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        alert("Something Went Wrong at Our End!");
      })
      .then(function () {
        // always executed
        localStorage.removeItem("deleteId");
      });
  };

  return (
    <TableContainer component={Paper} elevation={8}>
      <header
        style={{
          fontSize: "1.5rem",
          fontFamily: "Roboto,Helvetica,Arial,sans-serif",
          padding: "15px",
          textAlign: "center",
          color: "#1976d2",
        }}
      >
        Records
      </header>
      {tableData.length !== 0 ? (
        <Table
          sx={{ minWidth: 650 }}
          style={{ width: "100%" }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow
              style={{
                backgroundColor: "#1976d2",
              }}
            >
              <TableCell style={{ color: "white", fontWeight: "bolder" }}>
                First Name
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bolder" }}>
                Last Name
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bolder" }}>
                Phone Number
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bolder" }}>
                Email
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bolder" }}>
                Submission Date
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bolder" }}>
                Update
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bolder" }}>
                Delete
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((rowData) => {
              return (
                <TableRow
                  key={rowData.id}
                  sx={{
                    "&:last-child TableCell, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell>{rowData.firstName}</TableCell>
                  <TableCell>{rowData.lastName}</TableCell>
                  <TableCell>{rowData.number}</TableCell>
                  <TableCell>{rowData.email}</TableCell>
                  <TableCell>{rowData.date}</TableCell>
                  <TableCell>
                    <NavLink
                      to="/update"
                      style={{ textDecoration: "underline white 2px" }}
                    >
                      <Button
                        onClick={() => {
                          setLocalStorage({
                            id: rowData.id,
                            fName: rowData.firstName,
                            lName: rowData.lastName,
                            number: rowData.number,
                            email: rowData.email,
                            date: rowData.date,
                          });
                        }}
                        color="success"
                        variant="contained"
                      >
                        Update
                      </Button>
                    </NavLink>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        deleteData(rowData.id);
                      }}
                      color="error"
                      variant="outlined"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <p
          style={{
            textAlign: "center",
            fontSize: "1rem",
            fontWeight: "bold",
            color: "#897f7f",
          }}
        >
          {content}
        </p>
      )}
    </TableContainer>
  );
}

export default Read;
