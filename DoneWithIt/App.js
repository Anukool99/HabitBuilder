import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ScrollView } from 'react-native';
import { Button, Card, IconButton, TextInput as PaperInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const App = () => {
  const [habits, setHabits] = useState([]);
  const [habitName, setHabitName] = useState('');

  useEffect(() => {
    loadHabits();
  }, []);

  useEffect(() => {
    saveHabits();
  }, [habits]);

  const loadHabits = async () => {
    try {
      const storedHabits = await AsyncStorage.getItem('habits');
      if (storedHabits) {
        setHabits(JSON.parse(storedHabits));
      }
    } catch (error) {
      console.error('Failed to load habits:', error);
    }
  };

  const saveHabits = async () => {
    try {
      await AsyncStorage.setItem('habits', JSON.stringify(habits));
    } catch (error) {
      console.error('Failed to save habits:', error);
    }
  };

  const addHabit = () => {
    if (habitName.trim()) {
      const newHabit = { id: Date.now().toString(), name: habitName, completed: false };
      setHabits([...habits, newHabit]);
      setHabitName('');
      scheduleReminder(newHabit.name);
    }
  };

  const scheduleReminder = async (habitName) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Habit Reminder',
        body: `Don't forget to work on your habit: ${habitName}!`,
      },
      trigger: { seconds: 100 },
    });
  };

  const toggleHabitCompletion = (id) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const streakCount = habits.filter(habit => habit.completed).length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('./assets/Green-leaves-logo-1.png')} style={styles.headerImage} />
        <Text style={styles.greeting}>Hi, let's build some awesome habits today!</Text>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Your Habit Tracker</Text>
      </View>
      
      <PaperInput
        style={styles.input}
        placeholder="What's your new habit?"
        value={habitName}
        onChangeText={setHabitName}
        mode="outlined"
      />
      
      <Button mode="contained" onPress={addHabit} style={styles.addButton}>
        Add New Habit
      </Button>

      <Text style={styles.streakText}>
        {streakCount > 0 ? `🎉 Congrats! You've completed ${streakCount} habit(s)!` : 'Start building your streak today!'}
      </Text>

      <FlatList dt
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.habitCard}>
            <Card.Title
              title={item.name}
              titleStyle={item.completed ? styles.completedHabit : styles.habitText}
              right={() => (
                <View style={styles.actionButtons}>
                  <IconButton
                    icon={item.completed ? 'undo' : 'check'}
                    color={item.completed ? '#FF8C00' : '#4CAF50'}
                    onPress={() => toggleHabitCompletion(item.id)}
                    style={styles.icon}
                  />
                  <IconButton
                    icon="delete"
                    color="#F44336"
                    onPress={() => deleteHabit(item.id)}
                    style={styles.icon}
                  />
                </View>
              )}
            />
          </Card>
        )}
        nestedScrollEnabled={true}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3ffdf',
    paddingBottom:30
  },

  titleContainer:{
    alignItems:'center'
  },
  header: {
    marginTop: 80,
    marginBottom: 20,
    alignItems: 'center'
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A4A4A',
    textAlign: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
  },
  addButton: {
    marginBottom: 25,
    backgroundColor: '#62dfbE',
    borderRadius: 10,
  },
  streakText: {
    fontSize: 18,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center',
  },
  habitCard: {
    marginBottom: 15,
    borderRadius: 12,
    elevation: 5,
    backgroundColor: '#ffffff',
  },
  habitText: {
    fontSize: 18,
    color: '#333',
  },
  completedHabit: {
    textDecorationLine: 'line-through',
    color: '#B0B0B0',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
   alignItems:'center',
    resizeMode: 'cover', // You can also use 'contain' or 'stretch'
  },
  icon: {
    marginHorizontal: 10,
  },
});

export default App;
