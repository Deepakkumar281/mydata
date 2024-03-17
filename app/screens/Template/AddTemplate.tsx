import React, {useState, useMemo, useRef, useEffect} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Switch,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Colors,
  IconButton,
  List,
  Modal,
  Paragraph,
  RadioButton,
  TextInput,
  Title,
} from 'react-native-paper';
import {useSelector} from '../../redux';
import {useDispatch} from 'react-redux';
import WorkOrderApi from '../../services/workOrder';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import styles from './styles';
import {setCurrentUser} from '../../redux/user/actions';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import CommonTextInput from '../../components/CommonTextInput';

import {
  ALLOWED_FILE_TYPES,
  ALLOWED_FILE_TYPES2,
  ALLOWED_FILE_TYPES3,
  ALLOWED_FILE_TYPES4,
  getQuestionName,
  questionList,
  QuestionsData,
  QuestionType,
} from '../../models/api/templates';
import {FAB} from 'react-native-paper';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import {Col, Grid} from 'react-native-easy-grid';
import uuid from 'react-native-uuid';
import TemplateApi from '../../services/template';
import Loader from '../../components/Loader';
import {useRoute} from '@react-navigation/native';
import {setScreenUpdated} from '../../redux/screen/actions';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import {Item} from 'react-native-paper/lib/typescript/components/List/List';
import MultiLineInput from '../../components/MultiLineInput';
import AppStyle from '../../config/styles';
import DropDown from 'react-native-paper-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
interface IconItem {
  name: string;
  color: string;
}

