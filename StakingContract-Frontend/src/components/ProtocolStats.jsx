import React from "react";
import { useProtocolStats } from "../hooks/useProtocolStats";
// import { Progress } from "./ui/progress";
import { formatEther } from "viem";
import { Loader2 } from "lucide-react";

const ProtocolStats = () => {
  const { data, isLoading } = useProtocolStats();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-slate-400">Total Value Locked</p>
          <p className="text-2xl font-semibold text-white">
            {parseFloat(formatEther(BigInt(data?.totalStaked || "0"))).toFixed(
              2
            )}{" "}
            Tokens
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Current APR</p>
          <p className="text-2xl font-semibold text-green-400">
            {data?.currentAPR ? null : 0}%
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-slate-400">Reward Rate</p>
          <p className="text-lg font-medium">
            {parseFloat(
              formatEther(BigInt(data?.currentRewardRate || "0"))
            ).toFixed(6)}{" "}
            per minute
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Total Stakers</p>
          <p className="text-lg font-medium">{data?.totalUsers || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default ProtocolStats;
