import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { colors, sizes } from "../styles/style";

export default function ExerciseCard(props) {
  return (
    <View style={styles.exercise_box}>
      <Image
        source={{ uri: props.picture }}
        style={styles.imageStyle}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text_name} numberOfLines={2} ellipsizeMode="tail">
          {props.name}
        </Text>
        <Text style={styles.text_category}>{props.category}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  exercise_box: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
  },
  imageStyle: {
    width: 60,
    height: 45,
    borderRadius: 4,
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
    paddingRight: 5,
    justifyContent: "center",
  },
  text_name: {
    fontSize: sizes.size_sm,
    fontWeight: "bold",
    marginBottom: 2,
    flexWrap: "wrap",
    lineHeight: 18,
  },
  text_category: {
    fontSize: sizes.size_xs,
    color: "gray",
  },
});
