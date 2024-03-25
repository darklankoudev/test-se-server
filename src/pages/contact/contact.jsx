import { Info } from "lucide-react";
import "../../Css/themes/echo.css";

const Contact = () => {
  return (
    <>
      <div className="content transition-[margin,width] duration-100 xl:pl-3.5 pt-[54px] pb-10 relative z-10 group mode content--compact xl:ml-[275px] mode--light [&.content--compact]:xl:ml-[91px]">
        <div className="px-5 mt-16">
          <div className="container">
            <div className="grid grid-cols-12 gap-x-6 gap-y-10 ">
              <div className="col-span-12 xl:col-span-12 ">
                <div>
                  <div className="flex flex-col gap-y-3 md:h-10 md:flex-row md:items-center">
                    <div className="text-base font-medium group-[.mode--light]:text-white">
                      Info Me
                    </div>
                  </div>
                  <div className="box box--stacked mt-2 p-5">
                    <div className=" rounded-lg border border-slate-200/80 ">
                      <div className="overflow-auto xl:overflow-visible">
                        <table data-tw-merge="" className="w-full text-left">
                          <tbody>
                            <>
                              <tr
                                data-tw-merge=""
                                className="[&_td]:last:border-b-0"
                              >
                                <td
                                  data-tw-merge=""
                                  className="px-5 border-b dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                >
                                  <div className="flex text-md font-semibold items-center whitespace-nowrap">
                                    Moniker
                                    <Info className="ml-1.5 h-4 w-4 text-slate-400"></Info>
                                  </div>
                                </td>
                                <td
                                  data-tw-merge=""
                                  className="px-5 text-md font-medium--dark border-b dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                >
                                  <div className="text-center flex items-center justify-center">
                                    thanhphm
                                  </div>
                                </td>
                              </tr>
                              <tr
                                data-tw-merge=""
                                className="[&_td]:last:border-b-0"
                              >
                                <td
                                  data-tw-merge=""
                                  className="px-5 border-b dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                >
                                  <div className="flex text-md font-semibold items-center whitespace-nowrap">
                                    Operator Address
                                    <Info className="ml-1.5 h-4 w-4 text-slate-400"></Info>
                                  </div>
                                </td>
                                <td
                                  data-tw-merge=""
                                  className="px-5 border-b dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                >
                                  <div className="text-center">
                                    tnam1qpr477sufxt3sz800hsgr9xyf3dvc4fjguejd27c
                                  </div>
                                </td>
                              </tr>
                              <tr
                                data-tw-merge=""
                                className="[&_td]:last:border-b-0"
                              >
                                <td
                                  data-tw-merge=""
                                  className="px-5 border-b dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                >
                                  <div className="flex text-md font-semibold items-center whitespace-nowrap">
                                    Event
                                    <Info className="ml-1.5 h-4 w-4 text-slate-400"></Info>
                                  </div>
                                </td>
                                <td
                                  data-tw-merge=""
                                  className="px-5 text-md font-medium--dark border-b dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                >
                                  <div className="text-center flex items-center justify-center">
                                    <div className="text-center mr-2">
                                      Crew (Of Namada Shielded Expedition)
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
                                  className="px-5 border-b dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                >
                                  <div className="flex text-md font-semibold items-center whitespace-nowrap">
                                    Contact Me
                                    <Info className="ml-1.5 h-4 w-4 text-slate-400"></Info>
                                  </div>
                                </td>
                                <td
                                  data-tw-merge=""
                                  className="px-5 border-b dark:border-darkmode-300 border-dashed border-slate-300/70 py-3 dark:bg-darkmode-600"
                                >
                                  <div className="text-center hover:bg-opacity-80 hover:text-gray-800 transition duration-300 ease-in-out">
                                    <a
                                      href="https://twitter.com/Andytruong3979"
                                      target="_blank"
                                      style={{
                                        color: "#6495ED",
                                      }}
                                      rel="noreferrer"
                                    >
                                      https://twitter.com/Andytruong3979
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            </>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
