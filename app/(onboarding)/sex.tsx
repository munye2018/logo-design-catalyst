import { Image, SafeAreaView, TouchableOpacity, StatusBar, View, Text, StyleSheet } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import * as NavigationBar from 'expo-navigation-bar'

import { useGlobalContext } from '@/context/GlobalContext'

import { colors, sizes } from '../../constants/theme'

export default function Sex() {
  const router = useRouter()
  const { sex, setSex } = useGlobalContext()

  NavigationBar.setBackgroundColorAsync('#FFFFFF01')
  NavigationBar.setPositionAsync('absolute')
  NavigationBar.setButtonStyleAsync("dark")

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.secondary }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar backgroundColor={colors.secondary} barStyle={'dark-content'}/>
      <View style={styles.container}>
        <Text style={styles.mainText}>Select your sex</Text>
        <TouchableOpacity
            onPress={() => {setSex('male')}}
            style={[
              styles.optionBtn,
              sex == 'male' && { backgroundColor: colors.gray2 }
            ]}
          >
            <Text style={styles.backBtnText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => {setSex('female')}}
            style={[
              styles.optionBtn,
              sex == 'female' && { backgroundColor: colors.gray2 }
            ]}
          >
            <Text style={styles.backBtnText}>Female</Text>
        </TouchableOpacity>
        <View style={styles.btnContainer}>
          <TouchableOpacity
            onPress={() => router.replace('/event')}
            style={styles.nextBtn}
          >
            <Text style={styles.nextBtnText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: sizes.small
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '30%'
  },
  mainText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: sizes.xxLarge * 1.3,
    paddingTop: sizes.xxLarge * 2,
    paddingBottom: sizes.xxLarge * 2
  },
  optionBtn: {
    padding: sizes.medium,
    marginTop: sizes.small,
    borderRadius: sizes.xxLarge,
    backgroundColor: colors.white
  },
  btnContainer: {
    paddingTop: sizes.xxLarge,
    flexDirection: "row"
  },
  backBtnText: {
    textAlign: "center",
    fontSize: sizes.large
  },
  nextBtn: {
    backgroundColor: colors.primary,
    paddingVertical: sizes.small * 1.5,
    paddingHorizontal: sizes.small * 2,
    marginTop: sizes.xxLarge * 2,
    width: '100%',
    borderRadius: sizes.xxLarge
  },
  nextBtnText: {
    color: colors.white,
    textAlign: "center",
    fontSize: sizes.large
  }
})