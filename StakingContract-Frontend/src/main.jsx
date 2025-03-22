import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/ThemeProvider.jsx";
import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

const projectId = "e11e1ee467f1659c3613f095daa0370c";

const config = getDefaultConfig({
  appName: "Staking Protocol",
  projectId: projectId,
  chains: [sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

// Configure Apollo Client for GraphQL
const apolloClient = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/107419/staking-dapp/version/latest",
  cache: new InMemoryCache(),
});

// React Query client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider coolMode theme={darkTheme()}>
            <ThemeProvider defaultTheme="dark" storageKey="staking-ui-theme">
              <App />
            </ThemeProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </WagmiProvider>
  </StrictMode>
);
