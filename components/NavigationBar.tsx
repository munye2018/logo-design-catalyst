import { Image, Text, TouchableOpacity, View, StyleSheet, Platform } from 'react-native'

import { colors, sizes, shadows } from '@/constants/theme'
import Feather from '@expo/vector-icons/Feather';

export function NavigationBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
          >
            <View 
              style={{
                paddingVertical: sizes.xSmall,
                backgroundColor: isFocused ? colors.secondary : colors.white,
                borderRadius: sizes.medium
                }}
            >
              <Feather
                color={colors.primary}
                name={label == 'Home' ? 'home' : label == 'Program' ? 'calendar' : 'settings'}
                style={{
                  alignSelf: 'center',
                  color: isFocused ? colors.primary : colors.gray2
                }}
                size={20}
              />
              <Text style={{alignSelf: 'center', marginTop: 2, fontWeight: 'bold', color: isFocused ? colors.primary : colors.gray2 }}>
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    padding: sizes.small,
    paddingBottom:  Platform.OS == 'ios' ? sizes.xxLarge : 50,
    backgroundColor: colors.white,
    borderTopLeftRadius: sizes.xxLarge,
    borderTopRightRadius: sizes.xxLarge,
    ...shadows.medium,
    shadowColor: colors.primary
  }
})