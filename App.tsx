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
    'SF-Pro': require('./assets/fonts/SF-Pro.ttf'),
    'NewYork': require('./assets/fonts/NewYork.ttf'),
    'SF-Mono': require('./assets/fonts/SF-Mono-Regular.otf'),
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
          headerTintColor: '#2E7D32',
          headerTitleStyle: {
            fontFamily: 'NewYork',
            fontSize: 20,
          },
          contentStyle: {
            backgroundColor: '#FFFFFF',
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