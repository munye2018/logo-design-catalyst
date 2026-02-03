import { SafeAreaView, ScrollView, View, StatusBar, Platform } from 'react-native'
import { Stack } from 'expo-router'

import Exercises from '@/components/session/Exercises'
import { colors } from '@/constants/theme'

export default function Program() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.secondary }}>
      {/* , paddingTop: Platform.OS == 'ios' ? 0 : StatusBar.currentHeight }}> */}
      <StatusBar backgroundColor={colors.secondary} barStyle={'dark-content'} />
      <Stack.Screen
        options={{
          headerStyle: {backgroundColor: colors.secondary},
          headerShadowVisible: false,
          headerBackVisible: true,
          headerTitle: "Today's Session",
          headerTintColor: colors.primary
        }}
      />
      <Exercises />
    </SafeAreaView>
  )
}