import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Todo {
  id: number;
  text: string;
}

interface Props {
  todo: Todo;
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
}

export const SingleTodo = (props: Props) => {
  const { todo, todos, setTodos } = props;
  const [edit, setEdit] = useState(false);
  const [toggleEditButton, setToggleEditButton] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  /**
   * Updates local storage whenever any TODO(s)
   * is / are updated
   */
  useEffect(() => {
    AsyncStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  /**
   * Edits TODO's and stores them in the local storage
   */
  const handleEdit = () => {
    if (edit === false) {
      setEdit(previousState => !previousState);
      setToggleEditButton(previousState => !previousState);
    } else {
      setEdit(previousState => !previousState);
      setToggleEditButton(previousState => !previousState);
      setTodos(
        todos.map(item =>
          item.id === todo.id
            ? {
                id: item.id,
                text: editText,
              }
            : item
        )
      );
    }
    /**
     * Updates storage with the latest edited TODO
     */
    AsyncStorage.setItem('todos', JSON.stringify(todos));
  };

  /**
   * Deletes TODOs
   */
  const handleDelete = (id: number) => {
    setTodos(todos.filter(item => item.id !== id));
  };

  return (
    <View style={styles.todo}>
      {edit === false ? (
        <Text style={styles.todoText}>{todo.text}</Text>
      ) : (
        <TextInput
          style={styles.todoinput}
          value={editText}
          onChangeText={text => setEditText(text)}
        />
      )}
      {toggleEditButton === false ? (
        <TouchableOpacity activeOpacity={0.5}>
          <Feather name="edit" size={25} color="black" style={styles.button} onPress={handleEdit} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity activeOpacity={0.5}>
          <Feather
            name="check"
            size={30}
            color="black"
            style={styles.button}
            onPress={handleEdit}
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity activeOpacity={0.5}>
        <MaterialIcons
          name="delete"
          size={25}
          color="black"
          style={styles.button}
          onPress={() => handleDelete(todo.id)}
        />
      </TouchableOpacity>
    </View>
  );
};

/**
 * Styles for TODO component
 */
const styles = StyleSheet.create({
  todo: {
    flexDirection: 'row',
    marginHorizontal: 10,
    elevation: 5,
    shadowColor: '#1F2022',
    backgroundColor: '#E0FFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 50,
  },
  todoText: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  todoinput: {
    flex: 1,
    fontSize: 18,
    paddingHorizontal: 5,
    borderRadius: 5,
    borderColor: 'grey',
    borderWidth: 1,
  },
  button: {
    marginLeft: 15,
  },
});
