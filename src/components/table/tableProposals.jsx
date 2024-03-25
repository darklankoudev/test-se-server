import { useState, useEffect } from "react";
import axios from "axios";
import * as React from "react";
import "../../Css/themes/echo.css";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { API_BASE_URL } from "../../constants/constants";

const TableProposal = () => {
  const [proposals, setProposals] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/governance/proposals`);
        const proposalsData = res.data.proposals;
        proposalsData.sort((a, b) => b.id - a.id);
        setProposals(proposalsData);
        setLoading(false)
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.error(e);
        }
      }
    };

    fetchData();
  }, []);

  const formatVotesPercentage = (votes, totalVotes) => {
    const percentage = (votes / totalVotes) * 100;
    return percentage.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    }) + "%";
  };
  
  const formatYayVotes = (row) => {
    const yayVotes = parseInt(row.yay_votes);
    const totalVotes = yayVotes + parseInt(row.nay_votes) + parseInt(row.abstain_votes);
    if (yayVotes === 0) {
      return "0";
    }
    return formatVotesPercentage(yayVotes, totalVotes);
  };
  
  const formatNayVotes = (row) => {
    const nayVotes = parseInt(row.nay_votes);
    const totalVotes = parseInt(row.yay_votes) + nayVotes + parseInt(row.abstain_votes);
    if (nayVotes === 0) {
      return "0";
    }
    return formatVotesPercentage(nayVotes, totalVotes);
  };
  
  const formatAbstainVotes = (row) => {
    const abstainVotes = parseInt(row.abstain_votes);
    const totalVotes = parseInt(row.yay_votes) + parseInt(row.nay_votes) + abstainVotes;
    if (abstainVotes === 0) {
      return "0";
    }
    return formatVotesPercentage(abstainVotes, totalVotes);
  };
  
  
  const columns = [
    { id: "id", label: "#", minWidth: 75, align: "center" },
    { id: "kind", label: "Type Of Proposals", minWidth: 170, align: "center" },
    { id: "author", label: "Author", minWidth: 180 },
    { id: "result", label: "Result", minWidth: 180, align: "center" },
    { id: "start_epoch", label: "Start Epoch", minWidth: 120, align: "center" },
    { id: "end_epoch", label: "End Epoch", minWidth: 120, align: "center" },
    { id: "grace_epoch", label: "Grace Epoch", minWidth: 120, align: "center" },
    {
      id: "yay_votes",
      label: "Yay Votes (Yes)",
      minWidth: 170,
        format: formatYayVotes,
        align: "center"
    },
    {
      id: "nay_votes",
      label: "Nay Votes (No)",
      minWidth: 170,
        format: formatNayVotes,
        align: "center"
    },
    {
      id: "abstain_votes",
      label: "Abstain Votes (Abstain)",
      minWidth: 190,
        format: formatAbstainVotes,
        align: "center"
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, borderRight: "1px solid #e0e0e0", color: "white" }}
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
            proposals
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value =
                        column.id === "author"
                          ? row.author.Account
                          : row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align} style={{ border: "1px solid #e0e0e0" }}>
                          {column.format && typeof column.format === "function"
                            ? column.format(row, column.id)
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
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={proposals.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TableProposal;
