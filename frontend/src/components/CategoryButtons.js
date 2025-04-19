import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/style';

const CategoryButtons = ({ selectedCategory, setSelectedCategory }) => {
  const topRowCategories = ["all", "chest", "back", "shoulder"];
  const bottomRowCategories = ["arms", "abs", "leg", "glutes"];

  const renderCategoryButton = (category) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        {
          backgroundColor:
            selectedCategory === category
              ? colors.clr_blue
              : colors.clr_gray,
        },
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text
        style={[
          styles.categoryText,
          {
            color:
              selectedCategory === category
                ? colors.clr_white
                : colors.clr_black,
          },
        ]}
      >
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {topRowCategories.map(renderCategoryButton)}
      </View>
      <View style={styles.row}>
        {bottomRowCategories.map(renderCategoryButton)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  categoryButton: {
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    minWidth: 56,
    marginHorizontal: 2,
    marginVertical: 2,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default CategoryButtons; 