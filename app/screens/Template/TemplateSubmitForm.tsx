import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, Image, Linking, TouchableOpacity, View} from 'react-native';
import {Col, Grid} from 'react-native-easy-grid';
import VideoPlayer from 'react-native-video-controls';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import MultiSelectExample from './configure';
import {AirbnbRating, Rating} from 'react-native-ratings';
import {
  Button,
  Card,
  Checkbox,
  IconButton,
  Text,
  RadioButton,
  TextInput,
} from 'react-native-paper';
import CommonTextInput from '../../components/CommonTextInput';
import Loader from '../../components/Loader';
import {useSelector} from '../../redux';
import TemplateApi from '../../services/template';
import styles from './submitFormStyle';
import AppStyle from '../../config/styles';
import DropDown from 'react-native-paper-dropdown';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import {
  Asset,
  launchCamera,
  launchImageLibrary,

} from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import MultiLineInput from '../../components/MultiLineInput';
import {QuestionType} from '../../models/api/templates';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Picker} from '@react-native-picker/picker';
export interface CardProps {
  item: any;
  index: number;
}
type ErrorMessage = Record<string, { error: string }>;
const S3_URL = 'https://sgp1.digitaloceanspaces.com/freshvoice/';
// const S3_URL = 'http://143.110.245.242:9000/pg-cdn/';
const TemplateSubmitForm: React.FC = () => {
  const [datetime] = useState('');
  const [data, setData] = useState({} as any);
  const [asset_id] = useState<string>();
  const [setFileData] = useState({} as any);
  const [fileData1, setFileData1] = useState({} as any);
  const [fileData2, setFileData2] = useState({} as any);
  const [fileData3, setFileData3] = useState({} as any);
  const [submission, setSubmission] = useState({} as any);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDropDown, setShowDropDown] = useState({} as any);
  const user = useSelector(state => state.userReducer);
  const api = useMemo(() => new TemplateApi(), [user.access_token]);
  const templateApi = useMemo(() => new TemplateApi(), [user.loggedIn]);
  const route = useRoute<any>();
  const navigation = useNavigation();
  const {formId} = route.params;
  const [isDatePickerVisible, setDatePickerVisibility] = useState({} as any);
  const [submitting, setsubmitting] = useState(false);
  const [images, setImages] = useState([{unique_id: ''}]);
  const [images1, setImages1] = useState([{unique_id: ''}]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>({});
  const [images2, setImages2] = useState([{}]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [textValue, setTextValue] = useState('');
  const [rating, setRating] = useState(0);
const [selectedEmoji, setSelectedEmoji] = useState({ emoji: null, uniqueData: null });
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: {
      option: string;
      index: number;
      rowItem: string;
    };
  }>({});
  const showDatePicker = (uniqueId: string) => {
    setDatePickerVisibility({
      [uniqueId]: true,
    });
  };
  const hideDatePicker = (uniqueId: string) => {
    setDatePickerVisibility({
      [uniqueId]: false,
    });
  };
  const updateFormDate = (
    uid: any,
    item: any,
    inputType: any,
    momentFormat: string,
  ) => {
    return (
      <>
        <CommonTextInput
          txtStyle={styles.textInput}
          onChangeText={(value: any) => {
            updateFormData(item.unique_id, item, datetime, '', '','');
          }}
          placeHolder={'Your answer'}
          showRightButton={false}
          rightComponent={
            <TextInput.Icon
              name={'calendar'}
              size={22}
              color={'black'}
              forceTextInputFocus={false}
              onPress={() => {
                showDatePicker(item.unique_id);
              }}
            />
          }
          isSecure={false}
          values={
            submission[item.unique_id]?.value
              ? submission[item.unique_id]?.value
              : moment().format(momentFormat)
          }
          autoCapital={true}
        />
        <DateTimePickerModal
          isVisible={isDatePickerVisible[item.unique_id]}
          mode={inputType}
          onConfirm={(date: any) => {
            updateFormData(
              item.unique_id,
              item,
              moment(date).format(momentFormat),
              '',
              '',
             ''
            );
            hideDatePicker(item.unique_id);
          }}
          onCancel={() => {
            hideDatePicker(item.unique_id);
          }}
        />
      </>
    );
  };
  useEffect(() => {
    if (user.user_roles?.user_permissions?.CSFormSubmission?.includes('add')) {
      if (!submitting) {
        navigation.setOptions({
          headerRight: () => (
            <Button
              disabled={submitting}
              icon="check"
              onPress={() => {
                setSaving(true);
              }}>
              Submit
            </Button>
          ),
        });
      } else {
        navigation.setOptions({
          headerRight: null,
        });
      }
    } else {
      navigation.setOptions({
        headerRight: null,
      });
    }
  }, [navigation, user.user_roles]);
  const showError = (message: string) => {
    Notifier.showNotification({
      title: message,
      Component: NotifierComponents.Alert,
      duration: 2000,
      componentProps: {
        alertType: 'error',
      },
    });
    -setSaving(false);
  };
  useEffect(() => {
    navigation.setOptions({title: ''});
    loadFormDetails();
  }, []);
  const loadFormDetails = () => {
    api
      .templateDetails(formId)
      .then(res => {
        let counter = 0;
        navigation.setOptions({
          title: res.data.title,
          headerTitleStyle: {
            fontSize: 16,
          },
        });
        
        let formData = res.data.form_details.map((item: any) => {
          if (
            item.field_attributes.field_type === QuestionType.HEADING ||
            item.field_attributes.field_type === QuestionType.SUB_HEADING
          ) {
            counter = 0;
            return item;
          } else {
            counter += 1;
            return {
              ...item,
              counter: counter,
            };
          }
        });
        formData.map((item:any) =>{
          console.log(item,'item')
        })
        setData({
          ...res.data,
          form_details: formData,
        });
        setLoading(false);
      })
      .catch(err => {
        Notifier.showNotification({
          title: 'Something went wrong. Try again',
          Component: NotifierComponents.Alert,
          duration: 2000,
          componentProps: {
            alertType: 'error',
          },
        });
      });
  };
  useEffect(() => {
    if (saving) submit();
  }, [saving]);
  const submit = () => {
    if (loading) return;
    setSaving(false);
    setLoading(true);
    setsubmitting(true);
    let isError = false;
    for (let formDe of data.form_details) {
      if (formDe.is_required && !submission[formDe.unique_id]?.value) {
        isError = true;
        console.log("value")
      }
      for (let j = 0; j < formDe.field_attributes.options.length; j++) {
        if (submission[formDe.unique_id]?.uniqueId !== undefined) {
          if (
            submission[formDe.unique_id].uniqueId ===
            formDe.field_attributes.options[j].uniqueId
          ) {
            if (formDe.field_attributes.options[j].type === 'Mandatory') {
              if (formDe.field_attributes.options[j].remark) {
                if (submission[formDe.unique_id].remarks === undefined) {
                  isError = true;
                }
              }
              if (formDe.field_attributes.options[j].imageUpload) {
                if (submission[formDe.unique_id].upload === undefined) {
                  isError = true;
                }
              }
            }
          }
        }
      }
      if (
        submission[formDe.unique_id]?.field_type === 'Numeric' &&
        !submission[formDe.unique_id]?.value ===
          !isNaN(Number(submission[formDe.unique_id]?.value))
      ) {
        isError = true;
      }
      if (
        formDe.field_attributes.validations &&
        formDe.field_attributes.validations.type !== "Normal text" &&
        formDe.field_attributes.field_type !== "File Upload" &&
        !formDe.field_attributes.field_type.includes("Numeric")&&
        !formDe.field_attributes.field_type.includes("Yes/No Question")
      ) {
        if (
          formDe.field_attributes.validations.regex &&
          submission[formDe.unique_id]?.value
        ) {
          const regexPattern = formDe.field_attributes.validations.regex;
          const regex = new RegExp(regexPattern.slice(1, -1));
          if (!regex.test(String(submission[formDe.unique_id]?.value))) {
            isError = true;
            console.log(isError, "validation");

            setLoading(false);
            if (formDe.field_attributes.validations.regex)
              setErrorMessage((prevState:any) => ({
                ...prevState,
                [formDe.unique_id]: {
                  ...prevState[formDe.unique_id],
                  error: RegxMessage(formDe.field_attributes.validations),
                },
              }));
          }
        }
      }
      if (isError) {
        setLoading(false);
        setsubmitting(false);
        Notifier.showNotification({
          title: 'Please fill all required fields',
          Component: NotifierComponents.Alert,
          duration: 2000,
          componentProps: {
            alertType: 'error',
          },
        });
        return;
      }
    }
    let count = 1;
    if (count === 1) {
      api
        .submitForm(formId, {
          submitted_data: [submission],
          asset_id: asset_id,
        })
        .then(res => {
          setsubmitting(true);
          navigation.goBack();
          count++;
          Notifier.showNotification({
            title: 'Form submitted successfully.',
            Component: NotifierComponents.Alert,
            duration: 2000,
            componentProps: {
              alertType: 'success',
            },
          });
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
        // Hide offline notification if the network is back online
        Notifier.hideNotification();
      }
    });
  
   return () => {
     unsubscribe();
   };
 }, []);
  const selectitem = (selectedItems: any, uniqueId: any) => {
    setSubmission((prevState: any) => ({
      ...prevState,
      [uniqueId]: {
        ...prevState[uniqueId],
        asset: selectedItems,
      },
    }));
  };
  const setShowDropDownList = (key: string, value: boolean) => {
    setShowDropDown((prevState: any) => ({
      ...prevState,
      [key]: value,
    }));
  };
  const updateFormData = (
    uniqueId: string,
    item: any,
    value: any,
    unique_id: any,
    overallrating: any,
   count:any
  ) => {
    setSubmission((prevState: any) => ({
      ...prevState,
      [uniqueId]: {
        value: value,
        question: item.title,
        form_order: item.form_order,
        field_type: item.field_attributes.field_type,
        Answer: item.field_attributes?.Answer,
        uniqueId: unique_id,
        overallrating: overallrating,
      sort_order:item.counter,
      },
    }));
    for (let formDe of data.form_details) {
      if (formDe.unique_id === uniqueId) {
        if (
          formDe.field_attributes.validations &&
          formDe.field_attributes.validations.type !== "Normal text" &&
          formDe.field_attributes.field_type !== "File Upload" &&
          !formDe.field_attributes.field_type.includes("Yes/No Question")
        ) {
          if (
            formDe.field_attributes.validations.regex &&
            value &&
            formDe.field_attributes.validations.value !== "None"
          ) {
            const regexPattern = formDe.field_attributes.validations.regex;
            const regex = new RegExp(regexPattern.slice(1, -1));
           
          }
        }
      }
    }
  };
  console.log(submission, 'submission');
  const [selectedEmojis, setSelectedEmojis] = useState<{ [key: string]: string }>({});
  const updateFormRemarks = (uniqueId: string, item: any, value: any) => {
    setSubmission((prevState: any) => ({
      ...prevState,
      [uniqueId]: {
        ...prevState[uniqueId],
        remarks: value,
      },
    }));
  };
  const updateFormstar = (uniqueId: string, item: any, overallrating: any,selectedReview:any,RatingFactor:any,emojitype:any) => {
    setSubmission((prevState: any) => ({
      ...prevState,
      [uniqueId]: {
        ...prevState[uniqueId],
        overallrating: overallrating,
        Status: selectedReview, // Include selectedReview in the form data
        RatingFactor:RatingFactor,
        Symbol:emojitype,
      },
    }));
  };
  const updateFormdefault = (uniqueId: string, item: any, overallrating: any,selectedReview:any,RatingFactor:any,emojitype:any) => {
    setSubmission((prevState: any) => ({
      ...prevState,
      [uniqueId]: {
        ...prevState[uniqueId],
        overallrating: overallrating,
        Status: selectedReview, // Include selectedReview in the form data
        RatingFactor:RatingFactor,
        Symbol:emojitype,
      },
    }));
  };
  const updateFormemoji = (uniqueId: string, item: any, overallrating: any,selectedReview:any,RatingFactor:any,emojitype:any) => {
    setSubmission((prevState: any) => ({
      ...prevState,
      [uniqueId]: {
        ...prevState[uniqueId],
        overallrating: overallrating,
        Status: selectedReview, // Include selectedReview in the form data
        RatingFactor:RatingFactor,
        Symbol:emojitype,
      },
    }));
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
  const valuess = Symbol();
  const Updatefileupload = (uniqueId:any, item:any, value:any, values:any) => {
    setSubmission((prevState:any) => ({
      ...prevState,
      [uniqueId]: {
        ...prevState[uniqueId],
        value:  valuess,
        upload: value,
       
      },
    }));
  };
  // const Updatefileupload = (uniqueId: string, item: any, value: any) => {
  //   setSubmission((prevState: any) => ({
  //     ...prevState,
  //     [uniqueId]: {
  //       ...prevState[uniqueId],
  //       upload: value,
        
  //     },
  //   }));
  // };
  const handleEmojiPress = (uniqueId:any, emoji:any) => {
    setSelectedEmojis((prevSelectedEmojis) => ({
      ...prevSelectedEmojis,
      [uniqueId]: emoji,
    }));
  
    setSubmission((prevState: { [x: string]: any; }) => ({
      ...prevState,
      [uniqueId]: {
        ...prevState[uniqueId],
        Symbol: emoji,
      },
    }));
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
  const snapPhoto2 = async (
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
        processPhoto2(uniqueId, result, item, data, index, type);
      }
    } catch (err) {
      showError('Something went wrong. Try again.');
    }
  };
  const snapPhoto1 = async (
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
        processPhoto1(uniqueId, result, item, data, index, type);
      }
    } catch (err) {
      showError('Something went wrong. Try again.');
    }
  };
  
  const snapvideo = async (
    uniqueId: string,
    item: any,
    data: any,
    index: Number,
    type: any,
  ) => {
    try {
      const results = await launchCamera({
        mediaType: 'video',
        cameraType: 'back',
        quality: 0.2,
      });
      if (results.didCancel) {
      } else if (results.errorCode) {
        showError('Something went wrong. Try again.');
      } else {
        let result = results!.assets![0];
        processvideo(uniqueId, result, item, data, index, type);
      }
    } catch (err) {
      showError('Something went wrong. Try again.');
    }
  };
  const snapvideo1 = async (
    uniqueId: string,
    item: any,
    data: any,
    index: Number,
    type: any,
  ) => {
    try {
      const results = await launchCamera({
        mediaType: 'video',
        cameraType: 'back',
        quality: 0.2,
      });
      if (results.didCancel) {
      } else if (results.errorCode) {
        showError('Something went wrong. Try again.');
      } else {
        let result = results!.assets![0];
        processvideo1(uniqueId, result, item, data, index, type);
      }
    } catch (err) {
      showError('Something went wrong. Try again.');
    }
  };
  const snapvideo2 = async (
    uniqueId: string,
    item: any,
    data: any,
    index: Number,
    type: any,
  ) => {
    try {
      const results = await launchCamera({
        mediaType: 'video',
        cameraType: 'back',
        quality: 0.2,
      });
      if (results.didCancel) {
      } else if (results.errorCode) {
        showError('Something went wrong. Try again.');
      } else {
        let result = results!.assets![0];
        processvideo3(uniqueId, result, item, data, index, type);
      }
    } catch (err) {
      showError('Something went wrong. Try again.');
    }
  };
  const processvideo3 = async (
    uniqueId: string,
    asset: Asset,
    item: any,
    datas: any,
    index: any,
    type: any,
  ) => {
    switch (asset.type) {
      case '.mp4':
      case '.avi':
      case '.mov':
      case '.mkv':
      case 'video/mp4':
      case 'video/avi':
      case 'video/quicktime':
      case 'video/x-matroska':
        try {
          let data: any = await uploadvideo(asset);
          if (data !== null && data.media_id) {
            if (datas === 'Question') {
              updateFormData(item.unique_id, item, data.media_key, '', '','');
              setFileData1((prevState: any) => {
                const updatedArray = [...prevState[uniqueId]];
                updatedArray[index] = {type: type, src: data.media_key};
                return {
                  ...prevState,
                  [uniqueId]: updatedArray,
                };
              });
            } else {
              setFileData1((prevState: any) => {
                const existingArray = prevState[uniqueId] || [];
                const updatedArray = [...existingArray];
                updatedArray[index] = {type: type, src: data.media_key};
                Updatefileupload(item.unique_id, item, updatedArray,'');
                return {
                  ...prevState,
                  [uniqueId]: updatedArray,
                };
              });
            }
            Notifier.showNotification({
              title: 'video Uploaded Successfully.',
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
  const onFileChoose = async (
    uniqueId: string,
    item: any,
    item2: any,
    datas: any,
    index: Number,
    type: any,
  ) => {
    try {
      const res: DocumentPickerResponse[] | undefined =
        await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
        });
      if (res && res.length > 0) {
        const selectedFile = res[0];
        const file = {
          uri: selectedFile.uri,
          type: selectedFile.type || '',
          name: selectedFile.name || undefined,
          size: selectedFile.size || undefined,
        };
        await processdocument(uniqueId, file, item, datas, index, type);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const onFileChoose1 = async (
    uniqueId: string,
    item: any,
    item2: any,
    datas: any,
    index: Number,
    type: any,
  ) => {
    try {
      const res: DocumentPickerResponse[] | undefined =
        await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
        });
      if (res && res.length > 0) {
        const selectedFile = res[0];
        const file = {
          uri: selectedFile.uri,
          type: selectedFile.type || '',
          name: selectedFile.name || undefined,
          size: selectedFile.size || undefined,
        };

        await processdocument1(uniqueId, file, item, datas, index, type);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const onFileChoose2 = async (
    uniqueId: string,
    item: any,
    item2: any,
    datas: any,
    index: Number,
    type: any,
  ) => {
    try {
      const res: DocumentPickerResponse[] | undefined =
        await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
        });

      if (res && res.length > 0) {
        const selectedFile = res[0];

        const file = {
          uri: selectedFile.uri,
          type: selectedFile.type || '',
          name: selectedFile.name || undefined,
          size: selectedFile.size || undefined,
        };

        await processdocument2(uniqueId, file, item, datas, index, type);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const processdocument2 = async (
    uniqueId: string,
    asset: any,
    item: any,
    datas: any,
    index: any,
    type: any,
  ) => {
    switch (asset.type) {
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
          let data: any = await uploaddocument(asset);
          if (data !== null && data.media_id) {
            setFileData2((prevState: any) => {
              const existingArray = prevState[uniqueId] || [];
              const updatedArray = [...existingArray];
              updatedArray[index] = {type: type, src: data.media_key};
              Updatefileupload(item.unique_id, item, updatedArray,'');

              return {
                ...prevState,
                [uniqueId]: updatedArray,
              };
            });
            Notifier.showNotification({
              title: 'File Uploaded Successfully.',
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
            title: 'Something went wrong. Try again.',
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
          title: 'Selected File Type not Vaild. only(.pdf,.docx,.csv)allowed',
          Component: NotifierComponents.Alert,
          duration: 4000,
          componentProps: {
            alertType: 'error',
          },
        });
        return;
    }
  };
  const selectPhoto = async (
    uniqueId: string,
    item: any,
    type: any,
    data: any,
    index: any,
    types: any,
  ) => {
    try {
      if (type?.upload.photo.length > 0 && type?.upload.video.length == 0) {
        var results = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.2,
          selectionLimit: 1,
        });

        if (results.didCancel) {
        } else if (results.errorCode) {
          showError('Something went wrong. Try again.');
        } else {
          let result = results!.assets![0];
          let finaldata = {
            name: result.fileName,
            type: result.type,
            size: result.fileSize,
          };
          processPhoto(uniqueId, result, item, data, index, types);
        }
      }
      if (type?.upload.video.length > 0 && type?.upload.photo.length === 0) {
        var results = await launchImageLibrary({
          mediaType: 'video',
          quality: 0.2,
          selectionLimit: 1,
        });
        if (results.didCancel) {
        } else if (results.errorCode) {
          showError('Something went wrong. Try again.');
        } else {
          let result = results!.assets![0];
          processPhoto(uniqueId, result, item, data, index, types);
        }
      }
      if (type?.upload.video.length > 0 && type?.upload.photo.length > 0) {
        var results = await launchImageLibrary({
          mediaType: 'mixed',
          quality: 0.2,
          selectionLimit: 1,
        });
        if (results.didCancel) {
        } else if (results.errorCode) {
          showError('Something went wrong. Try again.');
        } else {
          let result = results!.assets![0];

          processPhoto(uniqueId, result, item, data, index, types);
        }
      }
    } catch (err) {
      showError('Something went wrong. Try again.');
    }
  };
  const selectPhoto1 = async (
    uniqueId: string,
    item: any,
    type: any,
    data: any,
    index: any,
    types: any,
  ) => {
    try {
      if (type?.upload?.photo?.length > 0 && type?.upload?.video?.length == 0) {
        var results = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.2,
          selectionLimit: 1,
        });

        if (results.didCancel) {
        } else if (results.errorCode) {
          showError('Something went wrong. Try again.');
        } else {
          let result = results!.assets![0];
          let finaldata = {
            name: result.fileName,
            type: result.type,
            size: result.fileSize,
          };
          processPhoto1(uniqueId, result, item, data, index, types);
        }
      }
      if (
        type?.upload?.video?.length > 0 &&
        type?.upload?.photo?.length === 0
      ) {
        var results = await launchImageLibrary({
          mediaType: 'video',
          quality: 0.2,
          selectionLimit: 1,
        });
        if (results.didCancel) {
        } else if (results.errorCode) {
          showError('Something went wrong. Try again.');
        } else {
          let result = results!.assets![0];
          processPhoto1(uniqueId, result, item, data, index, types);
        }
      }
      if (type?.upload?.video?.length > 0 && type?.upload?.photo?.length > 0) {
        var results = await launchImageLibrary({
          mediaType: 'mixed',
          quality: 0.2,
          selectionLimit: 1,
        });
        if (results.didCancel) {
        } else if (results.errorCode) {
          showError('Something went wrong. Try again.');
        } else {
          let result = results!.assets![0];

          processPhoto1(uniqueId, result, item, data, index, types);
        }
      }
      if (type?.photo?.length > 0 && type?.video?.length == 0) {
        var results = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.2,
          selectionLimit: 1,
        });

        if (results.didCancel) {
        } else if (results.errorCode) {
          showError('Something went wrong. Try again.');
        } else {
          let result = results!.assets![0];
          let finaldata = {
            name: result.fileName,
            type: result.type,
            size: result.fileSize,
          };
          processPhoto1(uniqueId, result, item, data, index, types);
        }
      }
      if (type?.video?.length > 0 && type?.photo?.length === 0) {
        var results = await launchImageLibrary({
          mediaType: 'video',
          quality: 0.2,
          selectionLimit: 1,
        });
        if (results.didCancel) {
        } else if (results.errorCode) {
          showError('Something went wrong. Try again.');
        } else {
          let result = results!.assets![0];
          processPhoto1(uniqueId, result, item, data, index, types);
        }
      }
      if (type?.video?.length > 0 && type?.photo?.length > 0) {
        var results = await launchImageLibrary({
          mediaType: 'mixed',
          quality: 0.2,
          selectionLimit: 1,
        });
        if (results.didCancel) {
        } else if (results.errorCode) {
          showError('Something went wrong. Try again.');
        } else {
          let result = results!.assets![0];

          processPhoto1(uniqueId, result, item, data, index, types);
        }
      }
    } catch (err) {
      showError('Something went wrong. Try again.');
    }
  };
  const selectPhoto2 = async (
    uniqueId: string,
    item: any,
    type: any,
    data: any,
    index: any,
    types: any,
  ) => {
    try {
      if (type?.upload?.photo?.length > 0 && type?.upload?.video?.length == 0) {
        var results = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.2,
          selectionLimit: 1,
        });

        if (results.didCancel) {
        } else if (results.errorCode) {
          showError('Something went wrong. Try again.');
        } else {
          let result = results!.assets![0];
          let finaldata = {
            name: result.fileName,
            type: result.type,
            size: result.fileSize,
          };
          processPhoto2(uniqueId, result, item, data, index, types);
        }
      }
      if (
        type?.upload?.video?.length > 0 &&
        type?.upload?.photo?.length === 0
      ) {
        var results = await launchImageLibrary({
          mediaType: 'video',
          quality: 0.2,
          selectionLimit: 1,
        });
        if (results.didCancel) {
        } else if (results.errorCode) {
          showError('Something went wrong. Try again.');
        } else {
          let result = results!.assets![0];
          processPhoto2(uniqueId, result, item, data, index, types);
        }
      }
      if (type?.upload?.video?.length > 0 && type?.upload?.photo?.length > 0) {
        var results = await launchImageLibrary({
          mediaType: 'mixed',
          quality: 0.2,
          selectionLimit: 1,
        });
        if (results.didCancel) {
        } else if (results.errorCode) {
          showError('Something went wrong. Try again.');
        } else {
          let result = results!.assets![0];
          processPhoto2(uniqueId, result, item, data, index, types);
        }
      }
      if (type?.photo?.length > 0 && type?.video?.length == 0) {
        var results = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.2,
          selectionLimit: 1,
        });

        if (results.didCancel) {
        } else if (results.errorCode) {
          showError('Something went wrong. Try again.');
        } else {
          let result = results!.assets![0];
          let finaldata = {
            name: result.fileName,
            type: result.type,
            size: result.fileSize,
          };
          processPhoto2(uniqueId, result, item, data, index, types);
        }
      }
      if (type?.video?.length > 0 && type?.photo?.length === 0) {
        var results = await launchImageLibrary({
          mediaType: 'video',
          quality: 0.2,
          selectionLimit: 1,
        });
        if (results.didCancel) {
        } else if (results.errorCode) {
          showError('Something went wrong. Try again.');
        } else {
          let result = results!.assets![0];
          processPhoto2(uniqueId, result, item, data, index, types);
        }
      }
      if (type?.video?.length > 0 && type?.photo?.length > 0) {
        var results = await launchImageLibrary({
          mediaType: 'mixed',
          quality: 0.2,
          selectionLimit: 1,
        });
        if (results.didCancel) {
        } else if (results.errorCode) {
          showError('Something went wrong. Try again.');
        } else {
          let result = results!.assets![0];

          processPhoto2(uniqueId, result, item, data, index, types);
        }
      }
    } catch (err) {
      showError('Something went wrong. Try again.');
    }
  };
  const processPhoto2 = async (
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
            setFileData3((prevState: any) => {
              const existingArray = prevState[uniqueId] || [];
              const updatedArray = [...existingArray];
              updatedArray[index] = {type: type, src: data.media_key};
              Updatefileupload(item.unique_id, item, updatedArray,'');

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
            title: 'Something went wrong. Try again.',
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
          title: 'Selected File Type not Vaild. only (.jpeg,.Png) allowed',
          Component: NotifierComponents.Alert,
          duration: 2000,
          componentProps: {
            alertType: 'error',
          },
        });
        return;
    }
  };
  const processPhoto1 = async (
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
            setFileData2((prevState: any) => {
              const existingArray = prevState[uniqueId] || [];
              const updatedArray = [...existingArray];
              updatedArray[index] = {type: type, src: data.media_key};
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
            title: 'Something went wrong. Try again.',
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
          title: 'Selected File Type not Vaild. only (.jpeg,.Png) allowed',
          Component: NotifierComponents.Alert,
          duration: 2000,
          componentProps: {
            alertType: 'error',
          },
        });
        return;
    }
  };
  const processvideo = async (
    uniqueId: string,
    asset: Asset,
    item: any,
    datas: any,
    index: any,
    type: any,
  ) => {
    switch (asset.type) {
      case '.mp4':
      case '.avi':
      case '.mov':
      case '.mkv':
      case 'video/mp4':
      case 'video/avi':
      case 'video/quicktime':
      case 'video/x-matroska':
        try {
          let data: any = await uploadvideo(asset);
          if (data !== null && data.media_id) {
            setFileData1((prevState: any) => {
              const existingArray = prevState[uniqueId] || [];
              const updatedArray = [...existingArray];
              updatedArray[index] = {type: type, src: data.media_key};
              UpdateFormUploads(item.unique_id, item, updatedArray);

              return {
                ...prevState,
                [uniqueId]: updatedArray,
              };
            });

            Notifier.showNotification({
              title: 'video Uploaded Successfully.',
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
  const processvideo1 = async (
    uniqueId: string,
    asset: Asset,
    item: any,
    datas: any,
    index: any,
    type: any,
  ) => {
    switch (asset.type) {
      case '.mp4':
      case '.avi':
      case '.mov':
      case '.mkv':
      case 'video/mp4':
      case 'video/avi':
      case 'video/quicktime':
      case 'video/x-matroska':
        try {
          let data: any = await uploadvideo(asset);
          if (data !== null && data.media_id) {
            setFileData2((prevState: any) => {
              const existingArray = prevState[uniqueId] || [];
              const updatedArray = [...existingArray];
              updatedArray[index] = {type: type, src: data.media_key};
              UpdateFormUploads(item.unique_id, item, updatedArray);

              return {
                ...prevState,
                [uniqueId]: updatedArray,
              };
            });

            Notifier.showNotification({
              title: 'video Uploaded Successfully.',
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
            if (datas === 'Question') {
              updateFormData(item.unique_id, item, data.media_key, '', '','');

              setFileData1((prevState: any) => {
                const updatedArray = [...prevState[uniqueId]];
                updatedArray[index] = {type: type, src: data.media_key};
                return {
                  ...prevState,
                  [uniqueId]: updatedArray,
                };
              });
            } else {
              setFileData1((prevState: any) => {
                const existingArray = prevState[uniqueId] || [];
                const updatedArray = [...existingArray];
                updatedArray[index] = {type: type, src: data.media_key};
                UpdateFormUploads(item.unique_id, item, updatedArray);
                return {
                  ...prevState,
                  [uniqueId]: updatedArray,
                };
              });
            }
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
            title: 'Something went wrong. Try again.',
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
          title: 'Selected File Type not Vaild. only (.jpeg,.Png) allowed',
          Component: NotifierComponents.Alert,
          duration: 2000,
          componentProps: {
            alertType: 'error',
          },
        });
        return;
    }
  };
  const handleOptionChange = (newOption: any, uniqueId: any) => {
    setFileData1((prevState: any) => ({
      ...prevState,
      [uniqueId]: [],
    }));
    setImages([{unique_id: ''}]);
  };
  const handleOptionChange1 = (newOption: any, uniqueId: any) => {
    setFileData2((prevState: any) => ({
      ...prevState,
      [uniqueId]: [],
    }));
    setImages1([{unique_id: ''}]);
  };
  // const processvideo = async (
  //   uniqueId: string,
  //   asset: Asset,
  //   item: any,
  //   datas: any,
  //   index: any,
  //   type: any,
  // ) => {
  //   switch (asset.type) {
  //     case '.mp4':
  //     case '.avi':
  //     case '.mov':
  //     case '.mkv':
  //     case 'video/mp4':
  //     case 'video/avi':
  //     case 'video/quicktime':
  //     case 'video/x-matroska':
  //       try {
  //         let data: any = await uploadvideo(asset);
  //         if (data !== null && data.media_id) {
  //           if (datas === 'Question') {
  //             updateFormData(item.unique_id, item, data.media_key, '', '','');
  //             setFileData1((prevState: any) => {
  //               const updatedArray = [...prevState[uniqueId]];
  //               updatedArray[index] = {type: type, src: data.media_key};
  //               return {
  //                 ...prevState,
  //                 [uniqueId]: updatedArray,
  //               };
  //             });
  //           } else {
  //             setFileData1((prevState: any) => {
  //               const existingArray = prevState[uniqueId] || [];
  //               const updatedArray = [...existingArray];
  //               updatedArray[index] = {type: type, src: data.media_key};
  //               UpdateFormUploads(item.unique_id, item, updatedArray);

  //               return {
  //                 ...prevState,
  //                 [uniqueId]: updatedArray,
  //               };
  //             });
  //           }
  //           Notifier.showNotification({
  //             title: 'video Uploaded Successfully.',
  //             Component: NotifierComponents.Alert,
  //             duration: 2000,
  //             componentProps: {
  //               alertType: 'success',
  //             },
  //           });
  //           setLoading(false);
  //         }
  //       } catch (err) {
  //         setLoading(false);
  //         Notifier.showNotification({
  //           title: 'Selected File Type not Vaild. only (.mp4,.mkv) allowed',
  //           Component: NotifierComponents.Alert,
  //           duration: 2000,
  //           componentProps: {
  //             alertType: 'error',
  //           },
  //         });
  //       }
  //       break;
  //     default:
  //       Notifier.showNotification({
  //         title: 'Selected File Type not Vaild. Try again.',
  //         Component: NotifierComponents.Alert,
  //         duration: 2000,
  //         componentProps: {
  //           alertType: 'error',
  //         },
  //       });
  //       return;
  //   }
  // };
  const processdocument = async (
    uniqueId: string,
    asset: any,
    item: any,
    datas: any,
    index: any,
    type: any,
  ) => {
    switch (asset.type) {
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
        try {
          let data: any = await uploaddocument(asset);
          if (data !== null && data.media_id) {
            if (datas === 'Question') {
              updateFormData(item.unique_id, item, data.media_key, '', '','');
              setFileData((prevState: any) => {
                const updatedArray = [...prevState[uniqueId]];
                updatedArray[index] = {type: type, src: data.media_key};
                return {
                  ...prevState,
                  [uniqueId]: updatedArray,
                };
              });
            } else {
              setFileData1((prevState: any) => {
                const existingArray = prevState[uniqueId] || [];
                const updatedArray = [...existingArray];
                updatedArray[index] = {type: type, src: data.media_key};
                UpdateFormUploads(item.unique_id, item, updatedArray);
                return {
                  ...prevState,
                  [uniqueId]: updatedArray,
                };
              });
            }
            Notifier.showNotification({
              title: 'File Uploaded Successfully.',
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
            title: 'Something went wrong. Try again.',
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
          title: 'Selected File Type not Vaild. only(.pdf,.docx,.csv)allowed',
          Component: NotifierComponents.Alert,
          duration: 4000,
          componentProps: {
            alertType: 'error',
          },
        });
        return;
    }
  };
  const processdocument1 = async (
    uniqueId: string,
    asset: any,
    item: any,
    datas: any,
    index: any,
    type: any,
  ) => {
    switch (asset.type) {
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
          let data: any = await uploaddocument(asset);
          if (data !== null && data.media_id) {
            setFileData2((prevState: any) => {
              const existingArray = prevState[uniqueId] || [];
              const updatedArray = [...existingArray];
              updatedArray[index] = {type: type, src: data.media_key};
              UpdateFormUploads(item.unique_id, item, updatedArray);

              return {
                ...prevState,
                [uniqueId]: updatedArray,
              };
            });
            Notifier.showNotification({
              title: 'File Uploaded Successfully.',
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
            title: 'Something went wrong. Try again.',
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
          title: 'Selected File Type not Vaild. only(.pdf,.docx,.csv)allowed',
          Component: NotifierComponents.Alert,
          duration: 4000,
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
              console.log('Uploadggg', res.data)
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
  // const uploadImage = async (file: Asset) => {
  //   return new Promise((resolve, reject) => {
  //     if (!file.uri || typeof file.uri !== 'string') {
  //       reject(new Error('File URI is invalid or undefined.'));
  //       return;
  //     }
  //     Image.getSize(file.uri, (width, height) => {
  //       // Log the image dimensions
  //       console.log(`Image dimensions: ${width}x${height}`);
  //       let data = {
  //         content_type: file.type,
  //       };
  //       api
  //         .ImageUploader(data)
  //         .then(res => {
  //           const formData = new FormData();
  //           Object.keys(res.data.data.fields).forEach(key => {
  //             formData.append(key, res.data.data.fields[key]);
  //           });
  //           formData.append('file', {
  //             type: file.type,
  //             name: file.fileName,
  //             uri: file.uri,
  //           });
  //           const xhr = new XMLHttpRequest();
  //           xhr.open('POST', res.data.data.url, true);
  //           console.log('Upload', res.data.data.url);
  //           console.log('Uploadsss', res);
  //           xhr.onload = function () {
  //             if (this.status === 204) {
  //               console.log('Uploadggg', res.data);
  //               resolve(res.data);
  //             } else {
  //               reject(new Error('Upload failed'));
  //             }
  //           };
  //           xhr.onerror = function () {
  //             reject(new Error('An error occurred during the upload'));
  //           };
  
  //           xhr.upload.onprogress = function (evt) {
  //             if (evt.lengthComputable) {
  //               const totalSize = evt.total; // Total size of the upload
  //               const uploadedSize = evt.loaded; // Uploaded size in bytes
  //               // Convert bytes to kilobytes and megabytes
  //               const uploadedKB = uploadedSize / 1024; // Convert bytes to kilobytes
  //               const uploadedMB = uploadedKB / 1024; // Convert kilobytes to megabytes
  //               // Log upload progress and image size information in KB or MB
  //               console.log(uploadedSize,totalSize,'uploadedSize')
  //               console.log(`Uploaded ${uploadedKB.toFixed(3)} KB (${uploadedMB.toFixed(3)} MB) out of ${totalSize} bytes`);
  //             }
  //           };
  //           xhr.send(formData);
  //         })
  //         .catch(err => {
  //           reject(err);
  //         });
  //     }, (error) => {
  //       console.error('Error getting image size:', error);
  //       reject(error);
  //     });
  //   });
  // };
  
  const uploadvideo = async (file: Asset) => {
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
          xhr.onload = function () {
            if (this.status === 204) {
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
  const downloadDocument = (uri: any) => {
    Linking.openURL(uri);
  };
  const uploaddocument = async (file: DocumentPickerResponse) => {
    return new Promise(async (resolve, reject) => {
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
  const handleDeletePhoto = (uniqueId: any, index: any) => {
    setFileData1((prevState: any) => {
      const updatedArray = [...prevState[uniqueId]];
      updatedArray.splice(index, 1);

      return {
        ...prevState,
        [uniqueId]: updatedArray,
      };
    });
  };
  const handleDeletePhoto1 = (uniqueId: any, index: any) => {
    setFileData2((prevState: any) => {
      const updatedArray = [...prevState[uniqueId]];
      updatedArray.splice(index, 1);
      return {
        ...prevState,
        [uniqueId]: updatedArray,
      };
    });
  };
  const handleDeletePhoto2 = (uniqueId: any, index: any) => {
    setFileData3((prevState: any) => {
      const updatedArray = [...prevState[uniqueId]];
      updatedArray.splice(index, 1);
      return {
        ...prevState,
        [uniqueId]: updatedArray,
      };
    });
  };
  const handleDeleteImage = (index: any) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };
  const handleDeleteImage1 = (index: any) => {
    setImages1(prevImages => prevImages.filter((_, i) => i !== index));
  };
  const RegxMessage = (value:any) => {
    if (value.value === "Pan No" && !value.errorText) {
      return "Enter Valid Pan No";
    } else if (value.value === "Aadhar No" && !value.errorText) {
      return "Enter Valid Aadhar No";
    } else if (value.value === "GST No" && !value.errorText) {
      return "Enter Valid GST No";
    } else if (value.value === "Pincode" && !value.errorText) {
      return "Enter Valid Pincode";
    } else if (value.value === "Email" && !value.errorText) {
      return "Enter Valid Email";
    } else if (value.value === "URL" && !value.errorText) {
      return "Enter Valid URL";
    } else if (value.value === "Phone No" && !value.errorText) {
      return "Enter Valid Phone No";
    } else if (value.value === "IFSC Code" && !value.errorText) {
      return "Enter Valid IFSC Code";
    } else if (value.value === "Driving License No" && !value.errorText) {
      return "Enter Valid Driving License No";
    } else if (value.value === "Min" && !value.errorText) {
      return `Please enter a value that is at least ${value.min}`;
    } else if (value === "Max" && !value.errorText) {
      return `Please enter a value that is at most ${value.max}`;
    } else if (value === "Min-Max" && !value.errorText) {
      return `Please enter a value between ${value.min} and ${value.max}`;
    } else if (value === "Fixed") {
      return value.errorText;
    }
    return value.errorText;
  };
  const validateField = (item:any) => {
    if (item.is_required && !submission[item.unique_id]?.value) {
      return <Text style={styles.validText}>This field is required</Text>;
    }
    if (
      submission[item.unique_id]?.field_type === 'Numeric' &&
      !submission[item.unique_id]?.value ===
        !isNaN(Number(submission[item.unique_id]?.value))
    ) {
      return <Text style={styles.validText}>Enter only numeric value</Text>;
    }
    if (item.is_required && item.field_attributes.validations) {
      try {
        let validations = item.field_attributes.validations;
        if (validations.method === 'Regex') {
          let regex = new RegExp(validations.regex);
          if (!regex.test(submission[item.unique_id]?.value)) {
            // Check if RegxMessage function returns a valid string
            const errorMessage = RegxMessage(validations) || 'Regex mismatch error';
            return (
              <Text style={styles.validText}>{errorMessage}</Text>
            );
          }
        }
      } catch (err) {
        console.log(err);
        // Handle any potential error when processing the regex
        return (
          <Text style={styles.validText}>Error validating regex</Text>
        );
      }
    }
    
  };
  
  

  const renderRequired = (field_attributes: any, item: any, values: any) => {
    switch (field_attributes.field_type) {
      case 'Short Answer':
      case 'Long Answer':
      case 'Numeric':
        return <React.Fragment>{validateField(item)}</React.Fragment>;
      default:
        return (
          <React.Fragment>
            {item.is_required && !submission[item.unique_id]?.value && (
              <Text style={styles.validText}>This field is required</Text>
            )}
            {field_attributes?.options.map((item2: any) => (
              <></>
            ))}
            {submission[item.unique_id]?.field_type === 'Numeric' &&
              !submission[item.unique_id]?.value ===
                !isNaN(Number(submission[item.unique_id]?.value)) && (
                <Text style={styles.validText}>Enter only numeric value</Text>
              )}
          </React.Fragment>
        );
    }
  };
  const renderInput = (field_attributes: any, item: any) => {
    switch (field_attributes.field_type) {
      case 'Short Answer':
        return (
          <MultiLineInput
            txtStyle={styles.textInput}
            onChangeText={(value: any) => {
              if (item.unique_id.field_type === 'Numeric') {
                if (value.match())
                  updateFormData(item.unique_id, item, value, '', '','');
              } else {
                updateFormData(item.unique_id, item, value, '', '','');
              }
            }}
            placeHolder={'Your answer'}
            showRightButton={false}
            isSecure={false}
            values={submission[item.unique_id]?.value}
            errorText={errorMessage[item.unique_id]?.error}
            autoCapital={true}
          />
        );
      case 'Long Answer':
        return (
          <MultiLineInput
            txtStyle={styles.textInput}
            onChangeText={(value: any) => {
              if (item.unique_id.field_type === 'Numeric') {
                if (value.match())
                  updateFormData(item.unique_id, item, value, '', '','');
              } else {
                updateFormData(item.unique_id, item, value, '', '','');
              }
            }}
            placeHolder={'Your answer'}
            showRightButton={false}
            isSecure={false}
            values={submission[item.unique_id]?.value}
              errorText={errorMessage[item.unique_id]?.error}
            autoCapital={true}
          />
        );
      case 'Numeric':
        const validationRegex = field_attributes?.validations?.regex;
        const uniqueId = item.unique_id;

        return (
          <MultiLineInput
            txtStyle={styles.textInput}
            onChangeText={(value: any) => {
              if (validationRegex) {
                console.log('Regex Pattern:', validationRegex);
                console.log('Value to Test:', value);

                if (!new RegExp(validationRegex).test(value)) {
                  console.log('Invalid value:', value);
                  updateFormData(uniqueId, item, value, '', '',''); // Assuming this is the function to update form data
                  return; // Regex validation failed, do not update form data
                }
              }

              console.log('Valid value:', value);
              updateFormData(uniqueId, item, value, '', '',''); // Assuming this is the function to update form data
            }}
            placeHolder={'Your answer'}
            showRightButton={false}
            isSecure={false}
            keyboardType="numeric"
            values={submission[uniqueId]?.value}
            autoCapital={false}
          />
        );

      case 'Checkbox':
        return (
          <React.Fragment>
            <ScrollView>
              {field_attributes.options.map((item2: any) => (
                <React.Fragment key={item2.uniqueId}>
                  <Grid>
                    <Col
                      style={{
                        width: 40,
                      }}>
                      <Checkbox
                        color={AppStyle.color.COLOR_PRIMARY}
                        onPress={() => {
                          updateFormData(
                            item.unique_id,
                            item,
                            item2.option,
                            '',
                            '',
                            ''
                          );
                        }}
                        status={
                          submission[item.unique_id]?.value === item2.option
                            ? 'checked'
                            : 'unchecked'
                        }
                      />
                    </Col>
                    <Col style={styles.checkBoxCol}>
                      <Text>{item2.option}</Text>
                    </Col>
                  </Grid>
                  {submission[item.unique_id]?.value === item2.option && (
                    <>
                      {item2?.remark && (
                        <React.Fragment>
                          <CommonTextInput
                            txtStyle={styles.textInput}
                            onChangeText={(value: any) => {
                              if (value.match()) {
                                updateFormRemarks(item.unique_id, item2, value);
                              } else {
                                updateFormRemarks(item.unique_id, item2, '');
                              }
                            }}
                            placeHolder={item2.label}
                            showRightButton={false}
                            isSecure={false}
                            autoFocus={true}
                            values={submission[item.unique_id]?.remarks}
                            autoCapital={true}
                          />
                          {item2?.type === 'Mandatory' &&
                            !submission[item.unique_id]?.remarks && (
                              <Text style={styles.requiredText}>
                                This field is required
                              </Text>
                            )}
                        </React.Fragment>
                      )}
                    </>
                  )}
                </React.Fragment>
              ))}
            </ScrollView>
          </React.Fragment>
        );
      case 'Linear Scale':
        const numLinearend = item.field_attributes.Linearend;
        const radioButtons = [];
        for (
          let i = item.field_attributes.Linearstart;
          i <= numLinearend;
          i++
        ) {
          radioButtons.push(
            <View>
              <Text style={{fontSize: 15, marginStart: 12}}>{i}</Text>
              <View
                key={i}
                style={{flexDirection: 'column', alignItems: 'center'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <RadioButton
                    value={submission[item.unique_id]?.value}
                    status={
                      submission[item.unique_id]?.value === i
                        ? 'checked'
                        : 'unchecked'
                    }
                    onPress={() => {
                      updateFormData(item.unique_id, item, i, '', numLinearend,'');
                    }}
                  />
                </View>
              </View>
            </View>,
          );
        }
        const radioButtonsLength = radioButtons.length; // This gives you the length

        console.log('Number of Radio Buttons:', radioButtonsLength);
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <ScrollView
                horizontal={true}
                contentContainerStyle={{flexGrow: 1}}>
                <View
                  style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{marginTop: 16, fontSize: 15, color: 'black'}}>
                    {item?.field_attributes?.Linearstart_label}
                  </Text>
                  <View style={{flexDirection: 'row'}}>{radioButtons}</View>
                  <Text style={{marginTop: 16, fontSize: 15, color: 'black'}}>
                    {item?.field_attributes?.Linearend_label}
                  </Text>
                </View>
              </ScrollView>
            </View>
          </View>
        );

      case 'Checkbox grid':
        console.log(selectedOptions, 'lkjhg');
        return (
          <View>
            <View style={{flexDirection: 'row', marginStart: 100}}>
              {field_attributes.options.map((item2: any, index: number) => (
                <Text
                  key={item2.option}
                  style={{
                    width: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginStart: 20,
                  }}>
                  {item2.option}
                </Text>
              ))}
            </View>

            {item?.field_attributes?.row.map((rowItem: any) => (
              <View key={rowItem.uniqueId} style={{flexDirection: 'row'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 35,
                    flexWrap: 'wrap',
                    width: 80,
                  }}>
                  <Text>{rowItem.option}</Text>
                </View>
                <ScrollView horizontal={true}>
                  <View
                    style={{
                      flexGrow: 1,
                      marginLeft: 30,
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    {field_attributes.options.map((item2: any, index: any) => (
                      <View key={item2.option} style={{width: 60}}>
                        {/* <Text>{item2.option}</Text> */}
                        <View style={{marginTop: 10}}>
                          <RadioButton
                            value={item2.option}
                            status={
                              selectedOptions[rowItem.uniqueId] &&
                              typeof selectedOptions[rowItem.uniqueId] ===
                                'object' &&
                              selectedOptions[rowItem.uniqueId].option ===
                                item2.option
                                ? 'checked'
                                : 'unchecked'
                            }
                            onPress={() => {
                              // Update selected options for this row
                              setSelectedOptions(prevState => {
                                const updatedState = {
                                  ...prevState,
                                  [rowItem.uniqueId]: {
                                    option: item2.option,
                                    index: index + 1,
                                    rowItem: rowItem.option,
                                  },
                                };

                                // Log updated selectedOptions
                                console.log(
                                  'Updated selectedOptions:',
                                  updatedState,
                                );

                                return updatedState;
                              });

                              // Your existing updateFormData function
                              updateFormData(
                                item.unique_id,
                                item,
                                selectedOptions,
                                rowItem.uniqueId,
                                '',
                               ''
                              );
                            }}
                          />
                        </View>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            ))}
          </View>
        );

      case 'Multiple choice grid':
        console.log(selectedOptions, 'lkjhg');
        return (
          <View>
            <View style={{flexDirection: 'row', marginStart: 100}}>
              {field_attributes.options.map((item2: any, index: number) => (
                <Text
                  key={item2.option}
                  style={{
                    width: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginStart: 30,
                  }}>
                  {item2.option}
                </Text>
              ))}
            </View>

            {item?.field_attributes?.row.map((rowItem: any) => (
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <View
                  key={rowItem.uniqueId}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                    flexWrap: 'wrap',
                    width: 90,
                  }}>
                  <Text>{rowItem.option}</Text>
                </View>
                <ScrollView horizontal={true}>
                  <View
                    style={{
                      flexGrow: 1,
                      marginLeft: 30,
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    {field_attributes.options.map((item2: any) => (
                      <View key={item2.option} style={{width: 50}}>
                        <Checkbox
                          color={AppStyle.color.COLOR_PRIMARY}
                          onPress={() => {
                            // Toggle selected options for this row
                            setSelectedOptions(prevState => {
                              const updatedOptions = {
                                ...prevState[rowItem.uniqueId],
                                [item2.option]:
                                  !prevState[rowItem.uniqueId]?.[item2.option],
                              };

                              return {
                                ...prevState,
                                [rowItem.uniqueId]: updatedOptions,
                              };
                            });

                            // Your existing updateFormData function
                            updateFormData(
                              item.unique_id,
                              item,
                              item2.option,
                              rowItem.uniqueId,
                              '',
                            ''
                            );
                          }}
                          status={
                            selectedOptions[rowItem.uniqueId]?.[item2.option]
                              ? 'checked'
                              : 'unchecked'
                          }
                        />
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            ))}
          </View>
        );
      case 'Yes/No Question':
        return (
          <React.Fragment>
            <ScrollView>
              {field_attributes.options.map((item2: any, ind: any) => {
                const Imgaescount = images.filter(
                  o => o?.unique_id === item.unique_id,
                );
                const complaintValue = submission[item.unique_id]?.complaint;
                console.log(submission[item.unique_id]?.complaint, 'kk');
                return (
                  <React.Fragment key={item2.uniqueId}>
                    <Grid>
                      <Col style={{width: 40}}>
                        <RadioButton
                          value={submission[item.unique_id]?.value}
                          color={AppStyle.color.COLOR_PRIMARY}
                          onPress={() => {
                            handleOptionChange(item2.option, item.unique_id);
                            updateFormData(
                              item.unique_id,
                              item,
                              item2.option,
                              item2.uniqueId,
                              '',
                             ''
                            );
                          }}
                          status={
                            submission[item.unique_id]?.value === item2.option
                              ? 'checked'
                              : 'unchecked'
                          }
                        />
                      </Col>
                      <Col style={styles.checkBoxCol}>
                        <Text>{item2.option}</Text>
                      </Col>
                    </Grid>
                    {submission[item.unique_id]?.value === item2.option && (
                      <>
                        {item2?.remark && item2.type !== 'Not Required' && (
                          <React.Fragment>
                            <CommonTextInput
                              txtStyle={styles.textInput}
                              onChangeText={(value: any) => {
                                if (value.match()) {
                                  updateFormRemarks(
                                    item.unique_id,
                                    item2,
                                    value,
                                  );
                                } else {
                                  updateFormRemarks(item.unique_id, item2, '');
                                }
                              }}
                              placeHolder={item2.label}
                              showRightButton={false}
                              isSecure={false}
                              // autoFocus={true}
                              values={submission[item.unique_id]?.remarks}
                              autoCapital={true}
                            />
                            {item2?.type === 'Mandatory' &&
                              !submission[item.unique_id]?.remarks && (
                                <Text style={styles.requiredText}>
                                  This field is required
                                </Text>
                              )}
                          </React.Fragment>
                        )}
                      </>
                    )}

                    {submission[item.unique_id]?.value === item2.option &&
                      item2.type !== 'Not Required' && (
                        <View style={styles.imageUploadView}>
                          <>
                            {images.map((image: any, index: any) => {
                              console.log(
                                fileData1[item.unique_id]?.[index]?.src,
                                'll',
                              );
                              const fileUri =
                                S3_URL +
                                fileData1[item.unique_id]?.[index]?.src;
                              const filetypess =
                                fileData1[item.unique_id]?.[index]?.type;
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
                                      {filetypess === 'video' && (
                                        <VideoPlayer
                                          source={{uri: fileUri}}
                                          style={styles.placeholderImg2}
                                        />
                                      )}
                                      {filetypess === 'document' && (
                                        <View key={index}>
                                          <Image
                                            source={require('../image/file.png')}
                                            style={styles.placeholderImg1}
                                          />
                                          <TouchableOpacity
                                            onPress={() =>
                                              downloadDocument(
                                                S3_URL +
                                                  fileData1[item.unique_id]?.[
                                                    index
                                                  ]?.src,
                                              )
                                            }
                                            style={{
                                              flexDirection: 'row',
                                              alignItems: 'center',
                                            }}>
                                            <MaterialIcons
                                              name="cloud-download"
                                              size={24}
                                              color="black"
                                            />
                                            <Text>Download Document</Text>
                                          </TouchableOpacity>
                                        </View>
                                      )}
                                      <TouchableOpacity
                                        onPress={() =>
                                          handleDeletePhoto(
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
                                          {item2?.upload?.document.length !==
                                            0 && (
                                            <View style={{marginStart: 15}}>
                                              <IconButton
                                                onPress={() =>
                                                  onFileChoose(
                                                    item.unique_id,
                                                    item,
                                                    item2,
                                                    'Option',
                                                    index,
                                                    'document',
                                                  )
                                                }
                                                icon="file-upload"
                                              />
                                              <Text>Upload file</Text>
                                            </View>
                                          )}
                                          {item2?.upload?.photo.length !== 0 &&
                                            !fileData1[item.unique_id]?.[
                                              index
                                            ] && (
                                              <View style={{marginStart: 15}}>
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
                                          {(item2?.upload?.photo.length !== 0 ||
                                            item2?.upload?.video.length !==
                                              0) && (
                                            <View style={{marginStart: 15}}>
                                              <IconButton
                                                onPress={() =>
                                                  selectPhoto(
                                                    item.unique_id,
                                                    item,
                                                    item2,
                                                    'Option',
                                                    index,
                                                    'image',
                                                  )
                                                }
                                                icon="view-gallery"
                                              />
                                              <Text style={{marginStart: 2}}>
                                                Gallery
                                              </Text>
                                            </View>
                                          )}
                                          {item2?.upload?.video.length !==
                                            0 && (
                                            <View style={{marginStart: 15}}>
                                              <IconButton
                                                onPress={() =>
                                                  snapvideo(
                                                    item.unique_id,
                                                    item,
                                                    'Option',
                                                    index,
                                                    'video',
                                                  )
                                                }
                                                icon={({size, color}) => (
                                                  <MaterialCommunityIcons
                                                    name="video"
                                                    size={size}
                                                    color={color}
                                                  />
                                                )}
                                              />
                                              <Text>Take Video</Text>
                                            </View>
                                          )}
                                          {index === 0 ||
                                            (image.unique_id ===
                                              item.unique_id && (
                                              <View
                                                style={{
                                                  justifyContent: 'center',
                                                }}>
                                                <IconButton
                                                  onPress={() =>
                                                    handleDeleteImage(index)
                                                  }
                                                  icon="delete"
                                                />
                                              </View>
                                            ))}
                                        </View>
                                      )}
                                      {item.unique_id === image.unique_id && (
                                        <View style={{flexDirection: 'row'}}>
                                          {item2?.upload?.document.length !==
                                            0 && (
                                            <View style={{marginStart: 15}}>
                                              <IconButton
                                                onPress={() =>
                                                  onFileChoose(
                                                    item.unique_id,
                                                    item,
                                                    item2,
                                                    'Option',
                                                    index,
                                                    'document',
                                                  )
                                                }
                                                icon="file-upload"
                                              />
                                              <Text>Upload file</Text>
                                            </View>
                                          )}
                                          {item2?.upload?.photo.length !== 0 &&
                                            !fileData1[item.unique_id]?.[
                                              index
                                            ] && (
                                              <View style={{marginStart: 15}}>
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

                                          {(item2?.upload?.photo.length !== 0 ||
                                            item2?.upload?.video.length !==
                                              0) && (
                                            <View style={{marginStart: 15}}>
                                              <IconButton
                                                onPress={() =>
                                                  selectPhoto(
                                                    item.unique_id,
                                                    item,
                                                    item2,
                                                    'Option',
                                                    index,
                                                    'image',
                                                  )
                                                }
                                                icon="view-gallery"
                                              />
                                              <Text style={{marginStart: 2}}>
                                                Gallery
                                              </Text>
                                            </View>
                                          )}

                                          {item2?.upload?.video.length !==
                                            0 && (
                                            <View style={{marginStart: 15}}>
                                              <IconButton
                                                onPress={() =>
                                                  snapvideo(
                                                    item.unique_id,
                                                    item,
                                                    'Option',
                                                    index,
                                                    'video',
                                                  )
                                                }
                                                icon={({size, color}) => (
                                                  <MaterialCommunityIcons
                                                    name="video"
                                                    size={size}
                                                    color={color}
                                                  />
                                                )}
                                              />
                                              <Text>Take Video</Text>
                                            </View>
                                          )}
                                          {images.length !== 1 && (
                                            <View
                                              style={{
                                                justifyContent: 'center',
                                              }}>
                                              <IconButton
                                                onPress={() =>
                                                  handleDeleteImage(index)
                                                }
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
                          {Imgaescount.length !==
                            Number(item2.no_upload) - 1 && (
                            <View style={{marginRight: 10, marginLeft: 'auto'}}>
                              <Button
                                onPress={() => {
                                  setImages(prevImages => [
                                    ...prevImages,
                                    {unique_id: item.unique_id},
                                  ]);
                                }}>
                                Add
                              </Button>
                            </View>
                          )}
                          {item2?.type === 'Mandatory' &&
                            !submission[item.unique_id]?.upload && (
                              <Text style={styles.validText}>
                                This field is required
                              </Text>
                            )}
                        </View>
                      )}
                  </React.Fragment>
                );
              })}
            </ScrollView>
          </React.Fragment>
        );
      case 'Advanced Yes/No Question':
        return (
          <React.Fragment>
            <ScrollView>
              {field_attributes.options.map((item2: any, ind: any) => {
                const Imgaescount = images1.filter(
                  o => o?.unique_id === item.unique_id,
                );
                return (
                  <React.Fragment key={item2.uniqueId}>
                    <Grid>
                      <Col
                        style={{
                          width: 40,
                        }}>
                        <RadioButton
                          value={submission[item.unique_id]?.value}
                          color={AppStyle.color.COLOR_PRIMARY}
                          onPress={() => {
                            handleOptionChange1(item2.option, item.unique_id);
                            updateFormData(
                              item.unique_id,
                              item,
                              item2.option,
                              item2.uniqueId,
                              '',''
                              
                            );
                          }}
                          status={
                            submission[item.unique_id]?.value === item2.option
                              ? 'checked'
                              : 'unchecked'
                          }
                        />
                      </Col>
                      <Col style={styles.checkBoxCol}>
                        <Text>{item2.option}</Text>
                      </Col>
                    </Grid>
                    {submission[item.unique_id]?.value === item2.option &&
                      item2.type !== 'Not Required' && (
                        <>
                          {item2?.remark && (
                            <React.Fragment>
                              <CommonTextInput
                                txtStyle={styles.textInput}
                                onChangeText={(value: any) => {
                                  if (value.match()) {
                                    updateFormRemarks(
                                      item.unique_id,
                                      item2,
                                      value,
                                    );
                                  } else {
                                    updateFormRemarks(
                                      item.unique_id,
                                      item2,
                                      '',
                                    );
                                  }
                                }}
                                placeHolder={item2.label}
                                showRightButton={false}
                                isSecure={false}
                                // autoFocus={true}
                                values={submission[item.unique_id]?.remarks}
                                autoCapital={true}
                              />
                              {item2?.type === 'Mandatory' &&
                                !submission[item.unique_id]?.remarks && (
                                  <Text style={styles.requiredText}>
                                    This field is required
                                  </Text>
                                )}
                            </React.Fragment>
                          )}
                          {}
                        </>
                      )}

                    {submission[item.unique_id]?.value === item2.option && (
                      <View style={styles.imageUploadView}>
                        <>
                          {images1.map((image: any, index: any) => {
                            const fileUri =
                              S3_URL + fileData2[item.unique_id]?.[index]?.src;
                            const filetypess =
                              fileData2[item.unique_id]?.[index]?.type;
                            return (
                              <View
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                }}>
                                {!!fileData2[item.unique_id]?.[index] ? (
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
                                    {filetypess === 'video' && (
                                      <VideoPlayer
                                        source={{uri: fileUri}}
                                        style={styles.placeholderImg2}
                                      />
                                    )}
                                    {filetypess === 'document' && (
                                      <View key={index}>
                                        <Image
                                          source={require('../image/file.png')}
                                          style={styles.placeholderImg1}
                                        />
                                        <TouchableOpacity
                                          onPress={() =>
                                            downloadDocument(
                                              S3_URL +
                                                fileData2[item.unique_id]?.[
                                                  index
                                                ]?.src,
                                            )
                                          }
                                          style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                          }}>
                                          <MaterialIcons
                                            name="cloud-download"
                                            size={24}
                                            color="black"
                                          />
                                          <Text>Download Document</Text>
                                        </TouchableOpacity>
                                      </View>
                                    )}
                                    <TouchableOpacity
                                      onPress={() =>
                                        handleDeletePhoto1(
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
                                    {index === 0 && (
                                      <View style={{flexDirection: 'row'}}>
                                        {item2?.upload?.document.length !==
                                          0 && (
                                          <View style={{marginStart: 15}}>
                                            <IconButton
                                              onPress={() =>
                                                onFileChoose1(
                                                  item.unique_id,
                                                  item,
                                                  item2,
                                                  'Option',
                                                  index,
                                                  'document',
                                                )
                                              }
                                              icon="file-upload"
                                            />
                                            <Text>Upload file</Text>
                                          </View>
                                        )}
                                        {item2?.upload?.photo.length !== 0 &&
                                          !fileData2[item.unique_id]?.[
                                            index
                                          ] && (
                                            <View style={{marginStart: 15}}>
                                              <IconButton
                                                onPress={() =>
                                                  snapPhoto1(
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

                                        {(item2?.upload?.photo.length !== 0 ||
                                          item2?.upload?.video.length !==
                                            0) && (
                                          <View style={{marginStart: 15}}>
                                            <IconButton
                                              onPress={() =>
                                                selectPhoto1(
                                                  item.unique_id,
                                                  item,
                                                  item2,
                                                  'Option',
                                                  index,
                                                  'image',
                                                )
                                              }
                                              icon="view-gallery"
                                            />
                                            <Text style={{marginStart: 2}}>
                                              Gallery
                                            </Text>
                                          </View>
                                        )}

                                        {item2?.upload?.video.length !== 0 && (
                                          <View style={{marginStart: 15}}>
                                            <IconButton
                                              onPress={() =>
                                                snapvideo1(
                                                  item.unique_id,
                                                  item,
                                                  'Option',
                                                  index,
                                                  'video',
                                                )
                                              }
                                              icon={({size, color}) => (
                                                <MaterialCommunityIcons
                                                  name="video"
                                                  size={size}
                                                  color={color}
                                                />
                                              )}
                                            />
                                            <Text>Take Video</Text>
                                          </View>
                                        )}
                                        {index === 0 ||
                                          (image.unique_id ===
                                            item.unique_id && (
                                            <View
                                              style={{
                                                justifyContent: 'center',
                                              }}>
                                              <IconButton
                                                onPress={() =>
                                                  handleDeleteImage1(index)
                                                }
                                                icon="delete"
                                              />
                                            </View>
                                          ))}
                                      </View>
                                    )}
                                    {item.unique_id === image.unique_id && (
                                      <View style={{flexDirection: 'row'}}>
                                        {item2?.upload?.document.length !==
                                          0 && (
                                          <View style={{marginStart: 15}}>
                                            <IconButton
                                              onPress={() =>
                                                onFileChoose1(
                                                  item.unique_id,
                                                  item,
                                                  item2,
                                                  'Option',
                                                  index,
                                                  'document',
                                                )
                                              }
                                              icon="file-upload"
                                            />
                                            <Text>Upload file</Text>
                                          </View>
                                        )}
                                        {item2?.upload?.photo.length !== 0 &&
                                          !fileData1[item.unique_id]?.[
                                            index
                                          ] && (
                                            <View style={{marginStart: 15}}>
                                              <IconButton
                                                onPress={() =>
                                                  snapPhoto1(
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
                                        {(item2?.upload?.photo.length !== 0 ||
                                          item2?.upload?.video.length !==
                                            0) && (
                                          <View style={{marginStart: 15}}>
                                            <IconButton
                                              onPress={() =>
                                                selectPhoto1(
                                                  item.unique_id,
                                                  item,
                                                  item2,
                                                  'Option',
                                                  index,
                                                  'image',
                                                )
                                              }
                                              icon="view-gallery"
                                            />
                                            <Text style={{marginStart: 2}}>
                                              Gallery
                                            </Text>
                                          </View>
                                        )}

                                        {item2?.upload?.video.length !== 0 && (
                                          <View style={{marginStart: 15}}>
                                            <IconButton
                                              onPress={() =>
                                                snapvideo1(
                                                  item.unique_id,
                                                  item,
                                                  'Option',
                                                  index,
                                                  'video',
                                                )
                                              }
                                              icon={({size, color}) => (
                                                <MaterialCommunityIcons
                                                  name="video"
                                                  size={size}
                                                  color={color}
                                                />
                                              )}
                                            />
                                            <Text>Take Video</Text>
                                          </View>
                                        )}
                                        {images.length !== 0 && (
                                          <View
                                            style={{
                                              justifyContent: 'center',
                                            }}>
                                            <IconButton
                                              onPress={() =>
                                                handleDeleteImage1(index)
                                              }
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
                        {Imgaescount.length !== Number(item2.no_upload) - 1 && (
                          <View style={{marginRight: 10, marginLeft: 'auto'}}>
                            <Button
                              onPress={() => {
                                setImages1(prevImages => [
                                  ...prevImages,
                                  {unique_id: item.unique_id},
                                ]);
                              }}>
                              Add
                            </Button>
                          </View>
                        )}
                        {item2?.imageupload === 'Mandatory' &&
                          !submission[item.unique_id]?.upload && (
                            <Text style={styles.validText}>
                              This field is required
                            </Text>
                          )}
                      </View>
                    )}
                    {submission[item.unique_id]?.value === item2.option &&
                      item2.type !== 'Not Required' && (
                        <>
                          <Text style={{marginStart: 30, marginTop: 20}}>
                            {item.field_attributes.asset_label}
                          </Text>
                          <MultiSelectExample
                            id={item.field_attributes.asset_type_id}
                            assetTypeLabel={
                              item.field_attributes.asset_type_label
                            }
                            Change={(value: any) => {
                              selectitem(value, item.unique_id);
                            }}
                            Apitype={item.field_attributes.Apitype}
                            Apipath={item.field_attributes.Apipath}
                            extraLabel={item.field_attributes.extraLabel}
                            options_type={item.field_attributes.options_type}
                            asset_label={item.field_attributes.asset_label}
                          />
                        </>
                      )}
                    { item.field_attributes.Feedback &&submission[item.unique_id]?.value === item2.option &&
                      item2.type !== 'Not Required' && (
                        <View>
                          {item.field_attributes.Symbols === 'Star' && (
                            <View>
                                  <Text style={{ marginTop: 20,fontSize:18,textAlign:'center'}}>
                              {item.field_attributes.Ratingdescription}
                            </Text>
                              <AirbnbRating
                               count={item?.field_attributes?.RatingFactor}
                               defaultRating={
                                 submission[item.unique_id]?.overallrating || 0
                               } // Set the default rating from the form data
                               selectedColor="orange"
                               reviewColor="orange"
                                size={35}
                                reviewSize={25}
                                onFinishRating={rating => {
                                  const selectedReview = item?.field_attributes?.RatingScale.split(',')[rating - 1];
                                  const count = item?.field_attributes?.RatingFactor;
                              console.log( submission[item.unique_id]?.value,'lkk')
                                
                                  updateFormstar(
                                    item.unique_id,
                                    item,
                                    rating,
                                    selectedReview ,// Pass selectedReview to updateFormData function
                                    count,
                                    'Star'
                                  )
                                }}
                                // ratingContainerStyle={{marginVertical: 20}}
                                starContainerStyle={{
                                  marginTop: 10,
                                  justifyContent: 'space-between',
                                  width: '70%',
                                  }}
                                reviews={[
                                  item?.field_attributes?.RatingScale
                                ]}
                                showRating={false}
                              />
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontSize: 25,
                                  color: 'green',
                                  fontWeight: 'bold',
                                }}>
                                
                                {
                                    item?.field_attributes?.RatingScale.split(',')[submission[item.unique_id]?.overallrating - 1 || 0]
                                }
                              </Text>
                            </View>
                          )}
      {item.field_attributes.Symbols === 'Default' && (
        <View>
      <AirbnbRating
        count={item?.field_attributes?.RatingFactor}
        defaultRating={submission[item.unique_id]?.overallrating || 0}
        selectedColor="black"
        reviewColor="black"
        size={25}
        reviewSize={30}
        onFinishRating={(rating) => {
          const selectedReview = item?.field_attributes?.RatingScale.split(',')[rating - 1];
          const count = item?.field_attributes?.RatingFactor;

          console.log(submission[item.unique_id]?.value, 'lkk');

          updateFormdefault(
            item.unique_id,
            item,
            rating,
            selectedReview,
            count,
            'Default'
          );
        }}
        ratingContainerStyle={{ marginVertical: 20, }}
        starContainerStyle={{
          marginTop: 10,
          justifyContent: 'space-between',
          width: '50%',
          }}
        starImage={require('./image/circle3.png')}
        reviews={[item?.field_attributes?.RatingScale]}
        showRating={false}
      />
         <Text
                                style={{
                                  textAlign: 'center',
                                  fontSize: 25,
                                  color: 'green',
                                  fontWeight: 'bold',
                                }}>
                                
                                {
                                    item?.field_attributes?.RatingScale.split(',')[submission[item.unique_id]?.overallrating - 1 || 0]
                                }
                              </Text>
                              </View>)}
                        {item.field_attributes.Symbols === 'Smileys' &&
                              item?.field_attributes?.RatingFactor == '5' && (
                                <View>
                                      <Text style={{ marginTop: 20,fontSize:18,textAlign:'center'}}>
                              {item.field_attributes.Ratingdescription}
                            </Text>
                                  <View style={styles.emojiContainer}>
                                    <View style={{marginStart: 50}}>
                                    <TouchableOpacity onPress={() => {
                                       const selectedEmoji = item?.field_attributes?.RatingScale.split(',')[0];
  handleEmojiPress(item.unique_id, item?.field_attributes?.RatingScale.split(',')[0]);
  setSelectedEmoji({ emoji: item?.field_attributes?.RatingScale.split(',')[0], uniqueData: item.unique_id });
  updateFormemoji(
    item.unique_id,
    item,
  
    '',
    selectedEmoji,// Pass selectedReview to updateFormData function
    '',
    'Smileys'
  );
}}>
                                    <MaterialCommunityIcons
                                          name={
                                            rating >= 1
                                              ? 'emoticon-angry-outline'
                                              : 'emoticon-angry-outline'
                                          }
                                          size={40}
                                          style={styles.emoji}
                                        />
                                      </TouchableOpacity>
                                      {/* <Text style={[styles.textalign, {  width: 60 }]}>
                                    {item?.field_attributes?.RatingScale.split(',')[0]}</Text> */}
                                    </View>
                                    <View style={{marginStart: 20}}>
                                    <TouchableOpacity onPress={() => {
                  const selectedEmoji = item?.field_attributes?.RatingScale.split(',')[1];

  handleEmojiPress(item.unique_id,  item?.field_attributes?.RatingScale.split(',')[1]);
  setSelectedEmoji({ emoji: item?.field_attributes?.RatingScale.split(',')[1], uniqueData: item.unique_id });
  updateFormemoji(
    item.unique_id,
    item,
    '',
    selectedEmoji,// Pass selectedReview to updateFormData function
    '',
    'Smileys'
  );
}}>
                                     
                                        <MaterialCommunityIcons
                                          name={
                                            rating >= 2
                                              ? 'emoticon-sad-outline'
                                              : 'emoticon-sad-outline'
                                          }
                                          size={40}
                                          style={styles.emoji1}
                                        />
                                      </TouchableOpacity>
                                      {/* <Text style={[styles.textalign, {  width: 60 }]}>  {item?.field_attributes?.RatingScale.split(',')[1]}</Text> */}

                                    </View>
                                    <View style={{marginStart: 20}}>
                                    <TouchableOpacity onPress={() => {
                      const selectedEmoji = item?.field_attributes?.RatingScale.split(',')[2];

  handleEmojiPress(item.unique_id,  item?.field_attributes?.RatingScale.split(',')[2]);
  setSelectedEmoji({ emoji: item?.field_attributes?.RatingScale.split(',')[2], uniqueData: item.unique_id });
  updateFormemoji(
    item.unique_id,
    item,
    '',
    selectedEmoji,// Pass selectedReview to updateFormData function
    '',
    'Smileys'
  );

}}>
                                        <MaterialCommunityIcons
                                          name={
                                            rating >= 3
                                              ? 'emoticon-neutral-outline'
                                              : 'emoticon-neutral-outline'
                                          }
                                          size={40}
                                          style={styles.emoji2}
                                        />
                                      </TouchableOpacity>
                                      {/* <Text style={[styles.textalign, { width: 60 }]}>  {item?.field_attributes?.RatingScale.split(',')[2]}</Text> */}
                                    </View>
                                    <View style={{marginStart: 20}}>
                                    <TouchableOpacity onPress={() => {
                  const selectedEmoji = item?.field_attributes?.RatingScale.split(',')[3];

  handleEmojiPress(item.unique_id,  item?.field_attributes?.RatingScale.split(',')[3]);
  setSelectedEmoji({ emoji: item?.field_attributes?.RatingScale.split(',')[3], uniqueData: item.unique_id });
  updateFormemoji(
    item.unique_id,
    item,
    
    '',
    selectedEmoji,// Pass selectedReview to updateFormData function
    '',
    'Smileys'
  );
}}>

                                   
                                        <MaterialCommunityIcons
                                          name={
                                            rating >= 4
                                              ? 'emoticon-happy-outline'
                                              : 'emoticon-happy-outline'
                                          }
                                          size={40}
                                          style={styles.emoji3}
                                        />
                                      </TouchableOpacity>
                                      {/* <Text style={[styles.textalign, { flexWrap: 'wrap', width: 60 }]}>  {item?.field_attributes?.RatingScale.split(',')[3]}</Text> */}

                                    </View>
                                    <View style={{marginStart: 20}}>
                                    <TouchableOpacity onPress={() => {
                      const selectedEmoji = item?.field_attributes?.RatingScale.split(',')[4];

  handleEmojiPress(item.unique_id,  item?.field_attributes?.RatingScale.split(',')[4]);
  setSelectedEmoji({ emoji: item?.field_attributes?.RatingScale.split(',')[4], uniqueData: item.unique_id });
  updateFormemoji(
    item.unique_id,
    item,
    
    '',
    selectedEmoji,// Pass selectedReview to updateFormData function
    '',
    'Smileys'
  );
}}>
                                        <MaterialCommunityIcons
                                          name={
                                            rating >= 5
                                              ? 'emoticon-excited-outline'
                                              : 'emoticon-excited-outline'
                                          }
                                          size={40}
                                          style={styles.emoji4}
                                        />
                                      </TouchableOpacity>
                                      {/* <Text style={[styles.textalign, { flexWrap: 'wrap', width: 40 }]}>
                                      {item?.field_attributes?.RatingScale.split(',')[4]}</Text> */}

                                    </View>
                                  </View>
                                  {selectedEmojis[item.unique_id] && (
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              color: 'green',
              fontWeight: 'bold',
            }}
          >
            {selectedEmojis[item.unique_id]}
          </Text>
        )}
                                  {/* <Text style={styles.selectedRating}>Selected Rating: {rating}</Text> */}
                                </View>
                              )}
                                   {item.field_attributes.Symbols === 'Smileys' &&
                              item?.field_attributes?.RatingFactor == '3' && (
                                <View>
                                   <Text style={{ marginTop: 15,fontSize:18,textAlign:'center'}}>
                              {item.field_attributes.Ratingdescription}
                            </Text>
                                <View style={{marginStart:70}}>
                                     
                                  <View style={styles.emojiContainer}>
                                    <View style={{marginStart: 50}}>
                                    <TouchableOpacity onPress={() => {
                    const selectedEmoji = item?.field_attributes?.RatingScale.split(',')[0];

  handleEmojiPress(item.unique_id,  item?.field_attributes?.RatingScale.split(',')[0]);
  setSelectedEmoji({ emoji: item?.field_attributes?.RatingScale.split(',')[0], uniqueData: item.unique_id });
  updateFormemoji(
    item.unique_id,
    item,
    '',
    selectedEmoji,// Pass selectedReview to updateFormData function
    '',
    'Smileys'
  );
}}>

                                        <MaterialCommunityIcons
                                          name={
                                            rating >= 1
                                              ? 'emoticon-angry-outline'
                                              : 'emoticon-angry-outline'
                                          }
                                          size={40}
                                          style={styles.emoji}
                                        />
                                      </TouchableOpacity>
                                      {/* <Text style={[styles.textalign, {  width: 60 }]}>
                                    {item?.field_attributes?.RatingScale.split(',')[0]}</Text> */}
                                    </View>
                                    
                                    <View style={{marginStart: 20}}>
                                    <TouchableOpacity onPress={() => {
                      const selectedEmoji = item?.field_attributes?.RatingScale.split(',')[1];

  handleEmojiPress(item.unique_id, item?.field_attributes?.RatingScale.split(',')[1]);
  setSelectedEmoji({ emoji: item?.field_attributes?.RatingScale.split(',')[1], uniqueData: item.unique_id });
  updateFormemoji(
    item.unique_id,
    item,
  
    '',
    selectedEmoji,// Pass selectedReview to updateFormData function
    '',
    'Smileys'
  );
}}>

                                        <MaterialCommunityIcons
                                          name={
                                            rating >= 2
                                              ? 'emoticon-neutral-outline'
                                              : 'emoticon-neutral-outline'
                                          }
                                          size={40}
                                          style={styles.emoji2}
                                        />
                                      </TouchableOpacity>
                                      {/* <Text style={[styles.textalign, { width: 60 }]}>  {item?.field_attributes?.RatingScale.split(',')[2]}</Text> */}
                                    </View>
                                    
                                    <View style={{marginStart: 20}}>
                                    <TouchableOpacity onPress={() => {
           const selectedEmoji = item?.field_attributes?.RatingScale.split(',')[2];

  handleEmojiPress(item.unique_id, item?.field_attributes?.RatingScale.split(',')[2]);
  setSelectedEmoji({ emoji: item?.field_attributes?.RatingScale.split(',')[2], uniqueData: item.unique_id });
  updateFormemoji(
    item.unique_id,
    item,
    
    '',
    selectedEmoji,// Pass selectedReview to updateFormData function
    '',
    'Smileys'
  );
}}>
                                        <MaterialCommunityIcons
                                          name={
                                            rating >= 3
                                              ? 'emoticon-excited-outline'
                                              : 'emoticon-excited-outline'
                                          }
                                          size={40}
                                          style={styles.emoji4}
                                        />
                                      </TouchableOpacity>
                                      
                                    </View>
                                  </View>
                                  {selectedEmojis[item.unique_id] && (
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              color: 'green',
              fontWeight: 'bold',
              marginEnd:70,
            }}
          >
            {selectedEmojis[item.unique_id]}
          </Text>
        )}
                                
                                </View>
                                </View>
                              )}
                        
                        </View>
                      )}
                  </React.Fragment>
                );
              })}
            </ScrollView>
          </React.Fragment>
        );
      case 'Radio Button':
        return (
          <React.Fragment>
            <ScrollView>
              {field_attributes.options.map((item2: any) => (
                <React.Fragment key={item2.uniqueId}>
                  <Grid>
                    <Col
                      style={{
                        width: 40,
                      }}>
                      <RadioButton
                        value={submission[item.unique_id]?.value}
                        color={AppStyle.color.COLOR_PRIMARY}
                        onPress={() => {
                          updateFormData(
                            item.unique_id,
                            item,
                            item2.option,
                            '',
                            '',
                           ''
                          );
                        }}
                        status={
                          submission[item.unique_id]?.value === item2.option
                            ? 'checked'
                            : 'unchecked'
                        }
                      />
                    </Col>
                    <Col style={styles.checkBoxCol}>
                      <Text>{item2.option}</Text>
                    </Col>
                    <View></View>
                  </Grid>
                  {submission[item.unique_id]?.value === item2.option && (
                    <>
                      {item2?.remark && (
                        <React.Fragment>
                          <CommonTextInput
                            txtStyle={styles.textInput}
                            onChangeText={(value: any) => {
                              if (value.match()) {
                                updateFormRemarks(item.unique_id, item2, value);
                              } else {
                                updateFormRemarks(item.unique_id, item2, '');
                              }
                            }}
                            placeHolder={item2.label}
                            showRightButton={false}
                            isSecure={false}
                            autoFocus={true}
                            values={submission[item.unique_id]?.remarks}
                            autoCapital={true}
                          />
                          {item2?.type === 'Mandatory' &&
                            !submission[item.unique_id]?.remarks && (
                              <Text style={styles.requiredText}>
                                This field is required
                              </Text>
                            )}
                        </React.Fragment>
                      )}
                    </>
                  )}
                </React.Fragment>
              ))}
            </ScrollView>
          </React.Fragment>
        );
      case 'Date Time':
        return (
          <React.Fragment>
            <Grid key={item.uniqueId}>
              <Col>
                {updateFormDate(item.unique_id, item, 'datetime', 'L HH:mm')}
              </Col>
            </Grid>
          </React.Fragment>
        );
      case QuestionType.DATE_ONLY:
        return (
          <React.Fragment>
            <Grid key={item.uniqueId}>
              <Col>{updateFormDate(item.unique_id, item, 'date', 'L')}</Col>
            </Grid>
          </React.Fragment>
        );
      case QuestionType.TIME_ONLY:
        return (
          <React.Fragment>
            <Grid key={item.uniqueId}>
              <Col>{updateFormDate(item.unique_id, item, 'time', 'HH:mm')}</Col>
            </Grid>
          </React.Fragment>
        );
      case 'Dropdown':
        return (
          <View style={styles.dropDown}>
            <DropDown
              label={'Select answer'}
              mode={'outlined'}
              visible={showDropDown[item.unique_id]}
              showDropDown={() => setShowDropDownList(item.unique_id, true)}
              onDismiss={() => setShowDropDownList(item.unique_id, false)}
              value={submission[item.unique_id]?.value}
              setValue={value => {
                updateFormData(item.unique_id, item, value, '', '','');
              }}
              list={field_attributes.options.map((options: any) => ({
                label: options.option,
                value: options.option,
              }))}
            />
          </View>
        );
      case 'File Upload':
        return (
          <React.Fragment key={item.unique_id}>
            <View style={styles.imageUploadView}>
              <>
                {images2.map((image: any, index: any) => {
                  const fileUri =
                    S3_URL + fileData3[item.unique_id]?.[index]?.src;
                  const filetypess = fileData3[item.unique_id]?.[index]?.type;
                  return (
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                      }}>
                      {!!fileData3[item.unique_id]?.[index] ? (
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
                          {filetypess === 'video' && (
                            <VideoPlayer
                              source={{uri: fileUri}}
                              style={styles.placeholderImg2}
                            />
                          )}
                          {filetypess === 'document' && (
                            <View key={index}>
                              <Image
                                source={require('../image/file.png')}
                                style={styles.placeholderImg1}
                              />
                              <TouchableOpacity
                                onPress={() =>
                                  downloadDocument(
                                    S3_URL + fileData3[item.unique_id]?.[index]?.src,
                                  )
                                }
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <MaterialIcons
                                  name="cloud-download"
                                  size={24}
                                  color="black"
                                />
                                <Text>Download Document</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                          <TouchableOpacity
                            onPress={() =>
                              handleDeletePhoto2(item.unique_id, index)
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
                        <View style={{flexDirection: 'row'}}>
                          {field_attributes?.validations.allowed_file_types
                            ?.document?.length !== 0 && (
                            <View style={{marginStart: 15}}>
                              <IconButton
                                onPress={() =>
                                  onFileChoose2(
                                    item.unique_id,
                                    item,
                                    'item2',
                                    'Question',
                                    index,
                                    'document',
                                  )
                                }
                                icon="file-upload"
                              />
                              <Text>Upload file</Text>
                            </View>
                          )}
                          {field_attributes?.validations.allowed_file_types
                            ?.photo?.length !== 0 &&
                            !fileData3[item.unique_id]?.[index] && (
                              <View style={{marginStart: 15}}>
                                <IconButton
                                  onPress={() =>
                                    snapPhoto2(
                                      item.unique_id,
                                      item,
                                      'Question',
                                      index,
                                      'image',
                                    )
                                  }
                                  icon="camera"
                                />
                                <Text>Take snap</Text>
                              </View>
                            )}
                          {field_attributes?.validations.allowed_file_types
                            ?.photo?.length !== 0 && (
                            <View style={{marginStart: 15}}>
                              <IconButton
                                onPress={() =>
                                  selectPhoto2(
                                    item.unique_id,
                                    item,
                                    field_attributes?.validations
                                      .allowed_file_types,
                                    'Question',
                                    index,
                                    'image',
                                  )
                                }
                                icon="view-gallery"
                              />
                              <Text style={{marginStart: 2}}>Gallery</Text>
                            </View>
                          )}
                          {field_attributes?.validations.allowed_file_types
                            ?.video?.length !== 0 && (
                            <View style={{marginStart: 15}}>
                              <IconButton
                                onPress={() =>
                                  snapvideo2(
                                    item.unique_id,
                                    item,
                                    'Question',
                                    index,
                                    'video',
                                  )
                                }
                                icon={({size, color}) => (
                                  <MaterialCommunityIcons
                                    name="video"
                                    size={size}
                                    color={color}
                                  />
                                )}
                              />
                              <Text>Take Video</Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  );
                  0;
                })}
              </>
            </View>
          </React.Fragment>
        );
    }
  };
  const renderItem = ({item, index}: CardProps) => {
    return (
      <Card style={styles.card}>
        {item.counter ? (
          <Card.Title
            titleStyle={styles.cardTitleText}
            title={`${item.counter}. ${item.title}`}
            subtitle={item.description ? `${item.description}` : ''}
            subtitleNumberOfLines={6}
            titleNumberOfLines={10}
          />
        ) : (
       
          <Text style={styles.cardTitleTextHeading}>{`${item.title}`}</Text>
        )}
        <Card.Content style={styles.cardContent}>
          {renderInput(item.field_attributes, item)}
          {renderRequired(item.field_attributes, item, '')}
        </Card.Content>
      </Card>
    );
  };
  return (
    <View style={styles.container}>
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
        <ActivityIndicator />
      </View>
    )}
    {!offline && !loading && (
      <FlatList
        keyboardShouldPersistTaps="always"
        keyboardDismissMode={'none'}
        removeClippedSubviews={false}
        renderItem={renderItem}
        data={data.form_details}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyExtractor={item => item.unique_id}
      />
    )}
  </View>
  );
};
export default TemplateSubmitForm;
