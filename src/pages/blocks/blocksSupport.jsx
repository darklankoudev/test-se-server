import TableBlockSupport from "../../components/table/tableSuport/tableBlockSupport";
import "../../Css/themes/echo.css";

const BlocksSupport = () => {
  return (
    <>
      <div className="content transition-[margin,width] duration-100 xl:pl-3.5 pt-[54px] pb-10 relative z-10 group mode content--compact xl:ml-[275px] mode--light [&.content--compact]:xl:ml-[91px]">
        <div className="px-5 mt-16">
          <div className="container">
            <div className="grid grid-cols-12 gap-x-6 gap-y-10">
              <div class="col-span-12 xl:col-span-12">
                <div>
                  <div class="flex flex-col gap-y-3 md:h-10 md:flex-row md:items-center">
                    <div class="text-base font-medium group-[.mode--light]:text-white">
                     List Blocks
                    </div>
                  </div>
                  <div class="box box--stacked mt-2 p-5">
                    <TableBlockSupport />
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

export default BlocksSupport;
