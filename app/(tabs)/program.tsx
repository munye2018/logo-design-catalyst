import { SafeAreaView, StatusBar, Platform } from 'react-native'
import * as NavigationBar from 'expo-navigation-bar'

import WeekIndicator from '@/components/program/WeekIndicator'
import Sessions from '@/components/program/Sessions'
import { colors, sizes } from '@/constants/theme'

export default function Program() {
  NavigationBar.setBackgroundColorAsync('#FFFFFF01')
  NavigationBar.setPositionAsync('absolute')
  NavigationBar.setButtonStyleAsync("dark")

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.secondary,
        paddingTop: Platform.OS == 'ios' ? 0 : StatusBar.currentHeight,
        paddingHorizontal: sizes.small
      }}
    >
      <StatusBar backgroundColor={colors.secondary} barStyle={'dark-content'} />
      <WeekIndicator />
      <Sessions />
    </SafeAreaView>
  )
}