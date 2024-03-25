import axios from "axios";
import { Activity, Database } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProposalDetail = () => {
  const [proposalID, setProposalID] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/proposal/${id}`
        );
        setProposalID(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching proposal:", error);
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/proposal/detail/${id}`
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching proposal:", error);
      }
    };

    fetchProposal();

    // const intervalId = setInterval(fetchProposal, 1000);

    // return () => clearInterval(intervalId);
  }, [id]);

  return (
    <div className="content transition-[margin,width] duration-100 xl:pl-3.5 pt-[54px] pb-10 relative z-10 group mode content--compact xl:ml-[275px] mode--light [&.content--compact]:xl:ml-[91px]">
      <div className="px-5 mt-16">
        <div className="container">
          <div className="grid grid-cols-12 gap-x-6 gap-y-10">
            <div className="col-span-12">
              <div>
                <div className="flex flex-col gap-y-3 md:h-10 md:flex-row md:items-center">
                  <div className="text-base font-medium group-[.mode--light]:text-white">
                    Namada Explorer Overview
                  </div>
                </div>
                <div className="tab-content box box--stacked mt-3.5 ">
                  <div
                    data-transition=""
                    data-selector=".active"
                    data-enter="transition-[visibility,opacity] ease-linear duration-150"
                    data-enter-from="!p-0 !h-0 overflow-hidden invisible opacity-0"
                    data-enter-to="visible opacity-100"
                    data-leave="transition-[visibility,opacity] ease-linear duration-150"
                    data-leave-from="visible opacity-100"
                    data-leave-to="!p-0 !h-0 overflow-hidden invisible opacity-0"
                    id="example-1"
                    role="tabpanel"
                    aria-labelledby="example-1-tab"
                    className="tab-pane active flex flex-col gap-2 p-1.5 leading-relaxed xl:flex-row "
                  >
                    <div className="grid w-full grid-cols-4 gap-2 ">
                      <div className="relative col-span-4 pb-10 flex-1 overflow-hidden rounded-[0.6rem] border-2 bg-slate-50/50 p-5 sm:col-span-2 xl:col-span-1">
                        {/* <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/10 bg-primary/10">
                            <Database class="stroke-[1] h-6 w-6 fill-primary/10 text-primary" />
                          </div> */}
                        <div className="mt-2.5 pt-3 flex items-center">
                          <div className="text-base text-slate-500">
                            Chain ID
                          </div>
                        </div>
                        {/* {loading ? (
                            <div className="mt-1 text-2xl font-medium text-white">
                              <LinearProgress color="success" />
                            </div>
                          ) : ( */}
                        <div className="mt-1 text-2xl font-medium">
                          Thông tin
                        </div>
                        {/* )} */}
                      </div>
                      <div className="relative col-span-4 flex-1 overflow-hidden rounded-[0.6rem] border-2 bg-slate-50/50 p-5 sm:col-span-2 xl:col-span-1">
                        {/* <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/10 bg-primary/10">
                            <Activity className="stroke-[1] h-6 w-6 fill-primary/10 text-primary" />
                          </div> */}
                        <div className="mt-2.5 pt-3 flex items-center">
                          <div className="text-base text-slate-500">
                            Block Time
                          </div>
                        </div>
                        <div className="mt-1 text-2xl font-medium">
                          {/* {infoS.time ? (
                              formatTime(infoS.time)
                            ) : (
                              <LinearProgress color="success" />
                            )} */}{" "}
                          Thông tin
                        </div>
                      </div>

                      <div className="relative col-span-4 flex-1 overflow-hidden rounded-[0.6rem] border-2 bg-slate-50/50 p-5 sm:col-span-2 xl:col-span-1">
                        {/* <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/10 bg-primary/10">
                            <Album className="stroke-[1] h-6 w-6 fill-primary/10 text-primary" />
                          </div> */}
                        <div className="mt-2.5 pt-3 flex items-center">
                          <div className="text-base text-slate-500">
                            Block Height
                          </div>
                        </div>
                        {/* {loading ? (
                            <div className="mt-1 text-2xl font-medium text-white">
                              <LinearProgress color="success" />
                            </div>
                          ) : ( */}
                        <div className="mt-1 text-2xl font-medium">
                          Thông tin
                        </div>
                        {/* )} */}
                      </div>
                      <div className="relative col-span-4 flex-1 overflow-hidden rounded-[0.6rem] border-2 bg-slate-50/50 p-5 sm:col-span-2 xl:col-span-1">
                        {/* <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/10 bg-primary/10">
                            <ShieldCheck className="stroke-[1] h-6 w-6 fill-primary/10 text-primary" />
                          </div> */}
                        <div className="mt-2.5 pt-3 flex items-center">
                          <div className="text-base text-slate-500">
                            Validators Active
                          </div>
                        </div>
                        {/* {loading ? (
                            <div className="mt-1 text-2xl font-medium text-white">
                              <LinearProgress color="success" />
                            </div>
                          ) : ( */}
                        <div className="mt-1 text-2xl font-medium">
                          Thông tin
                        </div>
                        {/* )} */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid w-full mt-10 grid-cols-12 gap-x-6 gap-y-10">
          {/* layout 1 */}
          <div class="col-span-12 sm:col-span-6 xl:col-span-6">
            <div>
              <div class="flex flex-col gap-y-3 md:h-10 md:flex-row md:items-center">
                <div class="text-base font-medium">Latest 10 Blocks</div>
              </div>
              <div class="box box--stacked mt-2 p-5">
                Table 1
              </div>
            </div>
          </div>
          {/* layout 2 */}
          <div class="col-span-12 sm:col-span-6 xl:col-span-6">
            <div>
              <div class="flex flex-col gap-y-3 md:h-10 md:flex-row md:items-center">
                <div class="text-base font-medium">Latest 10 Blocks</div>
              </div>
              <div class="box box--stacked mt-2 p-5">
                Table 2
              </div>
            </div>
          </div>
          
        </div>
        </div>
        {/* 2222 */}
        
      </div>
    </div>
  );
};

export default ProposalDetail;
