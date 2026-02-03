import React from 'react'
import { FlatList, Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'

import { colors, sizes } from '@/constants/theme'
import { useGlobalContext } from '@/context/GlobalContext'

export default function Sessions() {
  const { week, program } = useGlobalContext()

  return (
    <FlatList
      data={program[week].sessions}
      renderItem={({ item }) => (
        <Session session={item} />
      )}
      keyExtractor={(item) => item?.id}
      contentContainerStyle={{
        paddingBottom: 137,
        rowGap: sizes.small
      }}
      showsVerticalScrollIndicator={false}
    />
  )
}

const Session = ({ session }: any) => {
  const router = useRouter()
  const { setSession } = useGlobalContext()

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.day}>{session.day}</Text>
        <Text style={styles.sessionName}>
          {session.name}
        </Text>
        <Text style={styles.sessionDetails}>{session.details}</Text>
        <View
          style={{
            width: '97.5%',
            height: 5,
            borderRadius: 10,
            backgroundColor: '#dfdfdf'
          }}
        >
          <View
            style={[
              {
                height: 5,
                borderRadius: 10,
                backgroundColor: colors.primary
              },
              {
                width: 57
              }
            ]}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.startBtn}
        onPress={() => {
          setSession(session.id)
          router.navigate('/session')
        }}
      >
        <Text style={styles.startBtnText}>Start Session</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: sizes.medium,
    paddingLeft: sizes.xLarge,
    paddingRight: sizes.medium,
    backgroundColor: colors.white,
    borderRadius: sizes.xxLarge,
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