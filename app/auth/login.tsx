import { useState } from 'react'
import { SafeAreaView, TextInput, TouchableOpacity, View, Text, StyleSheet } from 'react-native'
// import BouncyCheckView from 'react-native-bouncy-checkView'
import { Stack, useRouter } from 'expo-router'

import { colors, shadows, sizes } from '../../constants/theme'
// import { useAuth } from '../../context/AuthContext'

const LogIn = () => {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(true)

  const router = useRouter()
  // const { logIn } = useAuth()

  const handlePressLogIn = () => {
    // logIn(identifier, password)
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.secondary }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
          <Text style={styles.mainText}>
            Perform.
          </Text>
          <Text style={styles.subText}>At your best.</Text>
          <TextInput
            placeholder="Username/Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            placeholderTextColor={colors.gray2}
            onChangeText={(text) => {
              setIdentifier(text)
            }}
            style={styles.inputContainer}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.gray2}
            onChangeText={(text) => {
              setPassword(text)
            }}
            secureTextEntry={passwordVisible}
            style={styles.inputContainer}
          />
          {/* <View>
            <BouncyCheckView onPress={togglePasswordVisibility} />
            <Text variant="p2">See password</Text>
          </View>
          <Text variant="p2">Forgot password?</Text> */}
        <TouchableOpacity
          onPress={handlePressLogIn}
          style={styles.loginBtn}
        >
          <Text style={styles.loginBtnText}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.replace('/auth/signup')}
          style={{
            padding: sizes.small
          }}
        >
          <Text
            style={styles.dontBtn}
          >
            Don't have an account?
            <Text style={styles.signupBtnText}>
              {' '}
              Sign up
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: sizes.xxLarge,
    marginTop: sizes.xxLarge 
  },
  mainText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: sizes.xxLarge,
    paddingTop: sizes.xxLarge
  },
  subText: {
    textAlign: "center",
    color: colors.gray2,
    marginBottom: sizes.large,
      // fontFamily: 'bold',
      // fontSize: sizes.large,
      // color: colors.primary,
      // maxWidth: '80%',
      // textAlign: 'center',
      // marginTop: sizes.small,
      // marginBottom: sizes.medium
  },
  inputContainer: {
    marginTop: sizes.small,
    backgroundColor: colors.white,
    padding: sizes.small,
    paddingLeft: sizes.large,
    borderRadius: sizes.xLarge
  },
  loginBtn: {
    padding: sizes.xLarge,
    backgroundColor: colors.primary,
    marginVertical: sizes.xLarge,
    borderRadius: sizes.xxLarge
  },
  loginBtnText: {
    fontWeight: 'bold',
    color: colors.secondary,
    textAlign: 'center',
    fontSize: sizes.large
  },
  dontBtn: {
    color: colors.gray2,
    textAlign: "center",
    fontSize: sizes.medium
  },
  signupBtnText: {
    fontWeight: 'bold',
    color: colors.primary
  }
})

export default LogIn
