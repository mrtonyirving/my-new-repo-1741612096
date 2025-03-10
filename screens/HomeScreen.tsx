
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  GiftList: { listId: string; listName: string };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [giftLists, setGiftLists] = useState([]);
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    loadGiftLists();
  }, []);

  const loadGiftLists = async () => {
    try {
      const lists = await AsyncStorage.getItem('giftLists');
      if (lists) {
        setGiftLists(JSON.parse(lists));
      }
    } catch (error) {
      console.error('Error loading gift lists:', error);
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const createNewList = async () => {
    const newList = {
      id: Date.now().toString(),
      name: 'New Gift List',
      date: new Date().toISOString(),
      gifts: [],
    };

    const updatedLists = [...giftLists, newList];
    setGiftLists(updatedLists);
    await AsyncStorage.setItem('giftLists', JSON.stringify(updatedLists));
    navigation.navigate('GiftList', { listId: newList.id, listName: newList.name });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.listContainer}>
        <Text style={styles.title}>Your Gift Lists</Text>
        {giftLists.map((list) => (
          <TouchableOpacity
            key={list.id}
            style={styles.listCard}
            onPress={() => navigation.navigate('GiftList', { 
              listId: list.id,
              listName: list.name
            })}
          >
            <View style={styles.listInfo}>
              <Text style={styles.listName}>{list.name}</Text>
              <Text style={styles.listDate}>
                {new Date(list.date).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.giftCount}>
              {list.gifts.length} gifts
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={createNewList}
        style={styles.fab}
      >
        <Animated.View style={[styles.fabContent, { transform: [{ scale: scaleAnim }] }]}>
          <MaterialIcons name="add" size={24} color="#FFFFFF" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontFamily: 'PlayfairDisplay',
    fontSize: 24,
    color: '#212121',
    padding: 20,
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontFamily: 'Inter',
    fontSize: 18,
    color: '#212121',
    marginBottom: 4,
  },
  listDate: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#757575',
  },
  giftCount: {
    fontFamily: 'RobotoMono',
    fontSize: 14,
    color: '#2E7D32',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    borderRadius: 28,
    backgroundColor: '#2E7D32',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabContent: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
