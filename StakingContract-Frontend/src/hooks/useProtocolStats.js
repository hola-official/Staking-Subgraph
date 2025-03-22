import { useQuery, gql } from "@apollo/client";

const PROTOCOL_STATS_QUERY = gql`
  query GetProtocolStats {
    protocol(id: "1") {
      totalStaked
      currentRewardRate
      currentAPR
    }
  }
`;

export const useProtocolStats = () => {
  const { data, loading, error, refetch } = useQuery(PROTOCOL_STATS_QUERY, {
    pollInterval: 30000, // Poll every 30 seconds
  });

  return {
    protocolStats: data?.protocol,
    totalStaked: data?.protocol?.totalStaked,
    currentRewardRate: data?.protocol?.currentRewardRate,
    currentAPR: data?.protocol?.currentAPR,
    loading,
    error,
    refetch,
  };
};
