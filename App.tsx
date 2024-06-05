import { useCallback } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { HomeTabs } from './src/screens/HomeTabs'
import { VolumeDetails } from './src/screens/VolumeDetails'
// import { useUserStore } from '../store'

export type RootParamList = {
  HomeTabs: undefined
  VolumeDetails: {
    id: string
  }
}
let Stack = createNativeStackNavigator<RootParamList>()
let queryClient = new QueryClient()

export default function Root() {
  const [fontsLoaded, fontError] = useFonts({
    NewYork: require('./assets/NewYork.ttf'),
    NewYorkBold: require('./assets/NewYorkBold.otf'),
  })
  // const userStore = useUserStore()

  const onLayoutRootView = useCallback(async () => {
    // await userStore.fetchCsrf()
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontError])

  if (!fontsLoaded && !fontError) {
    return null
  }
  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="HomeTabs">
              <Stack.Screen
                name="HomeTabs"
                component={HomeTabs}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="VolumeDetails"
                component={VolumeDetails}
                options={{ presentation: 'modal' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </GestureHandlerRootView>
        <StatusBar style="auto" />
      </QueryClientProvider>
    </SafeAreaProvider>
  )
}
