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

export default function SteroidCategoryScreen({ navigation, route }) {
  const { category } = route.params;
  const [searchQuery, setSearchQuery] = useState("");

  const [steroidList, setSteroidList] = useState([]);
  const [storeSteroid, setStoreSteroid] = useState([]);

  // Fetch steroid data from API
  useEffect(() => {
    fetchSteroid();
  }, []);

  const fetchSteroid = async () => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_ENDPOINT_API}/api/user/getSteroidDetails`
      );

 
      const filtered = response.data.filter((steroid) =>
        steroid.category.toLowerCase().includes(category.toLowerCase())
      );
     
      setSteroidList(filtered);
      setStoreSteroid(filtered);
    } catch (error) {
      console.error("Error fetching steroids:", error);
    }
  };

  useEffect(() => {
    filterCategory();
  }, [searchQuery]);

  const filterCategory = () => {
    // Filter by search query
    if (searchQuery) {
      const filtered = steroidList.filter((steroid) =>
        steroid.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSteroidList(filtered);
    } else {
      setSteroidList(storeSteroid);
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
          {steroidList.map((steroid) => (
            <TouchableOpacity
              key={steroid._id}
              style={styles.card}
              onPress={() => navigation.navigate("Steroid detail", { steroid })}
            >
              <Image
                source={{
                  uri:
                    steroid.image ||
                    "https://medlineplus.gov/images/AnabolicSteroids_share.jpg",
                }}
                style={styles.cardImage}
              />
              <View style={styles.cardOverlay}>
                <Text style={styles.cardTitle}>{steroid.name}</Text>
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
