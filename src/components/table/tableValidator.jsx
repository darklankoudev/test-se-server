import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL_SUPPORT } from "../../constants/constants";
import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import CircularProgress from '@mui/material/CircularProgress';
import "../../Css/themes/echo.css";

const TableValidator = () => {
  const [dataVal, setDataVal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL_SUPPORT}/validators/list`);
        const validatorsList = res.data.currentValidatorsList;
        setDataVal(validatorsList);
        // console.log(validatorsList)
        setLoading(false);
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.error(e);
        }
      }
    };

    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const votingPowerFormatted = (number) => {
    return (number / 1000000).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
  };

  const votingPercentageFormatted = (number) => {
    return number.toFixed(2) + "%";
  };

  const columns = [
    { id: "address", label: "#", minWidth: 50 },
    { id: "address", label: "Address", minWidth: 170 },
    { id: "moniker", label: "Moniker", minWidth: 170 },
    { id: "operator_address", label: "Operator", minWidth: 170 },
    { id: "pub_key.type", label: "Type", minWidth: 170 },
    {
      id: "voting_power",
      label: "Voting Power",
      minWidth: 170,
      format: votingPowerFormatted,
    },
    {
      id: "voting_percentage",
      label: "Percentage",
      minWidth: 100,
      format: votingPercentageFormatted,
    },
  ];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="left"
                  style={{
                    minWidth: column.minWidth,
                    color: "white",
                    borderRight: "1px solid #e0e0e0",
                  }}
                  className="overflow-hidden bg-gradient-to-b from-theme-2/90 to-theme-1/[0.85] p-5"
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <CircularProgress color="success" />
                  <div className="text-center mt-2">Please wait a few seconds</div>
                </TableCell>
              </TableRow>
            ) : (
              dataVal
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, rowIndex) => {
                  const index = page * rowsPerPage + rowIndex + 1;
                  return (
                    <TableRow hover tabIndex={-1} key={rowIndex}>
                      <TableCell
                        align="left"
                        style={{ border: "1px solid #e0e0e0" }}
                        // sx = {{padding: "8px"}}
                      >
                        {index}
                      </TableCell>
                      <TableCell
                        align="left"
                        style={{ border: "1px solid #e0e0e0" }}
                        sx={{ padding: "8px" }}
                      >
                        {row.address}
                      </TableCell>
                      {columns.slice(2).map((column, columnIndex) => {
                        const value = column.id.includes(".")
                          ? row[column.id.split(".")[0]][column.id.split(".")[1]]
                          : row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align="left"
                            style={{ border: "1px solid #e0e0e0" }}
                          >
                            {column.format &&
                            typeof column.format === "function"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={dataVal.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
  
};

export default TableValidator;
