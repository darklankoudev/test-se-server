import LatestValidatorSupport from "./latestValidatorSupport";
import LatestBlockSuport from "./latestBlockSupport";

const IndexBlockValidatorSupport = () => {
  return (
    <>
      <div className="content transition-[margin,width] duration-100 xl:pl-3.5 pb-10 relative z-10 group mode content--compact xl:ml-[275px] mode--light [&.content--compact]:xl:ml-[91px]">
        <div className="px-5 mt-1">
          <div className="container">
            <div className="grid grid-cols-12 gap-x-6 gap-y-10">
              <LatestValidatorSupport />
              <LatestBlockSuport />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndexBlockValidatorSupport;
