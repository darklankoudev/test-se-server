import {
  ActivitySquare,
  Ban,
  BookMarked,
  CheckCheck,
  Info,
} from "lucide-react";
import { API_VLVN_URL } from "../../constants/constants";
import axios from "axios";
import { format as formatDate } from "date-fns";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import ReactJson from "react-json-view";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Tag } from "antd";

const TXHDetail = () => {
  const [infoDetailTXH, setInfoDetailTXH] = useState([]);
  const [loading, setLoading] = useState(true);
  const { hash } = useParams();

  const formatTime = (timeString) => {
    if (timeString) {
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        return formatDate(date, "dd/MM/yyyy HH:mm:ss");
      }
    }
    return "Invalid time";
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

  const formatShielded = (infoDetailTXH) => {
    const tx_type = infoDetailTXH.tx_type;
    const tx = infoDetailTXH.tx;
    if (tx_type === "Decrypted") {
      if (
        tx &&
        tx.Transfer &&
        tx.Transfer.shielded &&
        tx.Transfer.shielded !== null
      )
        return (
          <div className="flex items-center justify-center"><CheckCheck size={15} className="stroke-[1] w-6 h-6" /><div className="text-center ml-1">{"=> Yes"}</div> </div>
        );
    }
    return (
      <div className="flex items-center justify-center"><Ban size={15} className="stroke-[1] w-5 h-5" /> <div className="text-center ml-1">{"=> No"}</div> </div>
    );
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_VLVN_URL}/tx/${hash}`);
        const txData = res.data;

        if (txData && txData.block_id) {
          const blockRes = await axios.get(
            `${API_VLVN_URL}/block/hash/${txData.block_id}`
          );
          const blockData = blockRes.data;

          if (blockData && blockData.header) {
            const { height, time, chain_id } = blockData.header;
            txData.height = height;
            txData.time = time;
            txData.chain_id = chain_id;
          }
        }

        setInfoDetailTXH(txData);
        setLoading(false);
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.error(e);
        }
        
        setLoading(false);
      }
    };

    fetchData();
  }, [hash, infoDetailTXH]);

  const formatType = (infoDetailTXH) => {
    const tx_type = infoDetailTXH.tx_type;
    const tx = infoDetailTXH.tx;

    if (tx_type === "Wrapper" && !tx) return "Wrapper";
    if (tx_type === "Protocol" && !tx) return "Protocol";
    if (tx_type === "Decrypted" && !tx) return "Decrypted";
    if (tx_type === "Decrypted" && tx) {
      if (tx.Transfer) return "Transfer";
      if (tx.VoteProposal) return "Vote Proposal";
      if (tx.Ibc) return "IBC";
      if (tx.Unbond) return "Unbond";
      if (tx.UnjailValidator) return "Unjail Validator";
      if (tx.ReactivateValidator) return "Reactive Validator";
      if (tx.ClaimRewards) return "Claim Rewards";
      if (tx.Withdraw) return "Claim Rewards";
      if (tx.Bond) return "Bond";
      if (tx.UpdateAccount) return "Update Account";
      if (tx.EthPoolBridge) return "Eth Pool Bridge";
      if (tx.InitProposal) return "Init Proposal";
      if (tx.InitValidator) return "Init Validator";
      if (tx.InitAccount) return "Init Account";
      if (tx.RevealPK) return "Reveal PK";
      if (tx.DeactivateValidator) return "Deactivate Validator";
      if (tx.MetaDataChange) return "Meta Data Change";
      if (tx.CommissionChange) return "Commission Change"; 
      if (tx.ResignSteward) return "Resign Steward";
    }
    return "";
  };

  return (
    <div className="content transition-[margin,width] duration-100 xl:pl-3.5 pt-[54px] pb-10 relative z-10 group mode content--compact xl:ml-[275px] mode--light [&.content--compact]:xl:ml-[91px]">
      <div className="px-5 mt-16">
        <div className="container">
          <div className="grid grid-cols-12 gap-x-6 gap-y-10 ">
            {/* 111 */}
            <div className="col-span-12 xl:col-span-12 ">
              <div>
                <div className="flex flex-col gap-y-3 md:h-10 md:flex-row md:items-center">
                  <div className="text-base font-medium group-[.mode--light]:text-white">
                    Transaction Overview
                  </div>
                </div>
                <div className="box box--stacked mt-2 p-5">
                  <div className=" rounded-lg border-2 border-slate-300 ">
                    <div className="overflow-auto xl:overflow-visible">
                      <table data-tw-merge="" className="w-full text-left">
                        <tbody>
                          {loading ? (
                            <tr
                              data-tw-merge=""
                              className="[&_td]:last:border-b-0"
                            >
                              <td
                                data-tw-merge=""
                                className="px-5 flex flex-col items-center justify-center text-base border-b-2 dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                              >
                                <CircularProgress color="success" />
                                <div className="text-center mt-2">Please wait a few seconds</div>
                              </td>
                            </tr>
                          ) : infoDetailTXH && infoDetailTXH?.hash ? (
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
                                    Transaction Hash
                                    <Info className="ml-1.5 h-4 w-4 text-slate-400"></Info>
                                  </div>
                                </td>
                                <td
                                  data-tw-merge=""
                                  className="px-5 text-md font-medium--dark border-b-2 dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                >
                                  <div className="text-center flex items-center justify-center">
                                    <ActivitySquare className="stroke-[1] w-5 h-5 side-menu__link__icon mr-1" />
                                    {infoDetailTXH.hash}
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
                                    Type Of
                                    <Info className="ml-1.5 h-4 w-4 text-slate-400"></Info>
                                  </div>
                                </td>
                                <td
                                  data-tw-merge=""
                                  className="px-5 text-md border-b-2 dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                >
                                  <div className="text-center">
                                    {formatType(infoDetailTXH)}
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
                                    Status
                                    <Info className="ml-1.5 h-4 w-4 text-slate-400"></Info>
                                  </div>
                                </td>
                                <td
                                  data-tw-merge=""
                                  className="px-5 border-b-2 dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                >
                                  <div className="text-center">
                                    {formatStatus(infoDetailTXH.return_code)}
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
                                    Block Height
                                    <Info className="ml-1.5 h-4 w-4 text-slate-400"></Info>
                                  </div>
                                </td>

                                <td
                                  data-tw-merge=""
                                  className="px-5 border-b-2 dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                >
                                  <div className="text-center flex items-center justify-center">
                                    <BookMarked className="stroke-[1] w-5 h-4.5 side-menu__link__icon mr-1" />
                                    {infoDetailTXH.height}
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
                                    Gas
                                    <Info className="ml-1.5 h-4 w-4 text-slate-400"></Info>
                                  </div>
                                </td>
                                
                                <td
                                  data-tw-merge=""
                                  className="px-5 border-b-2 dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                >
                                  <div className="text-center flex items-center justify-center">
                                    {infoDetailTXH.fee_amount_per_gas_unit * 1}
                                    {" NAAN"}
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
                                    Shielded
                                    <Info className="ml-1.5 h-4 w-4 text-slate-400"></Info>
                                  </div>
                                </td>
                                <td
                                  data-tw-merge=""
                                  className="px-5 border-b-2 dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                >
                                  {/* <div className="text-center"> */}
                                    {formatShielded(infoDetailTXH)}
                                  {/* </div> */}
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
                                      {formatTime(infoDetailTXH.time)}
                                    </div>
                                    <div className="text-center">
                                      ({calculateAge(infoDetailTXH.time)})
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
                                    Chain ID
                                    <Info className="ml-1.5 h-4 w-4 text-slate-400"></Info>
                                  </div>
                                </td>
                                <td
                                  data-tw-merge=""
                                  className="px-5 text-md font-bold border-b-2 dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                >
                                  <div className="text-center">
                                    {infoDetailTXH.chain_id}
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
                                className="px-5 flex justify-center text-lg font-medium border-b-2 dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                              >
                                Invalid Transaction Hash
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
            {infoDetailTXH && infoDetailTXH?.hash ? (
              <>
                <div className="col-span-12 xl:col-span-12">
                  <div>
                    <div className="flex flex-col gap-y-3 md:h-10 md:flex-row md:items-center">
                      <div className="text-base font-medium ">Raw Data</div>
                    </div>
                    <div className="box mt-2 p-5 bg-slate-300">
                      <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        <TableContainer sx={{ maxHeight: 700 }} className="bg-slate-100">
                          <Table stickyHeader aria-label="sticky table">
                            <TableBody>
                              <TableCell>
                                <ReactJson src={infoDetailTXH} />
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
  );
};

export default TXHDetail;
