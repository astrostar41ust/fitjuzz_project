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

export default function SupplementScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState([
    {
      id: 1,
      title: "Protein",
      image:
        "https://www.healthifyme.com/blog/wp-content/uploads/2024/02/Protein-powder.jpg",
      description:
        "Essential for muscle repair and growth, commonly taken post-workout.",
      category: "protein",
    },
    {
      id: 2,
      title: "Creatine",
      image:
        "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/opn/opn02385/l/37.jpg",
      description:
        "Improves strength, increases lean muscle mass, and helps muscles recover faster.",
      category: "creatine",
    },
    
  ]);

  const [storeCategories, setStoreCategories] = useState(selectedCategory);

  useEffect(() => {
    filterCategory();
  }, [searchQuery]);

  const filterCategory = () => {
    // Filter by search query
    if (searchQuery) {
      const filtered = selectedCategory.filter((steroid) =>
        steroid.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSelectedCategory(filtered);
    } else {
      setSelectedCategory(storeCategories);
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
          {selectedCategory.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={GuideScreenStyle.categoryCard}
              onPress={() =>
                navigation.navigate("Supplement category", {
                  category: category.category,
                })
              }
            >
              <Image
                source={{ uri: category.image }}
                style={GuideScreenStyle.categoryImage}
              />
              <View style={GuideScreenStyle.categoryOverlay}>
                <Text style={GuideScreenStyle.categoryTitle}>
                  {category.title}
                </Text>
                <Text style={GuideScreenStyle.categoryDescription}>
                  {category.description}
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
