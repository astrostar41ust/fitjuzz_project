import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const FoodDetailsModal = ({ visible, food, onClose }) => {
  if (!food) return null;
  
  console.log('Food data received in modal:', food); // add log to see the data received
  
  const getCategoryColor = (category) => {
    switch (category) {
      case 'protein_rich':
      case 'protein':
        return '#E53935'; //
      case 'vegetables':
        return '#2E7D32'; // 
      case 'fruits':
        return '#EF6C00'; // 
      case 'grains':
      case 'carb':
        return '#F9A825'; // 
      case 'dairy':
        return '#1565C0'; // 
      case 'nuts_seeds':
        return '#5D4037'; // 
      case 'legumes':
        return '#512DA8'; // 
      case 'oils_fats':
      case 'fat':
        return '#F57F17'; // 
      case 'beverages':
        return '#00695C'; // 
      case 'herbs_spices':
        return '#33691E'; // 
      case 'sweets':
        return '#C2185B'; // 
      default:
        return '#455A64'; // 
    }
  };

  const getCategoryName = (category) => {
    switch (category) {
      case 'protein_rich':
      case 'protein':
        return 'โปรตีน';
      case 'vegetables':
        return 'ผัก';
      case 'fruits':
        return 'ผลไม้';
      case 'grains':
        return 'ธัญพืช';
      case 'carb':
        return 'คาร์โบไฮเดรต';
      case 'dairy':
        return 'นม';
      case 'nuts_seeds':
        return 'ถั่วและเมล็ด';
      case 'legumes':
        return 'ถั่ว';
      case 'oils_fats':
      case 'fat':
        return 'น้ำมันและไขมัน';
      case 'beverages':
        return 'เครื่องดื่ม';
      case 'herbs_spices':
        return 'สมุนไพรและเครื่องเทศ';
      case 'sweets':
        return 'ของหวาน';
      default:
        return 'อื่นๆ';
    }
  };
  
  const getNutrientColor = (nutrientType) => {
    switch (nutrientType) {
      case 'protein':
        return '#E53935'; // 
      case 'carbs':
        return '#F9A825'; // 
      case 'fat':
        return '#1565C0'; // 
      default:
        return '#455A64'; // 
    }
  };

  // check the data format of the nutrition according to the structure in MongoDB
  const getNutritionValue = () => {
    // check the data format of the nutrition according to the structure in MongoDB
    if (food.nutritionPer100g) {
      return food.nutritionPer100g;
    } else if (food.nutrition) {
      return food.nutrition;
    } else if (food.nutrients) {
      return food.nutrients;
    } else {
      // if there is no the expected format, check if there is the nutrition value in food
      const nutrition = {
        calories: food.calories || 0,
        protein: food.protein || 0,
        carbohydrates: food.carbohydrates || food.carbs || 0,
        fat: food.fat || 0,
        sugar: food.sugar || 0,
        fiber: food.fiber || 0,
        saturatedFat: food.saturatedFat || 0,
        unsaturatedFat: food.unsaturatedFat || 0,
        sodium: food.sodium || 0,
        cholesterol: food.cholesterol || 0,
        potassium: food.potassium || 0
      };
      
      // check if there is at least 1 value that is not 0
      const hasNonZeroValue = Object.values(nutrition).some(val => val !== 0);
      
      if (hasNonZeroValue) {
        return nutrition;
      } else {
        // if there is no value, use the default value
        return {
          calories: 0,
          protein: 0,
          carbohydrates: 0,
          fat: 0,
          sugar: 0,
          fiber: 0,
          saturatedFat: 0,
          unsaturatedFat: 0,
          sodium: 0,
          cholesterol: 0,
          potassium: 0
        };
      }
    }
  };
  
  const nutrition = getNutritionValue();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={[styles.categoryTag, { backgroundColor: getCategoryColor(food.category) }]}>
              <Text style={styles.categoryText}>
                {getCategoryName(food.category)}
              </Text>
            </View>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <Image 
              source={{ uri: food.picture || 'https://via.placeholder.com/400x200?text=No+Image' }} 
              style={styles.foodImage}
              resizeMode="cover"
            />

            <View style={styles.contentContainer}>
              <Text style={styles.foodName}>{food.name}</Text>
              
              <View style={styles.calorieContainer}>
                <View style={styles.calorieBox}>
                  <Text style={styles.calorieValue}>{food.nutritionPer100g?.calories || 0}</Text>
                  <Text style={styles.calorieLabel}>แคลอรี่</Text>
                  <Text style={styles.servingSize}>ต่อ {food.name === 'ขนมปังแผ่น' ? '1 แผ่น' : '100 กรัม'}</Text>
                </View>
              </View>

              <View style={styles.macrosContainer}>
                <View style={styles.macroItem}>
                  <View style={[styles.macroBox, { backgroundColor: '#FFF5F5', borderColor: getNutrientColor('protein') }]}>
                    <Text style={[styles.macroValue, { color: getNutrientColor('protein') }]}>{nutrition.protein}g</Text>
                    <Text style={styles.macroLabel}>โปรตีน</Text>
                  </View>
                </View>
                <View style={styles.macroItem}>
                  <View style={[styles.macroBox, { backgroundColor: '#FFFBEF', borderColor: getNutrientColor('carbs') }]}>
                    <Text style={[styles.macroValue, { color: getNutrientColor('carbs') }]}>{nutrition.carbohydrates || nutrition.carbs || 0}g</Text>
                    <Text style={styles.macroLabel}>คาร์บ</Text>
                  </View>
                </View>
                <View style={styles.macroItem}>
                  <View style={[styles.macroBox, { backgroundColor: '#F0F8FF', borderColor: getNutrientColor('fat') }]}>
                    <Text style={[styles.macroValue, { color: getNutrientColor('fat') }]}>{nutrition.fat}g</Text>
                    <Text style={styles.macroLabel}>ไขมัน</Text>
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>โภชนาการ</Text>
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>น้ำตาล</Text>
                  <Text style={styles.nutritionValue}>{nutrition.sugar}g</Text>
                </View>
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>ใยอาหาร</Text>
                  <Text style={styles.nutritionValue}>{nutrition.fiber}g</Text>
                </View>
                {nutrition.saturatedFat !== undefined && (
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>ไขมันอิ่มตัว</Text>
                    <Text style={styles.nutritionValue}>{nutrition.saturatedFat}g</Text>
                  </View>
                )}
                {nutrition.unsaturatedFat !== undefined && (
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>ไขมันไม่อิ่มตัว</Text>
                    <Text style={styles.nutritionValue}>{nutrition.unsaturatedFat}g</Text>
                  </View>
                )}
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>โซเดียม</Text>
                  <Text style={styles.nutritionValue}>{nutrition.sodium}mg</Text>
                </View>
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>คอเลสเตอรอล</Text>
                  <Text style={styles.nutritionValue}>{nutrition.cholesterol}mg</Text>
                </View>
                {nutrition.potassium !== undefined && nutrition.potassium > 0 && (
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>โพแทสเซียม</Text>
                    <Text style={styles.nutritionValue}>{nutrition.potassium}mg</Text>
                  </View>
                )}
              </View>

              {food.description && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>รายละเอียด</Text>
                  <Text style={styles.description}>{food.description}</Text>
                </View>
              )}

              {food.healthBenefits && food.healthBenefits.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>ประโยชน์ต่อสุขภาพ</Text>
                  {food.healthBenefits.map((benefit, index) => (
                    <View key={index} style={styles.bulletItem}>
                      <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="check-circle" size={18} color={getCategoryColor(food.category)} />
                      </View>
                      <Text style={styles.bulletText}>{benefit}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: width * 0.9,
    height: height * 0.85,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  contentContainer: {
    paddingHorizontal: 0,
    paddingBottom: 20,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 5,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  scrollView: {
    flex: 1,
  },
  foodImage: {
    width: '100%',
    height: 200,
  },
  calorieContainer: {
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  calorieBox: {
    alignItems: 'center',
  },
  calorieValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#212121',
  },
  calorieLabel: {
    fontSize: 16,
    color: '#757575',
    marginTop: 2,
  },
  servingSize: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 2,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  macroItem: {
    flex: 1,
    paddingHorizontal: 5,
  },
  macroBox: {
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  macroValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  macroLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    marginHorizontal: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 6,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#424242',
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212121',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#424242',
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    marginRight: 8,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    color: '#424242',
  },
});

export default FoodDetailsModal; 