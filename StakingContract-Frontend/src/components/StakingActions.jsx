import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useStakingContract } from "../hooks/useStakingContract";
import { usePendingRewards } from "../hooks/usePendingRewards";
import { Loader2, AlertTriangle } from "lucide-react";
import { formatEther } from "viem";

const StakingActions = () => {
  const { claimRewards, emergencyWithdraw, isLoading, loadingAction } =
    useStakingContract();
  const { data: pendingRewards = "0", isLoading: isRewardsLoading } =
    usePendingRewards();

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Pending Rewards:</span>
              <span className="font-medium">
                {isRewardsLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin inline" />
                ) : (
                  `${parseFloat(formatEther(BigInt(pendingRewards))).toFixed(
                    6
                  )} Tokens`
                )}
              </span>
            </div>
            <Button
              onClick={claimRewards}
              disabled={isLoading || parseFloat(pendingRewards) <= 0}
              className="mt-4"
            >
              {isLoading && loadingAction === "claim" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Claiming...
                </>
              ) : (
                "Claim Rewards"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="border-t border-slate-800 pt-6">
        <h3 className="font-semibold mb-4">Emergency Withdrawal</h3>
        <p className="text-slate-400 text-sm mb-4">
          Emergency withdrawal will remove all your staked tokens but will incur
          a penalty. Only use this in case of emergency.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              Emergency Withdraw
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                Warning: Penalty Applied
              </AlertDialogTitle>
              <AlertDialogDescription>
                Emergency withdrawal will incur a penalty on your staked tokens.
                This action cannot be undone. Are you sure you want to proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={emergencyWithdraw}
                disabled={isLoading && loadingAction === "emergency"}
                className="bg-red-500 hover:bg-red-600"
              >
                {isLoading && loadingAction === "emergency" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "I Understand, Proceed"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default StakingActions;
