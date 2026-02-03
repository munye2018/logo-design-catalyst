import { SafeAreaView, StatusBar, Platform, View, Text, StyleSheet } from 'react-native'
import { colors, sizes } from '@/constants/theme'

export default function Settings() {
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
      <View style={styles.container}>
        <Text style={styles.mainText}>Settings</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: sizes.medium
  },
  mainText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: sizes.xxLarge
  }
})