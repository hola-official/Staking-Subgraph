import React from "react";
import { ConnectButton as RainbowKitConnectButton } from "@rainbow-me/rainbowkit";
import { useDisconnect } from "wagmi";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Loader2, LogOut, ChevronDown, Wallet } from "lucide-react";

export function ConnectButton({
  label = "Connect Wallet",
  accountStatus = "full",
  chainStatus = { smallScreen: "icon", largeScreen: "full" },
  showBalance = { smallScreen: false, largeScreen: true },
}) {
  const { disconnect } = useDisconnect();
  return (
    <RainbowKitConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
        connectModalOpen,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    disabled={connectModalOpen}
                  >
                    {connectModalOpen ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet className="mr-2 h-4 w-4" />
                        {label}
                      </>
                    )}
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} variant="destructive">
                    Wrong network
                  </Button>
                );
              }

              // Connected state - determine display based on props
              return (
                <div className="flex items-center gap-2">
                  {/* Chain Button - show based on chainStatus */}
                  {chainStatus !== "none" && (
                    <Button
                      variant="outline"
                      onClick={openChainModal}
                      className="flex items-center gap-2"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 16,
                            height: 16,
                            borderRadius: 999,
                            overflow: "hidden",
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              style={{ width: 16, height: 16 }}
                            />
                          )}
                        </div>
                      )}
                      {(chainStatus === "name" ||
                        chainStatus === "full" ||
                        (typeof chainStatus === "object" &&
                          (window.innerWidth < 768
                            ? chainStatus.smallScreen === "name" ||
                              chainStatus.smallScreen === "full"
                            : chainStatus.largeScreen === "name" ||
                              chainStatus.largeScreen === "full"))) && (
                        <span>{chain.name}</span>
                      )}
                    </Button>
                  )}

                  {/* Account Button */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        {accountStatus !== "none" && (
                          <>
                            {account.ensAvatar &&
                              accountStatus !== "address" && (
                                <div
                                  style={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: 999,
                                    overflow: "hidden",
                                  }}
                                >
                                  <img
                                    src={account.ensAvatar}
                                    alt={account.displayName}
                                    style={{ width: 16, height: 16 }}
                                  />
                                </div>
                              )}
                            {accountStatus !== "avatar" && (
                              <span>{account.displayName}</span>
                            )}
                            {/* Show balance when enabled */}
                            {(showBalance === true ||
                              (typeof showBalance === "object" &&
                                (window.innerWidth < 768
                                  ? showBalance.smallScreen
                                  : showBalance.largeScreen))) &&
                              account.displayBalance && (
                                <span className="ml-1 text-sm text-gray-500">
                                  ({account.displayBalance})
                                </span>
                              )}
                          </>
                        )}
                        <ChevronDown size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={openAccountModal}>
                        Account Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={openAccountModal}>
                        <LogOut className="mr-2 h-4 w-4" onClick={disconnect()} />
                        Disconnect
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })()}
          </div>
        );
      }}
    </RainbowKitConnectButton.Custom>
  );
}
