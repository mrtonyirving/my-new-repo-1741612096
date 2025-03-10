import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export interface Gift {
  id: string;
  name: string;
  recipient: string;
  price: number;
  targetPrice?: number;
  notes?: string;
  purchased: boolean;
  occasion: string;
  dueDate?: string;
  priceHistory: Array<{
    price: number;
    date: string;
  }>;
}

export interface GiftList {
  id: string;
  name: string;
  occasion: string;
  date: string;
  gifts: Gift[];
}

interface GiftContextType {
  lists: GiftList[];
  addList: (name: string, occasion: string) => Promise<void>;
  addGift: (listId: string, gift: Omit<Gift, 'id' | 'priceHistory'>) => Promise<void>;
  updateGift: (listId: string, gift: Gift) => Promise<void>;
  deleteGift: (listId: string, giftId: string) => Promise<void>;
  updatePrice: (listId: string, giftId: string, newPrice: number) => Promise<void>;
  togglePurchased: (listId: string, giftId: string) => Promise<void>;
}

const GiftContext = createContext<GiftContextType | undefined>(undefined);

export const GiftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lists, setLists] = useState<GiftList[]>([]);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      const storedLists = await AsyncStorage.getItem('giftLists');
      if (storedLists) {
        setLists(JSON.parse(storedLists));
      }
    } catch (error) {
      console.error('Error loading lists:', error);
    }
  };

  const saveLists = async (updatedLists: GiftList[]) => {
    try {
      await AsyncStorage.setItem('giftLists', JSON.stringify(updatedLists));
      setLists(updatedLists);
    } catch (error) {
      console.error('Error saving lists:', error);
    }
  };

  const addList = async (name: string, occasion: string) => {
    const newList: GiftList = {
      id: uuidv4(),
      name,
      occasion,
      date: new Date().toISOString(),
      gifts: [],
    };
    await saveLists([...lists, newList]);
  };

  const addGift = async (listId: string, gift: Omit<Gift, 'id' | 'priceHistory'>) => {
    const newGift: Gift = {
      ...gift,
      id: uuidv4(),
      priceHistory: [{
        price: gift.price,
        date: new Date().toISOString(),
      }],
    };

    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          gifts: [...list.gifts, newGift],
        };
      }
      return list;
    });

    await saveLists(updatedLists);
  };

  const updateGift = async (listId: string, updatedGift: Gift) => {
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          gifts: list.gifts.map(gift => 
            gift.id === updatedGift.id ? updatedGift : gift
          ),
        };
      }
      return list;
    });

    await saveLists(updatedLists);
  };

  const deleteGift = async (listId: string, giftId: string) => {
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          gifts: list.gifts.filter(gift => gift.id !== giftId),
        };
      }
      return list;
    });

    await saveLists(updatedLists);
  };

  const updatePrice = async (listId: string, giftId: string, newPrice: number) => {
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          gifts: list.gifts.map(gift => {
            if (gift.id === giftId) {
              return {
                ...gift,
                price: newPrice,
                priceHistory: [
                  ...gift.priceHistory,
                  { price: newPrice, date: new Date().toISOString() },
                ],
              };
            }
            return gift;
          }),
        };
      }
      return list;
    });

    await saveLists(updatedLists);
  };

  const togglePurchased = async (listId: string, giftId: string) => {
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          gifts: list.gifts.map(gift => {
            if (gift.id === giftId) {
              return {
                ...gift,
                purchased: !gift.purchased,
              };
            }
            return gift;
          }),
        };
      }
      return list;
    });

    await saveLists(updatedLists);
  };

  return (
    <GiftContext.Provider
      value={{
        lists,
        addList,
        addGift,
        updateGift,
        deleteGift,
        updatePrice,
        togglePurchased,
      }}
    >
      {children}
    </GiftContext.Provider>
  );
};

export const useGifts = () => {
  const context = useContext(GiftContext);
  if (context === undefined) {
    throw new Error('useGifts must be used within a GiftProvider');
  }
  return context;
};