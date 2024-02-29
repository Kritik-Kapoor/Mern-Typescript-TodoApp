import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import "./sidebar.css";
import dummy from "../../assets/dummy.jpg";

//active color : #0064ff

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="flex items-center justify-between lg:justify-start">
        <span className="relative inline-block">
          <img
            src={dummy}
            alt="profile-image"
            width={90}
            className="rounded-full border border-slate-600 p-1.5"
          />
          <i className="fa-solid fa-circle text-[9px] text-green-400 absolute top-2 right-2"></i>
        </span>
        <p className="text-center lg:ml-3 lg:text-left">Kritik Kapoor</p>
      </div>
      <div className="flex flex-col py-3 mt-5 gap-3">
        <Link
          to="#"
          className="flex items-center text-white text-lg gap-x-5 p-2 px-5 hover:bg-[#004670] rounded-2xl"
        >
          <i className="fa-solid fa-house"></i>
          <span>Dashboard</span>
        </Link>
        <Link
          to="/lists"
          className="flex items-center text-white text-lg gap-x-5 p-2 px-5 hover:bg-[#004670] rounded-2xl"
        >
          <i className="fa-solid fa-list-check"></i>
          <span>List</span>
        </Link>
        <Link
          to="#"
          className="flex items-center text-white text-lg gap-x-5 p-2 px-5 hover:bg-[#004670] rounded-2xl"
        >
          <i className="fa-solid fa-calendar-days"></i>
          <span>Calendar</span>
        </Link>
      </div>
      <Button
        asChild
        variant={"destructive"}
        className="w-11/12 absolute bottom-2 left-2/4 -translate-x-2/4"
      >
        <Link to="/">LogOut</Link>
      </Button>
    </div>
  );
};

export default Sidebar;
