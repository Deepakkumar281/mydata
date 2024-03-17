import React, { useState, useMemo, useEffect } from 'react';
import { View, FlatList, StyleSheet, Dimensions, ActivityIndicator, Text } from 'react-native';
import { Button, Card, FAB } from 'react-native-paper';
import { useSelector } from '../../redux';
import { useDispatch } from 'react-redux';
import TemplateApi from '../../services/template';
import { ListResponse } from '../../models/common/listResponse';
import TemplateList from '../../components/templates/TemplateList';
import { useRoute } from '@react-navigation/native';
import { setScreenUpdated } from '../../redux/screen/actions';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppStyle from '../../config/styles';
import Checklisttab from './checklisttab';
import Drafttab from './drafttab';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import { Notifier, NotifierComponents } from 'react-native-notifier';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const SCREEN_NAME = 'LIST_TEMPLATES';
const iconNames = Icon.getRawGlyphMap();
const iconData = Object.keys(iconNames).map((name) => ({
  name: name,
  color: 'black',
}));

const Home: React.FC<any> = ({ navigation }) => {
  const user = useSelector(state => state.userReducer);
  const screen = useSelector(state => state.screenReducer);
  const [isLoading, setIsLoading] = useState(true);
  const templateApi = useMemo(() => new TemplateApi(), [user.loggedIn]);
  const [data, setData] = useState<ListResponse<any>>();
  const [userdata, setUserdata] = useState<any[]>([]);
  const [userdata1, setUserdata1] = useState<any[]>([]);
  const dispatch = useDispatch();
  const route = useRoute<any>();
  const addTemplate = () => {
    navigation.navigate('UserApp', {
      screen: 'AddTemplate',
    });
  };
  const datauser = () => {
    templateApi.userdata()
      .then((res: any) => {
        setUserdata(res.data.results);
      })
  }; 
  useEffect(() => {
    if (screen.screenName === SCREEN_NAME) {
      onAdded();
      dispatch(setScreenUpdated(''));
    }
  }, [screen.screenName]);
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected || (state.type === 'cellular' && state.strength && state.strength < 2)) {
        setOffline(true);
        Notifier.showNotification({
          title: 'Offline Mode',
          description: 'Your network connection is weak or offline.',
          Component: NotifierComponents.Alert,
          duration: 2000,
          componentProps: {
            alertType: 'error',
          },
        });
      } else {
        setOffline(false);
        // Hide offline notification if the network is back online
        Notifier.hideNotification();
      }
    });
  
   return () => {
     unsubscribe();
   };
 }, []);
  const onAdded = () => {
    loadTemplates();
  };
  useEffect(() => {
    if (user.loggedIn) {
      loadTemplates();
      datauser();
    }
  }, [user.loggedIn]);
  const loadTemplates = () => {
    setIsLoading(true);
    setData({} as any);
    templateApi
      .templateList()
      .then(res => {
        const templatesWithIcons = res.data.results.map((template: any, index: number) => ({
          ...template,
          icon: iconData[index % iconData.length],
        }));
        setData({ ...res.data, results: templatesWithIcons });
        setIsLoading(false);
      })
      .catch(err => {
        console.log('Loading error');
        console.log(err);
        setIsLoading(false);
      });
  };
  const numColumns = 2;
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth / numColumns) - 10;

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={[styles.itemContainer, { width: itemWidth }]}>
        <TemplateList item={item} user={user} />
      </View>
    );
  };
  useEffect(()=>{
    Userget()
  },[data,userdata])
const Userget=()=>{
  let filtered = Array.isArray(userdata) ? userdata.filter((o: any) => o.user_id === user.user.userid) : [];
  let Userlist=filtered.map((o:any)=>o.ipss_form_id)
  setUserdata1((data?.results?.filter((o: any) => Userlist.includes(o.ipss_form_id))) ?? []);
}
console.log(userdata1,'userdata1')
  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator size="small" color="black" />
        </View>
      ) : (
        <Card>
           <Card.Content>
           {offline && (
      <View>
      <View style={{ backgroundColor: 'red', padding: 10 ,flexDirection:'row',justifyContent:'center'}}>
         
     <MaterialCommunityIcons
                                    name="alert-circle"
                                    size={20}
                                    color="black"
                                  />
        <Text style={{ color: 'white' }}>Offline: Your network is weak or offline</Text>
        </View>
       
      </View>
    )}
               <FlatList
               refreshing={isLoading}
                 onRefresh={loadTemplates}
                 data={userdata1}
                 renderItem={renderItem}
                 keyExtractor={item => String(item.ipss_form_id)}
                 numColumns={numColumns}
               />
             </Card.Content>
        </Card>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.color.COLOR_BG,
  },
  fab: {
    backgroundColor: AppStyle.color.PRIMARY_BUTTON_COLOR,
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  customCard: {
    // margin: 10,
    // padding: 10,
    // borderRadius: 10, // Optional: Add rounded corners
    // shadowOffset: {width: 2, height: 4},
    // shadowColor: '#171717',
    // shadowOpacity: 0.2,
    // shadowRadius: 3,
    // elevation: 5,
    backgroundColor: AppStyle.color.COLOR_BG, // Optional: Set background color
  },
//   card: {
//     margin: 10,
//     padding:5,
//     textAlign:'center',
//     justifyContent:'center',
//     alignItems:'center',
//     minWidth:'40%',
//     textAlignVertical: 'center',
//     backgroundColor:'black',
//     border: '1px solid #77aaff', 
//     shadowOffset: {width: -2, height: 4},  
//     shadowColor: '#171717',  
//     shadowOpacity: 0.2,  
//     shadowRadius: 3,   
//     elevation: 20,   
// },
cardTitle: {
    marginBottom: 0, 
    fontSize:16     
},
cardActions: {
    marginTop: 0

},
carddesc:{
  fontSize:6    
},
flatListContent: {
  flexGrow: 1,
},
templateListContainer: {
  flex: 1, // Set the desired width for each item (e.g., 50% for two columns)
  paddingHorizontal: 10,
  marginBottom: 10,
},
gridContainer: {
  justifyContent: 'space-between',
  paddingHorizontal: 10,
  paddingVertical: 10,
},
activityIndicatorContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
itemContainer: {
  paddingHorizontal: 8,
  marginBottom: 10,
},
});

export default Home;

