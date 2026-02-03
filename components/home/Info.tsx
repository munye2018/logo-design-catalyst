import React from 'react'
import { Text, TouchableOpacity, View, StyleSheet, Touchable } from 'react-native'
import { router, useRouter } from 'expo-router'

import { colors, sizes } from '@/constants/theme'
import { useGlobalContext } from '@/context/GlobalContext'

export default function Progress(){
  const { event, bestTime } = useGlobalContext()

  return (
    <>
    <View style={styles.columnContainer}>
      <Widget
        title='Your Progress:'
        mainText='Week 4'
        details='of 20 weeks'
        button='View Program'
      />
      <Widget
        title='Fatigue:'
        mainText='9/10'
        details='Take a rest day.'
        button='Edit Fatigue'
        blueMode={true}
      />
    </View>
    <View style={styles.columnContainer}>
      <Widget
        title="Your Season's Best:"
        mainText={bestTime}
        details='on 21/12/24'
        button='View Details'
      />
      <Widget
        title='Your Event:'
        mainText={event + 'm'}
        details='Sprint'
        button='Change Event'
      />
    </View>
    </>
  )
}

const Widget = ({ title, mainText, details, button, blueMode }: any) => {
  return (
    <View 
      style={[
        styles.widgetContainer,
        blueMode == true && {
        backgroundColor: colors.blue
        }
      ]}
    >
      <View style={styles.textContainer}>
        <Text 
          style={[
            styles.title,
            blueMode == true && {
              color: colors.white
            }
          ]}
        >
        {title}
        </Text>
        <Text 
          style={[
            styles.mainText,
            blueMode == true && {
              color: colors.white
            }
          ]}
        >
          {mainText}
        </Text>
        <Text
          style={[
            styles.details,
            blueMode == true && {
              color: colors.white
            }
          ]}
        >
          {details}
        </Text>
        <TouchableOpacity>
          <Text
            style={[
              styles.btn,
              blueMode == true && {
                color: colors.white
              }
            ]}
          >
            {button}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  columnContainer: {
    flexDirection: 'row',
    gap: sizes.small,
    paddingBottom: sizes.small
  },
  widgetContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: sizes.xxLarge,
    padding: sizes.medium
  },
  title: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: sizes.medium
  },
  mainText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: sizes.xxLarge
  },
  details: {
    color: colors.gray2,
    fontWeight: 'regular',
    fontSize: sizes.small + 2,
    marginBottom: 3
  },
  textContainer: {
    flex: 1
  },
  btn: {
    color: colors.primary,
    fontWeight: 'bold'
  }
})