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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Checkbox, IconButton} from 'react-native-paper';
import {Col, Grid} from 'react-native-easy-grid';
import Icon from 'react-native-vector-icons/MaterialIcons';


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

const S3_URL = 'https://sgp1.digitaloceanspaces.com/freshvoice/';
// const S3_URL = 'http://143.110.245.242:9000/pg-cdn/';

const ActionTracker: React.FC<any> = (item: any) => {
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
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  const UpdateFormUploads = (uniqueId: string, item: any, value: any) => {
    setSubmission((prevState: any) => ({
      ...prevState,
      [uniqueId]: {
        ...prevState[uniqueId],
        upload: value,
      },
    }));
  };

  const actionItems = () => {
    templateApi.actiontracker().then(res => {
      let user_data: Item[] = res.data.results;
      setActionTracker(user_data);
      setaction(res.data.results);
    });
  };
  
  
  const fetchDataAndFilter = () => {
    
    templateApi.actiontracker().then(res => {
      let user_data: Item[] = res.data.results;
      setActionTracker(user_data);
      setaction(res.data.results);

      
      const filteredData = user_data.filter(item =>
        selectedActions.includes(item.lead_status_id.toString()),
      );
      setFilteredActionTracker(filteredData);
    });
  };
  useEffect(() => {
    fetchDataAndFilter();
  }, [selectedActions]);

  const action_tracker_id = actiontracker.length;
  useEffect(() => {
    actionItems();
    actionDropdown();
  }, [user.loggedIn, selectedStatus]);

  const actionDropdown = () => {
    templateApi
      .customaction()
      .then(res => {
        const actionData = res.data.results.map((action: any) => ({
          action_id: action.action_id,
          action_name: action.action_name,
        }));
        setDropdownAction(actionData);
      })
      .catch(error => {
        console.error('Error fetching action data:', error);
      });
  };

  useEffect(() => {
    actionItems();
    actionDropdown();
  }, [user.loggedIn]);

  const patchactionItems = (action_tracker_id: any, patch_data: any) => {
    return new Promise((resolve, reject) => {
      
      templateApi
        .patchcustomaction(action_tracker_id, patch_data)
        .then(res => {
          
          resolve(res);
        })
        .catch(err => {
          console.error('Error in patchactionItems:', err);
          
          reject(err);
        });
    });
  };

  const handleActionSubmit = () => {
    if (selectedItem && selectedAction) {
      const {action_tracker_id, attributes} = selectedItem;
      const lead_status_id = selectedAction;
      const patch_data = {
        lead_status_id: lead_status_id,
        attributes: {
          uploads: submission,
          remark_desc: textValue,
          upload_user: attributes.upload_user,
          no_upload: attributes.no_upload,
          upload: attributes.upload,
        },
      };
      patchactionItems(action_tracker_id, patch_data)
        .then(() => {
          
          Notifier.showNotification({
            title: 'Data Submitted successfully',
            Component: NotifierComponents.Alert,
            duration: 2000,
            componentProps: {
              alertType: 'success',
            },
          });
          navigation.goBack(); 
        })
        .catch(err => {
          setLoading(false);
          setsubmitting(false);
          if (err.response && err.response.status === 409) {
            Notifier.showNotification({
              title: err.response.data.message,
              Component: NotifierComponents.Alert,
              duration: 2000,
              componentProps: {
                alertType: 'error',
              },
            });
          } else {
            Notifier.showNotification({
              title: 'Something went wrong. Try again.',
              Component: NotifierComponents.Alert,
              duration: 2000,
              componentProps: {
                alertType: 'error',
              },
            });
          }
        });
    } else {
      
      Notifier.showNotification({
        title: 'Please select the Status.',
        Component: NotifierComponents.Alert,
        duration: 2000,
        componentProps: {
          alertType: 'error',
        },
      });
    }
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
        try {
          let data: any = await uploadImage(asset);
          if (data !== null && data.media_id) {
            setFileData1((prevState: any) => {
              const existingArray = prevState[uniqueId] || []; 
              const updatedArray = [
                ...(submission[uniqueId]?.upload || []), 
              ];
              
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
            title: 'Selected File Type not Vaild. only (.mp4,.mkv) allowed',
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
    return new Promise(async (resolve, reject) => {
      let data = {
        content_type: file.type,
      };
      api
        .ImageUploader(data)
        .then(res => {
          ;
          const formData = new FormData();
          Object.keys(res.data.data.fields).forEach(key => {
            formData.append(key, res.data.data.fields[key]);
          });
          formData.append('file', file);
          const xhr = new XMLHttpRequest();
          xhr.open('POST', res.data.data.url, true);
          xhr.onload = function () {
            if (this.status === 204) {
              resolve(res.data);
            } else {
              reject(null);
            }
          };
          xhr.upload.onprogress = function (evt) {};
          xhr.send(formData);
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  const openModal = (item: Item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalVisible(false);
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

  const handleAddClick = (uniqueId: any, no_upload: any) => {
    if (images.length === 0) {
      setShowAddButton(false);
    }
    if (images.length < no_upload) {
      setImages(prevImages => [...prevImages, { unique_id: uniqueId }]);
      setShowAddButton(images.length + 1 < no_upload);
    }  
  };
  
  const handleDeleteImage = (index: any,no_upload:any) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    
    if (images.length <= no_upload) {
      setShowAddButton(true);
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
  
  const toggleCheckbox = (actionId: string) => {
    setSelectedActions(prevSelectedActions => {
      if (prevSelectedActions.includes(actionId)) {
        return prevSelectedActions.filter(id => id !== actionId);
      } else {
        return [...prevSelectedActions, actionId];
      }
    });
  };

  return (
    <View>
      <ScrollView>
        <Text
          style={{
            color: 'black',
            fontSize: 20,
            marginTop: 10,
            marginStart: 10,
          }}>
          Select the Stages
        </Text>
        <View style={styles.checkboxContainer}>
          {dropdownaction.map((action, index) => (
            <View key={action.action_id} style={styles.checkboxRow}>
              <Checkbox.Item
                label={action.action_name}
                status={
                  selectedActions.includes(action.action_id.toString())
                    ? 'checked'
                    : 'unchecked'
                }
                onPress={() => toggleCheckbox(action.action_id.toString())}
              />
            </View>
          ))}
        </View>
        <Text
          style={{
            color: 'black',
            fontSize: 15,
            marginTop: 10,
            marginStart: 10,
          }}>
          Select a action item
        </Text>
        {selectedActions.length === 0 && (
              
              <View style={styles.centerCard}>
    <View style={styles.card1}>
      <Text style={{ fontSize: 15, color: 'black'}}>Please Pick the Stages !!!</Text>
    </View>
  </View>
            )}
            {selectedActions.length > 0 && (
        <View style={styles.pickerContainer}>
          
          <Picker
            style={styles.picker}
            selectedValue={selectedItem ? selectedItem.action_tracker_id : null}
            enabled={selectedActions.length > 0}
            onValueChange={value => {
              const selectedItem = actiontracker.find(
                item => item.action_tracker_id === value,
              );
              if (selectedItem) {
                openModal(selectedItem);
              }
              
            }}
            >
               
            <Picker.Item label="Select an item" value={null} />
           
            {filteredActionTracker.length > 0 ? (
              filteredActionTracker.map(item => (
                <Picker.Item
                  key={item.action_tracker_id}
                  label={item.item}
                  value={item.action_tracker_id}
                  style={{color: 'black', flexWrap: 'wrap'}}
                />
              ))
            ) : (
              <Picker.Item label="No data available" value={null} />
            )}
          </Picker>
        </View>)}

        {selectedItem && (
          <View style={styles.card}>
            <Text style={{marginStart: 30, color: 'black'}}>
              Action Item: {selectedItem.item}
            </Text>
            <Text style={{marginStart: 30, color: 'black'}}>
              Start Date: {selectedItem.start_date}
            </Text>
            <Text style={{marginStart: 30, color: 'red'}}>
              End Date: {selectedItem.exp_end_date}
            </Text>
            <Text style={{marginStart: 30, color: 'black'}}>
              Assigned By: {selectedItem.assigned_by}
            </Text>
            <Text style={{marginStart: 30, color: 'black'}}>
              Priority: {selectedItem.priority_name}
            </Text>
            <Text style={{marginStart: 30, color: 'black'}}>
              Status: {selectedItem.status_name}
            </Text>
          </View>
        )}
        {selectedItem &&
          selectedItem.attributes &&
          selectedItem.attributes.upload &&
          selectedItem.attributes.upload.length > 0 && (
            <View>
              <Text style={{marginStart: 150, marginTop: 20}}>
                {' '}
                Nc photo's{' '}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: 20,
                  marginStart: 40,
                }}>
                {selectedItem.attributes.upload.map(
                  (upload: any, index: any) => (
                    <Image
                      key={index}
                      source={{uri: S3_URL + upload.src}}
                      style={{
                        width: 100,
                        height: 100,
                        marginRight: 10,
                        marginBottom: 10,
                      }}
                    />
                  ),
                )}
               
              </View>
            </View>
          )}
        {selectedItem && (
          <View>
            <Text
              style={{
                marginStart: 20,
                color: 'black',
                marginTop: 15,
                fontSize: 20,
              }}>
              {' '}
              Action status
            </Text>
            <Text
              style={{
                marginStart: 120,
                color: 'black',
                marginTop: 10,
                fontSize: 20,
              }}>
              Status:{' '}
              {new Date(selectedItem.exp_end_date) < new Date()
                ? 'Pending'
                : selectedItem.status_name}
            </Text>
          </View>
        )}
        {selectedItem && (
          <View>
            <Text
              style={{
                color: 'black',
                fontSize: 15,
                marginTop: 20,
                marginStart: 20,
              }}>
              Select a Status
            </Text>
            <View style={styles.pickerContainer1}>
              
              <Picker
                style={[
                  styles.picker,
                  {
                    backgroundColor:
                      new Date(selectedItem.exp_end_date) >= new Date()
                        ? 'white'
                        : 'grey',
                  },
                ]}
                selectedValue={selectedAction}
                onValueChange={value => {
                  setSelectedAction(value);
                }}
                enabled={new Date(selectedItem.exp_end_date) >= new Date()}>
                <Picker.Item label="Select the data" value={null} />
                {dropdownaction.map((action, index) => (
                  <Picker.Item
                    key={action.action_id}
                    label={action.action_name}
                    value={action.action_id}
                  />
                ))}
              </Picker>
            </View>
          </View>
        )}

        {selectedItem && (
          <View>
            <Text
              style={{
                fontSize: 20,
                color: 'black',
                marginTop: 5,
                marginStart: 20,
              }}>
              Description
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter "
                value={textValue}
                onChangeText={text => setTextValue(text)}
                multiline={true}
                numberOfLines={4}
              />
            </View>
          </View>
        )}
        {selectedItem && (
          <ScrollView>
            <React.Fragment key={item.uniqueId}>
              <View style={styles.imageUploadView}>
                <>
                  {images.map((image: any, index: any) => {
                    
                    const fileUri =
                      S3_URL + fileData1[item.unique_id]?.[index]?.src;
                    const filetypess = fileData1[item.unique_id]?.[index]?.type;
                    return (
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                        }}>
                        {!!fileData1[item.unique_id]?.[index] ? (
                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              marginBottom: index === 0 ? 20 : 0,
                            }}>
                            {filetypess === 'image' ? (
                              <Image
                                source={{uri: fileUri}}
                                style={styles.placeholderImg}
                              />
                            ) : null}

                            <TouchableOpacity
                              onPress={
                                () =>
                                  handleDeleteUploadedPhoto(
                                    item.unique_id,
                                    index,
                                  ) 
                              }
                              style={{
                                justifyContent: 'center',
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
                              <View style={{flexDirection: 'row'}}>
                                {!fileData[item.unique_id]?.[index] && (
                                  <View
                                    style={{marginStart: 150, marginTop: 20}}>
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
                                    <Text>Take snap</Text>
                                  </View>
                                )}
                                {index === 0 ||
                                  (image.unique_id === item.unique_id && (
                                    <View
                                      style={{
                                        justifyContent: 'center',
                                      }}>
                                      <IconButton
                                        onPress={() => handleDeleteImage(index,selectedItem.attributes.no_upload)}
                                        icon="delete"
                                      />
                                    </View>
                                  ))}
                              </View>
                            )}
                            {item.unique_id === image.unique_id && (
                              <View style={{flexDirection: 'row'}}>
                                {!fileData[item.unique_id]?.[index] && (
                                  <View
                                    style={{marginStart: 150, marginTop: 20}}>
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
                                    <Text>Take snap</Text>
                                  </View>
                                )}

                                {images.length !== 1 && (
                                  <View
                                    style={{
                                      justifyContent: 'center',
                                    }}>
                                    <IconButton
                                      onPress={() => handleDeleteImage(index,selectedItem.attributes.no_upload)}
                                      icon="delete"
                                    />
                                  </View>
                                )}
                              </View>
                            )}
                          </>
                        )}
                      </View>
                    );
                  })}
                </>

                {}
                {showAddButton && (
                  <View style={{marginRight: 10, marginLeft: 'auto'}}>
                    <Button
                      title="Add"
                      onPress={() => handleAddClick(item.unique_id,selectedItem.attributes.no_upload)}
                    
                    />
                  </View>
                )}
                {}
              </View>
            </React.Fragment>
          </ScrollView>
        )}
        {selectedItem && (
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <TouchableOpacity>
                <Button title="Submit" onPress={handleActionSubmit} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    padding: 16,
    marginTop: 16,
    borderRadius: 8,
    elevation: 3,
    height: 210, 
    width: 300, 
    marginLeft: 30, 
  },
  pickerContainer: {
    backgroundColor: 'white', 
    width: 300, 
    height: 50, 
    borderRadius: 8,
    overflow: 'hidden', 
    marginLeft: 32,
    marginTop: 20,
  },
  checkboxContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5, 
    
  },
  pickerContainer1: {
    backgroundColor: 'white', 
    width: 300, 
    height: 50, 
    borderRadius: 8,
    overflow: 'hidden', 
    marginLeft: 32,
    marginTop: 28,
  },
  label: {
    color: 'black',
    fontSize: 15,
    marginTop: 20,
    marginStart: 20,
  },
  centerCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:40
  },
  card1: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    
  },
  inputContainer: {
    borderColor: 'black',
    borderWidth: 1,
    margin: 20,
    borderRadius: 5, 
    backgroundcolor: 'white',
  },
  input: {
    height: 60,
    padding: 10,
    color: 'black',
    backgroundcolor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 80, 
    marginBottom: 30,
  },
  placeholderImg: {
    width: 120,
    height: 120,
    marginTop: 20,
    marginLeft: 100,
  },
  placeholderImg2: {
    width: 120,
    height: 120,
    marginTop: 100,
    marginLeft: 250,
  },
  placeholderImg1: {
    width: 120,
    height: 120,
    marginTop: 70,
    marginLeft: 150,
  },
  button: {
    flex: 1, 
    marginHorizontal: 8, 
  },
  picker: {
    width: '100%',
    height: '100%',
    color: 'black', 
  },
  imageUploadView: {
    paddingLeft: 20,
  },
};

export default ActionTracker;
