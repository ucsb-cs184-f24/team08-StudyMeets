import { Tabs } from 'expo-router'
import React from 'react'

const TabsLayout = () => {
  return (
    <Tabs>
        <Tabs.Screen name="index" options={{
            headerTitle: "Home (Header)",
            title: "Home (Tab)"
        }}/>
        <Tabs.Screen name="users/[id]" options={{
            headerTitle: "User (Header)",
            title: "User (Tab)",
        }}/>
        <Tabs.Screen name="thirdTab" options={{
            headerTitle: "thirdTab (Header)",
            title: "thirdTab (Tab)",
        }}/>
    </Tabs>
  );
};

export default TabsLayout;