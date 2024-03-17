// import {useNavigation, useRoute} from '@react-navigation/native';
// import React, {useEffect, useMemo, useState} from 'react';
// import {Image, Linking, Modal, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
// import {Picker} from '@react-native-picker/picker';
// import {Col, Grid} from 'react-native-easy-grid';
// import VideoPlayer from 'react-native-video-controls';
// import {FlatList, ScrollView} from 'react-native-gesture-handler';
// import images from '../../config/images';
// import MultiSelectExample from './configure';
// import DropDownPicker, {
//   ValueType,
//   ItemType,
// } from 'react-native-dropdown-picker';

// import {
//   Button,
//   Card,
//   Checkbox,
//   IconButton,
//   Text,
//   RadioButton,
//   TextInput,
// } from 'react-native-paper';
// import CommonTextInput from '../../components/CommonTextInput';
// import Loader from '../../components/Loader';
// import {useSelector} from '../../redux';
// import TemplateApi from '../../services/template';
// import styles from './submitFormStyle';
// import AppStyle from '../../config/styles';
// import DropDown from 'react-native-paper-dropdown';
// import {Notifier, NotifierComponents} from 'react-native-notifier';
// import {
//   Asset,
//   launchCamera,
//   launchImageLibrary,
// } from 'react-native-image-picker';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import moment from 'moment';
// import MultiLineInput from '../../components/MultiLineInput';
// import {QuestionType} from '../../models/api/templates';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import DocumentPicker, {
//   DocumentPickerResponse,
// } from 'react-native-document-picker';
// import axios from 'axios';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import {Row} from 'native-base';
// export interface CardProps {
//   item: any;
//   index: number;
// }
// interface UserData {
//   username: string;
//   userid: number;
//   contact_name: any;
//   designation: any;
//   emp_id: any;
// }
// const S3_URL = 'https://sgp1.digitaloceanspaces.com/freshvoice/';
// // const S3_URL = 'http://143.110.245.242:9000/pg-cdn/';
// const SubmitFormid: React.FC = () => {
//   const [datetime, setdatetime] = useState('');
//   const [data, setData] = useState({} as any);
//   const [asset_id, setAssetid] = useState<string>();
//   const [fileData, setFileData] = useState({} as any);
//   const [fileData1, setFileData1] = useState({} as any);
//   const [fileData2, setFileData2] = useState({} as any);
//   const [submission, setSubmission] = useState({} as any);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [id, setID] = useState<string>('');
//   const [showDropDown, setShowDropDown] = useState({} as any);
//   const user = useSelector(state => state.userReducer);
//   const templateApi = useMemo(() => new TemplateApi(), [user.loggedIn]);
//   const api = useMemo(() => new TemplateApi(), [user.access_token]);
//   const route = useRoute<any>();
//   const navigation = useNavigation();
//   const {formId, checkListType} = route.params;
//   const [isDatePickerVisible, setDatePickerVisibility] = useState({} as any);
//   const [submitting, setsubmitting] = useState(false);
//   const [file, setFile] = useState<string | null>(null);
//   const [images, setImages] = useState([{unique_id: ''}]);
//   const [images1, setImages1] = useState([{unique_id: ''}]);
  
//   const [fileTypes, setFileTypes] = useState<string[]>([]);
//   const [fileTypes1, setFileTypes1] = useState<string[]>([]);
//   const [userData, setUserData] = useState<UserData[]>([]);
//   const [dropdownOptions, setDropdownOptions] = useState<string[]>([]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [selectedValue, setSelectedValue] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [searchText, setSearchText] = useState('');
//   const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
//   useEffect(() => {
    
//     const filtered = dropdownOptions.filter(option =>
//       option.toLowerCase().includes(searchText.toLowerCase()),
//     );
//     setFilteredOptions(filtered);
//   }, [searchText]);
//   const showDatePicker = (uniqueId: string) => {
//     setDatePickerVisibility({
//       [uniqueId]: true,
//     });
//   };
//   const hideDatePicker = (uniqueId: string) => {
//     setDatePickerVisibility({
//       [uniqueId]: false,
//     });
//   };
//   const updateFormDate = (
//     uid: any,
//     item: any,
//     inputType: any,
//     momentFormat: string,
//   ) => {
//     return (
//       <>
//         <CommonTextInput
//           txtStyle={styles.textInput}
//           onChangeText={(value: any) => {
//             updateFormData(item.unique_id, item, datetime, '');
//           }}
//           placeHolder={'Your answer'}
//           showRightButton={false}
//           rightComponent={
//             <TextInput.Icon
//               name={'calendar'}
//               size={22}
//               color={'black'}
//               forceTextInputFocus={false}
//               onPress={() => {
//                 showDatePicker(item.unique_id);
//               }}
//             />
//           }
//           isSecure={false}
//           values={
//             submission[item.unique_id]?.value
//               ? submission[item.unique_id]?.value
//               : moment().format(momentFormat)
//           }
//           autoCapital={true}
//         />

//         <DateTimePickerModal
//           isVisible={isDatePickerVisible[item.unique_id]}
//           mode={inputType}
//           onConfirm={(date: any) => {
//             updateFormData(
//               item.unique_id,
//               item,
//               moment(date).format(momentFormat),
//               '',
//             );
//             hideDatePicker(item.unique_id);
//           }}
//           onCancel={() => {
//             hideDatePicker(item.unique_id);
//           }}
//         />
//       </>
//     );
//   };
//   useEffect(() => {
//     if (
      
//       user.user_roles?.user_permissions?.CSFormSubmission?.includes('add')
//     ) {
//       if (!submitting) {
//         navigation.setOptions({
//           headerRight: () => (
//             <Button
//               disabled={submitting}
//               icon="check"
//               onPress={() => {
//                 setSaving(true);
//               }}>
//               Submit
//             </Button>
//           ),
//         });
//       } else {
//         navigation.setOptions({
//           headerRight: null,
//         });
//       }
//     } else {
//       navigation.setOptions({
//         headerRight: null,
//       });
//     }
//   }, [navigation, user.user_roles]);
//   const showError = (message: string) => {
//     Notifier.showNotification({
//       title: message,
//       Component: NotifierComponents.Alert,
//       duration: 2000,
//       componentProps: {
//         alertType: 'error',
//       },
//     });
//     setSaving(false);
//   };
//   const userdata = () => {
//     templateApi.UserDataGet().then(res => {
//       let user_data = res.data.results;
//       setUserData(user_data);
//       const dropdownValues = user_data.map(
//         (data: {contact_name: any}) => data.contact_name,
//       );
//       setDropdownOptions(dropdownValues);
//       });
//   };

