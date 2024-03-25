import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_VLVN_URL } from "../../../constants/constants";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { format as formatDate } from "date-fns";
import { useNavigate } from "react-router-dom";
import { ActivitySquare, Ban, CheckCheck, BookMarked } from "lucide-react";
import { LinearProgress } from "@mui/material";

const TableTXHSupport = () => {
  const [pageTXH, setPageTXH] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPageAPI, setCurrentPageAPI] = useState(1);
  const navigate = useNavigate();

  const formatTime = (timeString) => {
    if (timeString) {
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        return formatDate(date, "dd/MM/yyyy HH:mm:ss");
      }
    }
    return <LinearProgress color="inherit" />;
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
    } else if (seconds >= 0) {
      return `a few seconds ago`;
    }

    return <LinearProgress color="inherit" />
  };

  const formatStatus = (returnCode) => {
    return returnCode === 0 || returnCode === null ? (
      <Tag
        icon={<CheckCircleOutlined />}
        style={{ fontSize: "15px" }}
        color="success"
      >
        Success
      </Tag>
    ) : (
      <Tag
        icon={<CloseCircleOutlined />}
        style={{ fontSize: "15px" }}
        color="error"
      >
        Fail
      </Tag>
    );
  };

  const formatShielded = (tx_type, tx) => {
    if (tx_type === "Decrypted") {
      if (
        tx &&
        tx.Transfer &&
        tx.Transfer.shielded &&
        tx.Transfer.shielded.length > 0
      )
        return (
          <CheckCheck size={20} className="stroke-[1] w-6 h-6 flex mx-auto" />
        );
    }
    return (
      <Ban size={15} className="stroke-[1] w-5 h-5 flex mx-auto text-red-400" />
    );
  };

  const formatType = (tx_type, tx) => {
    if (tx_type === "Wrapper" && tx === null) return "Wrapper";
    if (tx_type === "Protocol" && tx === null) return "Protocol";
    if (tx_type === "Decrypted" && tx === null) return "Decrypted";
    if (tx_type === "Decrypted") {
      if (tx && tx.Transfer) return "Transfer";
      if (tx && tx.VoteProposal) return "Vote Proposal";
      if (tx && tx.Ibc) return "IBC";
      if (tx && tx.Unbond) return "Unbond";
      if (tx && tx.UnjailValidator) return "Unjail Validator";
      if (tx && tx.ReactivateValidator) return "Reactive Validator";
      if (tx && tx.ClaimRewards) return "Claim Rewards";
      if (tx && tx.Withdraw) return "Claim Rewards";
      if (tx && tx.Bond) return "Bond";
      if (tx && tx.UpdateAccount) return "Update Account";
      if (tx && tx.EthPoolBridge) return "Eth Pool Bridge";
      if (tx && tx.InitProposal) return "Init Proposal";
      if (tx && tx.InitValidator) return "Init Validator";
      if (tx && tx.InitAccount) return "Init Account";
      if (tx && tx.RevealPK) return "RevealPK";
      if (tx && tx.DeactivateValidator) return "Deactivate Validator";
      if (tx && tx.MetaDataChange) return "Meta Data Change";
      if (tx && tx.CommissionChange) return "Commission Change"; 
      if (tx && tx.ResignSteward) return "Resign Steward"
    }
    return "";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${API_VLVN_URL}/tx?page=${currentPageAPI}&page_size=20`
        );
        setLoading(false);
        setPageTXH(res.data.data);

        const blockIds = res.data.data.map((tx) => tx.block_id);
        const blockDetailsPromises = blockIds.map((blockId) =>
          axios.get(`${API_VLVN_URL}/block/hash/${blockId}`)
        );
        const blockDetailsResponses = await Promise.all(blockDetailsPromises);
        const blockDetails = blockDetailsResponses.map(
          (response) => response.data
        );

        const updatedTXH = res.data.data.map((tx, index) => {
          const blockDetail = blockDetails[index];
          return {
            ...tx,
            height: blockDetail.header.height,
            time: blockDetail.header.time,
          };
        });

        setPageTXH(updatedTXH);
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.error(e);
        }
      }
    };

    fetchData();
  }, []);

  const handleDetailTXH = (hash) => {
    navigate(`/transaction/hash/detail/${hash}`);
  };

  const handleDetailBlock = (height) => {
    navigate(`/block/detail/${height}`);
  };

  const columns = [
    { id: "shielded", label: "Shielded", minWidth: 70 },
    { id: "hash", label: "Transaction Hash", minWidth: 171 },
    { id: "height", label: "Height", minWidth: 171},
    { id: "type", label: "Type", minWidth: 180 },
    { id: "return_code", label: "Status", minWidth: 180, format: formatStatus },
    { id: "age", label: "Age", minWidth: 180, format: calculateAge },
    { id: "time", label: "Timestamp", minWidth: 180, format: formatTime },
  ];

  const loadNextTXH = async () => {
    try {
      const res = await axios.get(
        `${API_VLVN_URL}/tx?page=${currentPageAPI + 1}&page_size=20`
      );
      const newTXHData = res.data.data;

      const blockIds = newTXHData.map((tx) => tx.block_id);
      const blockDetailsPromises = blockIds.map((blockId) =>
        axios.get(`${API_VLVN_URL}/block/hash/${blockId}`)
      );
      const blockDetailsResponses = await Promise.all(blockDetailsPromises);
      const blockDetails = blockDetailsResponses.map(
        (response) => response.data
      );

      const updatedNewTXHData = newTXHData.map((tx, index) => {
        const blockDetail = blockDetails[index];
        return {
          ...tx,
          height: blockDetail.header.height,
          time: blockDetail.header.time,
        };
      });

      setPageTXH((prevPageTXH) => [...prevPageTXH, ...updatedNewTXHData]);
      setLoading(false);
      setCurrentPageAPI((prevPage) => prevPage + 1);
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
    loadNextTXH();
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    loadNextTXH();
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
            pageTXH
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((TXH) => (
                <TableRow key={TXH.hash}>
                  {columns.map((column) => {
                    let value = TXH[column.id];
                    if (column.id === "shielded") {
                      value = formatShielded(TXH.tx_type, TXH.tx);
                    } else if (column.id === "type") {
                      value = formatType(TXH.tx_type, TXH.tx);
                    } else if (column.id === "return_code") {
                      value = formatStatus(TXH.return_code);
                    } else if (column.id === "height") {
                      value = TXH.height;
                    } else if (column.id === "time") {
                      value = formatTime(TXH.time);
                    } else if (column.id === "age") {
                      value = calculateAge(TXH.time);
                    }
                    return (
                      <TableCell
                        key={column.id}
                        align="center"
                        style={{ border: "1px solid #e0e0e0" }}
                      >
                        {column.id === "hash" ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <ActivitySquare className="stroke-[1] w-5 h-5 side-menu__link__icon mr-1" />
                            <button
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#6495ED",
                              }}
                              onClick={() => handleDetailTXH(TXH.hash)}
                            >
                              {value}
                            </button>
                          </div>
                        ) : column.id === "height" ? (
                          TXH.height ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginLeft: "25px"
                              }}
                            >
                              <BookMarked className="stroke-[1] w-5 h-5 side-menu__link__icon mr-1" />
                              <button
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "#6495ED",
                                }}
                                onClick={() => handleDetailBlock(TXH.height)}
                              >
                                {TXH.height}
                              </button>
                            </div>
                          ) : (
                            <LinearProgress color="inherit" />
                          )
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
        count={pageTXH.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TableTXHSupport;
