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

export default function SteroidsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState([
    {
      id: 1,
      title: "Anabolic",
      image: "https://medlineplus.gov/images/AnabolicSteroids_share.jpg",
      description: "Steroids that promote muscle growth.",
      category: "anabolic",
    },
    {
      id: 2,
      title: "Oral",
      image:
        "https://5.imimg.com/data5/SELLER/Default/2023/9/348752444/CZ/DV/NU/199014953/oral-steroids.jpg",
      description: "Steroids taken by mouth.",
      category: "oral",
    },
    {
      id: 3,
      title: "Injectable",
      image:
        "https://www.healio.com/~/media/slack-news/stock-images/endocrinology/s/steroids.jpg?w=800",
      description: "Steroids administered via injection.",
      category: "injectable",
    },
  ]);

  const [storeCategories, setStoreCategories] = useState(selectedCategory);

  useEffect(() => {
    filterSteroids();
  }, [searchQuery]);

  const filterSteroids = () => {
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
              onPress={() => navigation.navigate('Steroid category', {category: category.category})}
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
