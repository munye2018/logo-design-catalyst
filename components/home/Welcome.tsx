import { Image, TouchableOpacity, StatusBar, View, Text, StyleSheet } from 'react-native'

import { colors, sizes } from '../../constants/theme'

const Welcome = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>Hello, Kamara 💪</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: sizes.medium
  },
  mainText: {
    fontWeight: 'bold',
    fontSize: sizes.xxLarge
  }
})

export default Welcome