import { SafeAreaView, View, StatusBar, Platform } from 'react-native'

import * as NavigationBar from 'expo-navigation-bar'

import Welcome from '@/components/home/Welcome'
import Session from '@/components/home/Session'
import Info from '@/components/home/Info'
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
      <Welcome />
      <Session />
      <Info />
    </SafeAreaView>
  )
}