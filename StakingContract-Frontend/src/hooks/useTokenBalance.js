import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useToken } from "wagmi";
import { formatEther } from "viem";

// GraphQL query to get token data (optional)
const GET_TOKEN_INFO = gql`
  query GetTokenAddress {
    protocol(id: "1") {
      stakingToken
    }
  }
`;

export function useTokenBalance(address) {
  const [tokenAddress, setTokenAddress] = useState(null);

  // Query to get the token address from the subgraph
  const { data: subgraphData } = useQuery(GET_TOKEN_INFO, {
    onCompleted: (data) => {
      if (data?.protocol?.stakingToken) {
        setTokenAddress(data.protocol.stakingToken);
      }
    },
  });

  console.log(subgraphData);

  // Use wagmi's useToken hook to get token data and balance
  const {
    data: tokenData,
    isError,
    isLoading: isTokenLoading,
  } = useToken({
    address: tokenAddress,
    enabled: !!tokenAddress,
  });
  console.log(tokenData)

  // Use wagmi's useBalance hook to get user's token balance
  const {
    data: balanceData,
    isError: isBalanceError,
    isLoading: isBalanceLoading,
  } = useBalance({
    address: address,
    token: tokenAddress,
    enabled: !!address && !!tokenAddress,
    watch: true,
  });

  // Calculate the formatted balance
  const balance = balanceData ? formatEther(balanceData.value) : "0";

  return {
    data: balance,
    tokenSymbol: tokenData?.symbol,
    tokenDecimals: tokenData?.decimals,
    isLoading: isTokenLoading || isBalanceLoading,
    isError: isError || isBalanceError,
  };
}

// Helper hook to use wagmi's balance hook
function useBalance(options) {
  const [data, setData] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchBalance() {
      if (!options.enabled) return;

      try {
        setIsLoading(true);
        const { getBalance } = await import("@wagmi/core");
        const balance = await getBalance({
          address: options.address,
          token: options.token,
        });
        setData(balance);
        setIsError(false);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBalance();

    // Set up polling if watch is enabled
    if (options.watch) {
      const interval = setInterval(fetchBalance, 10000); // Poll every 10 seconds
      return () => clearInterval(interval);
    }
  }, [options.address, options.token, options.enabled, options.watch]);

  return { data, isError, isLoading };
}
