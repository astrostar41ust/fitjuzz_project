import { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../styles/style";

const CustomCheckbox = ({ value, setValue, style }) => {
  return (
    <TouchableOpacity
      style={[
        CustomCheckboxStyle.checkbox, 
        value ? 
          { backgroundColor: colors.clr_brightblue, borderColor: colors.clr_brightblue } : 
          { backgroundColor: 'white', borderColor: colors.clr_gray },
        style
      ]}
      onPress={() => setValue(!value)}
    />
  );
};

const CustomCheckboxStyle = StyleSheet.create({
  checkbox: {
    borderRadius: 8,
    borderWidth: 1.5,
    width: 18,
    height: 18,
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.clr_gray,
  }
});

export default CustomCheckbox;