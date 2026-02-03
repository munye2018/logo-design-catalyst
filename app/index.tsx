import { ActivityIndicator, SafeAreaView } from 'react-native'
import * as NavigationBar from 'expo-navigation-bar'

import { colors } from '@/constants/theme'

export default function Index() {
  NavigationBar.setBackgroundColorAsync('#FFFFFF01')
  NavigationBar.setPositionAsync('absolute')
  NavigationBar.setButtonStyleAsync("light")
  
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.primary
      }}
    >
      <ActivityIndicator
        size="large"
        color={colors.white}
      />
    </SafeAreaView>
  )
}