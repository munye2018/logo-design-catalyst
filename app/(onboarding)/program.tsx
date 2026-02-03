import { Image, SafeAreaView, TouchableOpacity, StatusBar, View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import * as NavigationBar from 'expo-navigation-bar'

import { useGlobalContext } from '@/context/GlobalContext'
import generateProgram from '@/models/generate-sprints-program'

import { colors, sizes } from '../../constants/theme'

export default function Program() {
  const router = useRouter()
  const { programType, setProgramType, program, setProgram } = useGlobalContext()

  NavigationBar.setBackgroundColorAsync('#FFFFFF01')
  NavigationBar.setPositionAsync('absolute')
  NavigationBar.setButtonStyleAsync("dark")

  useEffect(() => {
    if (program) {
      router.replace('/home')
    }
  }, [program])

  const handleNavigate = () => {
    setProgram(generateProgram())
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.secondary }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar backgroundColor={colors.secondary} barStyle={'dark-content'}/>
      <View style={styles.container}>
        <Text style={styles.mainText}>Select your program length</Text>
        <TouchableOpacity
            onPress={() => {setProgramType('default')}}
            style={[
              styles.optionBtn,
              programType == 'default' && { backgroundColor: colors.gray2 }
            ]}
          >
            <Text style={styles.backBtnText}>20 Weeks</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => {setProgramType('custom')}}
            style={[
              styles.optionBtn,
              programType == 'custom' && { backgroundColor: colors.gray2 }
            ]}
          >
            <Text style={styles.backBtnText}>Custom</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => {setProgramType('ongoing')}}
            style={[
              styles.optionBtn,
              programType == 'ongoing' && { backgroundColor: colors.gray2 }
            ]}
          >
            <Text style={styles.backBtnText}>Train As You Go</Text>
        </TouchableOpacity>
        <View style={styles.btnContainer}>
          <TouchableOpacity
            onPress={() => router.replace('/time')}
            style={styles.backBtn}
          >
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleNavigate()}
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