import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ibm from "../assets/IBM_logo.svg";
import sourcery from "../assets/sourcerylogo.png";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "../ui/input";

const Header = () => {
  return (
    <div className="flex justify-between p-4 mb-4">
      <div className="flex py-2 mx-4">
        <Link to="/">
          <img src={sourcery} alt="IBM Logo" className="h-10 w-auto" />
        </Link>
      </div>
      <div className="flex py-2">
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1 pr-2">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              className="pl-8 border-slate-400"
              placeholder="Search RFPs..."
            />
          </div>
        </div>

        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default Header;
