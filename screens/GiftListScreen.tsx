
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  GiftDetail: { gift: Gift; listId: string };
  AddGift: { listId: string };
};

type Gift = {
  id: string;
  name: string;
  recipient: string;
  price: string;
};

interface GiftListScreenProps {
  route: RouteProp<{ params: { listId: string } }, 'params'>;
  navigation: StackNavigationProp<RootStackParamList>;
}

const GiftListScreen: React.FC<GiftListScreenProps> = ({ route, navigation }) => {
  const { listId } = route.params;
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [totalBudget, setTotalBudget] = useState(0);

  useEffect(() => {
    const loadGifts = async () => {
      try {
        const giftLists = await AsyncStorage.getItem('giftLists');
        if (giftLists) {
          const lists = JSON.parse(giftLists);
          const currentList = lists.find(list => list.id === listId);
          if (currentList) {
            setGifts(currentList.gifts);
            calculateTotalBudget(currentList.gifts);
          }
        }
      } catch (error) {
        console.error('Error loading gifts:', error);
      }
    };

    loadGifts();
  }, [listId]);

  const calculateTotalBudget = (giftsList: Gift[]) => {
    const total = giftsList.reduce((sum, gift) => sum + Number(gift.price), 0);
    setTotalBudget(total);
  };

  const handleDeleteGift = (giftId: string) => {
    Alert.alert(
      'Delete Gift',
      'Are you sure you want to delete this gift?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedGifts = gifts.filter(gift => gift.id !== giftId);
            setGifts(updatedGifts);
            calculateTotalBudget(updatedGifts);
            
            try {
              const giftLists = await AsyncStorage.getItem('giftLists');
              if (giftLists) {
                const lists = JSON.parse(giftLists);
                const updatedLists = lists.map(list => {
                  if (list.id === listId) {
                    return { ...list, gifts: updatedGifts };
                  }
                  return list;
                });
                await AsyncStorage.setItem('giftLists', JSON.stringify(updatedLists));
              }
            } catch (error) {
              console.error('Error deleting gift:', error);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.budgetText}>
          Total Budget: ${totalBudget.toFixed(2)}
        </Text>
      </View>

      <ScrollView style={styles.giftList}>
        {gifts.map((gift) => (
          <TouchableOpacity
            key={gift.id}
            style={styles.giftCard}
            onPress={() => navigation.navigate('GiftDetail', { gift, listId })}
          >
            <View style={styles.giftInfo}>
              <Text style={styles.giftName}>{gift.name}</Text>
              <Text style={styles.giftRecipient}>For: {gift.recipient}</Text>
            </View>
            <View style={styles.giftPrice}>
              <Text style={styles.priceText}>${gift.price}</Text>
              <TouchableOpacity
                onPress={() => handleDeleteGift(gift.id)}
                style={styles.deleteButton}
              >
                <MaterialIcons name="delete-outline" size={24} color="#FF4081" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddGift', { listId })}
      >
        <MaterialIcons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  budgetText: {
    fontFamily: 'SF-Mono',
    fontSize: 20,
    color: '#2E7D32',
    textAlign: 'center',
  },
  giftList: {
    flex: 1,
    padding: 16,
  },
  giftCard: {
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
  giftInfo: {
    flex: 1,
  },
  giftName: {
    fontFamily: 'SF-Pro',
    fontSize: 18,
    color: '#212121',
    marginBottom: 4,
  },
  giftRecipient: {
    fontFamily: 'SF-Pro',
    fontSize: 14,
    color: '#757575',
  },
  giftPrice: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontFamily: 'SF-Mono',
    fontSize: 16,
    color: '#2E7D32',
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default GiftListScreen;
