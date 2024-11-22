import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import { View, FlatList, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firestore, auth } from '../../firebase';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import CreateNewPost from './CreateNewPost';
import { TextInput as PaperTextInput, IconButton } from 'react-native-paper';
import { ThemeContext } from '../../theme/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import GroupCard from './GroupCard';
import { PlusCircle } from 'lucide-react-native';

const Explore = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const { theme, isDarkTheme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchPosts = () => {
      const postsQuery = query(collection(firestore, 'studymeets'), orderBy('CreatedAt', 'desc'));

      const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchPosts();
    return () => unsubscribe();
  }, []);

  const handleJoinGroup = async (postId) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        await addDoc(collection(firestore, 'userGroups'), {
          userId: currentUser.uid,
          postId: postId,
        });
        Alert.alert('Joined', 'You have successfully joined the group.');
      } catch (error) {
        console.error('Error joining group:', error);
        Alert.alert('Error', 'Failed to join the group.');
      }
    }
  };

  const filteredPosts = posts.filter(post =>
    post.Title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, padding: 10, backgroundColor: theme.colors.background }}>
      <PaperTextInput
        mode="outlined"
        placeholder="Search study groups..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />
      <FlatList
        data={filteredPosts}
        renderItem={({ item }) => (
          <GroupCard
            item={item}
            onPrimaryAction={handleJoinGroup}
            primaryActionLabel="Join"
          />
        )}
        keyExtractor={(item) => item.id}
      />
      <CreateNewPost visible={isModalVisible} onClose={closeModal} />
      <TouchableOpacity onPress={openModal} style={styles.floatingButton}>
        <View style={styles.circleBackground}>
          <PlusCircle size={40} color="white" />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    margin: 10,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,        
    left: 20,        
    zIndex: 10,        
  },
  circleBackground: {
    width: 50,         
    height: 50,        
    borderRadius: 25,   
    backgroundColor: '#6495ed', 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,       
  },
});

export default Explore;
