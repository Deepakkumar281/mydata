import React, {useEffect, useMemo, useState} from 'react';
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  Button,
  TextInput,
  StyleSheet,
} from 'react-native';
import {useSelector} from '../../redux';
import TemplateApi from '../../services/template';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Checkbox, IconButton} from 'react-native-paper';
import {Col, Grid} from 'react-native-easy-grid';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Dropdown} from 'react-native-element-dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
type Item = {
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
};
interface Actionstagesget {
  final_stage: any;
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
const S3_URL = 'https://sgp1.digitaloceanspaces.com/freshvoice/';
// const S3_URL = 'http://143.110.245.242:9000/pg-cdn/';

const ActionTracker1: React.FC<any> = (item: any) => {
  const user = useSelector(state => state.userReducer);
  const templateApi = useMemo(() => new TemplateApi(), [user.loggedIn]);
  const api = useMemo(() => new TemplateApi(), [user.access_token]);
  const route = useRoute<any>();
  const navigation = useNavigation();
  const [actiontracker, setActionTracker] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [clickedImage, setClickedImage] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dropdownaction, setDropdownAction] = useState<any[]>([]);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [data, setData] = useState({} as any);
  const [fileData, setFileData] = useState({} as any);
  const [fileData1, setFileData1] = useState({} as any);
  const [submission, setSubmission] = useState({} as any);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setsubmitting] = useState(false);
  const [images, setImages] = useState([{unique_id: ''}]);
  const [action, setaction] = useState<Item[]>([]);
  const [showAddButton, setShowAddButton] = useState(true);
  const [textValue, setTextValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [filteredActionTracker, setFilteredActionTracker] = useState<Item[]>(
    [],
  );
  const [selectedImage, setSelectedImage] = useState(null);


  const openImage = (imageSrc:any) => {
    setSelectedImage(imageSrc);
    setIsModalVisible(true);
  };

  const closeImage = () => {
    setSelectedImage(null);
    setIsModalVisible(false);
  };
  const UpdateFormUploads = (uniqueId: string, item: any, value: any) => {
    setSubmission((prevState: any) => ({
      ...prevState,
      [uniqueId]: {
        ...prevState[uniqueId],
        upload: value,
      },
    }));
  };
  const showError = (message: string) => {
    Notifier.showNotification({
      title: message,
      Component: NotifierComponents.Alert,
      duration: 2000,
      componentProps: {
        alertType: 'error',
      },
    });
    setSaving(false);
  };
  const snapPhoto = async (
    uniqueId: string,
    item: any,
    data: any,
    index: Number,
    type: any,
  ) => {
    try {
      const results = await launchCamera({
        mediaType: 'photo',
        cameraType: 'back',
        quality: 0.2,
      });
      if (results.didCancel) {
      } else if (results.errorCode) {
        showError('Something went wrong. Try again.');
      } else {
        let result = results!.assets![0];
        processPhoto(uniqueId, result, item, data, index, type);
      }
    } catch (err) {
      showError('Something went wrong. Try again.');
    }
  };
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
        Notifier.hideNotification();
      }
    });
   return () => {
     unsubscribe();
   };
 }, []);
  const processPhoto = async (
    uniqueId: string,
    asset: Asset,
    item: any,
    datas: any,
    index: any,
    type: any,
  ) => {
    switch (asset.type) {
      case 'image/jpeg':
      case '.png':
      case '.jpeg':
      case '.jpg':
      case 'image/png':
      case '.mp4':
      case '.mkv':
      case 'application/pdf':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case '.pdf':
      case '.doc':
      case '.docx':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/zip':
      case 'application/octet-stream':
      case 'application/x-zip-compressed':
      case 'multipart/x-zip':
      case '.zip':
      case 'application/vnd.ms-powerpoint':
      case '.ppt':
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      case '.pptx':
      case 'application/vnd.ms-excel':
      case '.xls':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case '.xlsx':
      case '.csv':
      case '.pdf':
      case '.docx':
      case '.apk':
        try {
          let data: any = await uploadImage(asset);
          if (data !== null && data.media_id) {
            setFileData1((prevState: any) => {
              const existingArray = prevState[uniqueId] || [];
              const updatedArray = [...(submission[uniqueId]?.upload || [])];
              updatedArray.splice(index, 0, {
                type: type,
                src: data.media_key,
              });
              UpdateFormUploads(item.unique_id, item, updatedArray);
              return {
                ...prevState,
                [uniqueId]: updatedArray,
              };
            });
            Notifier.showNotification({
              title: 'Image Uploaded Successfully.',
              Component: NotifierComponents.Alert,
              duration: 2000,
              componentProps: {
                alertType: 'success',
              },
            });
            setLoading(false);
          }
        } catch (err) {
          setLoading(false);
          Notifier.showNotification({
            title: 'something went wrong',
            Component: NotifierComponents.Alert,
            duration: 2000,
            componentProps: {
              alertType: 'error',
            },
          });
        }
        break;
      default:
        Notifier.showNotification({
          title: 'Selected File Type not Vaild. Try again.',
          Component: NotifierComponents.Alert,
          duration: 2000,
          componentProps: {
            alertType: 'error',
          },
        });
        return;
    }
  };
  const uploadImage = async (file: Asset) => {
    return new Promise((resolve, reject) => {
      let data = {
        content_type: file.type,
      };
      api
        .ImageUploader(data)
        .then(res => {
          const formData = new FormData();
          Object.keys(res.data.data.fields).forEach(key => {
            formData.append(key, res.data.data.fields[key]);
          });
          formData.append('file', {
            type: file.type,
            name: file.fileName,
            uri: file.uri,
          });
          const xhr = new XMLHttpRequest();
          xhr.open('POST', res.data.data.url, true);
          console.log('Upload', res.data.data.url);
          console.log('Uploadsss', res);
          xhr.onload = function () {
            if (this.status === 204) {
              console.log('Uploadggg', res.data);
              resolve(res.data);
            } else {
              reject(new Error('Upload failed'));
            }
          };
          xhr.onerror = function () {
            reject(new Error('An error occurred during the upload'));
          };
          xhr.upload.onprogress = function (evt) {};
          xhr.send(formData);
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  const handleDeleteUploadedPhoto = (uniqueId: any, index: any) => {
    setFileData1((prevState: any) => {
      const updatedArray = prevState[uniqueId] || [];
      updatedArray.splice(index, 1);
      return {
        ...prevState,
        [uniqueId]: updatedArray,
      };
    });
  };
  const handleAddClick = (uniqueId: any, no_of_uploads: any) => {
    if (images.length < 3) {
      const remainingUploads = 3 - images.length;
      const uploadsToAdd =
        remainingUploads <= no_of_uploads ? remainingUploads : no_of_uploads;
      const newImages = Array.from({length: uploadsToAdd}, () => ({
        unique_id: uniqueId,
      }));
      setImages(prevImages => [...prevImages, ...newImages]);
      const updatedRemainingUploads = no_of_uploads - uploadsToAdd;
      setShowAddButton(updatedRemainingUploads > 0);
    }
  };
  const [uploadData, setUploadData] = useState({
    type: '',
    src: '',
  });
  useEffect(() => {
    if (
      selectedItem &&
      selectedItem.attributes &&
      selectedItem.attributes.upload
    ) {
      const upload = selectedItem.attributes.upload[0];
      setUploadData(upload);
    }
  }, [selectedItem]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [Actionstages, setActionstages] = useState<Actionstagesget[]>([]);
  const [selectedButton, setSelectedButton] = useState<number | null>(null);
  const [editstagesname, seteditstagesname] = useState<string | null>(null);
  const [editstagesvalue, seteditstagesvalue] = useState<Actionstagesget[]>([]);
  const [isFinalStage, setIsFinalStage] = useState(false);
  const [dataaction, setdataaction] = useState('');
  const [lastSelectedCardData, setLastSelectedCardData] =
    useState<Actiondetailslist | null>(null);
  const editoptions = editstagesvalue.map(item => ({
    label: item?.action_name,
    value: item?.action_id.toString(),
  }));
  const getactionstagesall = () => {
    templateApi.Actionstage().then(res => {
      const stages = res.data.results;
      const actiondata = res.data.results;
      console.log(actiondata, 'actiondata');
      setdataaction(actiondata);
      setActionstages(stages);
      seteditstagesvalue(stages);
      if (stages.length > 0) {
        handleclick(stages[0].action_id);
        setSelectedButton(stages[0].action_id);
      }
    });
  };
  const [Actionstagedetails, setActionstagedetails] = useState<
    Actiondetailslist[]
  >([]);
  const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);
  const [yesButtonPressed, setYesButtonPressed] = useState(false);
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
    setYesButtonPressed(false);
    setIsFinalStage(false);
    setIsPopupVisible(false);
    seteditstagesname(null); // Clear editstagesname state
    // Clear the uploaded image for the specific item
    setFileData1((prevFileData: any) => {
      const updatedFileData = {...prevFileData};
      updatedFileData[item.unique_id] = []; // Clear the uploaded image array for the specific item
      console.log('Updated file data:', updatedFileData);
      return updatedFileData;
    });

    setSubmission((prevSubmission: any) => {
      const updatedSubmission = {...prevSubmission};
      updatedSubmission[item.unique_id] = {
        ...updatedSubmission[item.unique_id],
        upload: '',
      }; // Clear upload data for the specific item
      return updatedSubmission;
    });
  };
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
  const Actionedit = () => {
    if (!lastSelectedCardData) {
      console.error('No card data available for editing.');
      return;
    }
    const {action_tracker_id, lead_status_id} = lastSelectedCardData;
    console.log('Edited Card ID:', action_tracker_id);
    const data = {
      lead_status_id: editstagesname || lead_status_id,
      lead_attributes: {
        upload: submission,
      },
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
                              const selectedStage = editstagesvalue.find(
                                stage =>
                                  stage.action_id === parseInt(item.value, 10),
                              );
                              setIsFinalStage(selectedStage?.final_stage);
                            }}
                          />
                          {isFinalStage ? (
                            <>
                              {!yesButtonPressed && (
                                <>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      color: 'black',
                                    }}>
                                    Are You Sure Continue With Final Stage?
                                  </Text>
                                  <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                      style={styles.submitButton1}
                                      onPress={() => {
                                        setYesButtonPressed(true);
                                      }}>
                                      <Text style={styles.submitButtonText}>
                                        Yes
                                      </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={styles.closeButton1}
                                      onPress={closePopup}>
                                      <Text style={styles.closeButtonText}>
                                        No
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </>
                              )}
                              {yesButtonPressed && (
                                <>
                                  
                                    <React.Fragment>
                                      <View style={styles.placeholderImg}>
                                        <>
                                          {images.map(
                                            (image: any, index: any) => {
                                              const fileUri =
                                                S3_URL +
                                                fileData1[item.unique_id]?.[
                                                  index
                                                ]?.src;
                                              const filetypess =
                                                fileData1[item.unique_id]?.[
                                                  index
                                                ]?.type;
                                              return (
                                                <View
                                                  style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                  }}>
                                                  {!!fileData1[
                                                    item.unique_id
                                                  ]?.[index] ? (
                                                    <View
                                                      style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        marginBottom:
                                                          index === 0 ? 20 : 0,
                                                      }}>
                                                      {filetypess ===
                                                      'image' ? (
                                                        <Image
                                                          source={{
                                                            uri: fileUri,
                                                          }}
                                                          style={
                                                            styles.placeholderImg
                                                          }
                                                        />
                                                      ) : null}
                                                      <TouchableOpacity
                                                        onPress={() =>
                                                          handleDeleteUploadedPhoto(
                                                            item.unique_id,
                                                            index,
                                                          )
                                                        }
                                                        style={{
                                                          justifyContent:
                                                            'center',
                                                          marginStart: 10,
                                                        }}>
                                                        <MaterialIcons
                                                          name="delete"
                                                          size={24}
                                                          color="red"
                                                        />
                                                      </TouchableOpacity>
                                                    </View>
                                                  ) : (
                                                    <>
                                                     
                                                        {index == 0 && (
                                                          <View
                                                            style={{
                                                              flexDirection:
                                                                'row',
                                                            }}>
                                                            {!fileData[
                                                              item.unique_id
                                                            ]?.[index] && (
                                                              <View
                                                                style={{
                                                                  marginStart:
                                                                    'auto',
                                                                  marginTop: 20,
                                                                  marginEnd:
                                                                    'auto',
                                                                }}>
                                                                <IconButton
                                                                  onPress={() =>
                                                                    snapPhoto(
                                                                      item.unique_id,
                                                                      item,
                                                                      'Option',
                                                                      index,
                                                                      'image',
                                                                    )
                                                                  }
                                                                  icon="camera"
                                                                />
                                                                <Text>
                                                                  Take snap
                                                                </Text>
                                                              </View>
                                                            )}

                                                            {index === 0 ||
                                                              (image.unique_id ===
                                                                item.unique_id && (
                                                                <View
                                                                  style={{
                                                                    justifyContent:
                                                                      'center',
                                                                  }}></View>
                                                              ))}
                                                          </View>
                                                        )}
                                                        {item.unique_id ===
                                                          image.unique_id && (
                                                          <View
                                                            style={{
                                                              flexDirection:
                                                                'row',
                                                            }}>
                                                            {!fileData[
                                                              item.unique_id
                                                            ]?.[index] && (
                                                              <View
                                                                style={{
                                                                  marginStart: 150,
                                                                  marginTop: 20,
                                                                }}>
                                                                <IconButton
                                                                  onPress={() =>
                                                                    snapPhoto(
                                                                      item.unique_id,
                                                                      item,
                                                                      'Option',
                                                                      index,
                                                                      'image',
                                                                    )
                                                                  }
                                                                  icon="camera"
                                                                />
                                                                <Text>
                                                                  Take snap
                                                                </Text>
                                                              </View>
                                                            )}
                                                          </View>
                                                        )}
                                                    
                                                    </>
                                                  )}
                                                </View>
                                              );
                                            },
                                          )}
                                        </>
                                      </View>
                                    </React.Fragment>
                                 
                                  <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                      style={styles.closeButton}
                                      onPress={closePopup}>
                                      <Text style={styles.closeButtonText}>
                                        Close
                                      </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={styles.submitButton}
                                      onPress={Actionedit}>
                                      <Text style={styles.submitButtonText}>
                                        Submit
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                  style={styles.closeButton}
                                  onPress={closePopup}>
                                  <Text style={styles.closeButtonText}>
                                    Close
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={styles.submitButton}
                                  onPress={Actionedit}>
                                  <Text style={styles.submitButtonText}>
                                    Submit
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </>
                          )}
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
                  Assigned To: {item?.assigned_to}
                </Text>
                <Text style={styles.cardText}>
                  Assigned By: {item?.assigned_by}
                </Text>
                <Text style={styles.cardText}>
                  Priority: {item?.priority_name}
                </Text>
                <Text style={styles.cardText}>Status: {item?.status_name}</Text>
                <View>
                {item?.attributes?.upload && item.attributes.upload.length > 0 && (
    <Text style={styles.cardText6}>Nc's Photo -</Text>
  )}
      <ScrollView horizontal>
        {item?.attributes?.upload?.map((imageData :any, index:any) => (
          <>
          <TouchableOpacity key={index} onPress={() => openImage(S3_URL + imageData.src)}>
            <Image
              source={{ uri: S3_URL + imageData.src }}
              style={[styles.placeholderImg1, { marginRight: 10 }]}
            />
          </TouchableOpacity>
          </>
        ))}
      </ScrollView>
      <Modal visible={isModalVisible} transparent={true}>
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
      <TouchableOpacity onPress={closeImage} style={{ alignSelf: 'flex-end' }}>
        <Text style={{ fontSize: 18, color: 'black' }}>Close</Text>
      </TouchableOpacity>
      <Image
        source={{ uri: selectedImage }}
        style={{ width: 300, height: 300, marginTop: 20 }} // Adjust size as needed
        resizeMode="contain" // Adjust image resizing mode
      />
    </View>
  </View>
</Modal>

    </View>



              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

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
    color: '#333',
    marginBottom: 4,
  },
  cardText6: {
    fontSize: 16,
    color: 'black',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  cardText1: {
    fontSize: 16,
    color: 'red',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 2,
    color: '#4191F7',
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
    // borderColor: '#000',
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
    height: 100,
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
  submitButton1: {
    backgroundColor: 'green',
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
  closeButton1: {
    backgroundColor: 'red',
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
  placeholderImg: {
    width: 120,
    height: 120,
  },
  placeholderImg1: {
    width: 80,
    height: 80,
  },
  imageUploadView: {
    paddingLeft: 20,
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

export default ActionTracker1;
