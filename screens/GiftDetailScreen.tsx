
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Gift {
  id: string;
  name: string;
  recipient: string;
  price: number;
  notes?: string;
}

interface PriceHistoryEntry {
  price: number;
  date: string;
}

type RootStackParamList = {
  GiftDetail: {
    gift: Gift;
    listId: string;
  };
};

type GiftDetailScreenProps = {
  route: RouteProp<RootStackParamList, 'GiftDetail'>;
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const GiftDetailScreen: React.FC<GiftDetailScreenProps> = ({ route, navigation }) => {
  const { gift, listId } = route.params;
  const [priceHistory, setPriceHistory] = useState<PriceHistoryEntry[]>([]);

  const loadPriceHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(`priceHistory-${gift.id}`);
      if (history) {
        setPriceHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading price history:', error);
    }
  };

  useEffect(() => {
    loadPriceHistory();
  }, [loadPriceHistory]);

  const handlePriceUpdate = async (newPrice: number) => {
    const updatedHistory = [
      ...priceHistory,
      {
        price: newPrice,
        date: new Date().toISOString(),
      },
    ];

    try {
      await AsyncStorage.setItem(
        `priceHistory-${gift.id}`,
        JSON.stringify(updatedHistory)
      );
      setPriceHistory(updatedHistory);

      const giftLists = await AsyncStorage.getItem('giftLists');
      if (giftLists) {
        const lists = JSON.parse(giftLists);
        const updatedLists = lists.map((list: any) => {
          if (list.id === listId) {
            const updatedGifts = list.gifts.map((g: Gift) => {
              if (g.id === gift.id) {
                return { ...g, price: newPrice };
              }
              return g;
            });
            return { ...list, gifts: updatedGifts };
          }
          return list;
        });
        await AsyncStorage.setItem('giftLists', JSON.stringify(updatedLists));
      }
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.giftName}>{gift.name}</Text>
        <Text style={styles.recipient}>For: {gift.recipient}</Text>
      </View>

      <View style={styles.priceSection}>
        <Text style={styles.sectionTitle}>Current Price</Text>
        <Text style={styles.price}>${gift.price}</Text>
        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => {
            Alert.prompt(
              'Update Price',
              'Enter the new price:',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Update',
                  onPress: (newPrice) => {
                    if (newPrice && !isNaN(parseFloat(newPrice))) {
                      handlePriceUpdate(parseFloat(newPrice));
                    }
                  },
                },
              ],
              'plain-text',
              gift.price.toString()
            );
          }}
        >
          <MaterialIcons name="edit" size={20} color="#FFFFFF" />
          <Text style={styles.updateButtonText}>Update Price</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Price History</Text>
        {priceHistory.map((entry, index) => (
          <View key={index} style={styles.historyEntry}>
            <Text style={styles.historyPrice}>${entry.price}</Text>
            <Text style={styles.historyDate}>
              {new Date(entry.date).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.notesSection}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <Text style={styles.notes}>{gift.notes || 'No notes added'}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    backgroundColor: '#2E7D32',
  },
  giftName: {
    fontFamily: 'PlayfairDisplay',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  recipient: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  priceSection: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontFamily: 'Inter',
    fontSize: 18,
    color: '#212121',
    marginBottom: 12,
  },
  price: {
    fontFamily: 'RobotoMono',
    fontSize: 32,
    color: '#2E7D32',
    marginBottom: 16,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    padding: 12,
  },
  updateButtonText: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  historySection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  historyEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  historyPrice: {
    fontFamily: 'RobotoMono',
    fontSize: 16,
    color: '#212121',
  },
  historyDate: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#757575',
  },
  notesSection: {
    padding: 20,
  },
  notes: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: '#212121',
    lineHeight: 24,
  },
});

export default GiftDetailScreen;
