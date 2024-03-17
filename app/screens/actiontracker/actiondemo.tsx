import React, {useEffect, useMemo, useState} from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import TemplateApi from '../../services/template';
import {useSelector} from '../../redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import {Dropdown} from 'react-native-element-dropdown';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import {useNavigation} from '@react-navigation/native';
interface Actionstagesget {
  action_id: number;
  user_id: number;
  type: string;
  action_name: number;
}
interface Actiondetailslist {
  action_tracker_id: number;
  user_id: number;
  item: string;
  start_date: string;
  exp_end_date: string;
  drag_action: string;
  lead_status_id: number;
  status_name: string;
  assigned_to_tracker_id: number;
  assigned_to: string;
  assigned_by: string;
  priority: number;
  priority_name: string;
  reason_for_delay: string;
  status_for_reason: string;
  description: string;
  module_type: string;
  modified_by: string;
  modified_on: string;
  created_by: string;
  created_on: string;
  deleted: boolean;
  deleted_at: string;
  lead_attributes: Record<string, any>;
  attributes: Record<string, any>;
}
const buttonColors = [
  '#4191F7',
  '#4191F7',
  '#4191F7',
  '#4191F7',
  '#4191F7',
  '#4191F7',
  '#4191F7',
  '#4191F7',
  '#4191F7',
  '#4191F7',
  '#4191F7',
];
const Actiontracker: React.FC<any> = () => {
  const user = useSelector(state => state.userReducer);
  const templateApi = useMemo(() => new TemplateApi(), [user.loggedIn]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [Actionstages, setActionstages] = useState<Actionstagesget[]>([]);
  const [selectedButton, setSelectedButton] = useState<number | null>(null);
  const [editstagesname, seteditstagesname] = useState<string | null>(null);
  const [dataeditstagesname, setdataeditstagesname] = useState<string | null>(
    null,
  );
  const [editstagesvalue, seteditstagesvalue] = useState<Actionstagesget[]>([]);
  const [submission, setsubmission] = useState('');
  const [Actionstagedetails, setActionstagedetails] = useState<
    Actiondetailslist[]
  >([]);
  const navigation = useNavigation();
  const editoptions = editstagesvalue.map(item => ({
    label: item?.action_name,
    value: item?.action_id.toString(),
  }));
  const getactionstagesall = () => {
    templateApi.Actionstage().then(res => {
      const stages = res.data.results;
      setActionstages(stages);
      seteditstagesvalue(stages);
      if (stages.length > 0) {
        handleclick(stages[0].action_id); // Select the first stage
        setSelectedButton(stages[0].action_id);
      }
    });
  };
  const getallactiondetails = (actionId: number) => {
    templateApi.Actiondetails().then(res => {
      const datas = res.data.results.filter(
        (o: any) => o?.lead_status_id == actionId,
      );
      setActionstagedetails(datas);
    });
  };
  const handleclick = (actionId: number) => {
    getallactiondetails(actionId);
  };
  const closePopup = () => {
    setIsPopupVisible(false);
  };
  const [lastSelectedCardData, setLastSelectedCardData] =
    useState<Actiondetailslist | null>(null);
  const handleEdit = (actionTrackerId: number, actionId: number) => {
    setIsPopupVisible(true);
    setSelectedButton(actionId);
    const selectedCard = Actionstagedetails.find(
      item => item.action_tracker_id === actionTrackerId,
    );
    if (selectedCard) {
      setLastSelectedCardData(selectedCard);
    }
  };
  console.log(editstagesname, 'editstagesname');
  const Actionedit = () => {
    if (!lastSelectedCardData) {
      console.error('No card data available for editing.');
      return;
    }
    const {action_tracker_id, lead_status_id} = lastSelectedCardData;
    console.log('Edited Card ID:', action_tracker_id);
    const data = {
      lead_status_id: editstagesname || lead_status_id,
    };
    templateApi
      .Actionedit(action_tracker_id, data)
      .then(res => {
        Notifier.showNotification({
          title: 'Data Submitted Successfully',
          Component: NotifierComponents.Alert,
          duration: 2000,
          componentProps: {
            alertType: 'success',
          },
        });
        closePopup();
        navigation.goBack();
      })
      .catch(error => {
        Notifier.showNotification({
          title: 'Something went wrong. Try again.',
          Component: NotifierComponents.Alert,
          duration: 2000,
          componentProps: {
            alertType: 'error',
          },
        });
      });
  };
  useEffect(() => {
    getactionstagesall();
  }, [user.loggedIn]);
  return (
    <View>
      <View style={{flexDirection: 'row', marginTop: 25}}>
        <ScrollView>
          <View style={{position: 'absolute', top: 0, left: 0, right: 0}}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}>
                {Actionstages.map((stage, index, lead) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      {
                        backgroundColor:
                          buttonColors[index % buttonColors.length],
                      },
                      selectedButton === stage.action_id
                        ? styles.buttonHighlighted
                        : null,
                    ]}
                    onPress={() => {
                      handleclick(stage.action_id);
                      setSelectedButton(stage.action_id);
                    }}>
                    <Text style={styles.buttonText}>{stage.action_name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
          <View style={{marginTop: 40}}>
            {Actionstagedetails?.map((item, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>
                    Action Item: {item?.item}
                  </Text>
                  <View style={styles.iconContainer}>
                    <TouchableOpacity
                      onPress={() =>
                        handleEdit(item.action_tracker_id, item.lead_status_id)
                      }>
                      <Icon
                        name="edit"
                        size={20}
                        color="#4191F7"
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                    <Modal
                      visible={isPopupVisible}
                      animationType="slide"
                      transparent={true}
                      onRequestClose={closePopup}>
                      <View style={styles.popupContainer}>
                        <View style={styles.popupContent}>
                          <Dropdown
                            style={styles.input}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            data={editoptions}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={'Action Stage'}
                            searchPlaceholder="Search..."
                            value={editstagesname}
                            onChange={item => {
                              seteditstagesname(item.value);
                            }}
                          />
                          <View style={styles.buttonContainer}>
                            <TouchableOpacity
                              style={styles.submitButton}
                              onPress={Actionedit} // Call Actionedit directly when Submit button is pressed
                            >
                              <Text style={styles.submitButtonText}>
                                Submit
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.closeButton}
                              onPress={closePopup}>
                              <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </Modal>
                  </View>
                </View>
                <Text style={styles.cardText6}>
                  Non Compliance: {item?.attributes?.non_compliance}
                </Text>
                <Text style={styles.cardText}>
                  Start Date: {item?.start_date}
                </Text>
                <Text style={styles.cardText1}>
                  End Date: {item?.exp_end_date}
                </Text>
                <Text style={styles.cardText}>
                  Assigned By: {item?.assigned_by}
                </Text>
                <Text style={styles.cardText}>
                  Priority: {item?.priority_name}
                </Text>
                <Text style={styles.cardText}>Status: {item?.status_name}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
export default Actiontracker;
const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'row',
  },
  buttonText: {
    color: 'white',
  },
  button: {
    width: 100,
    height: 40,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 5,
  },
  buttonHighlighted: {
    borderWidth: 2, // Border width for the highlighted state
    backgroundColor: '#8600d5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 30, // Increase the padding
    marginVertical: 15,
    margin: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    fontSize: 16,
    color: '#333', // Customize the text color
    marginBottom: 4,
  },
  cardText1: {
    fontSize: 16,
    color: 'red', // Customize the text color
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 2,
    color: '#4191F7', // Customize the text color
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    marginLeft: 10,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    paddingHorizontal: 10,
    color: 'black',
    marginBottom: 10,
    width: '100%',
    height: 40,
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  placeholderStyle: {
    fontSize: 17,
    color: 'black',
  },
  cardText6: {
    fontSize: 16,
    color: 'black', // Customize the text color
    marginBottom: 4,
    fontWeight: 'bold',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: 'black',
  },
  submitButton: {
    backgroundColor: '#4191F7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1, // Allow buttons to grow and occupy equal space
    marginRight: 10, // Add spacing between buttons
  },
  closeButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1, // Allow buttons to grow and occupy equal space
  },
  buttonContainer: {
    flexDirection: 'row', // Align buttons horizontally
    justifyContent: 'space-between', // Add space between buttons
    marginTop: 10, // Adjust spacing from other elements as needed
  },
  closeButtonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
