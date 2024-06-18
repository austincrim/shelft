import React from 'react'
import { SymbolView } from 'expo-symbols'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Home } from './HomeTabs/Home'
import { Shelf } from './HomeTabs/Shelf'
import { Settings } from './HomeTabs/Settings'
import { HomeTabsParamList } from './types'

let Tabs = createBottomTabNavigator<HomeTabsParamList>()
export function HomeTabs() {
  return (
    <Tabs.Navigator screenOptions={{ tabBarActiveTintColor: 'goldenrod' }}>
      <Tabs.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <SymbolView
              size={28}
              name="house"
              resizeMode="scaleAspectFill"
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Shelf"
        component={Shelf}
        options={{
          title: 'Shelf',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <SymbolView
              size={28}
              name="books.vertical"
              resizeMode="scaleAspectFill"
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Settings"
        component={Settings}
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <SymbolView
              size={28}
              name="gear"
              resizeMode="scaleAspectFill"
              tintColor={color}
            />
          ),
        }}
      />
    </Tabs.Navigator>
  )
}
