import React, { useState } from "react";
import { useAccount } from "wagmi";
import { parseEther } from "viem";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { useStakingContract } from "../hooks/useStakingContract";
import { useTokenBalance } from "../hooks/useTokenBalance.js";
import { useStakedAmount } from "../hooks/useStakedAmount";
import { Loader2 } from "lucide-react";

const StakingForm = ({ action }) => {
  const { address } = useAccount();
  const [amount, setAmount] = useState("");
  const [percentage, setPercentage] = useState([0]);
  const { stake, withdraw, isLoading } = useStakingContract();
  const { data: balance = "0", isLoading: isBalanceLoading } =
    useTokenBalance(address);
  const { data: stakedAmount = "0", isLoading: isStakedLoading } =
    useStakedAmount(address);

  const maxAmount = action === "stake" ? balance : stakedAmount;

  const handlePercentageChange = (value) => {
    setPercentage(value);
    const newAmount = ((parseFloat(maxAmount) * value[0]) / 100).toFixed(6);
    setAmount(newAmount.toString());
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setAmount(value);
      const newPercentage =
        maxAmount !== "0"
          ? Math.min(
              (parseFloat(value || "0") / parseFloat(maxAmount)) * 100,
              100
            )
          : 0;
      setPercentage([newPercentage]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    try {
      if (action === "stake") {
        await stake(parseEther(amount));
      } else {
        await withdraw(parseEther(amount));
      }
      setAmount("");
      setPercentage([0]);
    } catch (error) {
      console.error(`Error on ${action}:`, error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="text-sm font-medium leading-none">
            {action === "stake" ? "Stake Amount" : "Withdraw Amount"}
          </label>
          <span className="text-sm text-slate-400">
            {isBalanceLoading || isStakedLoading ? (
              <Loader2 className="h-4 w-4 animate-spin inline" />
            ) : (
              <>Balance: {parseFloat(maxAmount).toFixed(4)}</>
            )}
          </span>
        </div>
        <Input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder="0.0"
          className="bg-slate-800 border-slate-700"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
        <Slider
          value={percentage}
          onValueChange={handlePercentageChange}
          max={100}
          step={1}
          className="mt-6"
        />
      </div>

      <div className="flex justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => handlePercentageChange([25])}
        >
          25%
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => handlePercentageChange([50])}
        >
          50%
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => handlePercentageChange([75])}
        >
          75%
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => handlePercentageChange([100])}
        >
          Max
        </Button>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!amount || parseFloat(amount) <= 0 || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {action === "stake" ? "Staking..." : "Withdrawing..."}
          </>
        ) : action === "stake" ? (
          "Stake Tokens"
        ) : (
          "Withdraw Tokens"
        )}
      </Button>
    </form>
  );
};

export default StakingForm;
