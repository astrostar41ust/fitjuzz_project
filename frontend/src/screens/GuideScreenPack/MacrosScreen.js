import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import GuideScreenStyle from '../../styles/components/GuideScreenStyle';
import { useNavigation } from '@react-navigation/native';

export default function MacrosScreen() {
  const navigation = useNavigation();
  
  // macro categories
  const macroCategories = [
    {
      id: 'carb',
      title: 'Carbohydrates',
      image: 'https://images.pexels.com/photos/1631899/pexels-photo-1631899.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'แหล่งพลังงานหลัก เช่น ข้าว ขนมปัง พาสต้า',
      screen: 'Carb'
    },
    {
      id: 'protein',
      title: 'Protein',
      image: 'https://images.pexels.com/photos/618775/pexels-photo-618775.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'สำคัญสำหรับการสร้างกล้ามเนื้อ เช่น เนื้อสัตว์ ไข่ ถั่ว',
      screen: 'Protein'
    },
    {
      id: 'fat',
      title: 'Fat',
      image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=800',
      description: 'จำเป็นต่อการดูดซึมวิตามิน เช่น น้ำมัน อะโวคาโด ถั่ว',
      screen: 'Fat'
    }
  ];

  return (
    <View style={GuideScreenStyle.container}>
      <Header />
      
      <ScrollView 
        style={GuideScreenStyle.content} 
        contentContainerStyle={GuideScreenStyle.contentContainer}
        showsVerticalScrollIndicator={false}
      >
 
        {macroCategories.map((category) => (
          <TouchableOpacity 
            key={category.id}
            style={GuideScreenStyle.categoryCard}
            onPress={() => navigation.navigate(category.screen, {
              category: category.id,
              title: category.title
            })}
          >
            <Image
              source={{ uri: category.image }}
              style={styles.categoryImage}
            />
            <View style={[GuideScreenStyle.categoryOverlay, styles.categoryOverlay]}>
              <Text style={GuideScreenStyle.categoryTitle}>{category.title}</Text>
              <Text style={GuideScreenStyle.categoryDescription}>{category.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 20,
    left: 15,
    padding: 8,
    zIndex: 10,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',

  },
  categoryOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)' 
  }
}); 