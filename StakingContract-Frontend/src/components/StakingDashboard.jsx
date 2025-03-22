import React, { useState } from "react";
import { useAccount } from "wagmi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ProtocolStats from "./ProtocolStats";
import StakingForm from "./StakingForm";
import StakingPositions from "./StakingPositions";
import UserStats from "./UserStats";
import StakingActions from "./StakingActions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const StakingDashboard = () => {
  const { isConnected } = useAccount();
  console.log(isConnected);
  const [activeTab, setActiveTab] = useState("stake");

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle>Protocol Statistics</CardTitle>
              <CardDescription>
                Overview of the staking protocol
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProtocolStats />
            </CardContent>
          </Card>
        </div>
        {isConnected && (
          <div>
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
                <CardDescription>Your staking information</CardDescription>
              </CardHeader>
              <CardContent>
                <UserStats />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {isConnected ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-slate-900 border-slate-800">
              <Tabs
                defaultValue="stake"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <CardHeader>
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="stake">Stake</TabsTrigger>
                    <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
                    <TabsTrigger value="claim">Claim Rewards</TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent className="pt-6">
                  <TabsContent value="stake">
                    <StakingForm action="stake" />
                  </TabsContent>
                  <TabsContent value="withdraw">
                    <StakingForm action="withdraw" />
                  </TabsContent>
                  <TabsContent value="claim">
                    <StakingActions />
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
          <div>
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>Your Position</CardTitle>
                <CardDescription>Current staking position</CardDescription>
              </CardHeader>
              <CardContent>
                <StakingPositions />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="bg-slate-900 border-slate-800 text-center p-8">
          <CardContent>
            <p className="text-lg mb-4">Connect your wallet to start staking</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StakingDashboard;
