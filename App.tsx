import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';

import HomeScreen from './screens/HomeScreen';
import GiftListScreen from './screens/GiftListScreen';
import AddGiftScreen from './screens/AddGiftScreen';
import GiftDetailScreen from './screens/GiftDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter': require('./assets/fonts/SF-Pro.ttf'),
    'PlayfairDisplay': require('./assets/fonts/NewYork.ttf'),
    'RobotoMono': require('./assets/fonts/SF-Mono-Regular.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#212121',
          headerTitleStyle: {
            fontFamily: 'PlayfairDisplay',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Gift Planner' }}
        />
        <Stack.Screen 
          name="GiftList" 
          component={GiftListScreen}
          options={({ route }) => ({ title: route.params?.listName || 'Gift List' })}
        />
        <Stack.Screen 
          name="AddGift" 
          component={AddGiftScreen}
          options={{ title: 'Add New Gift' }}
        />
        <Stack.Screen 
          name="GiftDetail" 
          component={GiftDetailScreen}
          options={{ title: 'Gift Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}