//   useEffect(() => {
//     userdata();
//   }, [user.loggedIn]);
//   useEffect(() => {
//     navigation.setOptions({title: ''});
//     loadFormDetails();
//   }, []);
//   const loadFormDetails = () => {
//     api
//       .templateDetails(327)
//       .then(res => {
//         let counter = 0;
//         navigation.setOptions({
//           title: res.data.title,
//           headerTitleStyle: {
//             fontSize: 16,
//           },
//         });
//         let formData = res.data.form_details.map((item: any) => {
//           if (
//             item.field_attributes.field_type === QuestionType.HEADING ||
//             item.field_attributes.field_type === QuestionType.SUB_HEADING
//           ) {
//             counter = 0;
//             return item;
//           } else {
//             counter += 1;
//             return {
//               ...item,
//               counter: counter,
//             };
//           }
//         });
//         setData({
//           ...res.data,
//           form_details: formData,
//         });
//         setLoading(false);
//       })
//       .catch(err => {
//         Notifier.showNotification({
//           title: 'Something went wrong. Try again',
//           Component: NotifierComponents.Alert,
//           duration: 2000,
//           componentProps: {
//             alertType: 'error',
//           },
//         });
//       });
//   };
//   useEffect(() => {
//     if (saving) submit();
//   }, [saving]);
//   const submit = () => {
//     if (loading) return;
//     setSaving(false);
//     setLoading(true);
//     setsubmitting(true);
//     if (!selectedValue) {
//     setLoading(false);
//     setsubmitting(false);
//     Notifier.showNotification({
//       title: 'Please select an employee',
//       Component: NotifierComponents.Alert,
//       duration: 2000,
//       componentProps: {
//         alertType: 'error',
//       },
//     });
//     return;
//   }
//     let isError = false;
//     for (let formDe of data.form_details) {
//       if (formDe.is_required && !submission[formDe.unique_id]?.value) {
//         isError = true;
//       }
//       for (let j = 0; j < formDe.field_attributes.options.length; j++) {
//         if (submission[formDe.unique_id]?.uniqueId !== undefined) {
//           if (
//             submission[formDe.unique_id].uniqueId ===
//             formDe.field_attributes.options[j].uniqueId
//           ) {
//             if (formDe.field_attributes.options[j].type === 'Mandatory') {
//               if (formDe.field_attributes.options[j].remark) {
//                 if (submission[formDe.unique_id].remarks === undefined) {
//                   isError = true;
//                 }
//               }
//               if (formDe.field_attributes.options[j].imageUpload) {
//                 if (submission[formDe.unique_id].upload === undefined) {
//                   isError = true;
//                 }
//               }
//               if (selectedValue) {
//                 submission[formDe.unique_id]['selectedValue'] = selectedValue;
//                 submission[formDe.unique_id]['contact_name'] = userData.find(item => item.contact_name === selectedValue)?.contact_name;
//                 submission[formDe.unique_id]['designation'] = userData.find(item => item.contact_name === selectedValue)?.designation;
//               }
//             }
//           }
//         }
//       }
//       if (
//         submission[formDe.unique_id]?.field_type === 'Numeric' &&
//         !submission[formDe.unique_id]?.value ===
//           !isNaN(Number(submission[formDe.unique_id]?.value))
//       ) {
//         isError = true;
//       }
//       if (formDe.field_attributes.validations) {
//         try {
//           let validations = formDe.field_attributes.validations;
//           if (validations.method === 'Regex') {
//             let regex = new RegExp(validations.regex);
//             if (regex.test(submission[formDe.unique_id]?.value)) {
//               } else {
//               }
//           }
//         } catch (err) {
//           }
//       }
//       if (isError) {
//         setLoading(false);
//         setsubmitting(false);
//         Notifier.showNotification({
//           title: 'Please fill all required fields',
//           Component: NotifierComponents.Alert,
//           duration: 2000,
//           componentProps: {
//             alertType: 'error',
//           },
//         });
//         return;
//       }
//     }
//     let count = 1;
//     if (count === 1) {
//       api
//         .submitForm(formId, {
//           submitted_data: [submission],
//           asset_id: asset_id,
//         })
//         .then(res => {
//           setsubmitting(true);
//           navigation.goBack();
//           count++;
//           Notifier.showNotification({
//             title: 'Form submitted successfully.',
//             Component: NotifierComponents.Alert,
//             duration: 2000,
//             componentProps: {
//               alertType: 'success',
//             },
//           });
//         })
//         .catch(err => {
//           setLoading(false);
//           setsubmitting(false);
//           if (err.response && err.response.status === 409) {
//             Notifier.showNotification({
//               title: err.response.data.message, 
//               Component: NotifierComponents.Alert,
//               duration: 2000,
//               componentProps: {
//                 alertType: 'error',
//               },
//             });
//           } else {
//             Notifier.showNotification({
//               title: 'Something went wrong. Try again.',
//               Component: NotifierComponents.Alert,
//               duration: 2000,
//               componentProps: {
//                 alertType: 'error',
//               },
//             });
//           }
//         });
//     }
//   };
//   const selectitem = (selectedItems: any, uniqueId: any) => {
//     setSubmission((prevState: any) => ({
//       ...prevState,
//       [uniqueId]: {
//         ...prevState[uniqueId],
//         asset: selectedItems,
//       },
//     }));
//   };
//   const setShowDropDownList = (key: string, value: boolean) => {
//     setShowDropDown((prevState: any) => ({
//       ...prevState,
//       [key]: value,
//     }));
//   };
//   const updateFormData = (
//     uniqueId: string,
//     item: any,
//     value: any,
//     unique_id: any,
//   ) => {
//     const contactName = selectedValue
//   ? userData.find(data => data.contact_name === selectedValue)?.contact_name
//   : '';
// const designation = selectedValue
//   ? userData.find(data => data.contact_name === selectedValue)?.designation
//   : '';
// const empId = selectedValue
//   ? userData.find(data => data.contact_name === selectedValue)?.emp_id
//   : '';
//     setSubmission((prevState: any) => ({
//       ...prevState,
//       [uniqueId]: {
//         value: value,
//         question: item.title,
//         form_order: item.form_order,
//         field_type: item.field_attributes.field_type,
//         complaint: item.field_attributes?.complaints,
//         uniqueId: unique_id,
//         contact_name: contactName,
//       designation: designation,
//       emp_id: empId,
//       },
//     }));
//   };
//   const updateFormRemarks = (uniqueId: string, item: any, value: any) => {
//     setSubmission((prevState: any) => ({
//       ...prevState,
//       [uniqueId]: {
//         ...prevState[uniqueId],
//         remarks: value,
//       },
//     }));
//   };
//   const UpdateFormUploads = (uniqueId: string, item: any, value: any) => {
//     setSubmission((prevState: any) => ({
//       ...prevState,
//       [uniqueId]: {
//         ...prevState[uniqueId],
//         upload: value,
//       },
//     }));
//   };
//   const snapPhoto = async (
//     uniqueId: string,
//     item: any,
//     data: any,
//     index: Number,
//     type: any,
//   ) => {
//     try {
//       const results = await launchCamera({
//         mediaType: 'photo',
//         cameraType: 'back',
//         quality: 0.2,
//       });
//       if (results.didCancel) {
        
//       } else if (results.errorCode) {
//         showError('Something went wrong. Try again.');
//       } else {
//         let result = results!.assets![0];
//         processPhoto(uniqueId, result, item, data, index, type);
//       }
//     } catch (err) {
//       showError('Something went wrong. Try again.');
//     }
//   };
//   const snapPhoto1 = async (
//     uniqueId: string,
//     item: any,
//     data: any,
//     index: Number,
//     type: any,
//   ) => {
//     try {
//       const results = await launchCamera({
//         mediaType: 'photo',
//         cameraType: 'back',
//         quality: 0.2,
//       });
//       if (results.didCancel) {
        
//       } else if (results.errorCode) {
//         showError('Something went wrong. Try again.');
//       } else {
//         let result = results!.assets![0];
//         processPhoto1(uniqueId, result, item, data, index, type);
//       }
//     } catch (err) {
//       showError('Something went wrong. Try again.');
//     }
//   };
//   const snapvideo = async (
//     uniqueId: string,
//     item: any,
//     data: any,
//     index: Number,
//     type: any,
//   ) => {
//     try {
//       const results = await launchCamera({
//         mediaType: 'video',
//         cameraType: 'back',
//         quality: 0.2,
//       });
//       if (results.didCancel) {
        
//       } else if (results.errorCode) {
//         showError('Something went wrong. Try again.');
//       } else {
//         let result = results!.assets![0];
//         processvideo(uniqueId, result, item, data, index, type);
//       }
//     } catch (err) {
//       showError('Something went wrong. Try again.');
//     }
//   };
//   const snapvideo1 = async (
//     uniqueId: string,
//     item: any,
//     data: any,
//     index: Number,
//     type: any,
//   ) => {
//     try {
//       const results = await launchCamera({
//         mediaType: 'video',
//         cameraType: 'back',
//         quality: 0.2,
//       });
//       if (results.didCancel) {
        
//       } else if (results.errorCode) {
//         showError('Something went wrong. Try again.');
//       } else {
//         let result = results!.assets![0];
//         processvideo1(uniqueId, result, item, data, index, type);
//       }
//     } catch (err) {
//       showError('Something went wrong. Try again.');
//     }
//   };
//   const onFileChoose = async (
//     uniqueId: string,
//     item: any,
//     item2: any,
//     datas: any,
//     index: Number,
//     type: any,
//   ) => {
//     try {
//       const res: DocumentPickerResponse[] | undefined =
//         await DocumentPicker.pick({
//           type: [DocumentPicker.types.allFiles],
//         });

//       if (res && res.length > 0) {
//         const selectedFile = res[0];

//         const file = {
//           uri: selectedFile.uri,
//           type: selectedFile.type || '',
//           name: selectedFile.name || undefined,
//           size: selectedFile.size || undefined,
//         };

//         await processdocument(uniqueId, file, item, datas, index, type);
//       }
//     } catch (err) {
//       }
//   };
//   const onFileChoose1 = async (
//     uniqueId: string,
//     item: any,
//     item2: any,
//     datas: any,
//     index: Number,
//     type: any,
//   ) => {
//     try {
//       const res: DocumentPickerResponse[] | undefined =
//         await DocumentPicker.pick({
//           type: [DocumentPicker.types.allFiles],
//         });

//       if (res && res.length > 0) {
//         const selectedFile = res[0];

//         const file = {
//           uri: selectedFile.uri,
//           type: selectedFile.type || '',
//           name: selectedFile.name || undefined,
//           size: selectedFile.size || undefined,
//         };

//         await processdocument1(uniqueId, file, item, datas, index, type);
//       }
//     } catch (err) {
//       }
//   };
//   const selectPhoto = async (
//     uniqueId: string,
//     item: any,
//     type: any,
//     data: any,
//     index: any,
//     types: any,
//   ) => {
//     try {
//       if (type?.upload.photo.length > 0 && type?.upload.video.length == 0) {
//         var results = await launchImageLibrary({
//           mediaType: 'photo',
//           quality: 0.2,
//           selectionLimit: 1,
//         });

//         if (results.didCancel) {
//         } else if (results.errorCode) {
//           showError('Something went wrong. Try again.');
//         } else {
//           let result = results!.assets![0];
//           let finaldata = {
//             name: result.fileName,
//             type: result.type,
//             size: result.fileSize,
//           };
//           processPhoto(uniqueId, result, item, data, index, types);
//         }
//       }
//       if (type?.upload.video.length > 0 && type?.upload.photo.length === 0) {
//         var results = await launchImageLibrary({
//           mediaType: 'video',
//           quality: 0.2,
//           selectionLimit: 1,
//         });
//         if (results.didCancel) {
//         } else if (results.errorCode) {
//           showError('Something went wrong. Try again.');
//         } else {
//           let result = results!.assets![0];
//           processPhoto(uniqueId, result, item, data, index, types);
//         }
//       }
//       if (type?.upload.video.length > 0 && type?.upload.photo.length > 0) {
//         var results = await launchImageLibrary({
//           mediaType: 'mixed',
//           quality: 0.2,
//           selectionLimit: 1,
//         });
//         if (results.didCancel) {
//         } else if (results.errorCode) {
//           showError('Something went wrong. Try again.');
//         } else {
//           let result = results!.assets![0];

//           processPhoto(uniqueId, result, item, data, index, types);
//         }
//       }
//     } catch (err) {
//       showError('Something went wrong. Try again.');
//     }
//   };
//   const selectPhoto1 = async (
//     uniqueId: string,
//     item: any,
//     type: any,
//     data: any,
//     index: any,
//     types: any,
//   ) => {
//     try {
//       if (type?.upload?.photo?.length > 0 && type?.upload?.video?.length == 0) {
//         var results = await launchImageLibrary({
//           mediaType: 'photo',
//           quality: 0.2,
//           selectionLimit: 1,
//         });

