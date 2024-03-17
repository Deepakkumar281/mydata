// Import
import * as React from 'react';
import {NavigationContainer, Theme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {navigationRef} from './NavigationService';
import {StyleSheet, Text, Image, StatusBar} from 'react-native';
import AppStyle from '../config/styles';
// Screens Import
import SplashScreen from '../screens/Splash';
import Login from '../screens/Login';
import CustomDrawerContent from '../screens/Drawer';
import Home from '../screens/Home';
import NHome from '../screens/NewHome';
import AddTemplate from '../screens/Template/AddTemplate';
import Changepassword from '../screens/Changepassword';
// import Vehiclecheck from '../screens/CheckList/vehiclecheck';
import AboutDetails from '../screens/About/About';
import Templates from '../screens/NewHome/templates';
import {Colors} from 'react-native-paper';
import TemplateSubmitForm from '../screens/Template/TemplateSubmitForm';
import Assign from '../screens/assign/assign';
// import MultiSelectExample from '../screens/Template/configure';
import images from '../config/images';
import TicketHome from '../screens/Home/tickethome';
// import survey from '../screens/Home/survey';
// import SubmitFormid from '../screens/Template/submitformid';
import actiontracker from '../screens/actiontracker/actiontracker';

const Stack = createStackNavigator();
const AuthStack = createStackNavigator();
const UserStack = createStackNavigator();
const UserAppStack = createStackNavigator();
const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

interface IProps {
  theme: Theme;
}

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      <AuthStack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <AuthStack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </AuthStack.Navigator>
  );
};

const UserHome = () => {
  return (
    <UserStack.Navigator screenOptions={{headerShown: false}}>
      <UserStack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
       <UserStack.Screen
        name="TicketHome"
        component={TicketHome}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </UserStack.Navigator>
  );
};

const NewHome = () => {
  return (
    <UserStack.Navigator screenOptions={{headerShown: false}}>
      <UserStack.Screen
        name="NewHome"
        component={NHome}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </UserStack.Navigator>
  );
};

const MainApp = () => {
  return (
    <Drawer.Navigator
      drawerContent={navigation => <CustomDrawerContent {...navigation} />}>
      <Drawer.Screen
        name="Newhome"
        component={NewHome}
        options={{
          title: 'Home',
        }}
      />
    </Drawer.Navigator>
  );
};

const UserApp = () => {
  return (
    <UserAppStack.Navigator>
      <UserAppStack.Screen
        name="AddTemplate"
        component={AddTemplate}
        options={{
          title: 'Add Template',
        }}
      />

      <UserAppStack.Screen
        name="TemplateSubmitForm"
        component={TemplateSubmitForm}
        options={{
          title: 'Ticket',
        }}
      />
      <UserAppStack.Screen
        name="Changepassword"
        component={Changepassword}
        options={{
          title: 'Change Password',
        }}
      />
      <UserAppStack.Screen
        name="AboutDetails"
        component={AboutDetails}
        options={{
          title: 'About',
        }}
      />
      <UserAppStack.Screen
        name="Dashboard"
        component={Templates}
        options={{
          title: 'Templates',
        }}
      />
      <UserAppStack.Screen
        name="UserMainHome"
        options={{
          title: 'Templates',
        }}
        component={UserHome}
      />
      <UserAppStack.Screen
        name="Checklist"
        options={{
          title: 'Checklist',
        }}
        component={Home}
      />
      <UserAppStack.Screen
        name="TicketHome"
        options={{
          title: 'Tickets',
        }}
        component={TicketHome}
      />
       {/* <UserAppStack.Screen
        name="survey"
        options={{
          title: 'survey',
        }}
        component={survey}
      /> */}
      <UserAppStack.Screen
        name="actiontracker"
        options={{
          title: 'Action Tracker',
        }}
        component={actiontracker}
      />
      {/* <UserAppStack.Screen
        name="SubmitFormid"
        options={{
          title: 'Survey Form',
        }}
        component={SubmitFormid}
      /> */}
      <UserAppStack.Screen
        name="Assign"
        options={{
          title: 'Assign',
        }}
        component={Assign}
      />
    </UserAppStack.Navigator>
  );
};

const App: React.FC<IProps> = (props: IProps) => {
  const {theme} = props;
  return (
    <NavigationContainer ref={navigationRef} theme={theme}>
      <StatusBar translucent={true} backgroundColor={Colors.black} />

      <Stack.Navigator>
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{headerShown: false, gestureEnabled: false}}
        />
        <Stack.Screen
          name="MainApp"
          component={MainApp}
          options={{headerShown: false, gestureEnabled: false}}
        />
        <Stack.Screen
          name="UserApp"
          component={UserApp}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabbarStyle: {
    color: '#07245B',
    fontSize: 11,
  },
  unselecttabbarStyle: {
    color: 'gray',
    fontSize: 11,
  },
});

export default App;
