import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-black justify-center items-center">
      
      <Animated.Text 
        entering={FadeInDown.duration(800)}
        className="text-orange-500 text-3xl font-bold"
      >
        Caleb Uni App
      </Animated.Text>

      <Animated.Text 
        entering={FadeInDown.delay(300).duration(800)}
        className="text-white mt-4 text-lg"
      >
        Built for Students. Powered by Innovation.
      </Animated.Text>

    </View>
  );
}