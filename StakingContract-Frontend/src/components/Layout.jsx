import React from "react";
import { ConnectButton } from "./ConnectButton";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-400">Staking Protocol</h1>
          <ConnectButton />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
      <footer className="border-t border-slate-800 mt-10">
        <div className="container mx-auto px-4 py-6 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Staking Protocol. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
