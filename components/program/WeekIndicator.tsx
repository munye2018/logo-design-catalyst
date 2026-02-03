import React from 'react'
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native'

import { useGlobalContext } from '@/context/GlobalContext'
import { colors, sizes } from '@/constants/theme'
import MaterialIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Weeks() {
  const { week, setWeek, program } = useGlobalContext()

  return (
    <>
      <Text style={styles.text}>{program[week].name}</Text>
      <View style={styles.btnContainer}>
        <TouchableOpacity onPress={() => {
            if (week != 0) {
              setWeek(week - 1)
            }
          }}
        >
          <MaterialIcons
            color={colors.primary}
            name='chevron-left'
            size={30}
          />
        </TouchableOpacity>
        <Text style={styles.btnText}>Week {week + 1}</Text>
        <TouchableOpacity onPress={() => {
            if (week != program.length - 1) {
              setWeek(week + 1)
            }
          }}
        >
          <MaterialIcons
              color={colors.primary}
              name='chevron-right'
              size={30}
          />
        </TouchableOpacity>
      </View>
      <View
        style={styles.indicatorContainer}
      >
        {/* Render indicator */}
        {program.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.indicator,
              program[index].completed == true && {
                backgroundColor: colors.gray2
              },
              program[index].completed == false && {
                backgroundColor: colors.gray2
              },
              week == index && {
                backgroundColor: colors.gray
              }
            ]}
            onPress={() => {setWeek(index)}}
          />
        ))}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    paddingTop: sizes.medium,
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: sizes.xxLarge
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: sizes.small
  },
  indicator: {
    flex: 1,
    height: 10,
    backgroundColor: colors.gray2,
    marginHorizontal: '1%',
    borderRadius: 5
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: sizes.large
  },
  startBtn: {
    backgroundColor: colors.primary,
    borderRadius: sizes.xLarge,
    marginVertical: sizes.small,
    paddingHorizontal: sizes.small,
    paddingVertical: sizes.small
  }
})