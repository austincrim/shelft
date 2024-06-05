import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'

export type RootStackParamList = {
  HomeTabs: NavigatorScreenParams<HomeTabsParamList>
  VolumeDetails: { id: string }
}

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>

export type HomeTabsParamList = {
  Home: undefined
  Shelf: undefined
  Settings: undefined
}

export type HomeTabScreenProps<T extends keyof HomeTabsParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<HomeTabsParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
