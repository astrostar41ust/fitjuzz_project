import * as React from "react";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { colors, sizes } from "../../../styles/style";

export default function EncyclopediaDetailScreen({ navigation, route }) {
  const { encyclopedia } = route.params;

  return (
    <View style={[styles.container]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Image
            source={{
              uri:
              encyclopedia.image ||
                "https://medlineplus.gov/images/AnabolicSteroids_share.jpg",
            }}
            style={styles.image}
          />
          <View style={styles.section}>
            <Text style={styles.title}>{encyclopedia.name}</Text>
            <Text style={styles.description}>{encyclopedia.description}</Text>
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
