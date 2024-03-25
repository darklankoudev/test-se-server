import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_VLVN_URL } from "../../../constants/constants";
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
import { BookMarked } from "lucide-react";

const TableBlockSupport = () => {
  const [pageBlock, setPageBlock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPageAPI, setCurrentPageAPI] = useState(1);
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
      return `a few seconds ago`;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${API_VLVN_URL}/block?page=${currentPageAPI}&page_size=30`
        );
        setLoading(false);
        setPageBlock(res.data.data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, []);

  const handleDetailBlock = (height) => {
    navigate(`/block/detail/${height}`);
  };

  const columns = [
    { id: "height", label: "Block Height", minWidth: 170 },
    { id: "block_id", label: "Block ID", minWidth: 170 },
    { id: "tx_hashes", label: "Total Transactions", minWidth: 170 },
    { id: "proposer_address", label: "Proposer", minWidth: 180 },
    { id: "time", label: "Age", minWidth: 170, format: calculateAge },
    { id: "time", label: "Timestamp", minWidth: 180, format: formatTime },
  ];

  const loadNextBlocks = async () => {
    try {
      if (pageBlock.length > 0) {
        const res = await axios.get(
          `${API_VLVN_URL}/block?page=${currentPageAPI + 1}&page_size=30`
        );
        setPageBlock([...pageBlock, ...res.data.data]);
        setLoading(false);
        setCurrentPageAPI((prevPage) => prevPage + 1);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleChangePage = (event, newPage) => {
    if (newPage === 0 && page > 0) {
      setCurrentPageAPI(1);
    } else {
      setCurrentPageAPI(newPage + 1);
    }
    setPage(newPage);
    loadNextBlocks();
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    loadNextBlocks();
  };

  useEffect(() => {
    // console.log("block");
  }, [pageBlock]);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
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
              .map((block) => (
                <TableRow key={block.block_id}>
                  {columns.map((column) => {
                    let value =
                      column.format && column.format === calculateAge
                        ? calculateAge(block.header[column.id])
                        : column.format && column.format === formatTime
                        ? formatTime(block.header[column.id])
                        : block.header[column.id];
                    if (column.id === "block_id") {
                      value = block.block_id;
                    } else if (column.id === "tx_hashes") {
                      value = block.tx_hashes.length;
                    } else if (column.format) {
                      value = column.format(block.header[column.id]);
                    } else {
                      value = block.header[column.id];
                    }
                    return (
                      <TableCell
                        key={column.id}
                        align="center"
                        style={{ border: "1px solid #e0e0e0" }}
                      >
                        {column.id === "height" ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginLeft: "20px",
                            }}
                          >
                            <BookMarked
                              size={15}
                              className="stroke-[1] w-5 h-5 side-menu__link__icon mr-1"
                            />
                            <button
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#6495ED",
                              }}
                              onClick={() =>
                                handleDetailBlock(block.header.height)
                              }
                            >
                              {value}
                            </button>
                          </div>
                        ) : (
                          value
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
          )}
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

export default TableBlockSupport;
