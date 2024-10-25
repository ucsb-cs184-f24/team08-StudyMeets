import React from 'react'
import { Stack } from 'expo-router'

const differentPageLayout = () => {
  return (
    <Stack>
        <Stack.Screen name="differentPage" />
    </Stack>
  );
};

export default differentPageLayout;