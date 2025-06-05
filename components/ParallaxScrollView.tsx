import React, { ReactElement } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, RefreshControlProps, useWindowDimensions, useColorScheme } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  SharedValue,
} from 'react-native-reanimated';
import { PropsWithChildren } from 'react';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
  refreshControl?: ReactElement<RefreshControlProps>;
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
  refreshControl,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const { width: windowWidth } = useWindowDimensions();
  const scrollY = useSharedValue(0);

  // Handle scroll events
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Animate the header based on scroll position
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [HEADER_HEIGHT / 2, 0, -HEADER_HEIGHT / 3],
            'clamp'
          ),
        },
      ],
      opacity: interpolate(
        scrollY.value,
        [0, HEADER_HEIGHT / 2],
        [1, 0.3],
        'clamp'
      ),
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          { backgroundColor: headerBackgroundColor[colorScheme] },
          headerAnimatedStyle,
        ]}>
        {headerImage}
      </Animated.View>
      <Animated.ScrollView
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingTop: HEADER_HEIGHT },
        ]}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        refreshControl={refreshControl}
      >
        <View style={styles.content}>{children}</View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    overflow: 'hidden',
    zIndex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
  },
  content: {
    paddingTop: 16,
    paddingBottom: 32,
  },
});