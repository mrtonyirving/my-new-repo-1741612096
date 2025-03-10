import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useGifts } from '../context/GiftContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { lists, addList } = useGifts();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [occasion, setOccasion] = useState('');

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }

    await addList(newListName, occasion);
    setIsModalVisible(false);
    setNewListName('');
    setOccasion('');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const calculateTotalBudget = (gifts) => {
    return gifts.reduce((sum, gift) => sum + (gift.price || 0), 0);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.listContainer}>
        {lists.map((list) => (
          <TouchableOpacity
            key={list.id}
            style={styles.listCard}
            onPress={() => navigation.navigate('GiftList', { listId: list.id })}
          >
            <View style={styles.listHeader}>
              <Text style={styles.listName}>{list.name}</Text>
              <Text style={styles.occasion}>{list.occasion}</Text>
            </View>
            <View style={styles.listStats}>
              <Text style={styles.budget}>
                ${calculateTotalBudget(list.gifts).toFixed(2)}
              </Text>
              <Text style={styles.giftCount}>
                {list.gifts.length} gifts
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsModalVisible(true)}
      >
        <MaterialIcons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Gift List</Text>
            <TextInput
              style={styles.input}
              placeholder="List Name"
              value={newListName}
              onChangeText={setNewListName}
            />
            <TextInput
              style={styles.input}
              placeholder="Occasion (e.g., Christmas, Birthday)"
              value={occasion}
              onChangeText={setOccasion}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.createButton]}
                onPress={handleCreateList}
              >
                <Text style={[styles.buttonText, styles.createButtonText]}>
                  Create
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listHeader: {
    marginBottom: 8,
  },
  listName: {
    fontFamily: 'NewYork',
    fontSize: 20,
    color: '#212121',
    marginBottom: 4,
  },
  occasion: {
    fontFamily: 'SF-Pro',
    fontSize: 14,
    color: '#757575',
  },
  listStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budget: {
    fontFamily: 'SF-Mono',
    fontSize: 16,
    color: '#2E7D32',
  },
  giftCount: {
    fontFamily: 'SF-Pro',
    fontSize: 14,
    color: '#757575',
  },
  fab: {
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontFamily: 'NewYork',
    fontSize: 20,
    color: '#212121',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    fontFamily: 'SF-Pro',
    fontSize: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  createButton: {
    backgroundColor: '#2E7D32',
  },
  buttonText: {
    fontFamily: 'SF-Pro',
    fontSize: 16,
    textAlign: 'center',
    color: '#212121',
  },
  createButtonText: {
    color: '#FFFFFF',
  },
});

export default HomeScreen;