import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";

import { sizes, colors } from "../../../styles/style";

export default function SupplementDetailScreen({ navigation, route }) {
  const { supplement } = route.params;

  return (
    <View style={[styles.container]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Image
            source={{
              uri:
                supplement.image ||
                "https://medlineplus.gov/images/AnabolicSteroids_share.jpg",
            }}
            style={styles.image}
          />
          <View style={styles.section}>
            <Text style={styles.title}>{supplement.name}</Text>
            <Text style={styles.description}>{supplement.description}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.clr_background,
  },
  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
    opacity: 0.7,
  },
  title: {
    color: colors.clr_white,
    fontSize: sizes.size_2xl,
    fontWeight: "bold",
    marginVertical: 20,
  },
  description: {
    color: colors.clr_white,
    fontSize: sizes.size_base,
  },
  section: {
    paddingHorizontal: 14,
  },
});