//         if (results.didCancel) {
//         } else if (results.errorCode) {
//           showError('Something went wrong. Try again.');
//         } else {
//           let result = results!.assets![0];
//           let finaldata = {
//             name: result.fileName,
//             type: result.type,
//             size: result.fileSize,
//           };
//           processPhoto1(uniqueId, result, item, data, index, types);
//         }
//       }
//       if (
//         type?.upload?.video?.length > 0 &&
//         type?.upload?.photo?.length === 0
//       ) {
//         var results = await launchImageLibrary({
//           mediaType: 'video',
//           quality: 0.2,
//           selectionLimit: 1,
//         });
//         if (results.didCancel) {
//         } else if (results.errorCode) {
//           showError('Something went wrong. Try again.');
//         } else {
//           let result = results!.assets![0];
//           processPhoto1(uniqueId, result, item, data, index, types);
//         }
//       }
//       if (type?.upload?.video?.length > 0 && type?.upload?.photo?.length > 0) {
//         var results = await launchImageLibrary({
//           mediaType: 'mixed',
//           quality: 0.2,
//           selectionLimit: 1,
//         });
//         if (results.didCancel) {
//         } else if (results.errorCode) {
//           showError('Something went wrong. Try again.');
//         } else {
//           let result = results!.assets![0];

//           processPhoto1(uniqueId, result, item, data, index, types);
//         }
//       }
//       if (type?.photo?.length > 0 && type?.video?.length == 0) {
//         var results = await launchImageLibrary({
//           mediaType: 'photo',
//           quality: 0.2,
//           selectionLimit: 1,
//         });

//         if (results.didCancel) {
//         } else if (results.errorCode) {
//           showError('Something went wrong. Try again.');
//         } else {
//           let result = results!.assets![0];
//           let finaldata = {
//             name: result.fileName,
//             type: result.type,
//             size: result.fileSize,
//           };
//           processPhoto1(uniqueId, result, item, data, index, types);
//         }
//       }
//       if (type?.video?.length > 0 && type?.photo?.length === 0) {
//         var results = await launchImageLibrary({
//           mediaType: 'video',
//           quality: 0.2,
//           selectionLimit: 1,
//         });
//         if (results.didCancel) {
//         } else if (results.errorCode) {
//           showError('Something went wrong. Try again.');
//         } else {
//           let result = results!.assets![0];
//           processPhoto1(uniqueId, result, item, data, index, types);
//         }
//       }
//       if (type?.video?.length > 0 && type?.photo?.length > 0) {
//         var results = await launchImageLibrary({
//           mediaType: 'mixed',
//           quality: 0.2,
//           selectionLimit: 1,
//         });
//         if (results.didCancel) {
//         } else if (results.errorCode) {
//           showError('Something went wrong. Try again.');
//         } else {
//           let result = results!.assets![0];

//           processPhoto1(uniqueId, result, item, data, index, types);
//         }
//       }
//     } catch (err) {
//       showError('Something went wrong. Try again.');
//     }
//   };

//   const processPhoto1 = async (
//     uniqueId: string,
//     asset: Asset,
//     item: any,
//     datas: any,
//     index: any,
//     type: any,
//   ) => {
//     switch (asset.type) {
//       case 'image/jpeg':
//       case '.png':
//       case '.jpeg':
//       case '.jpg':
//       case 'image/png':
//         try {
//           let data: any = await uploadImage(asset);
//           if (data !== null && data.media_id) {
//             setFileData2((prevState: any) => {
//               const existingArray = prevState[uniqueId] || []; 
//               const updatedArray = [...existingArray]; 
//               updatedArray[index] = {type: type, src: data.media_key};
//               UpdateFormUploads(item.unique_id, item, updatedArray);

//               return {
//                 ...prevState,
//                 [uniqueId]: updatedArray,
//               };
//             });
//             Notifier.showNotification({
//               title: 'Image Uploaded Successfully.',
//               Component: NotifierComponents.Alert,
//               duration: 2000,
//               componentProps: {
//                 alertType: 'success',
//               },
//             });
//             setLoading(false);
//           }
//         } catch (err) {
//           setLoading(false);
//           Notifier.showNotification({
//             title: 'Something went wrong. Try again.',
//             Component: NotifierComponents.Alert,
//             duration: 2000,
//             componentProps: {
//               alertType: 'error',
//             },
//           });
//         }
//         break;
//       default:
//         Notifier.showNotification({
//           title: 'Selected File Type not Vaild. only (.jpeg,.Png) allowed',
//           Component: NotifierComponents.Alert,
//           duration: 2000,
//           componentProps: {
//             alertType: 'error',
//           },
//         });
//         return;
//     }
//   };
//   const processvideo1 = async (
//     uniqueId: string,
//     asset: Asset,
//     item: any,
//     datas: any,
//     index: any,
//     type: any,
//   ) => {
//     switch (asset.type) {
//       case '.mp4':
//       case '.avi':
//       case '.mov':
//       case '.mkv':
//       case 'video/mp4':
//       case 'video/avi':
//       case 'video/quicktime':
//       case 'video/x-matroska':
//         try {
//           let data: any = await uploadvideo(asset);
//           if (data !== null && data.media_id) {
//             setFileData2((prevState: any) => {
//               const existingArray = prevState[uniqueId] || []; 
//               const updatedArray = [...existingArray]; 
//               updatedArray[index] = {type: type, src: data.media_key};
//               UpdateFormUploads(item.unique_id, item, updatedArray);

//               return {
//                 ...prevState,
//                 [uniqueId]: updatedArray,
//               };
//             });

//             Notifier.showNotification({
//               title: 'video Uploaded Successfully.',
//               Component: NotifierComponents.Alert,
//               duration: 2000,
//               componentProps: {
//                 alertType: 'success',
//               },
//             });
//             setLoading(false);
//           }
//         } catch (err) {
//           setLoading(false);
//           Notifier.showNotification({
//             title: 'Selected File Type not Vaild. only (.mp4,.mkv) allowed',
//             Component: NotifierComponents.Alert,
//             duration: 2000,
//             componentProps: {
//               alertType: 'error',
//             },
//           });
//         }
//         break;
//       default:
//         Notifier.showNotification({
//           title: 'Selected File Type not Vaild. Try again.',
//           Component: NotifierComponents.Alert,
//           duration: 2000,
//           componentProps: {
//             alertType: 'error',
//           },
//         });
//         return;
//     }
//   };
//   const processPhoto = async (
//     uniqueId: string,
//     asset: Asset,
//     item: any,
//     datas: any,
//     index: any,
//     type: any,
//   ) => {
//     switch (asset.type) {
//       case 'image/jpeg':
//       case '.png':
//       case '.jpeg':
//       case '.jpg':
//       case 'image/png':
//         try {
//           let data: any = await uploadImage(asset);

//           if (data !== null && data.media_id) {
//             if (datas === 'Question') {
//               updateFormData(item.unique_id, item, data.media_key, '');

//               setFileData1((prevState: any) => {
//                 const updatedArray = [...prevState[uniqueId]]; 
//                 updatedArray[index] = {type: type, src: data.media_key}; 
//                 return {
//                   ...prevState,
//                   [uniqueId]: updatedArray,
//                 };
//               });
//             } else {
//               setFileData1((prevState: any) => {
//                 const existingArray = prevState[uniqueId] || []; 
//                 const updatedArray = [...existingArray]; 
//                 updatedArray[index] = {type: type, src: data.media_key};
//                 UpdateFormUploads(item.unique_id, item, updatedArray);

//                 return {
//                   ...prevState,
//                   [uniqueId]: updatedArray,
//                 };
//               });

              
//             }
//             Notifier.showNotification({
//               title: 'Image Uploaded Successfully.',
//               Component: NotifierComponents.Alert,
//               duration: 2000,
//               componentProps: {
//                 alertType: 'success',
//               },
//             });
//             setLoading(false);
//           }
//         } catch (err) {
//           setLoading(false);
//           Notifier.showNotification({
//             title: 'Something went wrong. Try again.',
//             Component: NotifierComponents.Alert,
//             duration: 2000,
//             componentProps: {
//               alertType: 'error',
//             },
//           });
//         }
//         break;
//       default:
//         Notifier.showNotification({
//           title: 'Selected File Type not Vaild. only (.jpeg,.Png) allowed',
//           Component: NotifierComponents.Alert,
//           duration: 2000,
//           componentProps: {
//             alertType: 'error',
//           },
//         });
//         return;
//     }
//   };
//   const handleOptionChange = (newOption: any, uniqueId: any) => {
    
//     setFileData1((prevState: any) => ({
//       ...prevState,
//       [uniqueId]: [], 
//     }));
//     setImages([{unique_id: ''}]);
//   };
//   const handleOptionChange1 = (newOption: any, uniqueId: any) => {
    
//     setFileData2((prevState: any) => ({
//       ...prevState,
//       [uniqueId]: [], 
//     }));
//     setImages1([{unique_id: ''}]);
//   };
//   const processvideo = async (
//     uniqueId: string,
//     asset: Asset,
//     item: any,
//     datas: any,
//     index: any,
//     type: any,
//   ) => {
//     switch (asset.type) {
//       case '.mp4':
//       case '.avi':
//       case '.mov':
//       case '.mkv':
//       case 'video/mp4':
//       case 'video/avi':
//       case 'video/quicktime':
//       case 'video/x-matroska':
//         try {
//           let data: any = await uploadvideo(asset);
//           if (data !== null && data.media_id) {
//             if (datas === 'Question') {
//               updateFormData(item.unique_id, item, data.media_key, '');
//               setFileData1((prevState: any) => {
//                 const updatedArray = [...prevState[uniqueId]]; 
//                 updatedArray[index] = {type: type, src: data.media_key}; 
//                 return {
//                   ...prevState,
//                   [uniqueId]: updatedArray,
//                 };
//               });
//             } else {
//               setFileData1((prevState: any) => {
//                 const existingArray = prevState[uniqueId] || []; 
//                 const updatedArray = [...existingArray]; 
//                 updatedArray[index] = {type: type, src: data.media_key};
//                 UpdateFormUploads(item.unique_id, item, updatedArray);

