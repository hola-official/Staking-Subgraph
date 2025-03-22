import { useAccount, useContractWrite, usePublicClient } from "wagmi";
import { waitForTransaction } from "@wagmi/core";
import { useCallback, useState, useEffect } from "react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants/contract";

export const useStakingContract = () => {
  const { address } = useAccount();
  const [loadingAction, setLoadingAction] = useState(null);
  const publicClient = usePublicClient();

  const {
    writeAsync: writeStake,
    data: stakeData,
    isLoading: isStakeLoading,
  } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "stake",
  });

  const {
    writeAsync: writeWithdraw,
    data: withdrawData,
    isLoading: isWithdrawLoading,
  } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "withdraw",
  });

  // Handle transaction confirmations using waitForTransaction
  useEffect(() => {
    const handleTransaction = async (hash, actionType) => {
      if (!hash) return;

      try {
        await waitForTransaction({
          hash,
        });
        setLoadingAction(null);
      } catch (error) {
        console.error(`${actionType} transaction failed:`, error);
        setLoadingAction(null);
      }
    };

    if (stakeData?.hash) {
      handleTransaction(stakeData.hash, "Stake");
    }

    if (withdrawData?.hash) {
      handleTransaction(withdrawData.hash, "Withdraw");
    }
  }, [stakeData, withdrawData]);

  const stake = useCallback(
    async (amount) => {
      try {
        setLoadingAction("stake");
        await writeStake({ args: [amount] });
      } catch (error) {
        setLoadingAction(null);
        throw error;
      }
    },
    [writeStake]
  );

  const withdraw = useCallback(
    async (amount) => {
      try {
        setLoadingAction("withdraw");
        await writeWithdraw({ args: [amount] });
      } catch (error) {
        setLoadingAction(null);
        throw error;
      }
    },
    [writeWithdraw]
  );

  const isLoading = isStakeLoading || isWithdrawLoading || !!loadingAction;

  return {
    stake,
    withdraw,
    isLoading,
    loadingAction,
  };
};
