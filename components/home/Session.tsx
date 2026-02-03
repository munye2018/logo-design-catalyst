import React from 'react'
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'


import { colors, sizes } from '@/constants/theme'
import { useGlobalContext } from '@/context/GlobalContext'

export default function Session(){
  const router = useRouter()
  const { setSession, program } = useGlobalContext()

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.day}>Today's Session</Text>
        <Text style={styles.sessionName}>
          {program[0].sessions[0].name}
        </Text>
        <Text style={styles.sessionDetails}>{program[0].sessions[0].details}</Text>
      </View>
      <TouchableOpacity
        style={styles.startBtn}
        onPress={() => {
          setSession(program[0].sessions[0].id)
          router.navigate('/session') // Remove after auth testing...
        }}
      >
        <Text style={styles.startBtnText}>Start Session</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: sizes.xxLarge,
    padding: sizes.medium,
    marginBottom: sizes.small
  },
  day: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: sizes.medium
  },
  sessionName: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: sizes.large
  },
  sessionDetails: {
    color: colors.gray2,
    fontWeight: 'regular',
    fontSize: sizes.small + 2,
    marginBottom: 3
  },
  textContainer: {
    flex: 1
  },
  startBtn: {
    backgroundColor: colors.primary,
    borderRadius: sizes.xLarge,
    marginVertical: sizes.small,
    paddingHorizontal: sizes.small,
    paddingVertical: sizes.small
  },
  startBtnText: {
    color: colors.white,
    fontWeight: 'bold'
  }
})