import {Platform, StyleSheet, Dimensions} from 'react-native';
import AppStyle from '../../config/styles';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Colors} from 'react-native-paper';

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  radioButtonLabel: {
    marginLeft: 5,
  },
  checkboxContainer: {
    marginTop: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  checkboxRow1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  iconList: {
    marginTop: 20,
    marginBottom: 20,
  },
  iconItem: {
    alignItems: 'center',
    marginBottom: 10,
  },
  iconName: {
    marginTop: 5,
    fontSize: 12,
  },
  checkboxContainer1: {
    flexDirection: 'row',

    marginBottom: 10,
  },
  checkbox: {
    marginRight: 5000,
  },
  checkbox1: {
    marginRight: 200,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchInput: {
    backgroundColor: '#F5F5F5',

    borderRadius: 8,
  },
  closeButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  container: {
    backgroundColor: AppStyle.color.COLOR_BG,
    flex: 1,
  },
  activityIndicatorContainer: {
    flex: 1,

    marginBottom: 150,
  },
  titleSection: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#aaa',
    borderBottomWidth: 1,
  },
  rowItem: {
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    marginTop: 5,
    paddingBottom: 0,
  },
  cardActive: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    marginTop: 5,
    paddingBottom: 0,
    shadowColor: 'blue',
    borderColor: Colors.blue700,
    backgroundColor: Colors.blue100,
  },

  dropdownContainer: {
    minWidth: 170,
    marginRight: 180,
  },
  titleText: {
    marginTop: wp(0),
  },
  minimizedTextInput: {
    width: 50,
    fontSize: 12,
  },
  subTitleStyle: {
    fontSize: 12,
    marginBottom: 0,
    color: Colors.red600,
  },
  descText: {
    marginTop: wp(2),
    marginBottom: wp(2),
  },
  cardTitleHolder: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 5,
    margin: 10,
    borderRadius: 5,
  },
  fab: {
    backgroundColor: AppStyle.color.PRIMARY_BUTTON_COLOR,
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  formContent: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  actionButton: {
    marginBottom: 0,
    marginTop: 0,
    marginRight: 0,
  },
  modalStyle: {
    backgroundColor: Colors.white,
  },
  addOptionButton: {
    width: 120,
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 5,
  },
  containers: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  iconContainer: {
    margin: 10,
  },
  modalContent1: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    width: '100%',
  },
  iconList1: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  iconItem1: {
    marginBottom: 16,
  },
  closeButton1: {
    marginTop: 16,
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'center',
  },
  closeButtonText1: {
    color: 'white',
    fontWeight: 'bold',
  },
  containerIcon: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default styles;
