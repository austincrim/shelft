import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { Stack } from 'expo-router/stack'
import { StatusBar } from 'expo-status-bar'
import 'react-native-gesture-handler'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

let queryClient = new QueryClient()

export default function Root() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </GestureHandlerRootView>
        <StatusBar style="auto" />
      </QueryClientProvider>
    </SafeAreaProvider>
  )
}
