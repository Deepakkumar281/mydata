import React, { useState, useMemo, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, } from 'react-native';
import TemplateApi from '../../services/template';
import { useSelector } from '../../redux';
import DropDown from 'react-native-paper-dropdown';
import { Col, Grid, Row } from 'react-native-easy-grid';
import { ScrollView } from 'react-native-gesture-handler';
import { CheckBox } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import { Notifier, NotifierComponents } from 'react-native-notifier';
import SearchableDropDown from '../../components/SearchableDropDown';
import { boolean } from 'yup';


const Assign: React.FC<any> = () => {

    interface UserData {
        username: string,
        userid: number,
    }
    interface FormData {
        title: string,
        ipss_form_id: number,
    }

    interface CheckedItems {
        userData: boolean[];
        formData: boolean[];
    }

    interface TemplateUserData {
        user_id: number,
        username: string,
    }

    interface TemplateFormData {
        title: string,
        ipss_form_id: number,
    }

    const user = useSelector(state => state.userReducer);
    const templateApi = useMemo(() => new TemplateApi(), [user.loggedIn]);
    const [userData, setUserData] = useState<UserData[]>([]);
    const [formData, setFormData] = useState<FormData[]>([]);
    const [selectType, setselectType] = useState('');
    const [showtype, setShowtype] = useState(false);
    const [selectType1, setselectType1] = useState('');
    const [showtype1, setShowtype1] = useState(false);
    const [showtype2, setShowtype2] = useState(false);
    const [selectType2, setselectType2] = useState('');
    const [selectedValue, setSelectedValue] = useState(null);
    const navigation = useNavigation();
    const [saving, setsaving] = useState(false);
    const [checkedItems, setCheckedItems] = useState<CheckedItems>({
        userData: [],
        formData: [],
    });
    const [checkedItems1, setCheckedItems1] = useState<CheckedItems>({
        userData: [],
        formData: [],
    });

    const [templateUserData, setTemplateUserData] = useState<TemplateUserData[]>([]);
    const [templateFormData, setTemplateFormData] = useState<TemplateFormData[]>([]);
    const [matchedFormData, setMatchedFormData] = useState<FormData[]>([]);
    const [unMatchedFormData, setUnMatechedFormData] = useState<FormData[]>([]);
    const [matchedUserData, setMatchedUserData] = useState<UserData[]>([]);
    const [unmatchedUserData, setUnMatchedUserData] = useState<UserData[]>([]);


    const [selectedForms, setSelectedForms] = useState<FormData[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<UserData[]>([]);
    const [deselectedForms, setDeSelectedForms] = useState<FormData[]>([]);
    const [deselectedUsers, setDeSelectedUsers] = useState<UserData[]>([]);

    const userdata = () => {
        templateApi.UserDataGet().then((res) => {
            let user_data = res.data.results
            setUserData(user_data);
        })
    }

    const formdata = () => {
        templateApi.FormDataGet().then((res) => {
            let form_data = res.data.results
            setFormData(form_data);
        })
    }

    const templateuserdata = (form_id: number) => {
        templateApi.UserAssignGet(form_id).then((res) => {
            let template_userdata = res.data.results.filter((o: any) => { return o })
            setTemplateUserData(template_userdata)
        })
    }
    
    const templateformdata = (user_id: any) => {
        templateApi.FormAssignGet(user_id).then((res) => {
            let template_formdata = res.data.results.filter((o: any) => (o: any) => { return o })
            setTemplateFormData(template_formdata)

        })
    }

    const matchedFormDatas = useMemo(() => {
        return formData.filter((item) => {
            return templateFormData.some((otherItem) => otherItem.ipss_form_id === item.ipss_form_id);
        });
    }, [formData, templateFormData]);

    const UnmatchedFormDatas = useMemo(() => {
        return formData.filter((item) => {
            return !templateFormData.some((otherItem) => otherItem.ipss_form_id === item.ipss_form_id);
        });
    }, [formData, templateFormData]);

    const matchedUserDatas = useMemo(() => {
        return userData.filter((item) => {
            return templateUserData.some((otherItem) => otherItem.user_id === item.userid);
        });
    }, [userData, templateUserData]);

    const UnmatchedUserDatas = useMemo(() => {
        return userData.filter((item) => {
            return !templateUserData.some((otherItem) => otherItem.user_id === item.userid);
        });
    }, [userData, templateUserData]);

    useEffect(
        () => {
            userdata();
            formdata();
        }, [user.loggedIn,]
    );

    const showError = (message: string) => {
        Notifier.showNotification({
            title: message,
            Component: NotifierComponents.Alert,
            duration: 2000,
            componentProps: {
                alertType: 'error',
            },
        });
    };

    const submit = () => {
        console.log(selectType)
        console.log(selectType1)
        console.log(selectType2)
        if (!selectType || !selectType2 || !selectType1) {
            showError('Please Select the Following Dropdown');
            return;
        }
        let formdata = {
            assign: selectType,
            user_ids: [
                {
                    user_id: selectType1
                }
            ],
            form_ids:
                matchedFormData.map((item) => ({
                    ipss_form_id: item.ipss_form_id
                }))

        }
        let userdata = {
            assign: selectType,
            user_ids:
                matchedUserData.map((item) => ({
                    user_id: item.userid
                }))
            ,
            form_ids: [
                {
                    ipss_form_id: selectType1
                }
            ]
        }
        setsaving(false);

        if (selectType2 === "User") {
            console.log(userdata, "datas")

            templateApi.AssignTemplatePost(userdata)
                .then(res => {
                    Notifier.showNotification({
                        title: 'Form Assigned to the Following Users',
                        Component: NotifierComponents.Alert,
                        duration: 2000,
                        componentProps: {
                            alertType: 'success',
                        },
                    });
                    navigation.goBack();
                }).catch(err => {
                Notifier.showNotification({
                    title: 'Something went wrong. Try again.',
                    Component: NotifierComponents.Alert,
                    duration: 2000,
                    componentProps: {
                      alertType: 'error',
                    },
                  });
            })
        }
        if (selectType2 === "Form") {
            console.log(formdata, "datas")

            templateApi.AssignTemplatePost(formdata)
                .then(res => {
                    Notifier.showNotification({
                        title: 'The Following Forms Assigned to the User',
                        Component: NotifierComponents.Alert,
                        duration: 2000,
                        componentProps: {
                            alertType: 'success',
                        },
                    });
                    navigation.goBack();
                }).catch(err => {
                    Notifier.showNotification({
                        title: 'Something went wrong. Try again.',
                        Component: NotifierComponents.Alert,
                        duration: 2000,
                        componentProps: {
                            alertType: 'error',
                        },
                    });
                })
        }
    }
    useEffect(() => {

        console.log(selectType)
        console.log(selectType1)
        console.log(selectType2)
        if (selectType === "Form" && selectType1) {
            templateuserdata(parseInt(selectType1));
            setMatchedUserData(matchedUserDatas);
            setUnMatchedUserData(UnmatchedUserDatas);
        }
        if (selectType === "User" && selectType1) {
            templateformdata(parseInt(selectType1));
            setUnMatechedFormData(UnmatchedFormDatas)
            setMatchedFormData(matchedFormDatas)
            console.log(matchedFormData, "lkiiygtf")
        }
        selectedForms
    }, [selectType, selectType1, selectType2]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    icon="check"
                    onPress={() => {
                        setsaving(true);
                    }}>
                    Submit
                </Button>
            ),
        });
    }, [navigation])

    useEffect(() => {
        if (saving) submit();
    }, [saving])


    const handleCheckboxChange = (type: keyof CheckedItems, index: number) => {
        setCheckedItems((prevCheckedItems) => {
            const updatedCheckedItems: CheckedItems = {
                ...prevCheckedItems,
                [type]: [...prevCheckedItems[type]],
            };
            updatedCheckedItems[type][index] = !updatedCheckedItems[type][index];
            if (selectType2 === "Form") {
                const selectedForm: any = unMatchedFormData
                    .filter((item, index) => updatedCheckedItems.formData[index])
                    .map((item) => ({ title: item.title, ipss_form_id: item.ipss_form_id }));
                setSelectedForms(selectedForm);
            }
            if (selectType2 === "User") {
                const selectedUser: any = unmatchedUserData
                    .filter((item, index) => updatedCheckedItems.userData[index])
                    .map((item) => ({ username: item.username, userid: item.userid }));
                setSelectedUsers(selectedUser);
            }
            return updatedCheckedItems;
        });
    };


    const handleCheckboxChange1 = (type: keyof CheckedItems, index: number) => {
        setCheckedItems1((prevCheckedItems1) => {
            const updatedCheckedItems1: CheckedItems = {
                ...prevCheckedItems1,
                [type]: [...prevCheckedItems1[type]],
            };
            updatedCheckedItems1[type][index] = !updatedCheckedItems1[type][index];
            if (selectType2 === "Form") {
                const selectedForm1: any = matchedFormData
                    .filter((item, index) => updatedCheckedItems1.formData[index])
                    .map((item) => ({ title: item.title, ipss_form_id: item.ipss_form_id }));
                setDeSelectedForms(selectedForm1);
            }
            if (selectType2 === "User") {
                const selectedUser1: any = matchedUserData
                    .filter((item, index) => updatedCheckedItems1.userData[index])
                    .map((item) => ({ username: item.username, userid: item.userid }));
                setDeSelectedUsers(selectedUser1);
            }
            return updatedCheckedItems1;
        });
    };

    // Assigning the Forms to Users & Users to Forms
    const AssignItems = () => {

        console.log(selectedForms, "selected");
        if (selectType2 === "Form") {
            const newMatchedFormData = [...matchedFormData, ...selectedForms];
            const newUnmatchedFormData = unMatchedFormData.filter((item) => {
                return !selectedForms.some((otherItem) => otherItem?.ipss_form_id === item.ipss_form_id);
            });

            // Update the state with the new matched and unmatched data
            setMatchedFormData(newMatchedFormData);
            setUnMatechedFormData(newUnmatchedFormData);

            // Reset the selectedForms state to clear the selected checkboxes
            setSelectedForms([]);
            setCheckedItems((prevCheckedItems) => ({
                ...prevCheckedItems,
                formData: [],
            }));

        }
        if (selectType2 === "User") {
            const newMatchedUserData = [...matchedUserData, ...selectedUsers];
            const newUnmatchedUserData = unmatchedUserData.filter((item) => {
                return !selectedUsers.some((otherItem) => otherItem?.userid === item.userid);
            });

            // Update the state with the new matched and unmatched data
            setMatchedUserData(newMatchedUserData);
            setUnMatchedUserData(newUnmatchedUserData);

            // Reset the selectedForms state to clear the selected checkboxes
            setSelectedUsers([]);
            setCheckedItems((prevCheckedItems) => ({
                ...prevCheckedItems,
                userData: [],
            }));
        }
    }

    // DeAssigning the form to users & users to forms
    const deAssignItems = () => {
        console.log(deselectedForms, "selected");
        if (selectType2 === "Form") {
            const newUnmatchedFormData = [...unMatchedFormData, ...deselectedForms];
            const newMatchedFormData = matchedFormData.filter((item) => {
                return !deselectedForms.some((otherItem) => otherItem?.ipss_form_id === item.ipss_form_id);
            });

            // Update the state with the new matched and unmatched data
            setUnMatechedFormData(newUnmatchedFormData);
            setMatchedFormData(newMatchedFormData);

            // Reset the selectedForms state to clear the selected checkboxes
            setDeSelectedForms([]);
            setCheckedItems1((prevCheckedItems1) => ({
                ...prevCheckedItems1,
                formData: [],
            }));
        }
        if (selectType2 === "User") {
            const newUnMatchedUserData = [...unmatchedUserData, ...deselectedUsers];
            const newMatchedUserData = matchedUserData.filter((item) => {
                return !deselectedUsers.some((otherItem) => otherItem?.userid === item.userid);
            });

            // Update the state with the new matched and unmatched data
            setUnMatchedUserData(newUnMatchedUserData);
            setMatchedUserData(newMatchedUserData);

            // Reset the selectedForms state to clear the selected checkboxes
            setDeSelectedUsers([]);
            setCheckedItems1((prevCheckedItems1) => ({
                ...prevCheckedItems1,
                userData: [],
            }));
        }
    }

    const handleShowDropDown = () => {
        setShowtype(true);
    };
    const handleDismissDropDown = () => {
        setShowtype(false);
    };

    const TypeData = [
        { name: 'User', id: 'User' },
        { name: 'Form', id: 'Form' },
    ];


    const handleShowDropDown1 = () => {
        setShowtype1(true);
    };
    const handleDismissDropDown1 = () => {
        setShowtype1(false);
    };


    const handleShowDropDown2 = () => {
        setShowtype2(true);
    };
    const handleDismissDropDown2 = () => {
        setShowtype2(false);
    };

    return (
        <View>
            <View style={styles.wrapDropdown}>
                <View style={{ marginRight: 5, flex: 1 }}>
                    <DropDown
                        label={'Select'}
                        mode={'outlined'}
                        visible={showtype}
                        showDropDown={handleShowDropDown}
                        onDismiss={handleDismissDropDown}
                        value={selectType}
                        setValue={value => {
                            setselectType(value);
                            setselectType1('');
                            setselectType2('');
                        }}
                        list={TypeData?.map(options => ({
                            label: options.name,
                            value: options.id,
                        }))}
                    />
                </View>
                <View style={{ marginRight: 5, flex: 1 }}>
                    <SearchableDropDown
                        onItemSelect={(item: any) => {
                            setSelectedValue(item);
                            setselectType1(item?.id);
                            setselectType2('');
                        }}
                        selectedItems={selectedValue}
                        containerStyle={{}}
                        itemStyle={{
                            padding: 10,
                            marginTop: 2,
                            backgroundColor: '#fff',
                            borderColor: '#bbb',
                            borderWidth: 1,
                            borderRadius: 5,
                        }}
                        itemTextStyle={{ color: '#222' }}
                        itemsContainerStyle={{ maxHeight: 150, zIndex: 2 }}
                        items={selectType === "User" ? (
                            userData?.map((options) => ({
                                id: options?.userid,
                                name: options?.username,
                            }))
                        ) : selectType === "Form" ? (
                            formData?.map((options) => ({
                                id: options.ipss_form_id,
                                name: options.title,
                            }))
                        ) : (
                            [{ id: "", name: "No Options" }]
                        )}
                        resetValue={false}
                        textInputProps={{
                            placeholder: "Select Option",
                            onTextChange: (text: string) => {
                                // Handle text change if needed
                            },
                        }}
                        listProps={
                            {
                                nestedScrollEnabled: false,
                            }
                        }
                    />
                </View>
            </View>
            <View style={selectType ? { margin: 5, marginRight: 10 } : styles.disabledDropdown}>
                <DropDown
                    label='Select'
                    mode={'outlined'}
                    visible={showtype2}
                    showDropDown={handleShowDropDown2}
                    onDismiss={handleDismissDropDown2}
                    value={selectType2}
                    setValue={value => {
                        setselectType2(value);
                    }}
                    list={selectType ? (
                        selectType === "User" && selectType1 ? (
                            [{
                                label: "Form",
                                value: "Form"
                            }]
                        ) : (
                            selectType === "Form" && selectType1 ? (
                                [{
                                    label: "User",
                                    value: "User"
                                }]
                            ) : (
                                []
                            )
                        )
                    ) : (
                        []
                    )}
                />
            </View>
            <View style={styles.wrapData}>
                <Grid style={{ marginTop: 10, padding: 8 }}>
                    <Row style={styles.headerRow}>
                        <Col style={styles.headerCol}>

                            <Text style={styles.headerText}>Select Item</Text>
                        </Col>
                    </Row>
                    <ScrollView style={{ height: "60%" }}>
                        {selectType2 === "User" ? (
                            unmatchedUserData?.map((item, index) => (
                                <Row style={styles.dataRow} key={index}>
                                    <CheckBox
                                        checked={checkedItems.userData[index]}
                                        onPress={() => handleCheckboxChange("userData", index)}
                                        size={20}
                                    />
                                    <Col style={styles.dataRow}>
                                        <Text style={styles.dataText}>{item.username}</Text>
                                    </Col>
                                </Row>
                            ))
                        ) : selectType2 === "Form" ? (
                            unMatchedFormData?.map((item, index) => (
                                <Row style={styles.dataRow} key={index}>
                                    <CheckBox
                                        checked={checkedItems.formData[index]}
                                        onPress={() => handleCheckboxChange("formData", index)}
                                        size={20}
                                    />
                                    <Col style={styles.dataRow}>
                                        <Text style={styles.dataText}>{item?.title}</Text>
                                    </Col>
                                </Row>
                            ))
                        ) :
                            <Row style={styles.dataRow}>
                                <Col style={styles.dataRow}>
                                    <Text style={styles.dataText}>Select Data</Text>
                                </Col>
                            </Row>
                        }
                    </ScrollView>

                </Grid>

                <Grid style={{ marginTop: 10, padding: 8 }}>
                    <Row style={styles.headerRow}>
                        <Col style={styles.headerCol}>
                            <Text style={styles.headerText}>Chosen Item</Text>
                        </Col>
                    </Row>
                    <ScrollView style={{ height: "60%" }}>
                        {selectType2 === "User" ? (
                            matchedUserData?.map((item, index) => (
                                <Row style={styles.dataRow} key={index}>
                                    <CheckBox
                                        checked={checkedItems1.userData[index]}
                                        onPress={() => handleCheckboxChange1("userData", index)}
                                        size={20}
                                    />
                                    <Col style={styles.dataRow}>
                                        <Text style={styles.dataText}>{item.username}</Text>
                                    </Col>
                                </Row>
                            ))
                        ) : selectType2 === "Form" ? (
                            matchedFormData?.map((item, index) => (
                                <Row style={styles.dataRow} key={index}>
                                    <CheckBox
                                        checked={checkedItems1.formData[index]}
                                        onPress={() => handleCheckboxChange1("formData", index)}
                                        size={20}
                                    />
                                    <Col style={styles.dataRow}>
                                        <Text style={styles.dataText}>{item.title}</Text>
                                    </Col>
                                </Row>
                            ))
                        ) :
                            <Row style={styles.dataRow}>
                                <Col style={styles.dataRow}>
                                    <Text style={styles.dataText}>Select Data</Text>
                                </Col>
                            </Row>
                        }
                    </ScrollView>
                </Grid>
            </View>
            <View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={AssignItems}>
                        <Text style={styles.buttonText}>Assign</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={deAssignItems}>
                        <Text style={styles.buttonText}>DeAssign</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    disabledDropdown: {
        opacity: 0.5, // Adjust the opacity to visually indicate disabled state,
        margin: 5,
        marginRight: 10,
    },
    wrapDropdown: {
        // flex:0.5,
        flexDirection: "row",
        margin: 5
    },
    container: {
        padding: 8,
        marginTop: 20,

    },
    headerRow: {
        height: 50,
        borderWidth: 1,
        borderColor: 'gray',
   
    },
    headerCol: {
        justifyContent:"center",
        alignItems:"center",
        marginRight:20  
    },
    headerText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: "#000000",
        textAlign: "center",
    },
    dataRow: {
        height: 50,

    },
    dataCol: {
        padding: 8,
        borderWidth: 1,
        borderColor: 'gray',
    },
    dataText: {
        fontSize: 12,
        color: "#000000",
        flex: 1,
        marginLeft: 10,
        marginTop: 10,
        textAlign: "left",
        paddingTop: 5,
    },
    wrapData: {
        flexDirection: "row",
    },
    button: {
        backgroundColor: '#2196F3',
        // paddingVertical: 10,
        // paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: "center",
        width: 80,
        height: 30,
        marginBottom: 5
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',

    },
});

export default Assign;