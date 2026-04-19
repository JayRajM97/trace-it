import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { AuthProvider } from "../context/AuthContext";
import { RouteProvider } from "../context/RouteContext";
import { configureApi } from "@workspace/api-client-react";
import { useAuth } from "@clerk/clerk-expo";
import { Colors } from "../constants/colors";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

const tokenCache = {
  async getToken(key: string) {
    return SecureStore.getItemAsync(key);
  },
  async saveToken(key: string, value: string) {
    return SecureStore.setItemAsync(key, value);
  },
};

function ApiConfigurator({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  useEffect(() => {
    configureApi(
      process.env["EXPO_PUBLIC_API_BASE_URL"] ?? "http://localhost:3000",
      () => getToken()
    );
  }, [getToken]);
  return <>{children}</>;
}

export default function RootLayout() {
  const publishableKey = process.env["EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY"] ?? "";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
          <QueryClientProvider client={queryClient}>
            <ApiConfigurator>
              <AuthProvider>
                <RouteProvider>
                  <StatusBar style="light" />
                  <Stack
                    screenOptions={{
                      headerStyle: { backgroundColor: Colors.background },
                      headerTintColor: Colors.textPrimary,
                      headerTitleStyle: { fontWeight: "600" },
                      contentStyle: { backgroundColor: Colors.background },
                      headerShadowVisible: false,
                    }}
                  >
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="home" options={{ title: "TraceIt", headerShown: false }} />
                    <Stack.Screen name="shape-picker" options={{ title: "Pick a Shape" }} />
                    <Stack.Screen name="route-preview" options={{ title: "Route Preview" }} />
                    <Stack.Screen name="navigate" options={{ title: "Navigate", headerShown: false }} />
                    <Stack.Screen name="complete" options={{ title: "Route Complete", headerShown: false }} />
                    <Stack.Screen name="history" options={{ title: "My Art" }} />
                  </Stack>
                </RouteProvider>
              </AuthProvider>
            </ApiConfigurator>
          </QueryClientProvider>
        </ClerkProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