//                 return {
//                   ...prevState,
//                   [uniqueId]: updatedArray,
//                 };
//               });
//             }
//             Notifier.showNotification({
//               title: 'video Uploaded Successfully.',
//               Component: NotifierComponents.Alert,
//               duration: 2000,
//               componentProps: {
//                 alertType: 'success',
//               },
//             });
//             setLoading(false);
//           }
//         } catch (err) {
//           setLoading(false);
//           Notifier.showNotification({
//             title: 'Selected File Type not Vaild. only (.mp4,.mkv) allowed',
//             Component: NotifierComponents.Alert,
//             duration: 2000,
//             componentProps: {
//               alertType: 'error',
//             },
//           });
//         }
//         break;
//       default:
//         Notifier.showNotification({
//           title: 'Selected File Type not Vaild. Try again.',
//           Component: NotifierComponents.Alert,
//           duration: 2000,
//           componentProps: {
//             alertType: 'error',
//           },
//         });
//         return;
//     }
//   };
//   const processdocument = async (
//     uniqueId: string,
//     asset: any,
//     item: any,
//     datas: any,
//     index: any,
//     type: any,
//   ) => {
//     switch (asset.type) {
//       case 'application/pdf':
//       case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
//       case '.pdf':
//       case '.doc':
//       case '.docx':
//       case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
//       case 'application/zip':
//       case 'application/octet-stream':
//       case 'application/x-zip-compressed':
//       case 'multipart/x-zip':
//       case '.zip':
//       case 'application/vnd.ms-powerpoint':
//       case '.ppt':
//       case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
//       case '.pptx':
//       case 'application/vnd.ms-excel':
//       case '.xls':
//       case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
//       case '.xlsx':
//       case '.csv':
//       case '.pdf':
//       case '.docx':
//         try {
//           let data: any = await uploaddocument(asset);
//           if (data !== null && data.media_id) {
//             if (datas === 'Question') {
//               updateFormData(item.unique_id, item, data.media_key, '');
//               setFileData((prevState: any) => {
//                 const updatedArray = [...prevState[uniqueId]]; 
//                 updatedArray[index] = {type: type, src: data.media_key}; 
//                 return {
//                   ...prevState,
//                   [uniqueId]: updatedArray,
//                 };
//               });
//             } else {
//               setFileData1((prevState: any) => {
//                 const existingArray = prevState[uniqueId] || []; 
//                 const updatedArray = [...existingArray]; 
//                 updatedArray[index] = {type: type, src: data.media_key};
//                 UpdateFormUploads(item.unique_id, item, updatedArray);

//                 return {
//                   ...prevState,
//                   [uniqueId]: updatedArray,
//                 };
//               });
//             }
//             Notifier.showNotification({
//               title: 'File Uploaded Successfully.',
//               Component: NotifierComponents.Alert,
//               duration: 2000,
//               componentProps: {
//                 alertType: 'success',
//               },
//             });
//             setLoading(false);
//           }
//         } catch (err) {
//           setLoading(false);
//           Notifier.showNotification({
//             title: 'Something went wrong. Try again.',
//             Component: NotifierComponents.Alert,
//             duration: 2000,
//             componentProps: {
//               alertType: 'error',
//             },
//           });
//         }
//         break;
//       default:
//         Notifier.showNotification({
//           title: 'Selected File Type not Vaild. only(.pdf,.docx,.csv)allowed',
//           Component: NotifierComponents.Alert,
//           duration: 4000,
//           componentProps: {
//             alertType: 'error',
//           },
//         });
//         return;
//     }
//   };
//   const processdocument1 = async (
//     uniqueId: string,
//     asset: any,
//     item: any,
//     datas: any,
//     index: any,
//     type: any,
//   ) => {
//     switch (asset.type) {
//       case 'application/pdf':
//       case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
//       case '.pdf':
//       case '.doc':
//       case '.docx':
//       case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
//       case 'application/zip':
//       case 'application/octet-stream':
//       case 'application/x-zip-compressed':
//       case 'multipart/x-zip':
//       case '.zip':
//       case 'application/vnd.ms-powerpoint':
//       case '.ppt':
//       case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
//       case '.pptx':
//       case 'application/vnd.ms-excel':
//       case '.xls':
//       case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
//       case '.xlsx':
//       case '.csv':
//       case '.pdf':
//       case '.docx':
//         try {
//           let data: any = await uploaddocument(asset);
//           if (data !== null && data.media_id) {
//             setFileData2((prevState: any) => {
//               const existingArray = prevState[uniqueId] || []; 
//               const updatedArray = [...existingArray]; 
//               updatedArray[index] = {type: type, src: data.media_key};
//               UpdateFormUploads(item.unique_id, item, updatedArray);

//               return {
//                 ...prevState,
//                 [uniqueId]: updatedArray,
//               };
//             });
//             Notifier.showNotification({
//               title: 'File Uploaded Successfully.',
//               Component: NotifierComponents.Alert,
//               duration: 2000,
//               componentProps: {
//                 alertType: 'success',
//               },
//             });
//             setLoading(false);
//           }
//         } catch (err) {
//           setLoading(false);
//           Notifier.showNotification({
//             title: 'Something went wrong. Try again.',
//             Component: NotifierComponents.Alert,
//             duration: 2000,
//             componentProps: {
//               alertType: 'error',
//             },
//           });
//         }
//         break;
//       default:
//         Notifier.showNotification({
//           title: 'Selected File Type not Vaild. only(.pdf,.docx,.csv)allowed',
//           Component: NotifierComponents.Alert,
//           duration: 4000,
//           componentProps: {
//             alertType: 'error',
//           },
//         });
//         return;
//     }
//   };
//   const uploadImage = async (file: Asset) => {
//     return new Promise((resolve, reject) => {
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
          
//           xhr.onload = function () {
//             if (this.status === 204) {
//               resolve(res.data);
//             } else {
//               reject(new Error('Upload failed'));
//             }
//           };
//           xhr.onerror = function () {
//             reject(new Error('An error occurred during the upload'));
//           };
//           xhr.upload.onprogress = function (evt) {};
//           xhr.send(formData);
//         })
//         .catch(err => {
//           reject(err);
//         });
//     });
//   };
//   const uploadvideo = async (file: Asset) => {
//     return new Promise((resolve, reject) => {
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
          
//           xhr.onload = function () {
//             if (this.status === 204) {
//               resolve(res.data);
//             } else {
//               reject(new Error('Upload failed'));
//             }
//           };
//           xhr.onerror = function () {
//             reject(new Error('An error occurred during the upload'));
//           };
//           xhr.upload.onprogress = function (evt) {};
//           xhr.send(formData);
//         })
//         .catch(err => {
//           reject(err);
//         });
//     });
//   };
//   const downloadDocument = (uri: any) => {
//     Linking.openURL(uri);
//   };
//   const uploaddocument = async (file: DocumentPickerResponse) => {
//     return new Promise(async (resolve, reject) => {
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
//           formData.append('file', file);
//           const xhr = new XMLHttpRequest();
//           xhr.open('POST', res.data.data.url, true);
//           xhr.onload = function () {
//             if (this.status === 204) {
//               resolve(res.data);
//             } else {
//               reject(null);
//             }
//           };
//           xhr.upload.onprogress = function (evt) {};
//           xhr.send(formData);
//         })
//         .catch(err => {
//           reject(err);
//         });
//     });
//   };
//   const handleDeletePhoto = (uniqueId: any, index: any) => {
//     setFileData1((prevState: any) => {
//       const updatedArray = [...prevState[uniqueId]];
//       updatedArray.splice(index, 1); 

//       return {
//         ...prevState,
//         [uniqueId]: updatedArray,
//       };
//     });
//   };
//   const handleDeletePhoto1 = (uniqueId: any, index: any) => {
//     setFileData2((prevState: any) => {
//       const updatedArray = [...prevState[uniqueId]];
//       updatedArray.splice(index, 1); 

