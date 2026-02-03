import { Image, SafeAreaView, TouchableOpacity, StatusBar, View, Text, TextInput, StyleSheet } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import * as NavigationBar from 'expo-navigation-bar'

import { useGlobalContext } from '@/context/GlobalContext'

import { colors, sizes } from '../../constants/theme'

export default function Time() {
  const router = useRouter()
  const { bestTime, setBestTime } = useGlobalContext()

  NavigationBar.setBackgroundColorAsync('#FFFFFF01')
  NavigationBar.setPositionAsync('absolute')
  NavigationBar.setButtonStyleAsync("dark")

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.secondary }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar backgroundColor={colors.secondary} barStyle={'dark-content'}/>
      <View style={styles.container}>
        <Text style={styles.mainText}>What is your season's best in this event?</Text>
        <TextInput
            placeholder="00:00"
            keyboardType='numeric'
            maxLength={5}
            autoCorrect={false}
            placeholderTextColor={colors.gray2}
            autoCapitalize="none"
            onChangeText={(text) => {
              setBestTime(text)
            }}
            style={styles.inputContainer}
        />
        <View style={styles.btnContainer}>
          <TouchableOpacity
            onPress={() => router.replace('/event')}
            style={styles.backBtn}
          >
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.replace('/program')}
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
  inputContainer: {
    textAlign: 'center',
    alignSelf: 'center',
    width: '50%',
    fontSize: sizes.xxLarge,
    marginTop: sizes.small,
    backgroundColor: colors.white,
    padding: sizes.medium,
    borderRadius: sizes.xxLarge
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