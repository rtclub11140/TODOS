import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  FlatList,
  Linking,
} from 'react-native';
import { useEffect, useState } from 'react';
import { SingleTodo } from './components/SingleTodo';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Todo {
  id: number;
  text: string;
}

const App = () => {
  const [todo, setTodo] = useState<string>();
  const [todos, setTodos] = useState<Todo[]>();

  const fetchTodos = async () => {
    const data = await AsyncStorage.getItem('todos');

    /**
     * Updates TODO's if only data exist in the lcoal storage
     */
    if (data) {
      setTodos(JSON.parse(data));
    }
  };

  /**
   * Fetches all TODOs from local storage
   * when the component is loaded
   */
  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = () => {
    /**
     * Avoids blank TODOs by
     * checking whether the input
     * is empty or not
     */
    if (todo === '') {
      return;
    } else if (todo !== undefined) {
      /**
       * Since we can't use the spread syntax (...)
       * with undefined values, we can provide a
       * fallback of an empty array.
       */
      setTodos([...(todos || []), { id: Date.now(), text: todo }]);
    }

    /**
     * Resets current todo to blank
     * Alse resets input field to blank
     */
    setTodo('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Todos App</Text>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={text => setTodo(text)}
          value={todo}
          placeholder="Enter a TODO"
          style={styles.input}
        />
        <TouchableOpacity activeOpacity={0.5} onPress={handleAddTodo}>
          <Text style={styles.button}>Add</Text>
        </TouchableOpacity>
      </View>
      {todos !== undefined && (
        <View style={styles.list}>
          <FlatList
            data={todos}
            renderItem={({ item }) => <SingleTodo todo={item} todos={todos} setTodos={setTodos} />}
            keyExtractor={item => item.id.toString()}
          />
        </View>
      )}
      <View>
        <Text style={styles.footer}>
          Made with ❤ by
          <Text
            onPress={() => Linking.openURL('https://github.com/AyanavaKarmakar')}
            style={{ color: 'cyan' }}
          >
            {' '}
            Ayanava Karmakar
          </Text>
        </Text>
      </View>
      <StatusBar />
    </View>
  );
};

/**
 * Styles for App
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1F2022',
  },
  heading: {
    marginVertical: 20,
    fontSize: 50,
    fontWeight: '500',
    color: '#E0FFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    shadow: '#1F2022',
    backgroundColor: '#E0FFFF',
    elevation: 10,
    marginRight: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
  },
  button: {
    padding: 13,
    backgroundColor: '#E0FFFF',
    borderRadius: 50,
    elevation: 10,
  },
  list: {
    width: '100%',
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    color: '#E0FFFF',
  },
});

export default App;
