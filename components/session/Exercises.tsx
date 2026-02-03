import React, { useState } from 'react'
import { FlatList, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'

import { colors, sizes } from '@/constants/theme'
import { useGlobalContext } from '@/context/GlobalContext'

export default function Exercises() {
  const { program, bestTime, week, session } = useGlobalContext()

  let exercises = program[week].sessions[session].session

  if ("session" in exercises[0]) {
    exercises = exercises[0].session
  }

  return (
    <FlatList
      data={exercises}
      renderItem={({ item }) => (
        <Exercise exercise={item} />
      )}
      // keyExtractor={(item) => item?.id}
      contentContainerStyle={{
        padding: sizes.small,
        paddingBottom: 50,
        rowGap: sizes.small
      }}
      showsVerticalScrollIndicator={false}
    />
  )
}

const Exercise = ({ exercise }: any) => {
  const [activeTab, setActiveTab] = useState('hand')
  const { event, bestTime } = useGlobalContext()

  return (
    <View style={styles.container}>
      {exercise.name == "Acceleration" ||
       exercise.name == "Max Velocity" ||
       exercise.name == "Speed Endurance" ||
       exercise.name == "Specific Endurance" ||
       exercise.name == "Hills" ||
       exercise.name == "Intensive Tempo" ||
       exercise.name == "Extensive Tempo" ?
        <>
        <View style={styles.textContainer}>
          <View>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseDetails}>{exercise.reps} x {exercise.distance}m, {exercise.recovery} minute recovery</Text>
          </View>
          <Text style={styles.duration}>{exercise.pace * 100}% ({((bestTime/(event/exercise.distance))/exercise.pace).toFixed(2)}s)</Text>
        </View>
          <View style={styles.addTimeContainer}>
            <View style={styles.timeTypeContainer}>
              <TouchableOpacity
                style={styles.timeTypeBtn(activeTab, 'hand')}
                onPress={() => setActiveTab('hand')}
              >
                <Text style={styles.timeTypeBtnText(activeTab, 'hand')}>Hand</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.timeTypeBtn(activeTab, 'electronic')}
                onPress={() => setActiveTab('electronic')}
              >
                <Text style={styles.timeTypeBtnText(activeTab, 'electronic')}>Electronic</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder="00:00"
              keyboardType='numeric'
              maxLength={5}
              autoCorrect={false}
              placeholderTextColor={colors.gray2}
              onChangeText={(text) => {
              }}
              style={styles.timeText}
            />
            <TouchableOpacity style={styles.addTimeBtn}>
              <Text style={styles.addTimeBtnText}>Add Time</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={exercise.times}
            renderItem={({ item }) => (
              <Time time={item} />
            )}
            keyExtractor={(item) => item?.id}
            showsVerticalScrollIndicator={false}
          />
        </>
      :
        <View style={styles.textContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.exerciseName}>
              {exercise.name}
            </Text>
            <Text style={styles.exerciseDetails}>{exercise.details}</Text>
          </View>
          <Text style={styles.duration}>{exercise.duration}</Text>
        </View>
      }
    </View>
  )
}

const Time = ({ time }: any) => {
  return (
    <View style={styles.timeContainer}>
      <Text style={styles.repText}>Rep {Number(time.rep) + 1}</Text>
      <Text style={styles.timeText}>{time.time}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: sizes.large,
    backgroundColor: colors.white,
    borderRadius: sizes.xxLarge
  },
  exerciseName: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: sizes.large
  },
  exerciseDetails: {
    color: colors.gray2,
    fontWeight: 'regular',
    fontSize: sizes.small + 2,
    marginBottom: 3
  },
  duration: {
    color: colors.gray,
    fontWeight: 'bold',
    fontSize: sizes.medium
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addTimeContainer: {
    flexDirection:'row',
    marginVertical: sizes.xSmall/3
  },
  timeTypeContainer: {
    flex: 1,
    flexDirection:'row',
    padding: sizes.xSmall/4,
    backgroundColor: colors.secondary,
    borderRadius: sizes.xxLarge,
  },
// @ts-expect-error TS(2322): Type '(activeJobType: any, item: any) => { fontFam... Remove this comment to see the full error message
  timeTypeBtn: (activeTab, item) => ({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // padding: sizes.xSmall/10,
    backgroundColor: activeTab == item ? colors.primary : colors.secondary,
    borderRadius: sizes.xxLarge
  }),
// @ts-expect-error TS(2322): Type '(activeJobType: any, item: any) => { fontFam... Remove this comment to see the full error message
  timeTypeBtnText: (activeTab, item) => ({
    color: activeTab == item ? colors.secondary : colors.gray2,
    fontWeight: 'bold'
  }),
  addTimeBtn: {
    alignSelf: 'center',
    padding: sizes.xSmall,
    backgroundColor: colors.primary,
    borderRadius: sizes.xxLarge
  },
  addTimeBtnText: {
    color: colors.white,
    fontWeight: 'bold'
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: sizes.xSmall/3,
    padding: sizes.xSmall,
    backgroundColor: colors.secondary,
    borderRadius: sizes.xxLarge
  },
  repText: {
    color: colors.gray,
    fontWeight: 'bold',
    fontSize: sizes.medium
  },
  timeText: {
    color: colors.gray2,
    fontWeight: "bold",
    fontSize: sizes.medium
  },
})