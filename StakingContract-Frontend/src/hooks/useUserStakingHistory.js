import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

const USER_HISTORY_QUERY = gql`
  query GetUserHistory($address: String!) {
    stakeds(
      where: { user: $address }
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      amount
      timestamp
      blockTimestamp
      transactionHash
    }
    withdrawns(
      where: { user: $address }
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      amount
      timestamp
      blockTimestamp
      transactionHash
      rewardsAccrued
    }
    emergencyWithdrawns(
      where: { user: $address }
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      amount
      penalty
      timestamp
      blockTimestamp
      transactionHash
    }
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

export const useUserStakingHistory = (address) => {
  const { data, loading, error, refetch } = useQuery(USER_HISTORY_QUERY, {
    variables: { address: address?.toLowerCase() },
    skip: !address,
    pollInterval: 30000, // Poll every 30 seconds
  });

  // Combine and sort all transactions by timestamp
  const allTransactions = [];

  if (data) {
    // Add staking events
    data.stakeds.forEach((event) => {
      allTransactions.push({
        type: "stake",
        amount: event.amount,
        timestamp: parseInt(event.timestamp),
        blockTimestamp: parseInt(event.blockTimestamp),
        txHash: event.transactionHash,
      });
    });

    // Add withdrawal events
    data.withdrawns.forEach((event) => {
      allTransactions.push({
        type: "withdraw",
        amount: event.amount,
        timestamp: parseInt(event.timestamp),
        blockTimestamp: parseInt(event.blockTimestamp),
        txHash: event.transactionHash,
        rewardsAccrued: event.rewardsAccrued,
      });
    });

    // Add emergency withdrawal events
    data.emergencyWithdrawns.forEach((event) => {
      allTransactions.push({
        type: "emergency",
        amount: event.amount,
        penalty: event.penalty,
        timestamp: parseInt(event.timestamp),
        blockTimestamp: parseInt(event.blockTimestamp),
        txHash: event.transactionHash,
      });
    });

    // Add rewards claimed events
    data.rewardsClaimeds.forEach((event) => {
      allTransactions.push({
        type: "claim",
        amount: event.amount,
        timestamp: parseInt(event.timestamp),
        blockTimestamp: parseInt(event.blockTimestamp),
        txHash: event.transactionHash,
      });
    });
  }

  // Sort transactions by timestamp (newest first)
  allTransactions.sort((a, b) => b.blockTimestamp - a.blockTimestamp);

  return {
    stakeEvents: data?.stakeds || [],
    withdrawEvents: data?.withdrawns || [],
    emergencyWithdrawEvents: data?.emergencyWithdrawns || [],
    rewardClaimEvents: data?.rewardsClaimeds || [],
    allTransactions,
    isLoading: loading,
    error,
    refetch,
  };
};
