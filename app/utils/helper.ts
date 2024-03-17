import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiConfig from "../config/api-config";
import { WToast } from "react-native-smart-tip";

export const getData = async (key: any, json: boolean) => {
  const value: any = await AsyncStorage.getItem(key);
  return json ? JSON.parse(value) : value;
};

export const storeData = async (key: any, value: any) => {
  if (value && typeof value !== "string") {
    value = JSON.stringify(value);
  }
  await AsyncStorage.setItem(key, value);
};

export const removeData = async (key: any) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }
  return;
};

export const showToast = (message: any) => {
  WToast.show({
    data: message,
    textColor: "#ffffff",
    backgroundColor: "#d34200",
    duration: 1500,
    position: WToast.position.BOTTOM,
  });
};

export const isValidEmail = (val: any) => {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    val
  );
};

export const getImageUrl = (imageName: any) => {
  let imageUrl = ApiConfig.IMAGE_URL + imageName;
  return { uri: imageUrl };
};

export const dayDifferentCalculate = (createDate: any) => {
  let today: any = new Date();
  let postDate: any = new Date(createDate);
  let difference = Math.abs(today - postDate) / 1000;
  let days = Math.floor(difference / 86400);
  let hours = Math.floor(difference / 3600) % 24;
  var minutes = Math.floor(difference / 60) % 60;
  var seconds = Math.floor(difference % 60);

  if (seconds != 0 && minutes == 0 && hours == 0 && days == 0) {
    if (seconds > 1) {
      return seconds + " secs ago ";
    } else {
      return seconds + " sec ago ";
    }
  } else if (minutes != 0 && hours == 0 && days == 0) {
    if (minutes > 1) {
      return minutes + " mins ago ";
    } else {
      return minutes + " min ago ";
    }
  } else if (hours != 0 && days == 0) {
    if (hours > 1) {
      return hours + " hours ago ";
    } else {
      return hours + " hour ago ";
    }
  } else if (days != 0) {
    if (days > 1) {
      return days + " days ago ";
    } else {
      return days + " day ago ";
    }
  }
};
