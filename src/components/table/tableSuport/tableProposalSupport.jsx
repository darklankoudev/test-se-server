import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as React from "react";
import "../../../Css/themes/echo.css";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Button from "@mui/material/Button";

const TableProposalSupport = () => {
  const [proposals, setProposals] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/proposals`);
        const proposalsData = res.data;
        setProposals(proposalsData);
        setLoading(false);
      } catch (e) {
        if (process.env.NODE_ENV === "development") {
          console.error(e);
        }
      }
    };

    fetchData();
  }, []);

  const columns = [
    { id: "id", label: "#", minWidth: 75, align: "center" },
    { id: "type", label: "Type Of Proposals", minWidth: 180, align: "center" },
    { id: "author", label: "Author Email", minWidth: 220 },
    { id: "authors", label: "Author Address", minWidth: 220 },
    { id: "title", label: "Title", minWidth: 300, align: "center" },
    {
      id: "voting_start_epoch",
      label: "Start Epoch",
      minWidth: 120,
      align: "center",
    },
    {
      id: "voting_end_epoch",
      label: "End Epoch",
      minWidth: 120,
      align: "center",
    },
    { id: "grace_epoch", label: "Grace Epoch", minWidth: 120, align: "center" },
    { id: "button", label: "Action", minWidth: 150, align: "center" },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDetailProposal = (id) => {
    navigate(`/proposal/id/${id}`)
  } 

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 503 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    borderRight: "1px solid #e0e0e0",
                    color: "white",
                    // padding: "18px 15px"
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
              proposals
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const {
                    id,
                    type,
                    author,
                    voting_start_epoch,
                    voting_end_epoch,
                    grace_epoch,
                  } = row;
                  const { authors } = row.content;
                  const { title } = row.content;
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={id}>
                      <TableCell
                        align="center"
                        style={{ border: "1px solid #e0e0e0" }}
                        
                      >
                        {id}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ border: "1px solid #e0e0e0" }}
                      >
                        {type}
                      </TableCell>
                      <TableCell style={{ border: "1px solid #e0e0e0" }}>
                        {authors}
                      </TableCell>
                      <TableCell style={{ border: "1px solid #e0e0e0" }}>
                        {author}
                      </TableCell>
                      <TableCell style={{ border: "1px solid #e0e0e0" }}>
                        {title}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ border: "1px solid #e0e0e0" }}
                      >
                        {voting_start_epoch}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ border: "1px solid #e0e0e0" }}
                      >
                        {voting_end_epoch}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ border: "1px solid #e0e0e0" }}
                      >
                        {grace_epoch}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ border: "1px solid #e0e0e0" }}
                      >
                        <Button
                          variant="contained"
                          endIcon={<NavigateNextIcon />}
                          onClick={() => handleDetailProposal(id)}
                          color="success"
                        //   size="small"
                          style={{height: "25px", textTransform: 'none'}}
                        >
                          Detail
                        </Button>
                      </TableCell>
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

export default TableProposalSupport;
