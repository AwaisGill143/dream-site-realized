import { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface AppShellProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

const AppShell = ({ title, subtitle, actions, children }: AppShellProps) => {
  return (
    <div className="grid grid-cols-[220px_1fr] min-h-screen">
      <Sidebar />
      <div className="bg-background flex flex-col overflow-hidden">
        <div className="bg-card border-b border-border px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-display text-lg font-bold text-foreground">{title}</h1>
            {subtitle && <div className="text-[11px] text-cl-text3">{subtitle}</div>}
          </div>
          <div className="flex items-center gap-2.5">
            {actions}
            <div className="w-8 h-8 rounded-full bg-cl-accent2 text-primary-foreground flex items-center justify-center text-xs font-semibold">
              AN
            </div>
          </div>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

export default AppShell;
