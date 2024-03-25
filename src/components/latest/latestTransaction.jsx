import TableLatestTXH from "../table/tableLatestTXH";

const LatestTransaction = () => {
  return (
    <>
      <div class="col-span-12 xl:col-span-12">
        <div>
          <div class="flex flex-col gap-y-3 md:h-10 md:flex-row md:items-center">
            <div class="text-base font-medium">
              Latest Transactions
            </div>
          </div>
          <div class="box box--stacked mt-2 p-5">
            <TableLatestTXH />
          </div>
        </div>
      </div>
    </>
  );
};

export default LatestTransaction
