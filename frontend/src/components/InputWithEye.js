import * as React from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import styles from "../styles/style";
import { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";


export default function InputWithEye({ value, onChangeText }) {

  const [visible, setVisible] = useState(true);
  const [activeIcon, setActiveIcon] = useState(true);

  const handleHiddenPassword = () => {
    setVisible(!visible);
    setActiveIcon(!activeIcon);
  };

  const iconName =
    activeIcon === true ? 'eye' : 'eye-off'

  return (

    <View style={styles.input__subsection}>
      <TextInput
        secureTextEntry={visible}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity onPress={handleHiddenPassword}>
        <Icon
          name={iconName}
          size={20}
          color="gray"
          style={{ marginRight: 10}}
        />
      </TouchableOpacity>
    </View>

  );
}
