import { BookMarked, Info } from "lucide-react";
import axios from "axios";
import { API_VLVN_URL, API_BASE_URL_SUPPORT } from "../../constants/constants";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format as formatDate } from "date-fns";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { ActivitySquare } from "lucide-react";
import ReactJson from "react-json-view";

const BlockDetail = () => {
  const [infoDetailBlock, setInfoDetailBlock] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [txhOfBlock, setTxhOfBlock] = useState([]);
  const [loading, setLoading] = useState(true);
  const { height } = useParams();
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

  const columns = [
    { id: "id", label: "#", minWidth: 50 },
    { id: "hash_id", label: "Transaction Hash", minWidth: 170 },
    { id: "time", label: "Age", minWidth: 170, format: calculateAge },
    { id: "time", label: "Timestamp", minWidth: 170, format: formatTime },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_VLVN_URL}/block/height/${height}`);
        setInfoDetailBlock(res.data);
        setLoading(false);
        const { time } = res.data.header;
        const txhArray = res.data.tx_hashes.map((tx) => ({
          hash_id: tx.hash_id,
          time: time,
        }));
        setTxhOfBlock(txhArray);
        setLoading(false);
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.error(e);
        }
      }

      try {
        const resValSigned = await axios.get(`${API_BASE_URL_SUPPORT}/blocks/block/${height}/signatures`);
        setInfoDetailBlock(prevState => ({
          ...prevState,
          signatures: resValSigned.data
        }));
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.error(e);
        }
      }
    };

    fetchData();
    // const intervalId = setInterval(fetchData, 1000);

    // return () => clearInterval(intervalId);
  }, [height]);

  const handleDetailTXH = (hash) => {
    navigate(`/transaction/hash/detail/${hash}`);
  };

  return (
    <>
      <div className="content transition-[margin,width] duration-100 xl:pl-3.5 pt-[54px] pb-10 relative z-10 group mode content--compact xl:ml-[275px] mode--light [&.content--compact]:xl:ml-[91px]">
        <div className="px-5 mt-16">
          <div className="container">
            <div className="grid grid-cols-12 gap-x-6 gap-y-10 ">
              {/* 111 */}
              <div className="col-span-12 xl:col-span-12 ">
                <div>
                  <div className="flex flex-col gap-y-3 md:h-10 md:flex-row md:items-center">
                    <div className="text-base font-medium group-[.mode--light]:text-white">
                      Block Overview
                    </div>
                  </div>
                  <div className="box box--stacked mt-2 p-5 ">
                    <div className=" rounded-lg border-2 border-slate-300 ">
                      <div className="overflow-auto xl:overflow-visible">
                        <table data-tw-merge="" className="w-full text-left ">
                          <tbody>
                            {loading ? (
                              <tr
                                data-tw-merge=""
                                className="[&_td]:last:border-b-0"
                              >
                                <td
                                  data-tw-merge=""
                                  className="px-5 flex flex-col items-center justify-center text-base border-b dark:border-darkmode-300 border-dashed border-slate-400/70 py-3 dark:bg-darkmode-600"
                                >
                                  <CircularProgress color="success" />
                                  <div className="text-center mt-2">Please wait a few seconds</div>
                                </td>
                              </tr>

                            ) : infoDetailBlock && infoDetailBlock.header ? (
                              <>
                                <tr
                                  data-tw-merge=""
                                  className="[&_td]:last:border-b-0"
                                >
                                  <td
                                    data-tw-merge=""
                                    className="px-5 border-b-2 border-r-2 dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                  >
                                    <div className="flex text-md font-semibold items-center whitespace-nowrap">
                                      Block Height
                                      <Info className="ml-1.5 h-4 w-4 text-slate-400"></Info>
                                    </div>
                                  </td>
                                  <td
                                    data-tw-merge=""
                                    className="px-5 text-md font-medium--dark border-b-2 dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                  >
                                    <div className="text-center flex items-center justify-center">
                                      <BookMarked className="stroke-[1] w-4 h-4 side-menu__link__icon mr-1" />
                                      {infoDetailBlock.header.height}
                                    </div>
                                  </td>
                                </tr>
                                <tr
                                  data-tw-merge=""
                                  className="[&_td]:last:border-b-0"
                                >
                                  <td
                                    data-tw-merge=""
                                    className="px-5 border-b-2 border-r-2 dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                  >
                                    <div className="flex text-md font-semibold items-center whitespace-nowrap">
                                      Total Transaction
                                      <Info className="ml-1.5 h-4 w-4 text-slate-400"></Info>
                                    </div>
                                  </td>
                                  <td
                                    data-tw-merge=""
                                    className="px-5 border-b-2 dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                  >
                                    <div className="text-center">
                                      {infoDetailBlock.tx_hashes.length}
                                    </div>
                                  </td>
                                </tr>
                                <tr
                                  data-tw-merge=""
                                  className="[&_td]:last:border-b-0"
                                >
                                  <td
                                    data-tw-merge=""
                                    className="px-5 border-b-2 border-r-2 dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                  >
                                    <div className="flex text-md font-semibold items-center whitespace-nowrap">
                                      Total Validator Signed
                                      <Info className="ml-1.5 h-4 w-4 text-slate-400"></Info>
                                    </div>
                                  </td>
                                  <td
                                    data-tw-merge=""
                                    className="px-5 border-b-2 dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                  >
                                    <div className="text-center">
                                    {infoDetailBlock.signatures && infoDetailBlock.signatures.length}
                                    </div>
                                  </td>
                                </tr>
                                <tr
                                  data-tw-merge=""
                                  className="[&_td]:last:border-b-0"
                                >
                                  <td
                                    data-tw-merge=""
                                    className="px-5 border-b-2 border-r-2 dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                  >
                                    <div className="flex text-md font-semibold items-center whitespace-nowrap">
                                      Timestamp
                                      <Info className="ml-1.5 h-4 w-4 text-slate-400"></Info>
                                    </div>
                                  </td>
                                  <td
                                    data-tw-merge=""
                                    className="px-5 text-md font-medium--dark border-b-2 dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                  >
                                    <div className="text-center flex items-center justify-center">
                                      <div className="text-center mr-2">
                                        {formatTime(
                                          infoDetailBlock.header.time
                                        )}
                                      </div>
                                      <div className="text-center">
                                        (
                                        {calculateAge(
                                          infoDetailBlock.header.time
                                        )}
                                        )
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr
                                  data-tw-merge=""
                                  className="[&_td]:last:border-b-0"
                                >
                                  <td
                                    data-tw-merge=""
                                    className="px-5 border-b-2 border-r-2 dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                  >
                                    <div className="flex text-md font-semibold items-center whitespace-nowrap">
                                      Proposer
                                      <Info className="ml-1.5 h-4 w-4 text-slate-400"></Info>
                                    </div>
                                  </td>
                                  <td
                                    data-tw-merge=""
                                    className="px-5 border-b-2 dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                  >
                                    <div className="text-center">
                                      {infoDetailBlock.header.proposer_address}
                                    </div>
                                  </td>
                                </tr>
                                <tr
                                  data-tw-merge=""
                                  className="[&_td]:last:border-b-0"
                                >
                                  <td
                                    data-tw-merge=""
                                    className="px-5 border-b-2 border-r-2 dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                  >
                                    <div className="flex text-md font-semibold items-center whitespace-nowrap">
                                      Block ID
                                      <Info className="ml-1.5 h-4 w-4 text-slate-400"></Info>
                                    </div>
                                  </td>
                                  <td
                                    data-tw-merge=""
                                    className="px-5 border-b-2 dark:border-darkmode-300 border-dashed border-slate-300 py-3 dark:bg-darkmode-600"
                                  >
                                    <div className="text-center">
                                      {infoDetailBlock.block_id}
                                    </div>
                                  </td>
                                </tr>
                                <tr
                                  data-tw-merge=""
                                  className="[&_td]:last:border-b-0"
                                >
                                  <td
                                    data-tw-merge=""
                                    className="px-5 border-b-2 border-r-2 dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                  >
                                    <div className="flex text-md font-semibold items-center whitespace-nowrap">
                                      Chain ID
                                      <Info className="ml-1.5 h-4 w-4 text-slate-400"></Info>
                                    </div>
                                  </td>
                                  <td
                                    data-tw-merge=""
                                    className="px-5 text-md font-bold border-b-2 dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                  >
                                    <div className="text-center">
                                      {infoDetailBlock.header.chain_id}
                                    </div>
                                  </td>
                                </tr>
                              </>
                            ) : (
                              <tr
                                data-tw-merge=""
                                className="[&_td]:last:border-b-0"
                              >
                                <td
                                  data-tw-merge=""
                                  className="px-5 flex justify-center text-lg font-medium border-b dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                >
                                  Invalid Block Height 
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 222 */}
              {/* <div className="col-span-12 xl:col-span-12">
                <div>
                  <div className="flex flex-col gap-y-3 md:h-10 md:flex-row md:items-center">
                    <div className="text-base font-medium ">
                      Block Signatures
                    </div>
                  </div>
                  <div className="box box--stacked mt-2 p-5">ok 2 2 2</div>
                </div>
              </div> */}
              {/* 333 */}
              {infoDetailBlock && infoDetailBlock.header ? (
                <>
                  <div className="col-span-12 xl:col-span-12">
                    <div>
                      <div className="flex flex-col gap-y-3 md:h-10 md:flex-row md:items-center">
                        <div className="text-base font-medium text-center flex items-center xl:col-span-6 ">
                          Transactions Of Block{" "}
                          <BookMarked className="stroke-[1] w-4 h-4 side-menu__link__icon ml-1.5 mr-0.5 " />
                          {height}
                        </div>
                      </div>
                      <div className="box box--stacked mt-2 p-5">
                        <Paper sx={{ width: "100%", overflow: "hidden" }}>
                          <TableContainer sx={{ maxHeight: 440 }}>
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
                                {txhOfBlock
                                  .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                  )
                                  .map((row, index) => {
                                    return (
                                      <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row.hash_id}
                                      >
                                        <TableCell
                                          align="left"
                                          style={{
                                            border: "1px solid #e0e0e0",
                                          }}
                                        >
                                          {index + 1}
                                        </TableCell>
                                        {columns.slice(1).map((column) => {
                                          let value;
                                          if (column.format === calculateAge) {
                                            value = calculateAge(row.time);
                                          } else if (
                                            column.format === formatTime
                                          ) {
                                            value = formatTime(row.time);
                                          } else {
                                            value = row[column.id];
                                          }
                                          value =
                                            value === null ||
                                            value === undefined
                                              ? "N/A"
                                              : value;
                                          return (
                                            <TableCell
                                              key={column.id}
                                              align={column.align}
                                              style={{
                                                border: "1px solid #e0e0e0",
                                                cursor:
                                                  column.id === "hash_id"
                                                    ? "pointer"
                                                    : "default",
                                              }}
                                            >
                                              {column.id === "hash_id" ? (
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
                                                    onClick={() =>
                                                      handleDetailTXH(
                                                        row.hash_id
                                                      )
                                                    }
                                                  >
                                                    {value}
                                                  </button>
                                                </div>
                                              ) : column.format &&
                                                typeof value === "function" ? (
                                                column.format(value)
                                              ) : (
                                                value
                                              )}
                                            </TableCell>
                                          );
                                        })}
                                      </TableRow>
                                    );
                                  })}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={txhOfBlock.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                        </Paper>
                      </div>
                    </div>
                  </div>
                
              <div className="col-span-12 xl:col-span-12">
                  <div>
                    <div className="flex flex-col gap-y-3 md:h-10 md:flex-row md:items-center">
                      <div className="text-base font-medium text-center flex items-center xl:col-span-6  ">Raw Data Of Block 
                      <BookMarked className="stroke-[1] w-4 h-4 side-menu__link__icon ml-1.5 mr-0.5 " />
                      {height} 
                      </div>
                    </div>
                    <div className="box mt-2 p-5 bg-slate-300">
                      <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        <TableContainer sx={{ maxHeight: 700 }} className="bg-slate-100">
                          <Table stickyHeader aria-label="sticky table">
                            <TableBody>
                              <TableCell>
                                <ReactJson src={infoDetailBlock} />
                              </TableCell>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    </div>
                  </div>
                </div>
                </>
                 ) : (
                  " "
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlockDetail;
