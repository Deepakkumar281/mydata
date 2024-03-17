import { Platform, StyleSheet, Dimensions } from "react-native";
import OutlineTextinput from "../../components/OutlineTextinput";
import AppStyle from "../../config/styles";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    height:'100%',
    backgroundColor: "white", 
},
  containers: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 30,
},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  centerFlex:{
    position: 'absolute'
  },
  nameTxt:{
  marginStart:140
  },
  touchableOpacityContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    backgroundColor: '#e6e8f4',
    borderRadius: 10,
    padding: 20,
    width: '40%',
    height:100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 7,
  },
  logoIcon: {
    fontSize: 70,
    color: '#5C9BFF',
},
  cardview : {
    textAlign: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop:150
  },
  cardview1 : {
    textAlign: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop:30
  },
  logoText: {
    fontSize: 13,
    marginTop: 5,
    color: 'black',
  },
  abbTitle: {
    margin: 15, 
    fontSize:28,
    textAlign:"center", 
    marginTop:100   
},
  fab: {
    backgroundColor: AppStyle.color.PRIMARY_BUTTON_COLOR,
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  card: {
    borderRadius: 20,
  margin: 15,
  padding: 5,
  textAlign: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  minWidth: '25%',
  minHeight: 100,
  textAlignVertical: 'center',
  backgroundColor: '#fff',
  borderColor: 'lightgrey',
  borderWidth: 1,
  elevation: 4,
  
},
gradient: {
  flex: 1,
  padding: 16,
  justifyContent: 'center',
  alignItems: 'center',
},
card2: {
  borderRadius:20,
  margin: 10,
  padding:5,
  textAlign:'center',
  justifyContent:'center',
  alignItems:'center',
  minWidth:'80%',
  minHeight: 100,
  textAlignVertical: 'center',
  backgroundColor:'#fff',
  border: '1px solid #77aaff', 
  //shadowOffset: {width: -2, height: 4},  
  shadowColor: '#171717',  
  shadowOpacity: 0.2,  
  shadowRadius: 3,   
  elevation: 20, 
  opacity:.5,

},
vehtitle :{
  fontSize:18,
  marginLeft:15,
  fontWeight:'bold'
},
cimg : {
height:50,
margin:5,
justifyContent:'center',
width:50
},
cardTitle: {
  textAlign:'center',
    marginBottom: 10, 
    fontSize:13,
    lineHeight:20,
    fontWeight:'600'    
},
cardActions: {
    marginTop: 0

},
carddesc:{
  fontSize:6    
},
style1:{
  width: '30%',
  // maxWidth: 150,
  height: 130,
  backgroundColor: 'white',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  borderRadius: 20,
  marginStart: 20,
  shadowColor: '#000', // Shadow color
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.5, // Shadow opacity
  shadowRadius: 2, // Shadow radius
  elevation: 4, // Android shadow
  borderWidth: 1, // Border width
  borderColor: 'rgba(0, 0, 0, 0.1)' // Border color
},
style3:{
  width: '20%',
  // maxWidth: 150,
  height: 100,
  backgroundColor: 'white',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  borderRadius: 20,
  marginStart: 170,
  shadowColor: '#000', // Shadow color
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.5, // Shadow opacity
  shadowRadius: 2, // Shadow radius
  elevation: 4, // Android shadow
  borderWidth: 1, // Border width
  borderColor: 'rgba(0, 0, 0, 0.1)' ,// Border color
 
},
style2:{
  position: 'absolute',
  backgroundColor: 'white',
  top: 5,
  right: 5,
  bottom: 5,
  left: 5,
  borderRadius: 15,
},
style4:{
  position: 'absolute',
  backgroundColor: 'white',
  top: 5,
  right: 5,
  bottom: 5,
  left: 5,
  borderRadius: 15,
},
imageContainer: {
  backgroundColor: 'white', // Added background color
  
},
});

export default styles;
