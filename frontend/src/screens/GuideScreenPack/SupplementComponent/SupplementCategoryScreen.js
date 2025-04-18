import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { sizes, colors } from "../../../styles/style";

export default function SupplementCategoryScreen({ navigation, route }) {
  const { category } = route.params;
  const [searchQuery, setSearchQuery] = useState("");

  const [supplementList, setSupplementList] = useState([]);
  const [storeSupplement, setStoreSupplement] = useState([]);

  // Fetch steroid data from API
  useEffect(() => {
    fetchSupplement();
  }, []);

  const fetchSupplement = async () => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_ENDPOINT_API}/api/user/getSupplementDetails`
      );

      const filtered = response.data.filter((supplement) =>
        supplement.category.toLowerCase().includes(category.toLowerCase())
      );
      setSupplementList(filtered);
      setStoreSupplement(filtered);
    } catch (error) {
      console.error("Error fetching supplement:", error);
    }
  };

  useEffect(() => {
    filterCategory();
  }, [searchQuery]);

  const filterCategory = () => {
    // Filter by search query
    if (searchQuery) {
      const filtered = supplementList.filter((supplement) =>
        supplement.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSupplementList(filtered);
    } else {
      setSupplementList(storeSupplement);
    }
  };

  return (
    <View style={[styles.container]}>
      <View style={[styles.content]}>
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Steroids"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Ionicons
              name="search"
              size={20}
              color="gray"
              style={styles.searchIcon}
            />
          </View>
        </View>

        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {supplementList.map((supplement) => (
            <TouchableOpacity
              key={supplement._id}
              style={styles.card}
              onPress={() =>
                navigation.navigate("Supplement detail", { supplement })
              }
            >
              <Image
                source={{
                  uri:
                    supplement.image ||
                    "https://medlineplus.gov/images/AnabolicSteroids_share.jpg",
                }}
                style={styles.cardImage}
              />
              <View style={styles.cardOverlay}>
                <Text style={styles.cardTitle}>{supplement.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  card: {
    height: 130,
    borderRadius: 8,
    marginBottom: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    opacity: 0.7,
  },
  cardOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    paddingLeft: 15,
  },
  cardTitle: {
    color: colors.clr_white,
    fontSize: sizes.size_lg,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: colors.clr_background,
  },

  content: {
    flex: 1,
    backgroundColor: colors.clr_background,
    paddingHorizontal: 20,
    paddingTop: 5,
  },

  searchSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.clr_white,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.clr_white,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  searchIcon: {
    marginLeft: 5,
  },
});
