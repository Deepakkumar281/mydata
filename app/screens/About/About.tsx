import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  FlatList
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Avatar, Button, Card, FAB, Text } from 'react-native-paper';
import { useSelector } from '../../redux';
import { useDispatch } from 'react-redux';
import WorkOrderApi from '../../services/workOrder';
import SubmitGreenButton from '../../components/SubmitGreenButton';
import styles from './styles';
import { setCurrentUser } from '../../redux/user/actions';
import NavigationService from '../../navigation/NavigationService';
import TemplateApi from '../../services/template';
import { ListResponse } from '../../models/common/listResponse';
import TemplateList from '../../components/templates/TemplateList';
import { useRoute } from '@react-navigation/native';
import { setScreenUpdated } from '../../redux/screen/actions';
import Loader from '../../components/Loader';

const SCREEN_NAME = "LIST_TEMPLATES"

const AboutDetails: React.FC<any> = ({ navigation }) => {
  const user = useSelector(state => state.userReducer)
  const screen = useSelector(state => state.screenReducer)
  const [isLoading, setIsLoading] = useState(false);
  const templateApi = useMemo(() => new TemplateApi(), [user.loggedIn])
  const [data, setData] = useState([] as any)
  const dispatch = useDispatch()
  const route = useRoute<any>()
  const addTemplate = () => {
    NavigationService.navigate("UserApp", {
      screen: "AddTemplate"
    })
  }

   return (
    <>
      {isLoading ? <Loader />
        :
        <View style={styles.container}>
  <Card style={{ marginTop: 10 }} key={'123'}> 
                      <Card.Title
                        title="Version Details"
                        subtitle=''
                        left={(props) => <Avatar.Icon {...props} icon="folder" />}
                      />  
                      <Card.Content>
                        <Text>Version: 1.0.15</Text>
                        <Text>Powerd by : Techgenzi</Text>
                      </Card.Content>
                      
</Card>
         
        </View>
      }
    </>
  );
};

export default AboutDetails;