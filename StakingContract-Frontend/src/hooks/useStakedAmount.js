import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useContractRead } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants/contract";

const USER_STAKED_QUERY = gql`
  query GetUserStaked($address: String!) {
    user(id: $address) {
      stakedAmount
      lastStakeTimestamp
    }
  }
`;

export const useStakedAmount = (address) => {
  // Get staked amount from contract
  const {
    data: userInfo,
    isLoading: isContractLoading,
    refetch: refetchContract,
  } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "userInfo",
    args: [address],
    enabled: !!address,
    watch: true,
  });

  // Get staked amount from subgraph (for history)
  const {
    data: userData,
    loading: isSubgraphLoading,
    refetch: refetchSubgraph,
  } = useQuery(USER_STAKED_QUERY, {
    variables: { address: address?.toLowerCase() },
    skip: !address,
    pollInterval: 15000, // Poll every 15 seconds
  });

  const refreshData = () => {
    refetchContract();
    refetchSubgraph();
  };

  return {
    stakedAmount: userInfo?.[0], // First element is the stakedAmount
    lastStakeTimestamp: userInfo?.[1] || userData?.user?.lastStakeTimestamp,
    isLoading: isContractLoading || isSubgraphLoading,
    refreshData,
  };
};
