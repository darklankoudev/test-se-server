import { useState, useEffect, useRef } from "react";
import "../../Css/pages/landing-page.css";
import "../../Css/themes/echo.css";
import "../../Css/vendors/simplebar.css";
import "../../Css/vendors/tippy.css";
import {
  AlignJustify,
  Expand,
  LayoutGrid,
  Search,
  ToggleLeft,
} from "lucide-react";
import logoNamada from "../../assets/logoNamada.svg";
import { useNavigate } from "react-router-dom";

const Header = ({ modal, readOnly }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const searchModalRef = useRef(null);
  const navigate = useNavigate();

  const backgroundMode = () => {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const backgroundElement = document.querySelector(".background");
    const topBarElement = document.querySelector(".top-bar");
    const contentElement = document.querySelector(".content.mode");

    if (scrollTop > 0) {
      backgroundElement.classList.add("background--hidden");
      topBarElement.classList.add("top-bar--active");
      contentElement.classList.remove("mode--light");
    } else {
      backgroundElement.classList.remove("background--hidden");
      topBarElement.classList.remove("top-bar--active");
      contentElement.classList.add("mode--light");
    }
  };

  useEffect(() => {
    backgroundMode();

    const handleScroll = () => {
      backgroundMode();
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleOpenMenu = () => {
    setIsMenuOpen(true);
    const sideMenu = document.querySelector(".side-menu");
    sideMenu.classList.add("side-menu--mobile-menu-open");
    sideMenu.classList.add("close-mobile-menu--mobile-menu-open");
  };

  const HandleClick = (e) => {
    e.preventDefault();
    console.log("Button clicked!");
  };

  const handleOpenSearchModal = () => {
    searchModalRef.current.classList.add("show");
    setShowSearchModal(true);
  };

  const handleCloseSearchModal = () => {
    searchModalRef.current.classList.remove("show");
    setShowSearchModal(false);
  };

  const [isShown, setIsShown] = useState(false);
  const [state, setState] = useState(isShown ? "enter" : "leave");
  const elRef = useRef(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setState((state) => (isShown ? "enter" : "leave"));
    });

    if (elRef.current) {
      observer.observe(elRef.current, { attributes: true });
    }

    return () => observer.disconnect();
  }, [isShown]);

  useEffect(() => {
    const el = elRef.current;

    if (!el) return;

    if (isShown && state === "leave") {
      setState("enter");
      el.style.display = "block";

      // Enter
      el.classList.add(el.dataset.enterFrom);
      setTimeout(() => {
        el.classList.add(el.dataset.enter);
        el.classList.add(el.dataset.enterTo);
        el.classList.remove(el.dataset.enterFrom);

        setTimeout(() => {
          el.classList.remove(el.dataset.enter);
        }, parseFloat(window.getComputedStyle(el).transitionDuration) * 1000);
      });
    } else if (!isShown && state === "enter") {
      setState("leave");

      // Leave
      el.classList.add(el.dataset.leaveFrom);
      setTimeout(() => {
        el.classList.add(el.dataset.leave);
        el.classList.add(el.dataset.leaveTo);
        el.classList.remove(el.dataset.leaveFrom);

        setTimeout(() => {
          el.classList.remove(el.dataset.leave);
          el.className = (el.className !== undefined ? el.className : "")
            .split(" ")
            .filter((value) => !value.startsWith("mt-"))
            .join(" ");
          setTimeout(() => {
            el.style.display = "none";
          }, 100);
        }, parseFloat(window.getComputedStyle(el).transitionDuration) * 1000);
      });
    }
  }, [isShown, state]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        handleCloseSearchModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleCloseSearchModal]);

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      const searchString = event.target.value.trim();
  
      const containsSpecialChars = /[^\w\s]/.test(searchString);
  
      if (containsSpecialChars) {
        alert("Invalid input. Please enter a valid search string.");
        return;
      }
      const isHeight = /^\d+$/.test(searchString);
      const isHash = /^[a-zA-Z0-9]+$/.test(searchString);
  
      if (isHeight) {
        navigate(`/block/detail/${searchString}`);
      } else if (isHash) {
        navigate(`/transaction/hash/detail/${searchString}`);
      }
    }
  };

  const handleOnclick = () => {
    navigate("/")
  }

  

  return (
    <>
      <div className="fixed inset-x-0 top-0 mt-3.5 h-[65px] transition-[margin] duration-100 xl:ml-[275px] group-[.side-menu--collapsed]:xl:ml-[90px]">
        <div className="top-bar absolute left-0 xl:left-3.5 right-0 h-full mx-5 group before:content-[''] before:absolute before:top-0 before:inset-x-0 before:-mt-[15px] before:h-[20px] before:backdrop-blur">
          <div className="box group-[.top-bar--active]:box container flex h-full w-full items-center border-transparent bg-transparent shadow-none transition-[padding,background-color,border-color] duration-300 ease-in-out group-[.top-bar--active]:border-transparent group-[.top-bar--active]:bg-transparent group-[.top-bar--active]:bg-gradient-to-r group-[.top-bar--active]:from-theme-1 group-[.top-bar--active]:to-theme-2 group-[.top-bar--active]:px-5">
            <div className="flex items-center gap-1 xl:hidden">
              <a
                className="p-2 text-white rounded-full open-mobile-menu hover:bg-white/5"
                href="#"
                onClick={handleOpenMenu}
              >
                <AlignJustify className="stroke-[1] h-[18px] w-[18px]" />
              </a>
              <a
                className="p-2 text-white rounded-full hover:bg-white/5"
                data-tw-toggle="modal"
                data-tw-target="#quick-search"
                href="#"
                onClick={handleOpenSearchModal}
              >
                <Search className="stroke-[1] h-[18px] w-[18px]" />
              </a>
            </div>

            <nav
              aria-label="breadcrumb"
              className="flex flex-1 hidden xl:block"
            >
              <ol className="flex items-center text-theme-1 dark:text-slate-300 text-white/90">
                <li className="">
                  <a href="#" onClick={HandleClick}>
                    App
                  </a>
                </li>
                <li className="relative ml-5 pl-0.5 before:content-[''] before:w-[14px] before:h-[14px] before:bg-chevron-white before:transform before:rotate-[-90deg] before:bg-[length:100%] before:-ml-[1.125rem] before:absolute before:my-auto before:inset-y-0 dark:before:bg-chevron-white">
                  <a href="#" onClick={HandleClick}>
                    Overview
                  </a>
                </li>
              </ol>
            </nav>

            <div
              className="relative justify-center flex-1 hidden xl:flex"
              data-tw-toggle="modal"
              data-tw-target="#quick-search"
              onClick={handleOpenSearchModal}
            >
              <div className="flex w-[350px] cursor-pointer items-center rounded-[0.5rem] border border-transparent bg-white/[0.12] px-3.5 py-2 text-white/60 transition-colors duration-300 hover:bg-white/[0.15] hover:duration-100">
                <Search className="stroke-[1] h-[18px] w-[18px]" />
                <div className="ml-2.5 mr-auto">Quick search...</div>
              </div>
            </div>

            <div
              id="quick-search"
              aria-hidden="truesad"
              tabIndex="-1"
              sad
              ref={searchModalRef}
              className="modal group bg-gradient-to-b from-theme-1/50 via-theme-2/50 to-black/50 transition-[visibility,opacity] w-screen h-screen fixed left-0 top-0 overflow-y-hidden z-[60] [&:not(.show)]:duration-[0s,0.2s] [&:not(.show)]:delay-[0.2s,0s] [&:not(.show)]:invisible [&:not(.show)]:opacity-0 [&.show]:visible [&.show]:opacity-100 [&.show]:duration-[0s,0.1s]"
            >
              <div className="relative mx-auto my-10 w-[95%] scale-95 transition-transform group-[.show]:scale-100 sm:mt-40 sm:w-[600px] lg:w-[700px]">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex w-12 items-center justify-center">
                    <Search className="stroke-[1] w-5 h-5 -mr-1.5 text-slate-500" />
                  </div>
                  {/* input search */}
                  <input
                    data-tw-merge=""
                    onKeyDown={handleSearch}
                    type="search"
                    placeholder="Search block height, transaction hash"
                    className="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent transition duration-200 ease-in-out w-full border-slate-200 placeholder:text-slate-400/90 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 [&[type='file']]:border file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:border-r-[1px] file:border-slate-100/10 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-500/70 hover:file:bg-200 group-[.form-inline]:flex-1 group-[.input-group]:rounded-none group-[.input-group]:[&:not(:first-child)]:border-l-transparent group-[.input-group]:first:rounded-l group-[.input-group]:last:rounded-r group-[.input-group]:z-10 rounded-lg border-0 py-3.5 pl-12 pr-14 text-base shadow-lg focus:ring-0"
                  />

                  <div className="absolute inset-y-0 right-0 flex w-14 items-center">
                    <div
                      className="mr-auto rounded-[0.4rem] border bg-slate-100 px-1 py-1 text-xs text-slate-500/80"
                      onClick={handleCloseSearchModal}
                    >
                      <button
                        id="quick-search"
                        aria-hidden="true"
                        tabIndex="-1"
                        ref={searchModalRef}
                      >
                        {" "}
                        CLOSE{" "}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center flex-1">
              <div
                data-tw-merge=""
                data-tw-placement="bottom-end"
                className="dropdown relative ml-auto"
                onClick={() => setIsShown(!isShown)}
              >
                <button
                  onClick={handleOnclick}
                  data-tw-toggle="dropdown"
                  aria-expanded="false"
                  className="cursor-pointer image-fit h-[40px] w-[40px] overflow-hidden rounded-full border-[3px] border-white/[0.15]"
                >
                  <img src={logoNamada} alt="Namada Explorer" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
