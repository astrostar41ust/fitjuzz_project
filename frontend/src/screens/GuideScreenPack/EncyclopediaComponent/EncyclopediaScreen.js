import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { colors, sizes } from "../../../styles/style";
import GuideScreenStyle from "../../../styles/components/GuideScreenStyle";

export default function Encyclopedia({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");

  const [encyclopediaList, setEncyclopediaList] = useState([]);
  const [storeEncyclopedia, setStoreEncyclopedia] = useState([]);

  useEffect(() => {
    filterCategory();
  }, [searchQuery]);

  const filterCategory = () => {
    // Filter by search query
    if (searchQuery) {
      const filtered = encyclopediaList.filter((encyclopedia) =>
        encyclopedia.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setEncyclopediaList(filtered);
    } else {
      setEncyclopediaList(storeEncyclopedia);
    }
  };

  // Fetch steroid data from API
  useEffect(() => {
    fetchEncyclopedia();
  }, []);

  const fetchEncyclopedia = async () => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_ENDPOINT_API}/api/user/getEncyclopediaDetails`
      );

      setEncyclopediaList(response.data);
      setStoreEncyclopedia(response.data);
    } catch (error) {
      console.error("Error fetching steroids:", error);
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

        <ScrollView showsVerticalScrollIndicator={false}>
          {encyclopediaList.map((encyclopedia) => (
            <TouchableOpacity
              key={encyclopedia._id}
              style={GuideScreenStyle.categoryCard}
              onPress={() =>
                navigation.navigate("Encyclopedia detail", {
                  encyclopedia,
                })
              }
            >
              <Image
                source={{ uri: encyclopedia.image || 'https://medlineplus.gov/images/AnabolicSteroids_share.jpg'}}
                style={GuideScreenStyle.categoryImage}
              />
              <View style={GuideScreenStyle.categoryOverlay}>
                <Text style={GuideScreenStyle.categoryTitle}>
                  {encyclopedia.name}
                </Text>
               
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
