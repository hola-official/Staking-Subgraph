import { useContractRead } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants/contract";

export const useUserDetails = (address) => {
  // Get the detailed user info from contract
  const {
    data: userDetails,
    isLoading,
    refetch,
  } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getUserDetails",
    args: [address],
    enabled: !!address,
    watch: true,
  });

  // Get time until unlock
  const { data: timeUntilUnlock, refetch: refetchTime } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getTimeUntilUnlock",
    args: [address],
    enabled: !!address,
    watch: true,
  });

  const refreshData = () => {
    refetch();
    refetchTime();
  };

  return {
    userDetails: userDetails || null,
    stakedAmount: userDetails?.stakedAmount,
    lastStakeTimestamp: userDetails?.lastStakeTimestamp,
    pendingRewards: userDetails?.pendingRewards,
    timeUntilUnlock: userDetails?.timeUntilUnlock || timeUntilUnlock,
    canWithdraw: userDetails?.canWithdraw,
    isLoading,
    refreshData,
  };
};
