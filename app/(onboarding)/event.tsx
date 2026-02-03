import { Image, SafeAreaView, TouchableOpacity, StatusBar, View, Text, StyleSheet } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import * as NavigationBar from 'expo-navigation-bar'

import { useGlobalContext } from '@/context/GlobalContext'

import { colors, sizes } from '../../constants/theme'

export default function Event() {
  const router = useRouter()
  const { event, setEvent } = useGlobalContext()

  NavigationBar.setBackgroundColorAsync('#FFFFFF01')
  NavigationBar.setPositionAsync('absolute')
  NavigationBar.setButtonStyleAsync("dark")

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.secondary }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar backgroundColor={colors.secondary} barStyle={'dark-content'}/>
      <View style={styles.container}>
        <Text style={styles.mainText}>Select your primary event</Text>
        <TouchableOpacity
            onPress={() => {setEvent(100)}}
            style={[
              styles.optionBtn,
              event == 100 && { backgroundColor: colors.gray2 }
            ]}
          >
            <Text style={styles.backBtnText}>100m</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => {setEvent(200)}}
            style={[
              styles.optionBtn,
              event == 200 && { backgroundColor: colors.gray2 }
            ]}
          >
            <Text style={styles.backBtnText}>200m</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => {setEvent(400)}}
            style={[
              styles.optionBtn,
              event == 400 && { backgroundColor: colors.gray2 }
            ]}
          >
            <Text style={styles.backBtnText}>400m</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => {setEvent(800)}}
            style={[
              styles.optionBtn,
              event == 800 && { backgroundColor: colors.gray2 }
            ]}
          >
            <Text style={styles.backBtnText}>800m</Text>
        </TouchableOpacity>
        <View style={styles.btnContainer}>
          <TouchableOpacity
            onPress={() => {router.replace('/sex')}}
            style={styles.backBtn}
          >
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.replace('/time')}
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
    backgroundColor: colors.white,
  },
  btnContainer: {
    paddingTop: sizes.xxLarge,
    marginTop: sizes.xxLarge * 2,
    flexDirection: "row"
  },
  backBtn: {
    paddingVertical: sizes.small * 1.5,
    paddingHorizontal: sizes.small * 2,
    marginRight: sizes.small,
    width: '48%',
    borderRadius: sizes.xxLarge,
    backgroundColor: colors.white,
  },
  backBtnText: {
    textAlign: "center",
    fontSize: sizes.large
  },
  nextBtn: {
    backgroundColor: colors.primary,
    paddingVertical: sizes.small * 1.5,
    paddingHorizontal: sizes.small * 2,
    width: '48%',
    borderRadius: sizes.xxLarge
  },
  nextBtnText: {
    color: colors.white,
    textAlign: "center",
    fontSize: sizes.large
  }
})