//       return {
//         ...prevState,
//         [uniqueId]: updatedArray,
//       };
//     });
//   };
//   const validateField = (item: any) => {
//     if (item.is_required && !submission[item.unique_id]?.value) {
//       return <Text style={styles.validText}>This field is required</Text>;
//     }
//     if (
//       submission[item.unique_id]?.field_type === 'Numeric' &&
//       !submission[item.unique_id]?.value ===
//         !isNaN(Number(submission[item.unique_id]?.value))
//     ) {
//       return <Text style={styles.validText}>Enter only numeric value</Text>;
//     }
//     if (item.field_attributes.validations) {
//       try {
//         let validations = item.field_attributes.validations;
//         if (validations.method === 'Regex') {
//           let regex = new RegExp(validations.regex);
//           if (regex.test(submission[item.unique_id]?.value)) {
//           } else {
//             return (
//               <Text style={styles.validText}>{validations.errorText}</Text>
//             );
//           }
//         }
//       } catch (err) {
//         }
//     }
//   };
//   const handleDeleteImage = (index: any) => {
//     setImages(prevImages => prevImages.filter((_, i) => i !== index));
//   };
//   const handleDeleteImage1 = (index: any) => {
//     setImages1(prevImages => prevImages.filter((_, i) => i !== index));
//   };
//   const renderRequired = (field_attributes: any, item: any, values: any) => {
//     switch (field_attributes.field_type) {
//       case 'ShortAnswer':
//       case 'LongAnswer':
//       case 'Numeric':
//         return <React.Fragment>{validateField(item)}</React.Fragment>;
//       default:
//         return (
//           <React.Fragment>
//             {item.is_required && !submission[item.unique_id]?.value && (
//               <Text style={styles.validText}>This field is required</Text>
//             )}
//             {field_attributes?.options.map((item2: any) => (
//               <></>
//             ))}
//             {submission[item.unique_id]?.field_type === 'Numeric' &&
//               !submission[item.unique_id]?.value ===
//                 !isNaN(Number(submission[item.unique_id]?.value)) && (
//                 <Text style={styles.validText}>Enter only numeric value</Text>
//               )}
//           </React.Fragment>
//         );
//     }
//   };
//   const renderInput = (field_attributes: any, item: any) => {
//     switch (field_attributes.field_type) {
//       case 'ShortAnswer':
//         return (
//           <MultiLineInput
//             txtStyle={styles.textInput}
//             onChangeText={(value: any) => {
//               if (item.unique_id.field_type === 'Numeric') {
//                 if (value.match())
//                   updateFormData(item.unique_id, item, value, '');
//               } else {
//                 updateFormData(item.unique_id, item, value, '');
//               }
//             }}
//             placeHolder={'Your answer'}
//             showRightButton={false}
//             isSecure={false}
//             values={submission[item.unique_id]?.value}
//             autoCapital={true}
//           />
//         );
//       case 'LongAnswer':
//         return (
//           <MultiLineInput
//             txtStyle={styles.textInput}
//             onChangeText={(value: any) => {
//               if (item.unique_id.field_type === 'Numeric') {
//                 if (value.match())
//                   updateFormData(item.unique_id, item, value, '');
//               } else {
//                 updateFormData(item.unique_id, item, value, '');
//               }
//             }}
//             placeHolder={'Your answer'}
//             showRightButton={false}
//             isSecure={false}
//             values={submission[item.unique_id]?.value}
//             autoCapital={true}
//           />
//         );
//       case QuestionType.NUMERIC:
//         return (
//           <MultiLineInput
//             txtStyle={styles.textInput}
//             onChangeText={(value: any) => {
//               updateFormData(item.unique_id, item, value, '');
//             }}
//             placeHolder={'Your answer'}
//             showRightButton={false}
//             isSecure={false}
//             keyboardType="numeric"
//             values={submission[item.unique_id]?.value}
//             autoCapital={false}
//           />
//         );
//       case 'Checkbox':
//         return (
//           <React.Fragment>
//             <ScrollView>
//               {field_attributes.options.map((item2: any) => (
//                 <React.Fragment key={item2.uniqueId}>
//                   <Grid>
//                     <Col
//                       style={{
//                         width: 40,
//                       }}>
//                       <Checkbox
//                         color={AppStyle.color.COLOR_PRIMARY}
//                         onPress={() => {
//                           updateFormData(
//                             item.unique_id,
//                             item,
//                             item2.option,
//                             '',
//                           );
//                         }}
//                         status={
//                           submission[item.unique_id]?.value === item2.option
//                             ? 'checked'
//                             : 'unchecked'
//                         }
//                       />
//                     </Col>
//                     <Col style={styles.checkBoxCol}>
//                       <Text>{item2.option}</Text>
//                     </Col>
//                   </Grid>
//                   {submission[item.unique_id]?.value === item2.option && (
//                     <>
//                       {item2?.remark && (
//                         <React.Fragment>
//                           <CommonTextInput
//                             txtStyle={styles.textInput}
//                             onChangeText={(value: any) => {
//                               if (value.match()) {
//                                 updateFormRemarks(item.unique_id, item2, value);
//                               } else {
//                                 updateFormRemarks(item.unique_id, item2, '');
//                               }
//                             }}
//                             placeHolder={item2.label}
//                             showRightButton={false}
//                             isSecure={false}
//                             autoFocus={true}
//                             values={submission[item.unique_id]?.remarks}
//                             autoCapital={true}
//                           />
//                           {item2?.type === 'Mandatory' &&
//                             !submission[item.unique_id]?.remarks && (
//                               <Text style={styles.requiredText}>
//                                 This field is required
//                               </Text>
//                             )}
//                         </React.Fragment>
//                       )}
//                     </>
//                   )}
//                 </React.Fragment>
//               ))}
//             </ScrollView>
//           </React.Fragment>
//         );
//       case 'Yes/No Question':
//         return (
//           <React.Fragment>
//             <ScrollView>
//               {field_attributes.options.map((item2: any, ind: any) => {
//                 const Imgaescount = images.filter(
//                   o => o?.unique_id === item.unique_id,
//                 );
//                 return (
//                   <React.Fragment key={item2.uniqueId}>
//                     <Grid>
//                       <Col style={{width: 40}}>
//                         <RadioButton
//                           value={submission[item.unique_id]?.value}
//                           color={AppStyle.color.COLOR_PRIMARY}
//                           onPress={() => {
//                             handleOptionChange(item2.option, item.unique_id); 
//                             updateFormData(
//                               item.unique_id,
//                               item,
//                               item2.option,
//                               item2.uniqueId,
//                             );
//                           }}
//                           status={
//                             submission[item.unique_id]?.value === item2.option
//                               ? 'checked'
//                               : 'unchecked'
//                           }
//                         />
//                       </Col>
//                       <Col style={styles.checkBoxCol}>
//                         <Text>{item2.option}</Text>
//                       </Col>
//                     </Grid>
//                     {submission[item.unique_id]?.value === item2.option && (
//                       <>
//                         {item2?.remark && item2.type !== 'Not Required' && (
//                           <React.Fragment>
//                             <CommonTextInput
//                               txtStyle={styles.textInput}
//                               onChangeText={(value: any) => {
//                                 if (value.match()) {
//                                   updateFormRemarks(
//                                     item.unique_id,
//                                     item2,
//                                     value,
//                                   );
//                                 } else {
//                                   updateFormRemarks(item.unique_id, item2, '');
//                                 }
//                               }}
//                               placeHolder={item2.label}
//                               showRightButton={false}
//                               isSecure={false}
//                               autoFocus={true}
//                               values={submission[item.unique_id]?.remarks}
//                               autoCapital={true}
//                             />
//                             {item2?.type === 'Mandatory' &&
//                               !submission[item.unique_id]?.remarks && (
//                                 <Text style={styles.requiredText}>
//                                   This field is required
//                                 </Text>
//                               )}
//                           </React.Fragment>
//                         )}
//                       </>
//                     )}

//                     {submission[item.unique_id]?.value === item2.option &&
//                       item2.type !== 'Not Required' && (
//                         <View style={styles.imageUploadView}>
//                           <>
//                             {images.map((image: any, index: any) => {
                              
//                               const fileUri =
//                                 S3_URL +
//                                 fileData1[item.unique_id]?.[index]?.src;
//                               const filetypess =
//                                 fileData1[item.unique_id]?.[index]?.type;
//                               return (
//                                 <View
//                                   style={{
//                                     display: 'flex',
//                                     flexDirection: 'column',
//                                   }}>
//                                   {!!fileData1[item.unique_id]?.[index] ? (
//                                     <View
//                                       style={{
//                                         display: 'flex',
//                                         flexDirection: 'row',
//                                         marginBottom: index === 0 ? 20 : 0,
//                                       }}>
//                                       {filetypess === 'image' ? (
//                                         <Image
//                                           source={{uri: fileUri}}
//                                           style={styles.placeholderImg}
//                                         />
//                                       ) : null}
//                                       {filetypess === 'video' && (
//                                         <VideoPlayer
//                                           source={{uri: fileUri}}
//                                           style={styles.placeholderImg2}
//                                         />
//                                       )}
//                                       {filetypess === 'document' && (
//                                         <View key={index}>
//                                           <Image
//                                             source={require('../image/file.png')}
//                                             style={styles.placeholderImg1}
//                                           />
//                                           <TouchableOpacity
//                                             onPress={() =>
//                                               downloadDocument(
//                                                 S3_URL +
//                                                   fileData1[item.unique_id]?.[
//                                                     index
//                                                   ],
//                                               )
//                                             }
//                                             style={{
//                                               flexDirection: 'row',
//                                               alignItems: 'center',
//                                             }}>
//                                             <MaterialIcons
//                                               name="cloud-download"
//                                               size={24}
//                                               color="black"
//                                             />
//                                             <Text>Download Document</Text>
//                                           </TouchableOpacity>
//                                         </View>
//                                       )}
//                                       <TouchableOpacity
//                                         onPress={() =>
//                                           handleDeletePhoto(
//                                             item.unique_id,
//                                             index,
//                                           )
//                                         }
//                                         style={{
//                                           justifyContent: 'center',
//                                           marginStart: 10,
//                                         }}
                                        
