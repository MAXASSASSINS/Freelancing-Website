// eslint-disable-next-line
import { useEffect, useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiUserCircle } from "react-icons/bi";
import { FaRegEnvelope, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  hideDimBackground,
  showDimBackground,
} from "../../actions/dimBackgroundAction";
import { getAllGig } from "../../actions/gigAction";
import { logoutUser } from "../../actions/userAction";
import "../../component/common.css";
import { numberToCurrency } from "../../utility/util";
import { Avatar } from "../Avatar/Avatar";
import { TagOption, tagOptions } from "../CreateGig/tagsData";
import "./header.css";
import { AppDispatch, RootState } from "../../store";

export const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const searchRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const tagListContainerRef = useRef<HTMLUListElement>(null);
  const [search, setSearch] = useState<string>("");
  const [tagList, setTagList] = useState<TagOption[]>([]);

  const [showAvatarMenu, setShowAvatarMenu] = useState<boolean>(false);

  const { user, isAuthenticated, userError } = useSelector(
    (state: RootState) => state.user
  );

  const show = () => {
    dispatch(showDimBackground());
  };

  const hide = () => {
    dispatch(hideDimBackground());
  };

  const handleLogoClick = () => {
    if (searchRef.current) searchRef.current.value = "";
    dispatch(getAllGig());
    navigate("/");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    hideDimBackground();
    const searchQuery = searchRef.current?.value.trim();
    setTagList([]);
    if (searchQuery === "") {
      navigate("/search");
      searchRef.current?.blur();
      dispatch(hideDimBackground());
      return;
    }
    const keywords = encodeURIComponent(searchQuery || "");
    navigate(`/search?keywords=${keywords}`);
    searchRef.current?.blur();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let search = e.target.value;
    setSearch(search);
    let tagList: TagOption[] = [];
    if (search) {
      tagList = tagOptions.filter((tag) =>
        tag.value.toLowerCase().includes(search.toLowerCase())
      );
    }
    setTagList(tagList);
  };

  const handleTagClick = (e: React.MouseEvent<HTMLLIElement>) => {
    const tag = e.currentTarget.innerText;
    if (searchRef.current) searchRef.current.value = tag;
    setSearch(tag);
    handleSubmit(e);
    setTagList([]);
  };

  useEffect(() => {
    let params = location.search;
    if (params && params.includes("keywords")) {
      const keywords = new URLSearchParams(params).get("keywords");
      if(searchRef.current && keywords) searchRef.current.value = keywords;
      setSearch(keywords || "");
    }
  }, [location]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Element;
      if (
        target !== searchRef.current &&
        target !== tagListContainerRef.current
      ) {
        setTagList([]);
      }
      if (!target.closest("#avatar-menu")) {
        setShowAvatarMenu(false);
      }
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  const handleLogOut = async () => {
    dispatch(logoutUser());
    if (!userError) navigate("/");
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="title-wrapper">
          <h1
            className="heading hover:cursor-pointer"
            onClick={handleLogoClick}
          >
            FreelanceMe
          </h1>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <input
            ref={searchRef}
            className="search-input"
            onFocus={show}
            onBlur={hide}
            placeholder="Find services"
            onChange={handleSearchChange}

            // autoComplete="off"
          ></input>
          <div onClick={handleSubmit} className="search-icon">
            <AiOutlineSearch />
          </div>
          {tagList.length > 0 && (
            <div className="w-full bg-separator absolute top-16 z-[1000000] rounded max-h-[60vh] overflow-y-scroll">
              <ul className="" ref={tagListContainerRef}>
                {tagList.map((tag, index) => {
                  return (
                    <li
                      onClick={handleTagClick}
                      key={index}
                      value={tag.value}
                      className="px-4 py-3 hover:bg-dark_separator hover:cursor-pointer "
                    >
                      {tag.value}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </form>

        <div className="navigation-icons">
          <div className="inbox-icon">
            <Link to="/get/all/messages/for/current/user">
              <FaRegEnvelope />
            </Link>
          </div>
          <div
            className="my-list-icon"
            onClick={() => navigate("/my/favourite/gigs")}
          >
            <FaRegHeart />
          </div>
          <div className="orders-icon" onClick={() => navigate("/orders")}>
            Orders
          </div>
          {!isAuthenticated ? (
            <Link to="/login">
              <div>
                <BiUserCircle className="profile-icon" />
              </div>
            </Link>
          ) : (
            <div className="relative">
              <div
                ref={avatarRef}
                id="avatar-menu"
                onClick={() => setShowAvatarMenu((prev) => !prev)}
                className="relative profile-icon"
              >
                <Avatar
                  avatarUrl={user!.avatar.url}
                  userName={user!.name}
                  onlineStatus={true}
                  width="2rem"
                  alt="user profile"
                  onlineStatusWidth={"0.8rem"}
                />
              </div>
              {showAvatarMenu && (
                <div className="absolute z-50 text-light_heading min-w-max right-0 top-10 px-4 py-3 rounded bg-separator shadow-lg leading-5">
                  <ul className="hover:[&>*]:underline flex flex-col gap-4">
                    <Link to={"/user/" + user?._id}>Profile</Link>

                    <Link to={"/my/favourite/gigs"}>Favourite Gigs</Link>

                    <Link to={"/get/all/messages/for/current/user"}>Inbox</Link>

                    <Link to={"/orders"}>Orders</Link>
                    <li onClick={handleLogOut} className="hover:cursor-pointer">
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
          {isAuthenticated && (
            <div className="header-balance">
              <Link to={"/balance/detail"}>
                <p>₹{numberToCurrency(user!.balance)}</p>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
