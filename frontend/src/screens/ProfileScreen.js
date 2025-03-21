import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import styles, { sizes, colors } from "../styles/style";
import Header from "../components/Header";
import ProfileScreenStyle from "../styles/components/ProfileScreenStyle";
import IconIonIcons from "react-native-vector-icons/Ionicons";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import IconFontisto from "react-native-vector-icons/Fontisto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";


export default function ProfileScreen({ }) {
  const [username, setUsername] = useState("");
  const [weight, setWeight] = useState(0);
  const [tempWeight, setTempWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [tempHeight, setTempHeight] = useState(0);
  const [fat, setFat] = useState(0);
  const [tempFat, setTempFat] = useState(0);
  const [isModalVisibleWeight, setModalVisibleWeight] = useState(false);
  const [isModalVisibleHeight, setModalVisibleHeight] = useState(false);
  const [isModalVisibleFat, setModalVisibleFat] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const userGoogleToken = await AsyncStorage.getItem("userGoogleToken");
    const userXToken = await AsyncStorage.getItem("userXToken");

    if (userToken) {
      const decodedUserToken = jwtDecode(userToken);
      fetchUserProfile(decodedUserToken);
    } else if (userGoogleToken) {
      const decodedUserGoogleToken = jwtDecode(userGoogleToken);
      fetchUserProfile(decodedUserGoogleToken);
    } else if (userXToken) {
      const decodedUserXToken = jwtDecode(userXToken);
      fetchUserProfile(decodedUserXToken);
    }
  };

  const fetchUserProfile = async (allUserToken) => {
    const userId = allUserToken.userId;
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_ENDPOINT_API}/api/user/${userId}/profile`
      );
      const { username, weight, height, fat, picture } = response.data;
      setUsername(username || response.data.givenName || response.data.name);
      setWeight(weight);
      setHeight(height);
      setFat(fat);
      setSelectedImage(picture);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const updateWeightForUser = async (allUserToken) => {
    const decodedAllUserToken = jwtDecode(allUserToken);
    const userId = decodedAllUserToken.userId;
    try {
      await axios.put(
        `${process.env.EXPO_PUBLIC_ENDPOINT_API}/api/user/${userId}/updateWeight`,
        {
          weight: parseFloat(tempWeight),
        }
      );
      setWeight(tempWeight);
      setModalVisibleWeight(false);
    } catch (error) {
      console.error("Error updating weight:", error);
      Alert.alert("Error", "An error occurred while updating weight.", error);
    }
  };

  const updateHeightForUser = async (allUserToken) => {
    const decodedAllUserToken = jwtDecode(allUserToken);
    const userId = decodedAllUserToken.userId;

    try {
      await axios.put(
        `${process.env.EXPO_PUBLIC_ENDPOINT_API}/api/user/${userId}/updateHeight`,
        {
          height: parseFloat(tempHeight),
        }
      );
      setHeight(tempHeight);
      setModalVisibleHeight(false);
    } catch (error) {
      console.error("Error updating height:", error);
      Alert.alert("Error", "An error occurred while updating height.", error);
    }
  };

  const updateFatForUser = async (allUserToken) => {
    const decodedAllUserToken = jwtDecode(allUserToken);
    const userId = decodedAllUserToken.userId;

    try {
      await axios.put(
        `${process.env.EXPO_PUBLIC_ENDPOINT_API}/api/user/${userId}/updateFat`,
        {
          fat: parseFloat(tempFat),
        }
      );
      setFat(tempFat);
      setModalVisibleFat(false);
    } catch (error) {
      console.error("Error updating fat:", error);
      Alert.alert("Error", "An error occurred while updating fat.", error);
    }
  };

  const handleWeightUpdate = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const userGoogleToken = await AsyncStorage.getItem("userGoogleToken");
    const userXToken = await AsyncStorage.getItem("userXToken");

    if (userToken) {
      await updateWeightForUser(userToken);
    } else if (userGoogleToken) {
      await updateWeightForUser(userGoogleToken);
    } else if (userXToken) {
      await updateWeightForUser(userXToken);
    }
  };

  const handleHeightUpdate = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const userGoogleToken = await AsyncStorage.getItem("userGoogleToken");
    const userXToken = await AsyncStorage.getItem("userXToken");

    if (userToken) {
      await updateHeightForUser(userToken);
    } else if (userGoogleToken) {
      await updateHeightForUser(userGoogleToken);
    } else if (userXToken) {
      await updateHeightForUser(userXToken);
    }
  };

  const handleFatUpdate = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const userGoogleToken = await AsyncStorage.getItem("userGoogleToken");
    const userXToken = await AsyncStorage.getItem("userXToken");

    if (userToken) {
      await updateFatForUser(userToken);
    } else if (userGoogleToken) {
      await updateFatForUser(userGoogleToken);
    } else if (userXToken) {
      await updateFatForUser(userXToken);
    }
  };

  const updatePictureForUser = async (allUserToken, uri) => {
    const decodedAllUserToken = jwtDecode(allUserToken);
    const userId = decodedAllUserToken.userId;

    try {
      const response = await axios.put(
        `${process.env.EXPO_PUBLIC_ENDPOINT_API}/api/user/${userId}/updatePicture`,
        {
          picture: uri,
        }
      );
      console.log("Image upload successful:", response);
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const handleImagePicker = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const userGoogleToken = await AsyncStorage.getItem("userGoogleToken");
    const userXToken = await AsyncStorage.getItem("userXToken");

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setSelectedImage(uri);

      if (userToken) {
        await updatePictureForUser(userToken, uri);
      } else if (userGoogleToken) {
        await updatePictureForUser(userGoogleToken, uri);
      } else if (userXToken) {
        await updatePictureForUser(userXToken, uri);
      }
    }
  };


  const haddleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userGoogleToken");
      await AsyncStorage.removeItem("userXToken");

      navigation.navigate("Main");
    } catch (error) {
      console.log("Log out failed");
    }


  };

  const handleEditWeight = () => {
    setModalVisibleWeight(true);
  };

  const handleEditHeight = () => {
    setModalVisibleHeight(true);
  };

  const handleEditFat = () => {
    setModalVisibleFat(true);
  };

  const calBmi = () => {
    if (height > 0) {
      const calculatedBmi = weight / Math.pow(height / 100, 2);

      return calculatedBmi.toFixed(2);
    } else {
      return "0.00";
    }
  };
  const getBMIColor = (value) => {
    if (value < 18) return "lightgreen";
    if (value >= 18 && value < 23) return "green";
    if (value >= 23 && value < 25) return "pink";
    if (value >= 25 && value < 30) return "orange";
    if (value >= 30) return "red";
  };

  const getPointerPosition = (value) => {
    if (value < 0) return 0;
    if (value > 40) return 100;

    if (value < 18) {
      return (value / 18) * 20; // 0-20%
    } else if (value < 23) {
      return 20 + ((value - 18) / (23 - 18)) * 20; // 20-40%
    } else if (value < 25) {
      return 40 + ((value - 23) / (25 - 23)) * 20; // 40-60%
    } else if (value < 30) {
      return 60 + ((value - 25) / (30 - 25)) * 20; // 60-80%
    } else {
      return 80 + ((value - 30) / (40 - 30)) * 20; // 80-100%
    }
  };

  const calculatedBmi = parseFloat(calBmi());
  const pointerPosition = getPointerPosition(calculatedBmi);
  const bmiColor = getBMIColor(calculatedBmi);

  return (
    <View style={[ProfileScreenStyle.container]}>
      <Header />
      <ScrollView style={[styles.container]}>
        <View style={{ gap: 20 }}>
          <View style={[ProfileScreenStyle.profile_box]}>
            <TouchableOpacity style={[ProfileScreenStyle.profile_button_edit]} onPress={handleImagePicker}>
              <IconEntypo name={"edit"} size={10} color={colors.clr_gray} />
            </TouchableOpacity>

            <View style={[ProfileScreenStyle.profile]}>
              <Image
                source={{ uri: selectedImage }}
                style={{ width: 200, height: 100 }}
              />
            </View>
            <View style={[ProfileScreenStyle.profile_container]}>
              <Text style={[ProfileScreenStyle.username_text]}>
                {username}Username
              </Text>
            </View>
          </View>
          <Text style={{ color: "white" }}>Health Metrics</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            <View style={[ProfileScreenStyle.box]}>
              <View style={[ProfileScreenStyle.inside_box]}>
                <View style={[ProfileScreenStyle.header_box]}>
                  <Text style={[ProfileScreenStyle.header_text]}>Weight</Text>
                  <TouchableOpacity
                    style={[ProfileScreenStyle.button_edit]}
                    onPress={handleEditWeight}
                  >
                    <Text style={[ProfileScreenStyle.button_text]}>Edit</Text>
                    <IconEntypo
                      name={"edit"}
                      size={10}
                      color={colors.clr_gray}
                    />
                  </TouchableOpacity>
                </View>
                <View style={[ProfileScreenStyle.body_box]}>
                  <IconIonIcons
                    name={"scale"}
                    size={50}
                    color={colors.clr_orange}
                  />
                  <View
                    style={{ flexDirection: "row", alignItems: "flex-end" }}
                  >
                    <Text style={[ProfileScreenStyle.body_text_number]}>
                      {weight}
                    </Text>
                    <Text style={[ProfileScreenStyle.body_text_unit]}>KG</Text>
                  </View>
                </View>
              </View>
            </View>
            <Modal
              visible={isModalVisibleWeight}
              animationType="slide"
              transparent={true}
            >
              <View style={[ProfileScreenStyle.box_modal]}>
                <View style={[ProfileScreenStyle.inside_box_modal]}>
                  <Text style={[ProfileScreenStyle.modal_header_text_]}>
                    Edit Weight.
                  </Text>
                  <TextInput
                    style={[ProfileScreenStyle.modal_text_input]}
                    keyboardType="numeric"
                    onChangeText={(text) => setTempWeight(text)}
                  />
                  <View style={[ProfileScreenStyle.modal_input_box]} />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setModalVisibleWeight(false)}
                      style={[
                        ProfileScreenStyle.modal_button,
                        { backgroundColor: "lightgray" },
                      ]}
                    >
                      <Text>close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleWeightUpdate}
                      style={[
                        ProfileScreenStyle.modal_button,
                        { backgroundColor: "green" },
                      ]}
                    >
                      <Text style={{ color: "white" }}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            <View style={[ProfileScreenStyle.box]}>
              <View style={[ProfileScreenStyle.inside_box]}>
                <View style={[ProfileScreenStyle.header_box]}>
                  <Text style={[ProfileScreenStyle.header_text]}>Height</Text>
                  <TouchableOpacity
                    style={[ProfileScreenStyle.button_edit]}
                    onPress={handleEditHeight}
                  >
                    <Text style={[ProfileScreenStyle.button_text]}>Edit</Text>
                    <IconEntypo
                      name={"edit"}
                      size={10}
                      color={colors.clr_gray}
                    />
                  </TouchableOpacity>
                </View>
                <View style={[ProfileScreenStyle.body_box]}>
                  <IconMaterialCommunityIcons
                    name={"human-male-height-variant"}
                    size={50}
                    color={colors.clr_slate}
                  />
                  <View
                    style={{ flexDirection: "row", alignItems: "flex-end" }}
                  >
                    <Text style={[ProfileScreenStyle.body_text_number]}>
                      {height}
                    </Text>
                    <Text style={[ProfileScreenStyle.body_text_unit]}>CM</Text>
                  </View>
                </View>
              </View>
            </View>
            <Modal
              visible={isModalVisibleHeight}
              animationType="slide"
              transparent={true}
            >
              <View style={[ProfileScreenStyle.box_modal]}>
                <View style={[ProfileScreenStyle.inside_box_modal]}>
                  <Text style={[ProfileScreenStyle.modal_header_text_]}>
                    Edit Height.
                  </Text>
                  <TextInput
                    style={[ProfileScreenStyle.modal_text_input]}
                    keyboardType="numeric"
                    onChangeText={(text) => setTempHeight(text)}
                  />
                  <View style={[ProfileScreenStyle.modal_input_box]} />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setModalVisibleHeight(false)}
                      style={[
                        ProfileScreenStyle.modal_button,
                        { backgroundColor: "lightgray" },
                      ]}
                    >
                      <Text>close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleHeightUpdate}
                      style={[
                        ProfileScreenStyle.modal_button,
                        { backgroundColor: "green" },
                      ]}
                    >
                      <Text style={{ color: "white" }}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            <View style={[ProfileScreenStyle.box]}>
              <View style={[ProfileScreenStyle.inside_box]}>
                <View style={[ProfileScreenStyle.header_box]}>
                  <Text style={[ProfileScreenStyle.header_text]}>
                    Body fat %
                  </Text>
                  <TouchableOpacity
                    style={[ProfileScreenStyle.button_edit]}
                    onPress={handleEditFat}
                  >
                    <Text style={[ProfileScreenStyle.button_text]}>Edit</Text>
                    <IconEntypo
                      name={"edit"}
                      size={10}
                      color={colors.clr_gray}
                    />
                  </TouchableOpacity>
                </View>
                <View style={[ProfileScreenStyle.body_box]}>
                  <IconMaterialCommunityIcons
                    name={"human-child"}
                    size={50}
                    color={"darkyellow"}
                  />
                  <View
                    style={{ flexDirection: "row", alignItems: "flex-end" }}
                  >
                    <Text style={[ProfileScreenStyle.body_text_number]}>
                      {fat}
                    </Text>
                    <Text style={[ProfileScreenStyle.body_text_unit]}>%</Text>
                  </View>
                </View>
              </View>
            </View>
            <Modal
              visible={isModalVisibleFat}
              animationType="slide"
              transparent={true}
            >
              <View style={[ProfileScreenStyle.box_modal]}>
                <View style={[ProfileScreenStyle.inside_box_modal]}>
                  <Text style={[ProfileScreenStyle.modal_header_text_]}>
                    Edit Body Fat %.
                  </Text>
                  <TextInput
                    style={[ProfileScreenStyle.modal_text_input]}
                    keyboardType="numeric"
                    onChangeText={(text) => setTempFat(text)}
                  />
                  <View style={[ProfileScreenStyle.modal_input_box]} />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setModalVisibleFat(false)}
                      style={[
                        ProfileScreenStyle.modal_button,
                        { backgroundColor: "lightgray" },
                      ]}
                    >
                      <Text>close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleFatUpdate}
                      style={[
                        ProfileScreenStyle.modal_button,
                        { backgroundColor: "green" },
                      ]}
                    >
                      <Text style={{ color: "white" }}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            <View
              style={[ProfileScreenStyle.box, { height: 130, width: "48%" }]}
            >
              <View style={[ProfileScreenStyle.inside_box]}>
                <View>
                  <View>
                    <View style={[ProfileScreenStyle.header_box_bmi]}>
                      <Text style={[ProfileScreenStyle.bmi_text]}>BMI</Text>
                      <View style={ProfileScreenStyle.textContainer}>
                        {calculatedBmi < 18 && (
                          <IconMaterialCommunityIcons
                            name={"emoticon-sad"}
                            size={30}
                            color={bmiColor}
                          />
                        )}
                        {calculatedBmi >= 18 && calculatedBmi < 23 && (
                          <IconMaterialCommunityIcons
                            name={"emoticon-happy"}
                            size={30}
                            color={bmiColor}
                          />
                        )}
                        {calculatedBmi >= 23 && calculatedBmi < 25 && (
                          <IconMaterialCommunityIcons
                            name={"emoticon-confused"}
                            size={30}
                            color={bmiColor}
                          />
                        )}
                        {calculatedBmi >= 25 && calculatedBmi < 30 && (
                          <IconMaterialCommunityIcons
                            name={"emoticon-angry"}
                            size={30}
                            color={bmiColor}
                          />
                        )}
                        {calculatedBmi >= 30 && (
                          <IconMaterialCommunityIcons
                            name={"emoticon-dead"}
                            size={30}
                            color={bmiColor}
                          />
                        )}
                      </View>
                    </View>
                    <>
                      <Text style={[ProfileScreenStyle.bmi_text]}>
                        {calBmi()}
                      </Text>
                    </>
                  </View>
                </View>

                <View style={ProfileScreenStyle.bmiRange}>
                  <View style={ProfileScreenStyle.rangeLabels}>
                    <Text style={ProfileScreenStyle.rangeLabel}>0</Text>
                    <Text style={ProfileScreenStyle.rangeLabel}>18</Text>
                    <Text style={ProfileScreenStyle.rangeLabel}>23</Text>
                    <Text style={ProfileScreenStyle.rangeLabel}>25</Text>
                    <Text style={ProfileScreenStyle.rangeLabel}>30</Text>
                    <Text style={ProfileScreenStyle.rangeLabel}>40</Text>
                  </View>
                  <View style={ProfileScreenStyle.barColors}>
                    <View
                      style={[
                        ProfileScreenStyle.colorBlock,
                        { backgroundColor: "lightgreen" },
                      ]}
                    />

                    <View
                      style={[
                        ProfileScreenStyle.colorBlock,
                        { backgroundColor: "green" },
                      ]}
                    />
                    <View
                      style={[
                        ProfileScreenStyle.colorBlock,
                        { backgroundColor: "pink" },
                      ]}
                    />
                    <View
                      style={[
                        ProfileScreenStyle.colorBlock,
                        { backgroundColor: "orange" },
                      ]}
                    />
                    <View
                      style={[
                        ProfileScreenStyle.colorBlock,
                        { backgroundColor: "red" },
                      ]}
                    />
                    <View
                      style={[
                        ProfileScreenStyle.pointer,
                        { left: `${pointerPosition}%` },
                      ]}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.button, styles.buttonText]}
            onPress={haddleLogout}
          >
            <Text style={[styles.buttonText]}>Log out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