//                                       >
//                                         <MaterialIcons
//                                           name="delete"
//                                           size={24}
//                                           color="red"
//                                         />
//                                       </TouchableOpacity>
//                                     </View>
//                                   ) : (
//                                     <>
//                                       {index == 0 && (
//                                         <View style={{flexDirection: 'row'}}>
//                                           {item2?.upload?.document.length !==
//                                             0 && (
//                                             <View style={{marginStart: 15}}>
//                                               <IconButton
//                                                 onPress={() =>
//                                                   onFileChoose(
//                                                     item.unique_id,
//                                                     item,
//                                                     item2,
//                                                     'Option',
//                                                     index,
//                                                     'document',
//                                                   )
//                                                 }
//                                                 icon="file-upload"
//                                               />
//                                               <Text>Upload file</Text>
//                                             </View>
//                                           )}
//                                           {item2?.upload?.photo.length !== 0 &&
//                                             !fileData1[item.unique_id]?.[
//                                               index
//                                             ] && (
//                                               <View style={{marginStart: 15}}>
//                                                 <IconButton
//                                                   onPress={() =>
//                                                     snapPhoto(
//                                                       item.unique_id,
//                                                       item,
//                                                       'Option',
//                                                       index,
//                                                       'image',
//                                                     )
//                                                   }
//                                                   icon="camera"
//                                                 />
//                                                 <Text>Take snap</Text>
//                                               </View>
//                                             )}
//                                           {(item2?.upload?.photo.length !== 0 ||
//                                             item2?.upload?.video.length !==
//                                               0) && (
//                                             <View style={{marginStart: 15}}>
//                                               <IconButton
//                                                 onPress={() =>
//                                                   selectPhoto(
//                                                     item.unique_id,
//                                                     item,
//                                                     item2,
//                                                     'Option',
//                                                     index,
//                                                     'image',
//                                                   )
//                                                 }
//                                                 icon="view-gallery"
//                                               />
//                                               <Text style={{marginStart: 2}}>
//                                                 Gallery
//                                               </Text>
//                                             </View>
//                                           )}
//                                           {item2?.upload?.video.length !==
//                                             0 && (
//                                             <View style={{marginStart: 15}}>
//                                               <IconButton
//                                                 onPress={() =>
//                                                   snapvideo(
//                                                     item.unique_id,
//                                                     item,
//                                                     'Option',
//                                                     index,
//                                                     'video',
//                                                   )
//                                                 }
//                                                 icon={({size, color}) => (
//                                                   <MaterialCommunityIcons
//                                                     name="video"
//                                                     size={size}
//                                                     color={color}
//                                                   />
//                                                 )}
//                                               />
//                                               <Text>Take Video</Text>
//                                             </View>
//                                           )}
//                                           {index === 0 ||
//                                             (image.unique_id ===
//                                               item.unique_id && (
//                                               <View
//                                                 style={{
//                                                   justifyContent: 'center',
//                                                 }}>
//                                                 <IconButton
//                                                   onPress={() =>
//                                                     handleDeleteImage(index)
//                                                   }
//                                                   icon="delete"
//                                                 />
//                                               </View>
//                                             ))}
//                                         </View>
//                                       )}
//                                       {item.unique_id === image.unique_id && (
//                                         <View style={{flexDirection: 'row'}}>
//                                           {item2?.upload?.document.length !==
//                                             0 && (
//                                             <View style={{marginStart: 15}}>
//                                               <IconButton
//                                                 onPress={() =>
//                                                   onFileChoose(
//                                                     item.unique_id,
//                                                     item,
//                                                     item2,
//                                                     'Option',
//                                                     index,
//                                                     'document',
//                                                   )
//                                                 }
//                                                 icon="file-upload"
//                                               />
//                                               <Text>Upload file</Text>
//                                             </View>
//                                           )}
//                                           {item2?.upload?.photo.length !== 0 &&
//                                             !fileData1[item.unique_id]?.[
//                                               index
//                                             ] && (
//                                               <View style={{marginStart: 15}}>
//                                                 <IconButton
//                                                   onPress={() =>
//                                                     snapPhoto(
//                                                       item.unique_id,
//                                                       item,
//                                                       'Option',
//                                                       index,
//                                                       'image',
//                                                     )
//                                                   }
//                                                   icon="camera"
//                                                 />
//                                                 <Text>Take snap</Text>
//                                               </View>
//                                             )}

//                                           {(item2?.upload?.photo.length !== 0 ||
//                                             item2?.upload?.video.length !==
//                                               0) && (
//                                             <View style={{marginStart: 15}}>
//                                               <IconButton
//                                                 onPress={() =>
//                                                   selectPhoto(
//                                                     item.unique_id,
//                                                     item,
//                                                     item2,
//                                                     'Option',
//                                                     index,
//                                                     'image',
//                                                   )
//                                                 }
//                                                 icon="view-gallery"
//                                               />
//                                               <Text style={{marginStart: 2}}>
//                                                 Gallery
//                                               </Text>
//                                             </View>
//                                           )}

//                                           {item2?.upload?.video.length !==
//                                             0 && (
//                                             <View style={{marginStart: 15}}>
//                                               <IconButton
//                                                 onPress={() =>
//                                                   snapvideo(
//                                                     item.unique_id,
//                                                     item,
//                                                     'Option',
//                                                     index,
//                                                     'video',
//                                                   )
//                                                 }
//                                                 icon={({size, color}) => (
//                                                   <MaterialCommunityIcons
//                                                     name="video"
//                                                     size={size}
//                                                     color={color}
//                                                   />
//                                                 )}
//                                               />
//                                               <Text>Take Video</Text>
//                                             </View>
//                                           )}
//                                           {images.length !== 1 && (
//                                             <View
//                                               style={{
//                                                 justifyContent: 'center',
//                                               }}>
//                                               <IconButton
//                                                 onPress={() =>
//                                                   handleDeleteImage(index)
//                                                 }
//                                                 icon="delete"
//                                               />
//                                             </View>
//                                           )}
//                                         </View>
//                                       )}
//                                     </>
//                                   )}
//                                 </View>
//                               );
//                             })}
//                           </>
//                           {Imgaescount.length !==
//                             Number(item2.no_upload) - 1 && (
//                             <View style={{marginRight: 10, marginLeft: 'auto'}}>
//                               <Button
//                                 onPress={() => {
//                                   setImages(prevImages => [
//                                     ...prevImages,
//                                     {unique_id: item.unique_id},
//                                   ]);
//                                 }}>
//                                 Add
//                               </Button>
//                             </View>
//                           )}
//                           {item2?.type === 'Mandatory' &&
//                             !submission[item.unique_id]?.upload && (
//                               <Text style={styles.validText}>
//                                 This field is required
//                               </Text>
//                             )}
//                         </View>
//                       )}
//                   </React.Fragment>
//                 );
//               })}
//             </ScrollView>
//           </React.Fragment>
//         );
//       case 'Advanced Yes/No Question':
//         return (
//           <React.Fragment>
//             <ScrollView>
//               {field_attributes.options.map((item2: any, ind: any) => {
//                 const Imgaescount = images1.filter(
//                   o => o?.unique_id === item.unique_id,
//                 );
//                 return (
//                   <React.Fragment key={item2.uniqueId}>
//                     <Grid>
//                       <Col
//                         style={{
//                           width: 40,
//                         }}>
//                         <RadioButton
//                           value={submission[item.unique_id]?.value}
//                           color={AppStyle.color.COLOR_PRIMARY}
//                           onPress={() => {
//                             handleOptionChange1(item2.option, item.unique_id);
//                             updateFormData(
//                               item.unique_id,
//                               item,
//                               item2.option,
//                               item2.uniqueId,
//                             );
//                           }}
//                           status={
//                             submission[item.unique_id]?.value === item2.option
//                               ? 'checked'
//                               : 'unchecked'
//                           }
//                         />
//                       </Col>
//                       <Col style={styles.checkBoxCol}>
//                         <Text>{item2.option}</Text>
//                       </Col>
//                     </Grid>

//                     {submission[item.unique_id]?.value === item2.option &&
//                       item2.type !== 'Not Required' && (
//                         <>
//                           {item2?.remark && (
//                             <React.Fragment>
//                               <CommonTextInput
//                                 txtStyle={styles.textInput}
//                                 onChangeText={(value: any) => {
//                                   if (value.match()) {
//                                     updateFormRemarks(
//                                       item.unique_id,
//                                       item2,
//                                       value,
//                                     );
//                                   } else {
//                                     updateFormRemarks(
//                                       item.unique_id,
//                                       item2,
//                                       '',
//                                     );
//                                   }
//                                 }}
//                                 placeHolder={item2.label}
//                                 showRightButton={false}
//                                 isSecure={false}
//                                 autoFocus={true}
//                                 values={submission[item.unique_id]?.remarks}
//                                 autoCapital={true}
//                               />
//                               {item2?.type === 'Mandatory' &&
//                                 !submission[item.unique_id]?.remarks && (
//                                   <Text style={styles.requiredText}>
//                                     This field is required
//                                   </Text>
//                                 )}
//                             </React.Fragment>
//                           )}
//                           <>
//                             {submission[item.unique_id]?.value ===
//                               item2.option &&
//                               item2.type !== 'Not Required' && (
//                                 <>
//                                   {item2?.uploadlabel && (
//                                     <React.Fragment>
//                                       <Text
//                                         style={{
//                                           marginStart: 30,
//                                           marginTop: 20,
//                                         }}>
//                                         {item2.uploadlabel}
//                                       </Text>
//                                     </React.Fragment>
//                                   )}
//                                 </>
//                               )}
//                           </>
//                         </>
//                       )}
//                     {submission[item.unique_id]?.value === item2.option && (
//                       <View style={styles.imageUploadView}>
//                         <>
//                           {images1.map((image: any, index: any) => {
                            
//                             const fileUri =
//                               S3_URL + fileData2[item.unique_id]?.[index]?.src;
//                             const filetypess =
//                               fileData2[item.unique_id]?.[index]?.type;
//                             return (
//                               <View
//                                 style={{
//                                   display: 'flex',
//                                   flexDirection: 'column',
//                                 }}>
//                                 {!!fileData2[item.unique_id]?.[index] ? (
//                                   <View
//                                     style={{
//                                       display: 'flex',
//                                       flexDirection: 'row',
//                                       marginBottom: index === 0 ? 20 : 0,
//                                     }}>
//                                     {filetypess === 'image' ? (
//                                       <Image
//                                         source={{uri: fileUri}}
//                                         style={styles.placeholderImg}
//                                       />
//                                     ) : null}
//                                     {filetypess === 'video' && (
//                                       <VideoPlayer
//                                         source={{uri: fileUri}}
//                                         style={styles.placeholderImg2}
//                                       />
//                                     )}
//                                     {filetypess === 'document' && (
//                                       <View key={index}>
//                                         <Image
//                                           source={require('../image/file.png')}
//                                           style={styles.placeholderImg1}
//                                         />
//                                         <TouchableOpacity
//                                           onPress={() =>
//                                             downloadDocument(
//                                               S3_URL +
//                                                 fileData2[item.unique_id]?.[
//                                                   index
//                                                 ],
//                                             )
//                                           }
//                                           style={{
//                                             flexDirection: 'row',
//                                             alignItems: 'center',
//                                           }}>
//                                           <MaterialIcons
//                                             name="cloud-download"
//                                             size={24}
//                                             color="black"
//                                           />
//                                           <Text>Download Document</Text>
//                                         </TouchableOpacity>
//                                       </View>
//                                     )}
//                                     <TouchableOpacity
//                                       onPress={() =>
//                                         handleDeletePhoto1(
//                                           item.unique_id,
//                                           index,
//                                         )
//                                       }
//                                       style={{
//                                         justifyContent: 'center',
//                                         marginStart: 10,
//                                       }}
                                      
