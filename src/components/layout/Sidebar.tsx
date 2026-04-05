import { useLocation, Link } from "react-router-dom";
import { LayoutGrid, PlusCircle, BookOpen, ClipboardCheck, User, Settings, BarChart3 } from "lucide-react";

const navItems = [
  { icon: LayoutGrid, label: "Dashboard", path: "/dashboard" },
  { icon: PlusCircle, label: "Job Parser", path: "/parser" },
  { icon: BookOpen, label: "Learning Path", path: "/learning" },
  { icon: ClipboardCheck, label: "Assessments", path: "/assessments", notify: true },
  { icon: User, label: "Interview Sim", path: "/interview" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="bg-cl-sidebar flex flex-col w-[220px] min-h-full py-5">
      <Link to="/dashboard" className="px-5 pb-5 flex items-center gap-2 no-underline">
        <div className="w-7 h-7 bg-cl-accent2 rounded-lg flex items-center justify-center text-sm font-bold text-primary-foreground">
          C
        </div>
        <span className="font-display text-[15px] font-bold text-primary-foreground">CareerLaunch</span>
      </Link>
      <div className="px-3 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-[12.5px] transition-all mb-0.5 no-underline ${
                isActive
                  ? "bg-cl-accent text-primary-foreground"
                  : "text-cl-sidebar-text hover:bg-[rgba(255,255,255,0.1)] hover:text-primary-foreground"
              }`}
            >
              <item.icon className="w-4 h-4 opacity-80 flex-shrink-0" />
              {item.label}
              {item.notify && (
                <span className="w-[7px] h-[7px] rounded-full bg-[#E85D24] ml-auto" />
              )}
            </Link>
          );
        })}
      </div>
      <div className="px-3 mt-auto">
        <div className="text-[9.5px] text-cl-sidebar-text font-semibold tracking-wider uppercase px-2 mb-1">Account</div>
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-cl-sidebar-text text-[12.5px] cursor-pointer hover:bg-[rgba(255,255,255,0.1)] hover:text-primary-foreground transition-all">
          <User className="w-4 h-4 opacity-80" />
          Ayesha Noor
        </div>
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-cl-sidebar-text text-[12.5px] cursor-pointer hover:bg-[rgba(255,255,255,0.1)] hover:text-primary-foreground transition-all">
          <Settings className="w-4 h-4 opacity-80" />
          Settings
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
