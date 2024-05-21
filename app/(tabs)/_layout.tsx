import React from 'react'
import { SymbolView } from 'expo-symbols'
import { Tabs } from 'expo-router'

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'indigo' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <SymbolView
              size={28}
              resizeMode="scaleAspectFill"
              name="house"
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="shelf"
        options={{
          title: 'Shelf',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <SymbolView
              size={28}
              resizeMode="scaleAspectFill"
              name="books.vertical"
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <SymbolView
              size={28}
              resizeMode="scaleAspectFill"
              name="gear"
              tintColor={color}
            />
          ),
        }}
      />
    </Tabs>
  )
}