//                                     >
//                                       <MaterialIcons
//                                         name="delete"
//                                         size={24}
//                                         color="red"
//                                       />
//                                     </TouchableOpacity>
//                                   </View>
//                                 ) : (
//                                   <>
//                                     {index === 0 && (
//                                       <View style={{flexDirection: 'row'}}>
//                                         {item2?.upload?.document.length !==
//                                           0 && (
//                                           <View style={{marginStart: 15}}>
//                                             <IconButton
//                                               onPress={() =>
//                                                 onFileChoose1(
//                                                   item.unique_id,
//                                                   item,
//                                                   item2,
//                                                   'Option',
//                                                   index,
//                                                   'document',
//                                                 )
//                                               }
//                                               icon="file-upload"
//                                             />
//                                             <Text>Upload file</Text>
//                                           </View>
//                                         )}
//                                         {item2?.upload?.photo.length !== 0 &&
//                                           !fileData2[item.unique_id]?.[
//                                             index
//                                           ] && (
//                                             <View style={{marginStart: 15}}>
//                                               <IconButton
//                                                 onPress={() =>
//                                                   snapPhoto1(
//                                                     item.unique_id,
//                                                     item,
//                                                     'Option',
//                                                     index,
//                                                     'image',
//                                                   )
//                                                 }
//                                                 icon="camera"
//                                               />
//                                               <Text>Take snap</Text>
//                                             </View>
//                                           )}

//                                         {(item2?.upload?.photo.length !== 0 ||
//                                           item2?.upload?.video.length !==
//                                             0) && (
//                                           <View style={{marginStart: 15}}>
//                                             <IconButton
//                                               onPress={() =>
//                                                 selectPhoto1(
//                                                   item.unique_id,
//                                                   item,
//                                                   item2,
//                                                   'Option',
//                                                   index,
//                                                   'image',
//                                                 )
//                                               }
//                                               icon="view-gallery"
//                                             />
//                                             <Text style={{marginStart: 2}}>
//                                               Gallery
//                                             </Text>
//                                           </View>
//                                         )}

//                                         {item2?.upload?.video.length !== 0 && (
//                                           <View style={{marginStart: 15}}>
//                                             <IconButton
//                                               onPress={() =>
//                                                 snapvideo1(
//                                                   item.unique_id,
//                                                   item,
//                                                   'Option',
//                                                   index,
//                                                   'video',
//                                                 )
//                                               }
//                                               icon={({size, color}) => (
//                                                 <MaterialCommunityIcons
//                                                   name="video"
//                                                   size={size}
//                                                   color={color}
//                                                 />
//                                               )}
//                                             />
//                                             <Text>Take Video</Text>
//                                           </View>
//                                         )}
//                                         {index === 0 ||
//                                           (image.unique_id ===
//                                             item.unique_id && (
//                                             <View
//                                               style={{
//                                                 justifyContent: 'center',
//                                               }}>
//                                               <IconButton
//                                                 onPress={() =>
//                                                   handleDeleteImage1(index)
//                                                 }
//                                                 icon="delete"
//                                               />
//                                             </View>
//                                           ))}
//                                       </View>
//                                     )}

//                                     {item.unique_id === image.unique_id && (
//                                       <View style={{flexDirection: 'row'}}>
//                                         {item2?.upload?.document.length !==
//                                           0 && (
//                                           <View style={{marginStart: 15}}>
//                                             <IconButton
//                                               onPress={() =>
//                                                 onFileChoose1(
//                                                   item.unique_id,
//                                                   item,
//                                                   item2,
//                                                   'Option',
//                                                   index,
//                                                   'document',
//                                                 )
//                                               }
//                                               icon="file-upload"
//                                             />
//                                             <Text>Upload file</Text>
//                                           </View>
//                                         )}
//                                         {item2?.upload?.photo.length !== 0 &&
//                                           !fileData1[item.unique_id]?.[
//                                             index
//                                           ] && (
//                                             <View style={{marginStart: 15}}>
//                                               <IconButton
//                                                 onPress={() =>
//                                                   snapPhoto1(
//                                                     item.unique_id,
//                                                     item,
//                                                     'Option',
//                                                     index,
//                                                     'image',
//                                                   )
//                                                 }
//                                                 icon="camera"
//                                               />
//                                               <Text>Take snap</Text>
//                                             </View>
//                                           )}
//                                         {(item2?.upload?.photo.length !== 0 ||
//                                           item2?.upload?.video.length !==
//                                             0) && (
//                                           <View style={{marginStart: 15}}>
//                                             <IconButton
//                                               onPress={() =>
//                                                 selectPhoto1(
//                                                   item.unique_id,
//                                                   item,
//                                                   item2,
//                                                   'Option',
//                                                   index,
//                                                   'image',
//                                                 )
//                                               }
//                                               icon="view-gallery"
//                                             />
//                                             <Text style={{marginStart: 2}}>
//                                               Gallery
//                                             </Text>
//                                           </View>
//                                         )}

//                                         {item2?.upload?.video.length !== 0 && (
//                                           <View style={{marginStart: 15}}>
//                                             <IconButton
//                                               onPress={() =>
//                                                 snapvideo1(
//                                                   item.unique_id,
//                                                   item,
//                                                   'Option',
//                                                   index,
//                                                   'video',
//                                                 )
//                                               }
//                                               icon={({size, color}) => (
//                                                 <MaterialCommunityIcons
//                                                   name="video"
//                                                   size={size}
//                                                   color={color}
//                                                 />
//                                               )}
//                                             />
//                                             <Text>Take Video</Text>
//                                           </View>
//                                         )}
//                                         {images.length !== 0 && (
//                                           <View
//                                             style={{
//                                               justifyContent: 'center',
//                                             }}>
//                                             <IconButton
//                                               onPress={() =>
//                                                 handleDeleteImage1(index)
//                                               }
//                                               icon="delete"
//                                             />
//                                           </View>
//                                         )}
//                                       </View>
//                                     )}
//                                   </>
//                                 )}
//                               </View>
//                             );
//                           })}
//                         </>
//                         {Imgaescount.length !== Number(item2.no_upload) - 1 && (
//                           <View style={{marginRight: 10, marginLeft: 'auto'}}>
//                             <Button
//                               onPress={() => {
//                                 setImages1(prevImages => [
//                                   ...prevImages,
//                                   {unique_id: item.unique_id},
//                                 ]);
//                               }}>
//                               Add
//                             </Button>
//                           </View>
//                         )}
//                         {item2?.imageupload === 'Mandatory' &&
//                           !submission[item.unique_id]?.upload && (
//                             <Text style={styles.validText}>
//                               This field is required
//                             </Text>
//                           )}
//                       </View>
//                     )}
//                     {submission[item.unique_id]?.value === item2.option && (
//                       <>
//                         <MultiSelectExample
//                           id={item.field_attributes.asset_type_id}
//                           assetTypeLabel={
//                             item.field_attributes.asset_type_label
//                           }
//                           Change={(value: any) => {
//                             selectitem(value, item.unique_id);
//                           }}
//                         />
//                       </>
//                     )}
//                   </React.Fragment>
//                 );
//               })}
//             </ScrollView>
//           </React.Fragment>
//         );
//       case 'RadioButton':
//         return (
//           <React.Fragment>
//             <ScrollView>
//               {field_attributes.options.map((item2: any) => (
//                 <React.Fragment key={item2.uniqueId}>
//                   <Grid>
//                     <Col
//                       style={{
//                         width: 40,
//                       }}>
//                       <RadioButton
//                         value={submission[item.unique_id]?.value}
//                         color={AppStyle.color.COLOR_PRIMARY}
//                         onPress={() => {
//                           updateFormData(
//                             item.unique_id,
//                             item,
//                             item2.option,
//                             '',
//                           );
//                         }}
//                         status={
//                           submission[item.unique_id]?.value === item2.option
//                             ? 'checked'
//                             : 'unchecked'
//                         }
//                       />
//                     </Col>
//                     <Col style={styles.checkBoxCol}>
//                       <Text>{item2.option}</Text>
//                     </Col>
//                     <View></View>
//                   </Grid>
//                   {submission[item.unique_id]?.value === item2.option && (
//                     <>
//                       {item2?.remark && (
//                         <React.Fragment>
//                           <CommonTextInput
//                             txtStyle={styles.textInput}
//                             onChangeText={(value: any) => {
//                               if (value.match()) {
//                                 updateFormRemarks(item.unique_id, item2, value);
//                               } else {
//                                 updateFormRemarks(item.unique_id, item2, '');
//                               }
//                             }}
//                             placeHolder={item2.label}
//                             showRightButton={false}
//                             isSecure={false}
//                             autoFocus={true}
//                             values={submission[item.unique_id]?.remarks}
//                             autoCapital={true}
//                           />
//                           {item2?.type === 'Mandatory' &&
//                             !submission[item.unique_id]?.remarks && (
//                               <Text style={styles.requiredText}>
//                                 This field is required
//                               </Text>
//                             )}
//                         </React.Fragment>
//                       )}
//                     </>
//                   )}
//                 </React.Fragment>
//               ))}
//             </ScrollView>
//           </React.Fragment>
//         );
//       case 'DateTime':
//         return (
//           <React.Fragment>
//             <Grid key={item.uniqueId}>
//               <Col>
//                 {updateFormDate(item.unique_id, item, 'datetime', 'L HH:mm')}
//               </Col>
//             </Grid>
//           </React.Fragment>
//         );
//       case QuestionType.DATE_ONLY:
//         return (
//           <React.Fragment>
//             <Grid key={item.uniqueId}>
//               <Col>{updateFormDate(item.unique_id, item, 'date', 'L')}</Col>
//             </Grid>
//           </React.Fragment>
//         );
//       case QuestionType.TIME_ONLY:
//         return (
//           <React.Fragment>
//             <Grid key={item.uniqueId}>
//               <Col>{updateFormDate(item.unique_id, item, 'time', 'HH:mm')}</Col>
//             </Grid>
//           </React.Fragment>
//         );
//       case 'Dropdown':
//         return (
//           <View style={styles.dropDown}>
//             <DropDown
//               label={'Select answer'}
//               mode={'outlined'}
//               visible={showDropDown[item.unique_id]}
//               showDropDown={() => setShowDropDownList(item.unique_id, true)}
//               onDismiss={() => setShowDropDownList(item.unique_id, false)}
//               value={submission[item.unique_id]?.value}
//               setValue={value => {
//                 updateFormData(item.unique_id, item, value, '');
//               }}
//               list={field_attributes.options.map((options: any) => ({
//                 label: options.option,
//                 value: options.option,
//               }))}
//             />
//           </View>
//         );
//       case 'ImageUpload':
//         return (
//           <React.Fragment key={item.unique_id}>
//             <View style={styles.imageUploadView}>
//               <>
//                 {images1.map((image: any, index: any) => {
//                   const fileUri =
//                     S3_URL + fileData2[item.unique_id]?.[index]?.src;
//                   const filetypess = fileData2[item.unique_id]?.[index]?.type;
//                   return (
//                     <View
//                       style={{
//                         display: 'flex',
//                         flexDirection: 'column',
//                       }}>
//                       {!!fileData2[item.unique_id]?.[index] ? (
//                         <View
//                           style={{
//                             display: 'flex',
//                             flexDirection: 'row',
//                             marginBottom: index === 0 ? 20 : 0,
//                           }}>
//                           {filetypess === 'image' ? (
//                             <Image
//                               source={{uri: fileUri}}
//                               style={styles.placeholderImg}
//                             />
//                           ) : null}
//                           {filetypess === 'video' && (
//                             <VideoPlayer
//                               source={{uri: fileUri}}
//                               style={styles.placeholderImg2}
//                             />
//                           )}
//                           {filetypess === 'document' && (
//                             <View key={index}>
//                               <Image
//                                 source={require('../image/file.png')}
//                                 style={styles.placeholderImg1}
//                               />
//                               <TouchableOpacity
//                                 onPress={() =>
//                                   downloadDocument(
//                                     S3_URL + fileData2[item.unique_id]?.[index],
//                                   )
//                                 }
//                                 style={{
//                                   flexDirection: 'row',
//                                   alignItems: 'center',
//                                 }}>
//                                 <MaterialIcons
//                                   name="cloud-download"
//                                   size={24}
//                                   color="black"
//                                 />
//                                 <Text>Download Document</Text>
//                               </TouchableOpacity>
//                             </View>
//                           )}
//                           <TouchableOpacity
//                             onPress={() =>
//                               handleDeletePhoto1(item.unique_id, index)
//                             }
//                             style={{
//                               justifyContent: 'center',
//                               marginStart: 10,
//                             }}
                            
