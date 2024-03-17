import { Platform, StyleSheet, Dimensions } from "react-native";
import AppStyle from "../../config/styles";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Colors } from "react-native-paper";

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppStyle.color.COLOR_BG,
    flex: 1
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 16,
  },
  card: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10
  },
  cardContent: {
    paddingHorizontal: 0,
    paddingTop: 0,
    marginTop: 0
  },
  activityIndicatorContainer: {
    flex: 1,
    marginBottom:150
  },
  cardTitle: {
    textAlign: "center",
    marginBottom: 0,
  },
  textalign:{
    textAlign:'center'
  }
  ,
  textInput: {
    marginTop: 0
  },
  textInput1: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 0, // Decreased padding
    fontSize: 16,
    marginLeft:10
  },
 
  cardTitleText: {
    fontSize: 18,
    marginBottom: 0
  },
  cardTitleTextHeading: {
    fontSize: 18,
    marginBottom: 0,
    paddingBottom: 0,
    paddingTop: 5
  },
  headerTitle: {
    flexWrap: 'wrap', // Allow title text to wrap
    // Other styles for the title (e.g., fontSize, fontWeight, etc.)
  },
  dropdownContainer: {
    height: 40, // Adjust the height as needed
    marginBottom: 10, // Adjust the margin as needed
  },
  dropdownStyle: {
    backgroundColor: '#fafafa', // Dropdown background color
    borderWidth: 1, // Border width
    borderColor: '#ccc', // Border color
  },
  dropdownLabelStyle: {
    fontSize: 16, // Label font size
    color: '#333', // Label text color
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    padding: 5,
  },
    addButton: {
      backgroundColor: 'blue',
      padding: 10,
      borderRadius: 5,
      alignSelf: 'center',
      marginTop: 10,
    },
  
  checkBoxCol: {
    justifyContent: "center"
  },
  requiredText: {
    color: 'red',
    marginTop: 5,
    fontSize: 12,
    marginStart:25
  },
  dropDown: {
    marginLeft: 10,
    marginRight: 10
  },
  validText: {
    color: Colors.red400,
    fontSize: 14,
    marginLeft: 16
  },
  imageUploadView: {
    paddingLeft: 20
  },
  placeholderImg: {
    width: 120,
    height: 120,
    marginTop:10
  },
  inputContainer: {
    borderColor: 'black',
    borderWidth: 1,
    margin: 20,
    borderRadius: 5, // Add border radius for rounded corners
    
  },
  input: {
    height: 30,
    padding: 10,
    color: 'black',
  },
  placeholderImg1: {
    width: 40,
    height: 40,
    marginTop:10
  },
  placeholderImg2: {
    width: 40,
    height: 120,
    marginTop:10
  },
  emojiContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginBottom: 20,
    marginTop:20
   
  },
  emoji: {
    color: '#d23e3e',
  },
  emoji1: {
    color: '#f8974a',
  },
  emoji2: {
    color: '#fdda58',
  },
  emoji3: {
    color: '#bcd74c',
  },
  emoji4: {
    color: '#8bc645',
  },
  selectedRating: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  tableContainer: {
    flex:1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    maxWidth:"100%",
    position:"absolute",
    flexGrow:1,
    marginTop:46
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  columnHeader: {
    width: 75,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3CEOEA',
  },
  columnHeaderText: {
    fontWeight: 'bold',
    color:"#000000",
    fontSize:14
  },
  tableBody: {
    maxHeight: 400,  // Adjust this value to increase or decrease the maximum height
},
  tableCell: {
    width: 75,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    textAlign: 'center',
    color:"#000000",
    fontSize:12
  },

})

export default styles