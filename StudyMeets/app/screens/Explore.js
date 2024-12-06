import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ExploreGroups from './ExploreGroups';
import ExploreUsers from './ExploreUsers';
import { SafeAreaView } from 'react-native-safe-area-context';
import GroupCard from './GroupCard';
import { PlusCircle } from 'lucide-react-native';
import PeopleList from './PeopleList'

const Explore = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [isPeopleModalVisible, setPeopleModalVisible] = useState(false);
  const [members, setMembers] = useState([]);
  const [owner, setOwner] = useState(null); 
  const navigation = useNavigation();

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  useEffect(() => {
    const fetchJoinedGroups = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userGroupsQuery = query(collection(firestore, 'userGroups'), orderBy('postId'));
  
        const unsubscribe = onSnapshot(userGroupsQuery, (snapshot) => {
          const groups = snapshot.docs
            .filter(doc => doc.data().userId === currentUser.uid)
            .map(doc => doc.data().postId);
          setJoinedGroups(groups);
        });
  
        return unsubscribe;
      }
    };
  
    const unsubscribe = fetchJoinedGroups();
    return () => unsubscribe();
  }, []);

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

  const handlePeopleClick = async (postId) => {
    try {
      const groupDoc = await getDoc(doc(firestore, 'studymeets', postId));
      if (!groupDoc.exists()) {
        throw new Error('Group not found.');
      }
  
      const { OwnerEmail } = groupDoc.data();
    
      const ownerQuery = query(
        collection(firestore, 'users'),
        where('email', '==', OwnerEmail)
      );
      const ownerSnapshot = await getDocs(ownerQuery);
  
      if (ownerSnapshot.empty) {
        throw new Error('Owner not found.');
      }

      const ownerDoc = ownerSnapshot.docs[0];
      const ownerData = { id: ownerDoc.id, ...ownerDoc.data() };
  
      const userGroupsQuery = query(
        collection(firestore, 'userGroups'),
        where('postId', '==', postId)
      );
      const userGroupsSnapshot = await getDocs(userGroupsQuery);
      const userIds = userGroupsSnapshot.docs.map((doc) => doc.data().userId);

      if (userIds.length === 0) {
        setMembers([]);
        setOwner(ownerData);
        setPeopleModalVisible(true);
        return;
      }

      const usersQuery = query(
        collection(firestore, 'users'),
        where('__name__', 'in', userIds)
      );
      const usersSnapshot = await getDocs(usersQuery);
  
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      setMembers(usersData);
      setOwner(ownerData);
      setPeopleModalVisible(true);
    } catch (error) {
      console.error('Error fetching people:', error);
      Alert.alert('Error', 'Failed to fetch group members.');
    }
  };

  const handleJoinGroup = async (postId) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        // Check if user can join before attempting to join
        const result = await canUserJoinGroup(currentUser.uid, postId);
        
        if (!result.canJoin) {
          Alert.alert(
            'Cannot Join Group',
            result.reason,
            [{ text: 'OK' }]
          );
          return;
        }
  
        // If they can join, proceed with joining
        await addDoc(collection(firestore, 'userGroups'), {
          userId: currentUser.uid,
          postId: postId,
        });
        Alert.alert('Success', 'You have successfully joined the group.');
      } catch (error) {
        console.error('Error joining group:', error);
        Alert.alert('Error', 'Failed to join the group.');
      }
    }
  };

  const handleLeaveGroup = async (postId) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const userGroupQuery = query(
          collection(firestore, 'userGroups'),
          where('userId', '==', currentUser.uid),
          where('postId', '==', postId)
        );
  
        const querySnapshot = await getDocs(userGroupQuery);
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
  
        Alert.alert('Left', 'You have successfully left the group.');
      } catch (error) {
        console.error('Error leaving group:', error);
        Alert.alert('Error', 'Failed to leave the group.');
      }
    }
  };

  const handleDeleteGroup = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'studymeets', id));
      Alert.alert('Deleted', 'The post has been deleted successfully.');
    } catch (error) {
      console.error('Error deleting document:', error);
      Alert.alert('Error', 'Failed to delete the post.');
    }
  };

  const filteredPosts = posts.filter(post =>
    post.Title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        lazy={true}
        screenOptions={{
          tabBarActiveTintColor: '#000',
          tabBarIndicatorStyle: { backgroundColor: '#000' },
          tabBarLabelStyle: { fontSize: 16 },
          tabBarStyle: { backgroundColor: '#f5f5f5' },
        }}
      >
        <Tab.Screen name="Study Groups" component={ExploreGroups} />
        <Tab.Screen name="All Users" component={ExploreUsers} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default Explore;