//                           >
//                             <MaterialIcons
//                               name="delete"
//                               size={24}
//                               color="red"
//                             />
//                           </TouchableOpacity>
//                         </View>
//                       ) : (
//                         <View style={{flexDirection: 'row'}}>
//                           <View style={{marginStart: 15}}>
//                             <IconButton
//                               onPress={() =>
//                                 onFileChoose1(
//                                   item.unique_id,
//                                   item,
//                                   'item2',
//                                   'Question',
//                                   index,
//                                   'document',
//                                 )
//                               }
//                               icon="file-upload"
//                             />
//                             <Text>Upload file</Text>
//                           </View>

//                           {field_attributes?.validations.allowed_file_types
//                             ?.photo?.length !== 0 &&
//                             !fileData2[item.unique_id]?.[index] && (
//                               <View style={{marginStart: 15}}>
//                                 <IconButton
//                                   onPress={() =>
//                                     snapPhoto1(
//                                       item.unique_id,
//                                       item,
//                                       'Question',
//                                       index,
//                                       'image',
//                                     )
//                                   }
//                                   icon="camera"
//                                 />
//                                 <Text>Take snap</Text>
//                               </View>
//                             )}

//                           <View style={{marginStart: 15}}>
//                             <IconButton
//                               onPress={() =>
//                                 selectPhoto1(
//                                   item.unique_id,
//                                   item,
//                                   field_attributes?.validations
//                                     .allowed_file_types,
//                                   'Question',
//                                   index,
//                                   'image',
//                                 )
//                               }
//                               icon="view-gallery"
//                             />
//                             <Text style={{marginStart: 2}}>Gallery</Text>
//                           </View>

//                           <View style={{marginStart: 15}}>
//                             <IconButton
//                               onPress={() =>
//                                 snapvideo1(
//                                   item.unique_id,
//                                   item,
//                                   'Question',
//                                   index,
//                                   'video',
//                                 )
//                               }
//                               icon={({size, color}) => (
//                                 <MaterialCommunityIcons
//                                   name="video"
//                                   size={size}
//                                   color={color}
//                                 />
//                               )}
//                             />
//                             <Text>Take Video</Text>
//                           </View>
//                         </View>
//                       )}
//                     </View>
//                   );
//                   0;
//                 })}
//               </>
//             </View>
//           </React.Fragment>
//         );
//     }
//   };
//   const renderItem = ({item, index}: CardProps) => {
//     return (
//       <View>
//         <Card style={styles.card}>
//           {item.counter ? (
//             <Card.Title
//               titleStyle={styles.cardTitleText}
//               title={`${item.counter}. ${item.title}`}
//               subtitle={item.description ? `${item.description}` : ''}
//               subtitleNumberOfLines={6}
//               titleNumberOfLines={10}
//             />
//           ) : (
//             <Card.Title
//               titleStyle={styles.cardTitleTextHeading}
//               title={`${item.title}`}
//             />
//           )}
//           <Card.Content style={styles.cardContent}>
//             {renderInput(item.field_attributes, item)}
//             {renderRequired(item.field_attributes, item, '')}
//           </Card.Content>
//         </Card>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <Loader />
//       ) : (
//         <React.Fragment>
//       <View
//   style={{
//     backgroundColor: 'white',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: 60,
//   }}>
//   {selectedValue ? (
//     <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
//       <View style={{ alignItems: 'center' }}>
//         <Text style={{ fontSize: 18 }}>
//           {userData.find(item => item.contact_name === selectedValue)?.contact_name}
//         </Text>
//         <Text style={{ fontSize: 14, color: 'gray' }}>
//           {userData.find(item => item.contact_name === selectedValue)?.designation}
//         </Text>
//       </View>
//     </TouchableWithoutFeedback>
//   ) : (
//     <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
//       <View
//         style={{
//           height: '100%',
//           alignItems: 'center',
//           justifyContent: 'center',
//           borderWidth: 1,
//           borderColor: '#ccc', 
//           borderRadius: 5, 
//           paddingHorizontal: 10, 
//           backgroundColor: '#f5f5f5', 
//         }}>
//         <Text style={{ fontSize: 18 }}>Select Employee</Text>
//       </View>
//     </TouchableWithoutFeedback>
//   )}
// </View>
//           <FlatList
//             keyboardShouldPersistTaps="always"
//             keyboardDismissMode="none"
//             removeClippedSubviews={false}
//             renderItem={renderItem}
//             data={data.form_details}
//             contentContainerStyle={{paddingBottom: 20}}
//             keyExtractor={item => item.unique_id}
//           />
//           <Modal
//             animationType="slide"
//             transparent={true}
//             visible={modalVisible}
//             onRequestClose={() => setModalVisible(false)}>
//             <View
//               style={{
//                 flex: 1,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 backgroundColor: 'rgba(0, 0, 0, 0.5)',
//               }}>
//               <View
//                 style={{
//                   backgroundColor: 'white',
//                   borderRadius: 10,
//                   padding: 20,
//                   width: '80%',
//                   maxHeight: '80%',
//                 }}>
//                 <TouchableOpacity
//                   onPress={() => setModalVisible(false)} 
//                   style={{alignSelf: 'flex-end', padding: 10}}>
//                   <Text>Close</Text>
//                 </TouchableOpacity>
//                 <TextInput
//                   style={{borderWidth: 1, padding: 10, width: '100%'}}
//                   placeholder="Search Employee"
//                   value={searchText}
//                   onChangeText={text => setSearchText(text)}
//                 />
//                 <FlatList
//                   data={filteredOptions}
//                   renderItem={({item}) => (
//                     <TouchableOpacity
//                       onPress={() => {
//                         setSelectedValue(item);
//                         setModalVisible(false);
//                       }}
//                       style={{padding: 10}}>
//                       <Text>{item}</Text>
//                     </TouchableOpacity>
//                   )}
//                   keyExtractor={(item, index) => index.toString()}
//                 />
//               </View>
//             </View>
//           </Modal>
//         </React.Fragment>
//       )}
//     </View>
//   );
// };
// export default SubmitFormid;
