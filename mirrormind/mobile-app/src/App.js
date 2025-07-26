import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [text, setText] = useState('');
  const [reflection, setReflection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@session_history');
      if (jsonValue != null) {
        setHistory(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Failed to load history.', e);
    }
  };

  const saveReflection = async newReflection => {
    try {
      const newHistory = [...history, newReflection];
      setHistory(newHistory);
      const jsonValue = JSON.stringify(newHistory);
      await AsyncStorage.setItem('@session_history', jsonValue);
    } catch (e) {
      console.error('Failed to save reflection.', e);
    }
  };

  const handlePress = async () => {
    setIsLoading(true);
    setReflection(null);
    try {
      const res = await fetch(`http://localhost:8080/reflect?text=${text}`);
      const data = await res.json();
      setReflection(data);
      if (!data.error) {
        saveReflection(data);
      }
    } catch (error) {
      console.error(error);
      setReflection({error: 'Error fetching data'});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>MirrorMind</Text>
        <TextInput
          style={styles.input}
          onChangeText={setText}
          value={text}
          placeholder="How are you feeling?"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handlePress}
          disabled={isLoading}>
          <Text style={styles.buttonText}>
            {isLoading ? 'Reflecting...' : 'Reflect'}
          </Text>
        </TouchableOpacity>
        {reflection && (
          <View style={styles.reflectionContainer}>
            {reflection.error ? (
              <Text style={styles.errorText}>{reflection.error}</Text>
            ) : (
              <>
                <Image
                  style={styles.image}
                  source={{uri: reflection.image_url}}
                />
                <Text style={styles.reflectionText}>
                  {reflection.reflection}
                </Text>
                <Text style={styles.emotionText}>
                  Detected Emotions: {JSON.stringify(reflection.emotion)}
                </Text>
              </>
            )}
          </View>
        )}
        <Text style={styles.historyTitle}>History</Text>
        <FlatList
          data={history}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.historyItem}>
              <Text>{item.reflection}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  reflectionContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  image: {
    width: 256,
    height: 256,
    marginBottom: 20,
  },
  reflectionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  emotionText: {
    fontSize: 14,
    color: 'gray',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  historyItem: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
});

export default App;
