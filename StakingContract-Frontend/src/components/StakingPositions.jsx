import React from "react";
import { useAccount } from "wagmi";
import { useUserStakingHistory } from "../hooks/useUserStakingHistory";
import { formatEther } from "viem";
import { Badge } from "./ui/badge";
import { Loader2 } from "lucide-react";

const StakingPositions = () => {
  const { address } = useAccount();
  const { data, isLoading } = useUserStakingHistory(address);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-20">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-slate-400 text-center">No staking history found.</p>
    );
  }

  // Group by transaction to show net positions
  const stakingEvents = data.filter((event) => event.__typename === "Staked");
  const withdrawEvents = data.filter(
    (event) =>
      event.__typename === "Withdrawn" ||
      event.__typename === "EmergencyWithdrawn"
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-300">Recent Activity</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {data.slice(0, 5).map((event, index) => (
            <div
              key={index}
              className="bg-slate-800 p-3 rounded-md border border-slate-700 text-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <Badge
                    variant={
                      event.__typename === "Staked"
                        ? "success"
                        : event.__typename === "EmergencyWithdrawn"
                        ? "destructive"
                        : "secondary"
                    }
                    className="mb-2"
                  >
                    {event.__typename}
                  </Badge>
                  <p className="text-slate-300">
                    {parseFloat(formatEther(BigInt(event.amount))).toFixed(4)}{" "}
                    Tokens
                  </p>
                </div>
                <p className="text-xs text-slate-500">
                  {new Date(
                    parseInt(event.timestamp) * 1000
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-slate-300 mb-2">Stats</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-slate-800 p-3 rounded-md">
            <p className="text-slate-400">Total Staked</p>
            <p className="font-medium">
              {stakingEvents
                .reduce(
                  (sum, event) =>
                    sum + parseFloat(formatEther(BigInt(event.amount))),
                  0
                )
                .toFixed(4)}
            </p>
          </div>
          <div className="bg-slate-800 p-3 rounded-md">
            <p className="text-slate-400">Total Withdrawn</p>
            <p className="font-medium">
              {withdrawEvents
                .reduce(
                  (sum, event) =>
                    sum + parseFloat(formatEther(BigInt(event.amount))),
                  0
                )
                .toFixed(4)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingPositions;
