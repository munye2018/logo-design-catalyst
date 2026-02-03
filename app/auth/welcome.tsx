import { Image, SafeAreaView, TouchableOpacity, StatusBar, View, Text, StyleSheet } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import * as NavigationBar from 'expo-navigation-bar'

import { colors, sizes } from '../../constants/theme'

const Welcome = () => {
  const router = useRouter()

  NavigationBar.setBackgroundColorAsync('#FFFFFF01')
  NavigationBar.setPositionAsync('absolute')
  NavigationBar.setButtonStyleAsync("dark")
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar backgroundColor={colors.primary} />
        <View style={styles.logoContainer}>
          <Image
            style={{
              width: '30%',
              height: '30%',
            }}
            resizeMode='contain'
            source={require('../../assets/images/logo-transparent.png')}
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.mainText}>Aurora</Text>
          <Text style={styles.subText}>Maximise your performance</Text>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={() => router.replace('/auth/signup')}
              style={styles.signupBtn}
            >
              <Text style={styles.signupBtnText}>Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.replace('/auth/login')}
              style={styles.loginBtn}
            >
              <Text style={styles.loginBtnText}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: sizes.xxLarge,
    backgroundColor: colors.secondary,
    borderTopLeftRadius: sizes.xxLarge,
    borderTopRightRadius: sizes.xxLarge
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '30%'
  },
  mainText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: sizes.xxLarge * 1.5,
    paddingTop: sizes.xxLarge
  },
  subText: {
    textAlign: "center",
    color: colors.gray2,
    marginBottom: sizes.large
  },
  btnContainer: {
    paddingHorizontal: sizes.large,
    paddingTop: sizes.xxLarge,
    flexDirection: "row"
  },
  signupBtn: {
    paddingVertical: sizes.small * 1.5,
    paddingHorizontal: sizes.small * 2,
    marginRight: sizes.small,
    width: '48%',
    borderRadius: sizes.xxLarge,
    backgroundColor: colors.white,
  },
  signupBtnText: {
    textAlign: "center",
    fontSize: sizes.large
  },
  loginBtn: {
    backgroundColor: colors.primary,
    paddingVertical: sizes.small * 1.5,
    paddingHorizontal: sizes.small * 2,
    width: '48%',
    borderRadius: sizes.xxLarge
  },
  loginBtnText: {
    color: colors.white,
    textAlign: "center",
    fontSize: sizes.large
  }
})

export default Welcome
