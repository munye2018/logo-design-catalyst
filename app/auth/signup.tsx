import { useState } from 'react'
import { SafeAreaView, ScrollView, TextInput, TouchableOpacity, View, Alert, Text, StyleSheet } from 'react-native'
import { Stack, useRouter } from 'expo-router'

import { colors, shadows, sizes } from '../../constants/theme'
// import { useAuth } from '../../context/AuthContext'

const SignUp = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const router = useRouter()
  // const { signUp } = useAuth()

  const handleSignUp = () => {
    if (username == '' || email == '' || password == '' || confirmPassword == '' ) {
      return Alert.alert('Error', "Fields cannot be empty!", [{ text: 'OK' }])
    }

    if (password.length < 6 ) {
      return Alert.alert('Error', "Password must be at least 6 characters long", [{ text: 'OK' }])
    }

    if (password != confirmPassword ) {
      return Alert.alert('Error', "Passwords do not match", [{ text: 'OK' }])
    }
    // signUp(username, email, password)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.secondary }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.mainText}>Create account</Text>
          <Text style={styles.subText}>Explore all our existing programs</Text>
          <View style={{ marginTop: sizes.small }}>
            <TextInput
              placeholder="Username"
              placeholderTextColor={colors.gray2}
              onChangeText={(text) => {
                setUsername(text)
              }}
              style={styles.inputContainer}
            />
            <TextInput
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              placeholderTextColor={colors.gray2}
              onChangeText={(text) => {
                setEmail(text)
              }}
              style={styles.inputContainer}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor={colors.gray2}
              onChangeText={(text) => {
                setPassword(text)
              }}
              secureTextEntry
              style={styles.inputContainer}
            />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor={colors.gray2}
              onChangeText={(text) => {
                setConfirmPassword(text)
              }}
              secureTextEntry
              style={styles.inputContainer}
            />
          </View>
          {/* <Text
            color="textHint"
            variant="p1"
            marginVertical="small"
            textAlign="center"
          >
            By registering, you confirm that you accept our
            <Text variant="p2"> Terms of Use </Text>
            and our
            <Text variant="p2"> Privacy Policy</Text>
          </Text> */}
          <TouchableOpacity
            onPress={handleSignUp}
            style={styles.signupBtn}
          >
            <Text style={styles.signupBtnText}>Sign up</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('/auth/login')}>
            <Text style={styles.alreadyBtn}>
              Already have an account?
              <Text style={styles.loginBtnText}>
                {' '}
                Log in
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    marginBottom: sizes.large
  },
  inputContainer: {
    marginTop: sizes.small,
    backgroundColor: colors.white,
    padding: sizes.small,
    paddingLeft: sizes.large,
    borderRadius: sizes.xLarge
  },
  signupBtn: {
    padding: sizes.xLarge,
    backgroundColor: colors.primary,
    marginVertical: sizes.xLarge,
    borderRadius: sizes.xxLarge
  },
  signupBtnText: {
    fontWeight: 'bold',
    color: colors.secondary,
    textAlign: 'center',
    fontSize: sizes.large
  },
  alreadyBtn: {
    color: colors.gray2,
    textAlign: "center",
    fontSize: sizes.medium
  },
  loginBtnText: {
    fontWeight: 'bold',
    color: colors.primary
  }
})

export default SignUp
