import React, { useEffect, useMemo, useState } from 'react';
import MultiSelect from 'react-native-multiple-select';
import { useSelector } from '../../redux';
import TemplateApi from '../../services/template';
import { View, TextInput, Modal, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const MultiSelectExample = ({
  id,
  Change,
  assetTypeLabel,
  Apitype,
  Apipath,
  extraLabel,
  options_type,
  asset_label,
}: {
  id: any;
  Change: any;
  assetTypeLabel: string;
  Apitype: any;
  Apipath: any;
  extraLabel: any;
  options_type: any;
  asset_label: any;
}) => {
  const user = useSelector(state => state.userReducer);
  const templateApi = useMemo(() => new TemplateApi(), [user.loggedIn]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [selectedItems2, setSelectedItems2] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  const configureData = (asset_type: any, assetTypeLabel: string) => {
    templateApi.assesttype(asset_type).then(res => {
      const dataWithoutAttributes = res.data.results.map((asset: any) => ({
        ipss_asset_id: asset.ipss_asset_id.toString(),
        name: asset.asset_attributes[0][assetTypeLabel] || '',
      }));
      setSelectedItems(dataWithoutAttributes);
    });
  };

  const dynamicApi = async (path: any) => {
    try {
      const res = await templateApi.dynamicApi(path);
      let finalData = res.data.results ? res.data.results : res.data.data ? res.data.result : [];
      finalData = finalData.filter((item: any) => item[assetTypeLabel] !== null);
      setSelectedItems(finalData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    setLoading(true); // Set loading to true before fetching data

    const fetchData = async () => {
      try {
        let data = [];
        if (Apitype === "Asset") {
          const response = await templateApi.assesttype(id);
          data = response.data.results.map((asset: any) => ({
            ipss_asset_id: asset.ipss_asset_id.toString(),
            name: asset.asset_attributes[0][assetTypeLabel] || '',
          }));
        } else if (Apitype === "Others") {
          const response = await templateApi.dynamicApi(Apipath);
          let finalData = response.data.results ? response.data.results : response.data.data ? response.data.result : [];
          finalData = finalData.filter((item: any) => item[assetTypeLabel] !== null);
          data = finalData;
        }
        setSelectedItems(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false whether data fetch succeeded or failed
      }
    };
    fetchData();
  }, [id, assetTypeLabel, Apitype, Apipath, templateApi]);

  useEffect(() => {
    if (selectedItems2.length !== 0 && Change) {
      Change(selectedItems2);
    }
  }, [selectedItems2]);

  const onValueChange = (itemValue: any) => {
    setSelectedItems2([selectedItems.find(item => item[assetTypeLabel] === itemValue)]);
    setSelectedValue(itemValue);
    setModalVisible(false);
  };
  

  const filteredItems = selectedItems.filter(item => {
    const assetLabel = item[assetTypeLabel];
    return assetLabel && assetLabel.toLowerCase().includes(searchText.toLowerCase());
  });
  const onSelectedItemsChange = (selectedItemIds: any[]) => {
    const filteredItems = selectedItems.filter(item =>
      selectedItemIds.includes(item.ipss_asset_id),
    );
    setSelectedItems2(filteredItems);
  };
  const onSelectedItemsChange1 = (selectedItemIds: any[]) => {
    const filteredItems = selectedItems.filter(item =>
      selectedItemIds.includes(item[assetTypeLabel]),
    );
    setSelectedItems2(filteredItems);
  };

 
  const onValueChange1 = (itemName: string) => {
    const selectedItem = selectedItems.find(item => item.name === itemName);  
    if (selectedItem) {
      setSelectedItems2([selectedItem]);
      setSelectedValue(itemName);
      setModalVisible(false);
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={{width: 350, marginStart: 20}}>
        {Apitype === 'Asset' && (
          <View>
          {options_type === 'Multiple' && (
  <MultiSelect
    hideTags
    items={selectedItems}
    uniqueKey="ipss_asset_id"
    onSelectedItemsChange={onSelectedItemsChange}
    selectedItems={selectedItems2.map((item) => item.ipss_asset_id)}
    selectText= {asset_label}
    searchInputPlaceholderText="Search Items..."
    altFontFamily="ProximaNova-Light"
    tagRemoveIconColor="black"
    tagBorderColor="black"
    tagTextColor="black"
    selectedItemTextColor="black"
    selectedItemIconColor="black"
    itemTextColor="#000"
    displayKey="name"
    searchInputStyle={{ color: 'black' }}
    submitButtonColor="black"
    submitButtonText="Submit"
  />
)}
  {options_type === 'Single' && (
     <View>
     <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
        style={styles.button}
      >
        <View style={{flexDirection:'row'}}>
        <Text style={styles.buttonText}>
          {selectedItems2.length > 0
            ? `${asset_label}: ${selectedItems2.map(item => item?.name).join(', ')}`
            : 'Select a data'}
        </Text>
       
                                                  </View>
      </TouchableOpacity>
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity onPress={() => setModalVisible(false)}>
          <Text style={styles.closeButton}>Close</Text>
        </TouchableOpacity>
        <TextInput
          placeholder="Search..."
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          style={styles.searchInput}
        />
        <FlatList
          data={selectedItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onValueChange1(item.name)}>
              <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  </View>)}
     </View>
        ) }
         {Apitype === 'Others' && ( 
          <View>
      {/* {!modalVisible && ( */}
      <TouchableOpacity 
  onPress={() => {
    setModalVisible(true);
    setSelectedValue(selectedItems2.length > 0 ? selectedItems2[0][assetTypeLabel] : '');
  }}
  style={styles.button}
>
  <Text style={styles.buttonText}>Select the data : {selectedValue}</Text>
</TouchableOpacity>

        <Modal
  animationType="slide"
  transparent={false}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalContainer}>
  <TouchableOpacity onPress={() => setModalVisible(false)}>
      <Text style={styles.closeButton}>Close</Text>
    </TouchableOpacity>
    <TextInput
      placeholder="Search..."
      value={searchText}
      onChangeText={(text) => setSearchText(text)}
      style={styles.searchInput}
    />
   {loading ? (
      <ActivityIndicator size="large" color="black" />
    ) : (
      <FlatList
        data={filteredItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onValueChange(item[assetTypeLabel])}>
            <Text style={styles.itemText}>{item[assetTypeLabel]}</Text>
          </TouchableOpacity>
        )}
      />
    )}
  </View>
</Modal>


    </View>
        )}
      </View>
    </View>

  );
};
const styles = {
  modalContainer: {
    marginTop: 22,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    flex: 1,
  },
  searchInput: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  itemText: {
    fontSize: 16,
    paddingVertical: 8,
    color:'black'
  },
  closeButton: {
    fontSize: 18,
    color: 'black',
    paddingVertical: 8,
  marginStart : 280
  },
  button: {
    backgroundColor: 'white', // Change the background color to your preference
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1, // Add a border width
    borderColor: 'black', // Specify the border color
  },
  buttonText: {
    color: 'black', // Change the text color to your preference
    fontSize: 16,

  },
  button1: {
    backgroundColor: 'white', // Change the background color to your preference
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  }, 
};


export default MultiSelectExample;
