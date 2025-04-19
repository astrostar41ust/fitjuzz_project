import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function FoodDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { food } = route.params;

  // function to get the category name in Thai
  const getCategoryName = (category) => {
    const categoryMap = {
      'protein': 'โปรตีน',
      'carb': 'คาร์โบไฮเดรต',
      'fat': 'ไขมัน',
      'vegetable': 'ผัก',
      'fruit': 'ผลไม้',
      'dairy': 'ผลิตภัณฑ์นม',
      'grain': 'ธัญพืช',
      'seafood': 'อาหารทะเล',
      'meat': 'เนื้อสัตว์',
      'legume': 'ถั่ว',
      'nut': 'ถั่วและเมล็ด'
    };
    
    return categoryMap[category] || category;
  };

  // function to get the color of the category
  const getCategoryColor = (category) => {
    switch (category) {
      case 'protein':
        return '#D32F2F';
      case 'carb':
        return '#388E3C';
      case 'fat':
        return '#1976D2';
      case 'dairy':
        return '#512DA8';
      case 'fruit':
        return '#FF9800';
      case 'vegetable':
        return '#4CAF50';
      case 'grain':
        return '#FFC107';
      case 'legume':
        return '#8D6E63';
      case 'nut':
        return '#795548';
      case 'seafood':
        return '#0097A7';
      case 'meat':
        return '#E64A19';
      default:
        return '#4CAF50';
    }
  };

  return (
    <View style={styles.container}>
      {/* back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        {/* food image */}
        <Image
          source={{ uri: food.image || 'https://via.placeholder.com/800x500/CCCCCC/888888?text=No+Image' }}
          style={styles.headerImage}
        />
        
        {/* main information */}
        <View style={styles.headerInfo}>
          <Text style={styles.foodName}>{food.name}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(food.category) }]}>
            <Text style={styles.categoryText}>{getCategoryName(food.category)}</Text>
          </View>
        </View>

        <View style={styles.nutritionContainer}>
          <View style={styles.calorieBox}>
            <Text style={styles.calorieValue}>{food.nutritionPer100g?.calories || 0}</Text>
            <Text style={styles.calorieLabel}>แคลอรี่</Text>
            <Text style={styles.servingSize}>ต่อ {food.name === 'ขนมปังแผ่น' ? '1 แผ่น' : (food.servingSize || '100 กรัม')}</Text>
          </View>

          <View style={styles.macrosContainer}>
            {/* protein */}
            <View style={[styles.macroBox, styles.proteinBox]}>
              <Text style={styles.macroValue}>{food.nutritionPer100g?.protein || 0}g</Text>
              <Text style={styles.macroLabel}>โปรตีน</Text>
            </View>

            {/* carb */}
            <View style={[styles.macroBox, styles.carbBox]}>
              <Text style={styles.macroValue}>{food.nutritionPer100g?.carbohydrates || 0}g</Text>
              <Text style={styles.macroLabel}>คาร์โบไฮเดรต</Text>
            </View>

            {/* fat */}
            <View style={[styles.macroBox, styles.fatBox]}>
              <Text style={styles.macroValue}>{food.nutritionPer100g?.fat || 0}g</Text>
              <Text style={styles.macroLabel}>ไขมัน</Text>
            </View>
          </View>
        </View>

        {/* detailed nutrition information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ข้อมูลโภชนาการโดยละเอียด</Text>
          
          {/* calories */}
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>calories</Text>
            <Text style={styles.nutritionValue}>{food.nutritionPer100g?.calories || 0} แคล</Text>
          </View>
          
          {/* protein */}
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>protein</Text>
            <Text style={styles.nutritionValue}>{food.nutritionPer100g?.protein || 0} กรัม</Text>
          </View>
          
          {/* carb */}
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>carb</Text>
            <Text style={styles.nutritionValue}>{food.nutritionPer100g?.carbohydrates || 0} กรัม</Text>
          </View>
          
          {/* fiber */}
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>fiber</Text>
            <Text style={styles.nutritionValue}>{food.nutritionPer100g?.fiber || 0} กรัม</Text>
          </View>
          
          {/* Sugar */}
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>น้ำตาล</Text>
            <Text style={styles.nutritionValue}>{food.nutritionPer100g?.sugar || 0} กรัม</Text>
          </View>
          
          {/* fat */}
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>fat</Text>
            <Text style={styles.nutritionValue}>{food.nutritionPer100g?.fat || 0} กรัม</Text>
          </View>
          
          {/* saturated fat */}
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>saturated fat</Text>
            <Text style={styles.nutritionValue}>{food.nutritionPer100g?.saturatedFat || 0} กรัม</Text>
          </View>
          
          {/* cholesterol */}
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>cholesterol</Text>
            <Text style={styles.nutritionValue}>{food.nutritionPer100g?.cholesterol || 0} มก.</Text>
          </View>
          
          {/* sodium */}
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>sodium</Text>
            <Text style={styles.nutritionValue}>{food.nutritionPer100g?.sodium || 0} มก.</Text>
          </View>
          
          {/* potassium */}
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>potassium</Text>
            <Text style={styles.nutritionValue}>{food.nutritionPer100g?.potassium || 0} มก.</Text>
          </View>
        </View>

        {/* details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>details</Text>
          <Text style={styles.description}>{food.description || 'ไม่มีรายละเอียดเพิ่มเติม'}</Text>
        </View>

        {/* health benefits */}
        {food.healthBenefits && food.healthBenefits.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ประโยชน์ต่อสุขภาพ</Text>
            {food.healthBenefits.map((benefit, index) => (
              <View key={index} style={styles.bulletItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.bulletText}>{benefit}</Text>
              </View>
            ))}
          </View>
        )}

        {/* special properties */}
        {food.specialProperties && food.specialProperties.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>คุณสมบัติพิเศษ</Text>
            <View style={styles.tagContainer}>
              {food.specialProperties.map((property, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{property}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* tags */}
        {food.tags && food.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>tags</Text>
            <View style={styles.tagContainer}>
              {food.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* bottom space */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  headerImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  headerInfo: {
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  nutritionContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  calorieBox: {
    alignItems: 'center',
    marginBottom: 15,
  },
  calorieValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#212121',
  },
  calorieLabel: {
    fontSize: 16,
    color: '#757575',
  },
  servingSize: {
    fontSize: 14,
    color: '#9E9E9E',
    marginTop: 4,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  macroBox: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  proteinBox: {
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
  },
  carbBox: {
    backgroundColor: 'rgba(56, 142, 60, 0.1)',
  },
  fatBox: {
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
  },
  macroValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  macroLabel: {
    fontSize: 14,
    color: '#757575',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#212121',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#424242',
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  nutritionLabel: {
    fontSize: 16,
    color: '#424242',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    marginRight: 8,
    color: '#4CAF50',
  },
  bulletText: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
    color: '#424242',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  tagText: {
    fontSize: 14,
    color: '#616161',
  },
  bottomSpace: {
    height: 40,
  },
}); 