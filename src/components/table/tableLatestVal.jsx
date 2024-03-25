import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL_SUPPORT } from "../../constants/constants";
import CircularProgress from "@mui/material/CircularProgress";

const TableLatestVal = () => {
  const [top10Val, setTop10Val] = useState([]);
  const [loading, setLoading] = useState(true);

  const votingPowerFormatted = (number) => {
    return (number / 1000000).toLocaleString({ maximumFractionDigits: 2 });
  };

  const votingPercentageFormatted = (number) => {
    return number.toFixed(2) + "%";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL_SUPPORT}/validators/list`);
        const validatorsList = res.data.currentValidatorsList;

        validatorsList.sort((a, b) => b.voting_power - a.voting_power);

        const top10Validators = validatorsList.slice(0, 10);

        setTop10Val(top10Validators);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };

    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // console.log("ok, validator");
  }, [top10Val]);

  return (
    <>
      <div className="overflow-x-auto overflow-y-auto rounded-bl-lg rounded-br-lg rounded-tl-lg rounded-tr-lg">
        <table data-tw-merge className="w-full text-left">
          <thead
            data-tw-merge
            className="text-white overflow-hidden bg-gradient-to-b from-theme-2/90 to-theme-1/[0.85] p-5 "
          >
            <tr
              data-tw-merge
              className="[&amp;:hover_td]:bg-slate-100 [&amp;:hover_td]:dark:bg-darkmode-300 [&amp;:hover_td]:dark:bg-opacity-50"
            >
              <th
                data-tw-merge
                className="font-medium px-5 py-4 border-b-2 dark:border-darkmode-300 border-l border-r  whitespace-nowrap"
              >
                Top
              </th>
              <th
                data-tw-merge
                className="font-medium px-5 py-4 border-b-2 dark:border-darkmode-300 border-l border-r border-t whitespace-nowrap"
              >
                Moniker
              </th>
              <th
                data-tw-merge
                className="font-medium px-5 py-4 border-b-2 dark:border-darkmode-300 border-l border-r border-t whitespace-nowrap"
              >
                Address
              </th>
              <th
                data-tw-merge
                className="font-medium px-5 py-4 border-b-2 dark:border-darkmode-300 border-l border-r border-t whitespace-nowrap"
              >
                Operator
              </th>
              <th
                data-tw-merge
                className="font-medium px-5 py-4 border-b-2 dark:border-darkmode-300 border-l border-r border-t whitespace-nowrap"
              >
                Type
              </th>
              <th
                data-tw-merge
                className="font-medium text-center px-5 py-4 border-b-2 dark:border-darkmode-300 border-l border-r border-t whitespace-nowrap"
              >
                Voting Power
              </th>
              <th
                data-tw-merge
                className="font-medium px-5 py-4 border-b-2 dark:border-darkmode-300 border-l border-r border-t whitespace-nowrap"
              >
                Percentage
              </th>
              {/* <th
                data-tw-merge
                className="rounded-tr-lg font-medium px-5 py-4 border-b-2 dark:border-darkmode-300 border-l border-r border-t whitespace-nowrap"
              >
                Uptime
              </th> */}
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
              top10Val.map((validator, index) => (
                <tr
                  key={index}
                  data-tw-merge
                  className="[&amp;:hover_td]:bg-slate-100 [&amp;:hover_td]:dark:bg-darkmode-300 [&amp;:hover_td]:dark:bg-opacity-50"
                >
                  <td
                    data-tw-merge
                    className="px-5 py-4 text-center border-b dark:border-darkmode-300 border-l border-r border-t"
                  >
                    {index + 1}
                  </td>
                  <td
                    data-tw-merge
                    className="px-5 py-4 border-b dark:border-darkmode-300 border-l border-r border-t"
                  >
                    {validator.moniker}
                  </td>
                  <td
                    data-tw-merge
                    className="px-5 py-4 border-b dark:border-darkmode-300 border-l border-r border-t"
                  >
                    {validator.address}
                  </td>
                  <td
                    data-tw-merge
                    className="px-5 py-4 border-b dark:border-darkmode-300 border-l border-r border-t"
                  >
                    {validator.operator_address}
                  </td>
                  <td
                    data-tw-merge
                    className="px-5 py-4 text-center border-b dark:border-darkmode-300 border-l border-r border-t"
                  >
                    {validator.pub_key.type}
                  </td>
                  <td
                    data-tw-merge
                    className="px-5 py-4 text-center border-b dark:border-darkmode-300 border-l border-r border-t"
                  >
                    {votingPowerFormatted(validator.voting_power)}
                  </td>
                  <td
                    data-tw-merge
                    className="px-5 py-4 text-center border-b dark:border-darkmode-300 border-l border-r border-t"
                  >
                    {votingPercentageFormatted(validator.voting_percentage)}
                  </td>
                  {/* <td
                    data-tw-merge
                    className="px-5 py-4 text-center border-b dark:border-darkmode-300 border-l border-r border-t"
                  >
                    100%
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TableLatestVal;
