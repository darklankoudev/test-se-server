import { useState, useEffect } from "react";
import * as React from "react";
import axios from "axios";
import "../../Css/themes/echo.css";
import { API_BASE_URL_SUPPORT } from "../../constants/constants";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { format as fm } from "date-fns";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { ActivitySquare, BookMarked } from "lucide-react";

const TableTXH = () => {
  const [height, setHeight] = useState([]);
  const [pageTXH, setPageTXH] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return fm(date, "dd/MM/yyyy HH:mm:ss");
  };

  const calculateAge = (timeString) => {
    const date = new Date(timeString);
    const currentTime = new Date();
    const difference = currentTime - date;

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else {
      return `${seconds} seconds ago`;
    }
  };

  const getStatus = (returnCode) => {
    return returnCode === 0 || returnCode === null ? "Success" : "Fail";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL_SUPPORT}/blocks/list/5`);
        console.log(res.data);
        setHeight(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  const currentHeight = height.length > 0 ? height[0].header_height : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentHeight !== null) {
          const res = await axios.get(
            `${API_BASE_URL_SUPPORT}/transactions/list/20/${currentHeight}`
          );
          const sorted20TXH = res.data;
          setPageTXH(sorted20TXH);
          setLoading(false);
        }
      } catch (e) {
        console.log(e);
      }
    };

    if (currentHeight !== null) {
      fetchData();
    }
  }, [currentHeight, height]);

  const loadNextTXH = async () => {
    try {
      if (pageTXH.length > 0) {
        const lastBlockHeight = pageTXH[pageTXH.length - 1].header_height;
        const res = await axios.get(
          `${API_BASE_URL_SUPPORT}/transactions/list/20/${lastBlockHeight - 1}`
        );
        setPageTXH([...pageTXH, ...res.data]);
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    loadNextTXH();
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    loadNextTXH();
  };

  const handleDetailBlock = (id) => {
    navigate(`/block/detail/${id}`);
  }

  const columns = [
    { id: "hash", label: "Transactions Hash", minWidth: 170 },
    { id: "header_height", label: "Block Height", minWidth: 180, align:"center" },
    { id: "block_id", label: "Block Hash", minWidth: 180 },
    { id: "tx_type", label: "Type", minWidth: 100 },
    { id: "header_time", label: "Age", minWidth: 180, format: calculateAge, align:"center" },
    { id: "fee_amount_per_gas_unit", label: "Gas", minWidth: 180, align:"center" },
    { id: "return_code", label: "Status", minWidth: 170, format: getStatus, align:"center" },
    {
      id: "header_time",
      label: "Timestamp",
      minWidth: 190,
      format: formatTime, 
      align:"center"
    },
  ];

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 503}}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
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
                  <div className="text-center mt-2">
                    Please wait a few seconds
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              pageTXH
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.hash}>
                    {columns.map((column) => {
                      const value =
                        column.id === "header_time"
                          ? column.label === "Age"
                            ? calculateAge(row[column.id])
                            : formatTime(row[column.id])
                          : column.id === "header_height" &&
                            column.label === "Block Height"
                          ? (
                            <button
                              style={{
                                background: "none",
                                border: "none",
                                color: "#6495ED",
                              }}
                              onClick={() =>
                                handleDetailBlock(row.header_height)
                              }
                            >
                              {`#${row[column.id]}`}
                            </button>
                          )
                          : column.id === "return_code"
                          ? getStatus(row[column.id])
                          : column.id === "fee_amount_per_gas_unit"
                          ? row[column.id] * 1
                          : row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ border: "1px solid #e0e0e0", 
                          // textDecoration: column.id === "hash" ? "underline" : "none",
                          color: column.id === "hash" ? "#6495ED" : "inherit"
                         }}
                        >{column.id === "hash" ? (
                          <div style={{ display: "flex", alignItems: "center" }}>
                              <ActivitySquare size={20} className="stroke-[1] w-5 h-5 side-menu__link__icon mr-1" />
                              <span>{value}</span>
                          </div>
                      ) : (
                          value
                      )}
                          {/* {value} */}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={pageTXH.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TableTXH;
