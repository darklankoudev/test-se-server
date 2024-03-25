import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { API_BASE_URL_SUPPORT } from "../../constants/constants";
import CircularProgress from "@mui/material/CircularProgress";

const TableLatestTXH = () => {
  const [infoTXH, setInfoTXH] = useState(null || []);
  const [loading, setLoading] = useState(true);

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return format(date, "dd/MM/yyyy HH:mm:ss");
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
          `${API_BASE_URL_SUPPORT}/transactions/list/10`
        );
        setInfoTXH(res.data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };

    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // console.log("block");
  }, [infoTXH]);

  const getStatus = (returnCode) => {
    return returnCode === 0 || returnCode === null ? "Success" : "Fail";
  };
  return (
    <>
      <div className="overflow-x-auto overflow-y-auto rounded-bl-lg rounded-br-lg rounded-tl-lg rounded-tr-lg">
        <table data-tw-merge className="w-full text-left ">
          <thead
            data-tw-merge
            className="text-white overflow-hidden bg-gradient-to-b from-theme-2/90 to-theme-1/[0.85] p-5"
          >
            <tr
              data-tw-merge
              className="[&amp;:hover_td]:bg-slate-100 [&amp;:hover_td]:dark:bg-darkmode-300 rounded [&amp;:hover_td]:dark:bg-opacity-50"
            >
              <th
                data-tw-merge
                className="font-medium px-5 py-4 border-b-2 dark:border-darkmode-300 border-l border-r border-t whitespace-nowrap"
              >
                Transactions Hash
              </th>
              <th
                data-tw-merge
                className="font-medium px-5 py-4 border-b-2 dark:border-darkmode-300 border-l border-r border-t whitespace-nowrap"
              >
                Block Height
              </th>
              <th
                data-tw-merge
                className="font-medium text-center px-5 py-4 border-b-2 dark:border-darkmode-300 border-l border-r border-t whitespace-nowrap"
              >
                Type
              </th>
              <th
                data-tw-merge
                className="font-medium px-20 py-4 border-b-2 dark:border-darkmode-300 border-l border-r border-t whitespace-nowrap"
              >
                Age
              </th>
              <th
                data-tw-merge
                className="font-medium px-5 py-4 border-b-2 dark:border-darkmode-300 border-l border-r border-t whitespace-nowrap"
              >
                Gas
              </th>
              <th
                data-tw-merge
                className="font-medium text-center px-5 py-4 border-b-2 dark:border-darkmode-300 border-l border-r border-t whitespace-nowrap"
              >
                Status
              </th>
              <th
                data-tw-merge
                className="font-medium px-20 py-4 border-b-2 dark:border-darkmode-300 border-l border-r border-t whitespace-nowrap"
              >
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="8"
                  className="px-5 py-4 text-center border-b dark:border-darkmode-300"
                >
                  <CircularProgress color="success" />
                  <div className="text-center mt-2">Please wait a few seconds</div>
                </td>
              </tr>
            ) : (
              infoTXH &&
              infoTXH.map((TXH, index) => (
                <tr
                  key={index}
                  data-tw-merge
                  className="[&amp;:hover_td]:bg-slate-100 [&amp;:hover_td]:dark:bg-darkmode-300 [&amp;:hover_td]:dark:bg-opacity-50"
                >
                  <td
                    data-tw-merge
                    className="px-5 py-4 border-b text-center dark:border-darkmode-300 border-l border-r border-t"
                  >
                    {TXH.hash}
                  </td>
                  <td
                    data-tw-merge
                    className="px-5 py-4 border-b text-center dark:border-darkmode-300 border-l border-r border-t"
                  >
                    #{TXH.header_height}
                  </td>
                  <td
                    data-tw-merge
                    className="px-5 py-4 border-b text-center dark:border-darkmode-300 border-l border-r border-t"
                  >
                    {TXH.tx_type}
                  </td>
                  <td
                    data-tw-merge
                    className="px-5 py-4 border-b text-center dark:border-darkmode-300 border-l border-r border-t"
                  >
                    {calculateAge(TXH.header_time)}
                  </td>
                  <td
                    data-tw-merge
                    className="px-5 py-4 border-b text-center dark:border-darkmode-300 border-l border-r border-t"
                  >
                    {TXH.fee_amount_per_gas_unit * 1}
                  </td>
                  <td
                    data-tw-merge
                    className="px-10 py-4 border-b text-center dark:border-darkmode-300 border-l border-r border-t"
                  >
                    {getStatus(TXH.return_code)}
                  </td>
                  {TXH.header_time && (
                    <td
                      data-tw-merge
                      className="px-10 py-4 border-b text-center dark:border-darkmode-300 border-l border-r border-t"
                    >
                      {formatTime(TXH.header_time)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TableLatestTXH;
