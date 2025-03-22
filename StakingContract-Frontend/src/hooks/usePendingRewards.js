import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useContractRead } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants/contract";

const REWARDS_CLAIMED_QUERY = gql`
  query GetRewardsClaimed($address: String!) {
    rewardsClaimeds(
      where: { user: $address }
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      amount
      timestamp
      blockTimestamp
      transactionHash
    }
  }
`;

export const usePendingRewards = (address) => {
  // Get pending rewards from contract
  const {
    data: pendingRewards,
    isLoading: isPendingLoading,
    refetch: refetchPending,
  } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getPendingRewards",
    args: [address],
    enabled: !!address,
    watch: true,
  });

  // Get reward claim history from subgraph
  const {
    data: rewardsHistory,
    loading: isHistoryLoading,
    refetch: refetchHistory,
  } = useQuery(REWARDS_CLAIMED_QUERY, {
    variables: { address: address?.toLowerCase() },
    skip: !address,
    pollInterval: 15000, // Poll every 15 seconds
  });

  // Calculate total claimed rewards
  const totalClaimed =
    rewardsHistory?.rewardsClaimeds.reduce(
      (sum, event) => sum + BigInt(event.amount),
      BigInt(0)
    ) || BigInt(0);

  const refreshData = () => {
    refetchPending();
    refetchHistory();
  };

  return {
    pendingRewards,
    rewardsHistory: rewardsHistory?.rewardsClaimeds || [],
    totalClaimed,
    isLoading: isPendingLoading || isHistoryLoading,
    refreshData,
  };
};
