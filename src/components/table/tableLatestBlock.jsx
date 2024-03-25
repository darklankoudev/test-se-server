import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { API_BASE_URL_SUPPORT } from "../../constants/constants";
import CircularProgress from "@mui/material/CircularProgress";

const TableLatestBlock = () => {
  const [infoBlock, setInfoBlock] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      return `${seconds} seconds ago`;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL_SUPPORT}/blocks/list/10`);
        setInfoBlock(res.data);
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
  }, [infoBlock]);

  const handleDetailBlock = (id) => {
    navigate(`/block/detail/${id}`);
  }

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
              className="[&amp;:hover_td]:bg-slate-100 [&amp;:hover_td]:dark:bg-darkmode-300 [&amp;:hover_td]:dark:bg-opacity-50"
            >
              <th
                data-tw-merge
                className="font-medium px-5 py-4 border-b-2 dark:border-darkmode-300 border-l border-r border-t whitespace-nowrap"
              >
                Block Height
              </th>
              <th
                data-tw-merge
                className="font-medium px-5 py-4 border-b-2 dark:border-darkmode-300 border-l border-r border-t whitespace-nowrap"
              >
                Block Hash
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
                Transaction
              </th>
              <th
                data-tw-merge
                className="font-medium px-5 py-4 border-b-2 dark:border-darkmode-300 border-l border-r border-t whitespace-nowrap"
              >
                Proposer
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
              infoBlock &&
              infoBlock.map((block, index) => (
                <tr
                  key={index}
                  data-tw-merge
                  className="[&amp;:hover_td]:bg-slate-100 [&amp;:hover_td]:dark:bg-darkmode-300 [&amp;:hover_td]:dark:bg-opacity-50"
                >
                  <td
                    data-tw-merge
                    className="px-5 py-4 cursor-pointer border-b text-center dark:border-darkmode-300 border-l border-r border-t"
                    style={{ color: '#6495ED' }}
                    onClick={() => handleDetailBlock(block.header_height)}
                  >
                    #{block.header_height}
                  </td>
                  <td
                    data-tw-merge
                    className="px-5 py-4 border-b dark:border-darkmode-300 border-l border-r border-t"
                  >
                    {block.block_id}
                  </td>
                  <td
                    data-tw-merge
                    className="px-5 py-4 border-b text-center dark:border-darkmode-300 border-l border-r border-t"
                  >
                    {calculateAge(block.header_time)}
                  </td>
                  <td
                    data-tw-merge
                    className="px-5 py-4 border-b text-center dark:border-darkmode-300 border-l border-r border-t"
                  >
                    {block.transactions_count}
                  </td>
                  <td
                    data-tw-merge
                    className="px-5 py-4 border-b dark:border-darkmode-300 border-l border-r border-t"
                  >
                    {block.header_proposer_address}
                  </td>
                  {block.header_time && (
                    <td
                      data-tw-merge
                      className="px-5 py-4 border-b text-center dark:border-darkmode-300 border-l border-r border-t"
                    >
                      {formatTime(block.header_time)}
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

export default TableLatestBlock;
