import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { API_VLVN_URL } from "../../../constants/constants";
import CircularProgress from "@mui/material/CircularProgress";
import { BookMarked } from "lucide-react";

const TableLatestBlockSupport = () => {
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
        const res = await axios.get(`${API_VLVN_URL}/block?page=1&page_size=10`);
        setInfoBlock(res.data.data);
        setLoading(false);
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.error(e);
        }
      }
    };

    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId);
  }, []);

  //   useEffect(() => {
  //     // console.log("block");
  //   }, [infoBlock]);

  const handleDetailBlock = (height) => {
    navigate(`/block/detail/${height}`);
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
                className="font-medium px-5 py-4 border-b-2 dark:border-darkmode-300 border-l border-r border-t whitespace-nowrap"
              >
                Total Transactions
              </th>
              <th
                data-tw-merge
                className="font-medium  px-5 py-4 border-b-2 dark:border-darkmode-300 border-l border-r border-t whitespace-nowrap"
              >
                Proposer
              </th>
              <th
                data-tw-merge
                className="font-medium px-20 py-4 border-b-2 dark:border-darkmode-300 border-l border-r border-t whitespace-nowrap"
              >
                Age
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
                  colSpan="6"
                  className="px-5 py-4 text-center border-b dark:border-darkmode-300"
                >
                  <CircularProgress color="success" />
                  <div className="text-center mt-2">
                    Please wait a few seconds
                  </div>
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
                    style={{ color: "#6495ED" }}
                    onClick={() => handleDetailBlock(block.header.height)}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <BookMarked
                        size={15}
                        className="stroke-[1] w-5 h-5 side-menu__link__icon mr-1"
                      />
                      {block.header.height}
                    </div>
                  </td>
                  <td
                    data-tw-merge
                    className="px-5 py-4 border-b dark:border-darkmode-300 border-l border-r border-t"
                  >
                    {block.block_id}
                  </td>
                  <td
                    data-tw-merge
                    className="px-5 py-4 border-b dark:border-darkmode-300 border-l border-r border-t text-center"
                  >
                    {block.tx_hashes.length}
                  </td>
                  <td
                    data-tw-merge
                    className="px-5 py-4 border-b dark:border-darkmode-300 border-l border-r border-t"
                  >
                    {block.header.proposer_address}
                  </td>
                  <td
                    data-tw-merge
                    className="px-30 py-4 border-b dark:border-darkmode-300 border-l border-r border-t text-center"
                  >
                    {calculateAge(block.header.time)}
                  </td>
                  <td
                    data-tw-merge
                    className="px-30 py-4 border-b dark:border-darkmode-300 border-l border-r border-t text-center"
                  >
                    {formatTime(block.header.time)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TableLatestBlockSupport;
