import React, { Component } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { connect } from "react-redux";
import { updateAction } from "../../store/use-redux";
import { NavLink } from "react-router-dom";
import { Button } from "@mui/material";

const initialState = "Loading...";

class Readd extends Component {
  constructor() {
    super();
    this.state = {
      tableData: [],
      content: initialState,
      isDeleted: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      axios
        .get("https://620bf820ab956ad805681514.mockapi.io/Crud")
        .then((responseData) => {
          this.setState({ tableData: responseData.data }, () => {
            if (this.state.tableData.length === 0) {
              this.setState({ content: "No Data Found!!" });
            }
          });
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          alert("Something Went Wrong at Our End!");
        });
    }, 2000);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isDeleted === true) {
      axios
        .get("https://620bf820ab956ad805681514.mockapi.io/Crud")
        .then((responseData) => {
          this.setState({ tableData: responseData.data }, () => {
            if (this.state.tableData.length === 0) {
              this.setState({ content: "No Data Found!!" });
            }
            this.setState({ isDeleted: false });
          });
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          alert("Something Went Wrong at Our End!");
        });
    }

    // .then(() => {
    //   this.setState({ isDeleted: false });
    // });
  }

  setLocalStorage(data) {
    localStorage.setItem("updateId", data.id);
    localStorage.setItem("fName", data.fName);
    localStorage.setItem("lName", data.lName);
    localStorage.setItem("number", data.number);
    localStorage.setItem("email", data.email);
    localStorage.setItem("date", data.date);

    this.props.update();
  }

  deleteData(id) {
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
  }

  render() {
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
        {this.state.tableData.length !== 0 ? (
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
              {this.state.tableData.map((rowData) => {
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
                            this.setLocalStorage({
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
                          this.setState({ isDeleted: true });
                          this.deleteData(rowData.id);
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
            {this.state.content}
          </p>
        )}
      </TableContainer>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    update: () => dispatch(updateAction.update()), //we cant call functions directly in state values
  };
};

export default connect(null, mapDispatchToProps)(Readd);
