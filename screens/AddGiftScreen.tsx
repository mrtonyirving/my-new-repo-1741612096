
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  AddGift: {
    listId: string;
  };
};

type AddGiftScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddGift'>;
type AddGiftScreenRouteProp = RouteProp<RootStackParamList, 'AddGift'>;

interface AddGiftScreenProps {
  route: AddGiftScreenRouteProp;
  navigation: AddGiftScreenNavigationProp;
}

const AddGiftScreen: React.FC<AddGiftScreenProps> = ({ route, navigation }) => {
  const { listId } = route.params;
  const [giftName, setGiftName] = useState('');
  const [recipient, setRecipient] = useState('');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    if (!giftName || !recipient || !price) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    const newGift = {
      id: Date.now().toString(),
      name: giftName,
      recipient,
      price: parseFloat(price),
      notes,
      dateAdded: new Date().toISOString(),
    };

    try {
      const giftLists = await AsyncStorage.getItem('giftLists');
      if (giftLists) {
        const lists = JSON.parse(giftLists);
        const updatedLists = lists.map((list: { id: string; gifts: any[] }) => {
          if (list.id === listId) {
            return {
              ...list,
              gifts: [...list.gifts, newGift],
            };
          }
          return list;
        });
        await AsyncStorage.setItem('giftLists', JSON.stringify(updatedLists));
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error saving gift:', error);
      Alert.alert('Error', 'Unable to save the gift. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Gift Name *</Text>
        <TextInput
          style={styles.input}
          value={giftName}
          onChangeText={setGiftName}
          placeholder="Enter gift name"
        />

        <Text style={styles.label}>Recipient *</Text>
        <TextInput
          style={styles.input}
          value={recipient}
          onChangeText={setRecipient}
          placeholder="Enter recipient name"
        />

        <Text style={styles.label}>Price *</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price"
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add any notes about the gift"
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Gift</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  form: {
    padding: 16,
  },
  label: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: '#212121',
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Inter',
    fontSize: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default AddGiftScreen;