const AddTemplate: React.FC<any> = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<QuestionsData[]>([]);
  const [selectedValues, setSelectedValues] = useState('');
  const [selectType, setselectType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const user = useSelector(state => state.userReducer);
  const api = useMemo(() => new TemplateApi(), [user.access_token]);
  const dispatch = useDispatch();
  const route = useRoute<any>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isComplaint, setIsComplaint] = useState(false);

  // const [checkboxValues, setCheckboxValues] = useState(
  //   checkboxData.map(() => false)
  // );
  const [activeForm, setActiveForm] = useState<any>({
    index: undefined,
    item: {},
  });
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [onBottom, setOnBottom] = useState(false);
  const [showMethod, setShowMethod] = useState('');
  const [showValue, setShowValue] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          icon="check"
          onPress={() => {
            setSaving(true);
          }}>
          Submit
        </Button>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (saving) submit();
  }, [saving]);

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

  useEffect(() => {
    console.log(selectedValues);
  }, [selectedValues]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleIconSelect = (iconName: any) => {
    setSelectedIcon(iconName);
    setSelectedValues(iconName);
    toggleModal();
  };
  const iconNames = Icon.getRawGlyphMap();
  const iconData: IconItem[] = Object.keys(iconNames).map(name => ({
    name: name,
    color: 'blue',
  }));
  const filterIcons = () => {
    return iconData.filter(icon =>
      icon.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  const dropDown = [
    {name: 'Not Requried', id: 'Not Requried'},
    {name: 'Optional', id: 'Optional'},
    {name: 'Mandatory', id: 'Mandatory'},
    // Add more icon options as needed
  ];

  const TypeData = [
    {name: 'Ticket', id: 'Ticket'},
    {name: 'Check List', id: 'Checklist'},
    // Add more icon options as needed
  ];

  const handleValueChange = (value: string) => {
    setIsComplaint(value === 'yes');
  };

  useEffect(() => {
    console.log(selectedValues);
    console.log(selectType, 'selected type');
  }, [selectedValues, selectType]);

  const [showtype, setShowtype] = useState(false);
  const [showtype1, setShowtype1] = useState(false);
  const [showtype2, setShowtype2] = useState(false);
  const handleShowDropDown = () => {
    setShowtype(true);
  };
  const handleShowDropDown1 = () => {
    setShowtype1(true);
  };
  const handleShowDropDown2 = () => {
    setShowtype2(true);
  };
  const handleDismissDropDown = () => {
    setShowtype(false);
  };
  const handleDismissDropDown1 = () => {
    setShowtype1(false);
  };
  const handleDismissDropDown2 = () => {
    setShowtype2(false);
  };
  const submit = () => {
    // construct data and post to API
    if (!title || !description) {
      showError('Please enter title and description');
      return;
    }
    // Other validations
    let isValid = true;
    let optionsValid = true;
    for (let da of data) {
      if (!da.question) {
        isValid = false;
      }
      if (
        da.questionType === QuestionType.CHECKBOX ||
        da.questionType === QuestionType.DROP_DOWN ||
        da.questionType === QuestionType.RADIOBUTTON ||
        da.questionType === QuestionType.YesNo
      ) {
        if (da.options.length === 0) optionsValid = false;
      }
    }
    if (!isValid) {
      showError('Please fill all questions title.');
      return;
    }

    if (!optionsValid) {
      showError('Please fill all questions options values.');
      return;
    }

    if (data.length === 0) {
      showError('Please add some questions to the form.');
      return;
    }
    setIsLoading(true);
    let newData = {
      title: title,
      description: description,
      form_fields: data.map((item, index) => ({
        title: item.question,
        description: item.description,
        form_order: index,
        is_required: item.isRequired,
        unique_id: item.questionIndex,
        field_attributes: {
          options: item.options,
          field_type: item.questionType,
          validations: item.validations,
        },
      })),
      attribute: {
        icon_name: selectedValues,
        icon_pack: 'FontAwesome',
      },
      form_type: selectType,
    };
    console.log(newData);
    setSaving(false);
    // return
    api
      .addTemplate(newData)
      .then(res => {
        Notifier.showNotification({
          title: 'Form template has been added successfully.',
          Component: NotifierComponents.Alert,
          duration: 2000,
          componentProps: {
            alertType: 'success',
          },
        });
        dispatch(setScreenUpdated('LIST_TEMPLATES'));
        navigation.goBack();
      })
      .catch(err => {
        setIsLoading(false);
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

  const showActionSheet = () => {
    actionSheetRef.current?.show();
  };

  const cloneForm = (item: QuestionsData, index: number) => {
    const newData = data.slice(0); // copy
    newData.splice(index + 1, 0, {
      ...item,
      questionIndex: uuid.v4().toString(),
    });
    setData(newData);
  };

  const deleteForm = (index: number) => {
    setData(prevState => prevState.filter((item, index2) => index2 !== index));
  };

  const renderRequiredInput = (item: any, index: number) => {
    switch (item.questionType) {
      case QuestionType.SUB_HEADING:
      case QuestionType.HEADING:
        return <></>;
      default:
        return (
          <Col>
            <Grid>
              <Col>
                <Switch
                  value={item.isRequired}
                  onValueChange={value => {
                    updateFormDataByIndex('isRequired', value, index);
                  }}
                />
              </Col>
              <Col>
                <Text>Required</Text>
              </Col>
            </Grid>
          </Col>
        );
    }
  };

  const renderFormContent = (item: QuestionsData, index: number) => {
    return (
      <Grid>
        <Col>
          <Text>{getQuestionName(item.questionType)}</Text>
        </Col>
        <Col
          style={{
            width: 65,
          }}>
          <Grid>
            <Col
              style={{
                width: 32,
              }}>
              <IconButton
                icon="content-copy"
                size={18}
                style={styles.actionButton}
                color={Colors.grey600}
                onPress={() => cloneForm(item, index)}
              />
            </Col>
            <Col>
              <IconButton
                icon="delete"
                size={18}
                style={styles.actionButton}
                color={Colors.grey600}
                onPress={() => deleteForm(index)}
              />
            </Col>
          </Grid>
        </Col>
        {renderRequiredInput(item, index)}
      </Grid>
    );
  };

  const renderItem = ({
    item,
    getIndex,
    drag,
    isActive,
  }: RenderItemParams<QuestionsData>) => {
    return (
      <Card
        style={isActive ? styles.cardActive : styles.card}
        onPress={() => {
          setShowForm(true);
          setActiveForm({
            index: getIndex(),
            item,
          });
          setOnBottom(true);
        }}
        onLongPress={drag}>
        <Card.Title
          style={styles.cardTitleHolder}
          titleStyle={styles.cardTitle}
          subtitle={item.question ? '' : 'This field is required'}
          subtitleStyle={styles.subTitleStyle}
          title={`${(getIndex() as any) + 1}. ${item.question}`}
        />
        <Card.Content style={styles.formContent}>
          {renderFormContent(item, getIndex()!)}
        </Card.Content>
      </Card>
    );
  };

  const updateFormData = (key: string, value: any) => {
    setData(prevState =>
      prevState.map((item, index) => {
        if (index === activeForm.index) {
          item[key] = value;
        }
        return item;
      }),
    );
  };
  const updateFormData1 = (key: string, value: any) => {
    setOptionsItem1(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };
  const updateFormDataByIndex = (
    key: string,
    value: any,
    itemIndex: number,
  ) => {
    setData(prevState =>
      prevState.map((item, index) => {
        if (index === itemIndex) {
          item[key] = value;
        }
        return item;
      }),
    );
  };

  const addNewOption = (item: QuestionsData, itemIndex: number) => {
    setData(prevState =>
      prevState.map((item, index) => {
        if (index === itemIndex) {
          item['options'] = [
            ...item['options'],
            {
              option: '',
              uniqueId: uuid.v4().toString(),
            },
          ];
        }
        return item;
      }),
    );
  };

  const deleteNewOption = (
    item: QuestionsData,
    itemIndex: number,
    optionsIndex: number,
  ) => {
    setData(prevState =>
      prevState.map((item, index) => {
        if (index === itemIndex) {
          item['options'] = item['options'].filter(
            (item, index2) => index2 !== optionsIndex,
          );
        }
        return item;
      }),
    );
  };
  const UpdateOptiontype = (
    item: QuestionsData,
    itemIndex: number,
    optionsIndex: number,
    value: any,
  ) => {
    setData(prevState =>
      prevState.map((item, index) => {
        if (index === itemIndex) {
          item['options'] = item['options'].map(
            (optionsItem, optionsIndex2) => {
              if (optionsIndex2 === optionsIndex) {
                optionsItem['type'] = value;
              }
              return optionsItem;
            },
          );
        }
        return item;
      }),
    );
  };
  // const updatedocument = (
  //   item: QuestionsData,
  //   itemIndex: number,
  //   optionsIndex: number,
  //   values: string[],
  // ) => {
  //   setData(prevState =>
  //     prevState.map((item, index) => {
  //       if (index === itemIndex) {
  //         item['options'] = item['options'].map(
  //           (optionsItem, optionsIndex2) => {
  //             if (optionsIndex2 === optionsIndex) {
  //               optionsItem['document'] = [...values];
  //             }
  //             return optionsItem;
  //           },
  //         );
  //       }
  //       return item;
  //     }),
  //   );
  // };
  const updatedocument = (
    item: QuestionsData,
    itemIndex: number,
    optionsIndex: number,
    values: any[],
  ) => {
    setData(prevState =>
      prevState.map((prevItem, index) => {
        if (index === itemIndex) {
          const newItem = {...prevItem};
          if (newItem.options) {
            newItem.options = newItem.options.map(
              (optionsItem, optionsIndex2) => {
                if (optionsIndex2 === optionsIndex) {
                  optionsItem.document = values;
                }
                return optionsItem;
              },
            );
          }
          return newItem;
        }
        return prevItem;
      }),
    );
  };

  const updateNewOption = (
    item: QuestionsData,
    itemIndex: number,
    optionsIndex: number,
    value: any,
  ) => {
    setData(prevState =>
      prevState.map((item, index) => {
        if (index === itemIndex) {
          item['options'] = item['options'].map(
            (optionsItem, optionsIndex2) => {
              if (optionsIndex2 === optionsIndex) {
                optionsItem['option'] = value;
              }
              return optionsItem;
            },
          );
        }
        return item;
      }),
    );
  };

  const updateValidationValue = (
    item: QuestionsData,
    itemIndex: number,
    key: string,
    value: string,
  ) => {
    setData(prevState =>
      prevState.map((item, index) => {
        if (index === itemIndex) {
          item['validations'][key] = value;
        }
        return item;
      }),
    );
  };

  const updateAllowedFileTypes = (
    item: QuestionsData,
    itemIndex: number,
    fileType: string,
  ) => {
    setData(prevState =>
      prevState.map((item, index) => {
        if (index === itemIndex) {
          let allowed_file_types = item.validations.allowed_file_types;
          if (allowed_file_types.includes(fileType)) {
            // Remove
            allowed_file_types = allowed_file_types.filter(
              (allType: any) => allType !== fileType,
            );
          } else {
            // Add
            allowed_file_types.push(fileType);
          }
          item['validations'] = {
            allowed_file_types,
          };
        }
        return item;
      }),
    );
  };

  const saveButton = () => {
    return (
      <Button
        compact
        mode="contained"
        onPress={() => {
          setShowForm(false);
          setOnBottom(false);
        }}
        style={styles.addOptionButton}>
        Save
      </Button>
    );
  };

  const loadValidationForm = (item: QuestionsData, index: number) => {
    switch (item.questionType) {
      case QuestionType.IMAGE_UPLOAD:
        return (
          <View
            style={{
              paddingLeft: 15,
              paddingRight: 15,
              paddingTop: 10,
              paddingBottom: 10,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
              }}>
              Allowed file types:
            </Text>
            <Grid>
              <Col>
                {ALLOWED_FILE_TYPES.map((allowedFile: any) => (
                  <Grid key={allowedFile.fileType}>
                    <Col
                      style={{
                        width: 40,
                      }}>
                      <Checkbox
                        color={AppStyle.color.COLOR_PRIMARY}
                        onPress={() => {
                          updateAllowedFileTypes(
                            item,
                            index,
                            allowedFile.fileType,
                          );
                        }}
                        status={
                          item.validations.allowed_file_types.includes(
                            allowedFile.fileType,
                          )
                            ? 'checked'
                            : 'unchecked'
                        }
                      />
                    </Col>
                    <Col
                      style={{
                        justifyContent: 'center',
                      }}>
                      <Text>{allowedFile.fileTitle}</Text>
                    </Col>
                  </Grid>
                ))}
              </Col>
              <Col>
                {ALLOWED_FILE_TYPES2.map((allowedFile: any) => (
                  <Grid key={allowedFile.fileType}>
                    <Col
                      style={{
                        width: 40,
                      }}>
                      <Checkbox
                        color={AppStyle.color.COLOR_PRIMARY}
                        onPress={() => {
                          updateAllowedFileTypes(
                            item,
                            index,
                            allowedFile.fileType,
                          );
                        }}
                        status={
                          item.validations.allowed_file_types.includes(
                            allowedFile.fileType,
                          )
                            ? 'checked'
                            : 'unchecked'
                        }
                      />
                    </Col>
                    <Col
                      style={{
                        justifyContent: 'center',
                      }}>
                      <Text>{allowedFile.fileTitle}</Text>
                    </Col>
                  </Grid>
                ))}
              </Col>
            </Grid>
          </View>
        );
      case QuestionType.SHORT_ANSWER:
        return (
          <View
            style={{
              paddingLeft: 15,
              paddingRight: 15,
              paddingTop: 10,
              paddingBottom: 10,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
              }}>
              Validation:
            </Text>
            <DropDown
              label={'Method'}
              mode={'outlined'}
              visible={item.uniqueId === showMethod}
              showDropDown={() => {
                setShowMethod(item.uniqueId);
              }}
              onDismiss={() => {
                setShowMethod('');
              }}
              value={item.validations?.method}
              setValue={value => {
                console.log(value);
                updateValidationValue(item, index, 'method', value);
                updateValidationValue(item, index, 'value', '');
              }}
              list={[
                {
                  label: 'Text',
                  value: 'Text',
                },
                {
                  label: 'Length',
                  value: 'Length',
                },
                {
                  label: 'Regex',
                  value: 'Regex',
                },
              ]}
            />
            {item.validations?.method !== 'Regex' && (
              <DropDown
                label={'Value'}
                mode={'outlined'}
                visible={item.uniqueId === showValue}
                showDropDown={() => {
                  setShowValue(item.uniqueId);
                }}
                onDismiss={() => {
                  setShowValue('');
                }}
                value={item.validations?.value}
                setValue={value => {
                  updateValidationValue(item, index, 'value', value);
                }}
                list={
                  item.validations?.method === 'Length'
                    ? [
                        {
                          label: 'Max',
                          value: 'Max',
                        },
                        {
                          label: 'Min',
                          value: 'Min',
                        },
                      ]
                    : [
                        {
                          label: 'Email',
                          value: 'Email',
                        },
                        {
                          label: 'URL',
                          value: 'URL',
                        },
                      ]
                }
              />
            )}
            {item.validations?.method === 'Length' && (
              <CommonTextInput
                txtStyle={styles.titleText}
                onChangeText={(value: any) => {
                  updateValidationValue(item, index, 'charLength', value);
                }}
                placeHolder={'Number'}
                showRightButton={false}
                isSecure={false}
                //values = {valueTxt}
                values={item.validations?.charLength}
                autoFocus={true}
                keyboardType="numeric"
                autoCapital={true}
              />
            )}
            {item.validations?.method === 'Regex' && (
              <CommonTextInput
                txtStyle={styles.titleText}
                onChangeText={(value: any) => {
                  updateValidationValue(item, index, 'regex', value);
                }}
                placeHolder={'Regular Expression'}
                showRightButton={false}
                isSecure={false}
                //values = {valueTxt}
                values={item.validations?.regex}
                autoFocus={true}
                // keyboardType=""
                autoCapital={true}
              />
            )}

            <CommonTextInput
              txtStyle={styles.titleText}
              onChangeText={(value: any) => {
                updateValidationValue(item, index, 'errorText', value);
              }}
              placeHolder={'Custom Error Text'}
              showRightButton={false}
              isSecure={false}
              //values = {valueTxt}
              values={item.validations?.errorText}
              autoFocus={true}
              autoCapital={true}
            />
          </View>
        );
      case QuestionType.NUMERIC:
        return (
          <View
            style={{
              paddingLeft: 15,
              paddingRight: 15,
              paddingTop: 10,
              paddingBottom: 10,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
              }}>
              Validation:
            </Text>
            <DropDown
              label={'Method'}
              mode={'outlined'}
              visible={item.uniqueId === showMethod}
              showDropDown={() => {
                setShowMethod(item.uniqueId);
              }}
              onDismiss={() => {
                setShowMethod('');
              }}
              value={item.validations?.method}
              setValue={value => {
                console.log(value);
                updateValidationValue(item, index, 'method', value);
                updateValidationValue(item, index, 'value', '');
              }}
              list={[
                {
                  label: 'Regex',
                  value: 'Regex',
                },
              ]}
            />

            {item.validations?.method === 'Regex' && (
              <CommonTextInput
                txtStyle={styles.titleText}
                onChangeText={(value: any) => {
                  updateValidationValue(item, index, 'regex', value);
                }}
                placeHolder={'Regular Expression'}
                showRightButton={false}
                isSecure={false}
                //values = {valueTxt}
                values={item.validations?.regex}
                autoFocus={true}
                // keyboardType=""
                autoCapital={true}
              />
            )}

            <CommonTextInput
              txtStyle={styles.titleText}
              onChangeText={(value: any) => {
                updateValidationValue(item, index, 'errorText', value);
              }}
              placeHolder={'Custom Error Text'}
              showRightButton={false}
              isSecure={false}
              //values = {valueTxt}
              values={item.validations?.errorText}
              autoFocus={true}
              autoCapital={true}
            />
          </View>
        );
    }
  };
  const [optionsItem1, setOptionsItem1] = useState({type: ''});
  const loadOptionsForm = (item: QuestionsData, index: number) => {
    switch (item.questionType) {
      case QuestionType.DROP_DOWN:
      case QuestionType.CHECKBOX:
      case QuestionType.RADIOBUTTON:
      case QuestionType.YesNo:
        return (
          <View>
            {item.options?.map((optionsItem, optionsIndex, optionsItem1) => (
              <View style={{flex: 1, flexDirection: 'column'}}>
                {item.questionType === QuestionType.YesNo && <></>}
                {item.questionType !== QuestionType.YesNo && (
                  <CommonTextInput
                    key={optionsItem.uniqueId}
                    txtStyle={styles.titleText}
                    onChangeText={(value: any) => {
                      updateNewOption(optionsItem, index, optionsIndex, value);
                    }}
                    placeHolder={'Option'}
                    showRightButton={false}
                    isSecure={false}
                    values={optionsItem.option}
                    autoFocus={true}
                    autoCapital={true}
                    rightComponent={
                      <TextInput.Icon
                        name={'delete'}
                        size={22}
                        color={'black'}
                        forceTextInputFocus={false}
                        onPress={() => {
                          deleteNewOption(optionsItem, index, optionsIndex);
                        }}
                      />
                    }
                    returnKeyType="next"
                  />
                )}
              </View>
            ))}
            {item.questionType == QuestionType.YesNo && (
              <View>
                <View>
                  <CommonTextInput
                    key={+'_Yes'}
                    txtStyle={[styles.titleText, styles.minimizedTextInput]}
                    onChangeText={(value: any) => {
                      updateFormData('Yes', value);
                    }}
                    placeHolder={'Option'}
                    showRightButton={false}
                    isSecure={false}
                    values={'Yes'}
                    autoFocus={false}
                    autoCapital={true}
                    returnKeyType="next"
                  />
                  <CommonTextInput
                    key={+'_no'}
                    txtStyle={[styles.titleText, styles.minimizedTextInput]}
                    onChangeText={(value: any) => {
                      updateFormData('no', value);
                    }}
                    placeHolder={'Option'}
                    showRightButton={false}
                    isSecure={false}
                    values={'No'}
                    autoFocus={false}
                    autoCapital={true}
                    returnKeyType="next"
                  />
                  <View style={styles.dropdownContainer}>
                    <DropDown
                      label={'Details/Evidence'}
                      mode={'outlined'}
                      visible={showtype2}
                      showDropDown={handleShowDropDown2}
                      onDismiss={handleDismissDropDown2}
                      value={optionsItem1.type}
                      setValue={value => {
                        updateFormData1('type', value); // 'type' is the key corresponding to 'optionsItem1.type'
                      }}
                      list={dropDown.map(options => ({
                        label: options.name,
                        value: options.id,
                      }))}
                    />
                  </View>
                </View>
                <View>
                  <Text style={{fontFamily: 'bold'}}>
                    Define Which answer is complaint
                  </Text>
                  <RadioButton.Item
                    label="Yes, it is a complaint"
                    value="yes"
                    status={isComplaint ? 'checked' : 'unchecked'}
                    onPress={() => handleValueChange('yes')}
                  />
                  <RadioButton.Item
                    label="No, it is not a complaint"
                    value="no"
                    status={!isComplaint ? 'checked' : 'unchecked'}
                    onPress={() => handleValueChange('no')}
                  />
                </View>
              </View>
            )}
            <Grid>
              <Col>
                {item.questionType !== QuestionType.YesNo && (
                  <Button
                    compact
                    mode="contained"
                    onPress={() => {
                      addNewOption(item, index);
                    }}
                    style={styles.addOptionButton}>
                    Add Option
                  </Button>
                )}
              </Col>
              <Col>{saveButton()}</Col>
            </Grid>
          </View>
        );
      default:
        return saveButton();
    }
  };

  const renderForm = () => {
    if (activeForm.index === undefined || data.length === 0) {
      return <></>;
    }
    const content = data[activeForm.index];
    if (content === undefined) {
      return <></>;
    }
    return (
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={styles.formContainer}>
          <MultiLineInput
            txtStyle={styles.titleText}
            onChangeText={(value: any) => {
              updateFormData('question', value);
            }}
            placeHolder={'Question'}
            showRightButton={false}
            isSecure={false}
            //values = {valueTxt}
            values={content.question}
            autoFocus={true}
            autoCapital={true}
            returnKeyType="next"
          />

          <MultiLineInput
            txtStyle={styles.titleText}
            onChangeText={(value: any) => {
              updateFormData('description', value);
            }}
            placeHolder={'Description'}
            showRightButton={false}
            isSecure={false}
            //values = {valueTxt}
            values={content.description}
            autoFocus={false}
            autoCapital={true}
            returnKeyType="next"
          />

          <MultiLineInput
            txtStyle={styles.titleText}
            onChangeText={(value: any) => {
              updateFormData('Report title', value);
            }}
            placeHolder={'Report title'}
            showRightButton={false}
            isSecure={false}
            //values = {valueTxt}
            values={content.Report_title}
            autoFocus={false}
            autoCapital={true}
            returnKeyType="next"
          />
          {loadValidationForm(content, activeForm.index)}
          {loadOptionsForm(content, activeForm.index)}
        </View>
      </ScrollView>
    );
  };

  const addValidations = (questionType: QuestionType) => {
    if (questionType === QuestionType.IMAGE_UPLOAD) {
      return {
        allowed_file_types: ['Image', 'Video', 'Document', 'Audio'],
      };
    } else {
      return {};
    }
  };

  const addForm = (questionType: QuestionType) => {
    setData(prevState => [
      ...prevState,
      {
        questionIndex: uuid.v4().toString(),
        question: '',
        questionType,
        isRequired: false,
        options: [],
        validations: addValidations(questionType),
      },
    ]);
    actionSheetRef.current?.hide();
  };

  const renderActionItems = () => {
    return (
      <View>
        {questionList.map((item, index) => (
          <List.Item
            key={'qf_' + index}
            title={item.title}
            onPress={() => {
              addForm(item.questionType);
            }}
            left={props => <List.Icon {...props} icon={item.icon} />}
          />
        ))}
      </View>
    );
  };
  const renderIconItem = ({item}: {item: IconItem}) => {
    return (
      <TouchableOpacity style={styles.iconItem}>
        <Icon name={item.name} color={item.color} size={30} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Loader />
      ) : (
        <KeyboardAvoidingView>
          <DraggableFlatList
            enableLayoutAnimationExperimental={true}
            ListHeaderComponent={
              <View style={styles.titleSection}>
                <DropDown
                  label={'Form Type'}
                  mode={'outlined'}
                  visible={showtype}
                  showDropDown={handleShowDropDown}
                  onDismiss={handleDismissDropDown}
                  value={selectType}
                  setValue={value => {
                    setselectType(value);
                  }}
                  list={TypeData?.map(options => ({
                    label: options.name,
                    value: options.id,
                  }))}
                />
                <CommonTextInput
                  txtStyle={styles.titleText}
                  onChangeText={setTitle}
                  placeHolder={'Title'}
                  showRightButton={false}
                  isSecure={false}
                  values={title}
                  autoCapital={true}
                  returnKeyType="next"
                />
                <CommonTextInput
                  txtStyle={styles.descText}
                  onChangeText={setDescription}
                  placeHolder={'Description'}
                  showRightButton={false}
                  isSecure={false}
                  values={description}
                  autoCapital={true}
                  returnKeyType="next"
                />
                <View style={styles.containerIcon}>
                  <Text
                    style={{
                      margin: 5,
                      fontWeight: 'bold',
                      fontSize: 16,
                      color: '#000',
                    }}>
                    {' '}
                    {selectedIcon ? 'Selected Icon:' : 'Select Icons:'}{' '}
                  </Text>
                  <TouchableOpacity onPress={toggleModal}>
                    <Icon
                      name={selectedIcon || 'plus'}
                      size={24}
                      color="black"
                      style={{alignItems: 'center'}}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            }
            data={data}
            onDragEnd={({data}) => setData(data)}
            keyExtractor={item => '' + item.questionIndex}
            renderItem={renderItem}
            contentContainerStyle={{paddingBottom: 20}}
          />
        </KeyboardAvoidingView>
      )}

      <Modal
        visible={isModalVisible}
        style={styles.modal}
        onDismiss={toggleModal}>
        <View style={styles.modalContent}>
          <View>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search icons"
            />
            <FlatList
              data={filterIcons()}
              renderItem={renderIconItem}
              keyExtractor={item => item.name}
              numColumns={5}
              contentContainerStyle={styles.iconList}
            />
          </View>

          <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={showForm}
        onDismiss={() => {
          setShowForm(false);
          setOnBottom(false);
        }}>
        {renderForm()}
      </Modal>
      <ActionSheet ref={actionSheetRef}>
        <ScrollView>{renderActionItems()}</ScrollView>
      </ActionSheet>
      {!onBottom && (
        <FAB icon="plus" style={styles.fab} onPress={showActionSheet} />
      )}
    </View>
  );
};

export default AddTemplate;
