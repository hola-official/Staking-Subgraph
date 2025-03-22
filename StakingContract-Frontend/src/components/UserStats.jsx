import React from "react";
import { useAccount } from "wagmi";
import { useUserDetails } from "../hooks/useUserDetails";
import { Alert, AlertDescription } from "./ui/alert";
import { formatEther } from "viem";
// import { formatDuration } from "../utils/formatters";
import { Loader2, Clock } from "lucide-react";

const UserStats = () => {
  const { address } = useAccount();
  const { data, isLoading } = useUserDetails(address);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-20">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!data?.stakedAmount || parseFloat(data.stakedAmount) === 0) {
    return (
      <Alert className="bg-slate-800 border-slate-700">
        <AlertDescription>
          You haven't staked any tokens yet. Start staking to see your
          statistics.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-slate-400">Your Staked Amount</p>
        <p className="text-xl font-medium">
          {parseFloat(formatEther(BigInt(data.stakedAmount))).toFixed(4)} Tokens
        </p>
      </div>
      <div>
        <p className="text-sm text-slate-400">Pending Rewards</p>
        <p className="text-xl font-medium text-green-400">
          {parseFloat(formatEther(BigInt(data.pendingRewards))).toFixed(6)}{" "}
          Tokens
        </p>
      </div>
      {parseInt(data.timeUntilUnlock) > 0 && (
        <div className="flex items-start gap-2">
          <Clock className="h-4 w-4 text-yellow-400 mt-1" />
          <div>
            <p className="text-sm font-medium text-yellow-400">Lock Period</p>
            {/* <p className="text-sm text-slate-300">
              {formatDuration(parseInt(data.timeUntilUnlock))} until you can
              withdraw
            </p> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStats;
