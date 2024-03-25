import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL_SUPPORT } from "../../constants/constants";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { format as formatDate } from "date-fns";
import { useNavigate } from "react-router-dom";

const TableBlock = () => {
  const [height, setHeight] = useState([]);
  const [pageBlock, setPageBlock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return formatDate(date, "dd/MM/yyyy HH:mm:ss");
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL_SUPPORT}/blocks/list/5`);
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
            `${API_BASE_URL_SUPPORT}/blocks/list/20/${currentHeight}`
          );
          setPageBlock(res.data);
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

  const handleDetailBlock = (id) => {
    navigate(`/block/detail/${id}`);
  };

  const columns = [
    { id: "header_height", label: "Block Height", minWidth: 170 },
    { id: "block_id", label: "Block Hash", minWidth: 170 },
    { id: "header_time", label: "Age", minWidth: 175, format: calculateAge },
    { id: "transactions_count", label: "Total Transaction", minWidth: 180 },
    { id: "header_proposer_address", label: "Proposer", minWidth: 170 },
    {
      id: "header_time",
      label: "Timestamp",
      minWidth: 180,
      format: formatTime,
    },
  ];

  const loadNextBlocks = async () => {
    try {
      if (pageBlock.length > 0) {
        const lastBlockHeight = pageBlock[pageBlock.length - 1].header_height;
        const res = await axios.get(
          `${API_BASE_URL_SUPPORT}/blocks/list/20/${lastBlockHeight - 1}`
        );
        setPageBlock([...pageBlock, ...res.data]);
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    loadNextBlocks();
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    loadNextBlocks();
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 503 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="center"
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
              pageBlock
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.header_height}
                  >
                    {columns.map((column) => {
                      const value =
                        column.id === "header_time"
                          ? column.label === "Age"
                            ? calculateAge(row[column.id])
                            : formatTime(row[column.id])
                          : column.id === "header_height" &&
                            column.label === "Block Height" ? (
                            <button
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                handleDetailBlock(row.header_height)
                              }
                            >
                              {`#${row[column.id]}`}
                            </button>
                          ) : (
                            row[column.id]
                          );
                      return (
                        <TableCell
                          key={column.id}
                          align="center"
                          style={{ border: "1px solid #e0e0e0",
                          textDecoration: column.id === "header_height" ? "underline" : "none",
                          color: column.id === "header_height" ? "#6495ED" : "inherit", }}
                        >
                          {value}
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
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={pageBlock.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TableBlock;
