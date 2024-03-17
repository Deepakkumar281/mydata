import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  FlatList
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Button, FAB } from 'react-native-paper';
import { useSelector } from '../../redux';
import { useDispatch } from 'react-redux';
import WorkOrderApi from '../../services/workOrder';

import styles from './styles';
import { setCurrentUser } from '../../redux/user/actions';
import NavigationService from '../../navigation/NavigationService';
import TemplateApi from '../../services/template';
import { ListResponse } from '../../models/common/listResponse';
import TemplateList from '../../components/templates/TemplateList';
import { useRoute } from '@react-navigation/native';
import { setScreenUpdated } from '../../redux/screen/actions';
 
const SCREEN_NAME = "LIST_TEMPLATES"

const Templates: React.FC<any> = ({ navigation }) => {
  const user = useSelector(state => state.userReducer)
  const screen = useSelector(state => state.screenReducer)
  const [isLoading, setIsLoading] = useState(true);
  const templateApi = useMemo(() => new TemplateApi(), [user.loggedIn])
  const [data, setData] = useState<ListResponse<any>>()
  const dispatch = useDispatch()
  const route = useRoute<any>()


  const addTemplate = () => {
    NavigationService.navigate("UserApp", {
      screen: "AddTemplate"
    })
  }

  useEffect(() => {
    if (screen.screenName === SCREEN_NAME) {
      onAdded()
      dispatch(setScreenUpdated(""))
    }
  }, [screen.screenName])

  const onAdded = () => {
    loadTemplates()
  }

  useEffect(() => {
    if (user.loggedIn)
      loadTemplates()
  }, [user.loggedIn])

  const loadTemplates = () => {
    console.log("Loading started")
    setIsLoading(true)
    setData({} as any)
    templateApi.userdata().then(res => {
   //   console.log('Balakrishnan template test',res)
      console.log("Loading end")
      setData(res.data) 
      setIsLoading(false)
    }).catch(err => {
      console.log("Loading error")
      console.log(err)
      setIsLoading(false)
    })
  } 

  return (
    <>
      <View style={styles.container}>
          <FlatList
            refreshing={isLoading}
            onRefresh={() => {
              loadTemplates()
            }}
            data={data?.results}
            renderItem={({item}) => {
              return (<TemplateList item={item} user={user} />)
            }}
            keyExtractor={(item) => ""+item.ipss_form_id}
            />
          {(user.user.username === "supervisor") &&
          <FAB
            icon="plus"
            style={styles.fab}
            onPress={addTemplate}
          />
          }

      </View>
    </>
  );
};

export default Templates;