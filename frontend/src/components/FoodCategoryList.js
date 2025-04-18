import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, FlatList, TextInput, Dimensions, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import FoodDetailsModal from './FoodDetailsModal';
import SearchBox from './SearchBox';

const { width } = Dimensions.get('window');
const cardWidth = (width - 45) / 2; 

export default function FoodCategoryList({ 
  categoryName, 
  endpoint, 
  apiPath, 
  macroColor, 
  emptyMessage,
  loadingMessage = "กำลังโหลดข้อมูลอาหาร...",
  errorMessage = "ไม่สามารถโหลดข้อมูลอาหารได้",
  navigation,
  initialFoods = null,
  disableSearch = false,
  loading: externalLoading = false,
  sortType = 'default'
}) {
  const [loading, setLoading] = useState(externalLoading);
  const [error, setError] = useState(null);
  const [foods, setFoods] = useState(initialFoods || []);
  const [filteredFoods, setFilteredFoods] = useState(initialFoods || []);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  useEffect(() => {
    if (initialFoods === null) {
      fetchFoods();
    } else {
      setFoods(initialFoods);
      setFilteredFoods(initialFoods);
      setLoading(externalLoading);
    }
  }, [initialFoods, externalLoading]);

  useEffect(() => {
    // กรองข้อมูลอาหารตามคำค้นหา
    let resultFoods = [];
    
    if (searchText.trim() === '') {
      resultFoods = [...foods];
    } else {
      const searchLower = searchText.toLowerCase();
      resultFoods = foods.filter(food => {
        // ค้นหาจากชื่ออาหาร - รองรับทั้งภาษาไทยและภาษาอังกฤษ
        const nameMatch = food.name && food.name.toLowerCase().includes(searchLower);
        
        // ค้นหาจากคำอธิบายถ้ามี - รองรับทั้งภาษาไทยและภาษาอังกฤษ
        const descMatch = food.description && food.description.toLowerCase().includes(searchLower);
        
        // ค้นหาจากแท็ก (ถ้ามี)
        const tagMatch = food.tags && Array.isArray(food.tags) && 
                        food.tags.some(tag => tag.toLowerCase().includes(searchLower));
        
        return nameMatch || descMatch || tagMatch;
      });
    }
    
    // เรียงลำดับข้อมูลตามที่เลือก
    const sortedFoods = sortFoods(resultFoods, sortType);
    setFilteredFoods(sortedFoods);
  }, [searchText, foods, sortType]);

  const sortFoods = (foodsToSort, type) => {
    if (!foodsToSort || foodsToSort.length === 0) return [];
    
    let sortedFoods = [...foodsToSort];
    
    switch (type) {
      case 'carbHigh':
        sortedFoods.sort((a, b) => (b.nutritionPer100g?.carbohydrates || 0) - (a.nutritionPer100g?.carbohydrates || 0));
        break;
      case 'carbLow':
        sortedFoods.sort((a, b) => (a.nutritionPer100g?.carbohydrates || 0) - (b.nutritionPer100g?.carbohydrates || 0));
        break;
      case 'proteinHigh':
        sortedFoods.sort((a, b) => (b.nutritionPer100g?.protein || 0) - (a.nutritionPer100g?.protein || 0));
        break;
      case 'proteinLow':
        sortedFoods.sort((a, b) => (a.nutritionPer100g?.protein || 0) - (b.nutritionPer100g?.protein || 0));
        break;
      case 'fatHigh':
        sortedFoods.sort((a, b) => (b.nutritionPer100g?.fat || 0) - (a.nutritionPer100g?.fat || 0));
        break;
      case 'fatLow':
        sortedFoods.sort((a, b) => (a.nutritionPer100g?.fat || 0) - (b.nutritionPer100g?.fat || 0));
        break;
      case 'caloriesHigh':
        sortedFoods.sort((a, b) => (b.nutritionPer100g?.calories || 0) - (a.nutritionPer100g?.calories || 0));
        break;
      case 'caloriesLow':
        sortedFoods.sort((a, b) => (a.nutritionPer100g?.calories || 0) - (b.nutritionPer100g?.calories || 0));
        break;
      default:
        // ค่าเริ่มต้น ไม่ต้องเรียงลำดับ
        break;
    }
    
    return sortedFoods;
  };

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_ENDPOINT_API}${apiPath}`);
      
      if (response.data && response.data.foods) {
        const sortedFoods = sortFoods(response.data.foods, sortType);
        setFoods(sortedFoods);
        setFilteredFoods(sortedFoods);
      } else {
        setFoods([]);
        setFilteredFoods([]);
      }
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${categoryName} foods:`, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFoodPress = (food) => {
    setSelectedFood(food);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedFood(null);
  };

  const clearSearch = () => {
    setSearchText('');
  };

  const toggleFilterModal = () => {
    setFilterModalVisible(!filterModalVisible);
  };

  // สร้างแถวของรายการอาหาร (2 คอลัมน์)
  const renderFoodItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.foodCard, { width: cardWidth }]}
      onPress={() => handleFoodPress(item)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.picture || 'https://via.placeholder.com/300x200/CCCCCC/888888?text=No+Image' }}
          style={styles.foodImage}
        />
        <View style={styles.calorieOverlay}>
          <View style={styles.calorieContainer}>
            <Ionicons name="flame" size={14} color="#FF6F00" style={styles.flameIcon} />
            <Text style={styles.calorieValue}>
              {item.nutritionPer100g?.calories || 0}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.foodInfo}>
        <Text style={styles.foodTitle} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.foodDescription} numberOfLines={2}>
          {item.description || 'ไม่มีคำอธิบาย'}
        </Text>
      </View>
      
      <View style={styles.macroContainer}>
        <View style={styles.macroRow}>
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: '#388E3C' }]}>
              {item.nutritionPer100g?.carbohydrates || 0}g
            </Text>
            <Text style={styles.macroLabel}>คาร์บ</Text>
          </View>
          
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: '#D32F2F' }]}>
              {item.nutritionPer100g?.protein || 0}g
            </Text>
            <Text style={styles.macroLabel}>โปรตีน</Text>
          </View>
          
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: '#1976D2' }]}>
              {item.nutritionPer100g?.fat || 0}g
            </Text>
            <Text style={styles.macroLabel}>ไขมัน</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Modal สำหรับการเลือกเรียงลำดับ
  const renderFilterModal = () => (
    <Modal
      visible={filterModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={toggleFilterModal}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={toggleFilterModal}
      >
        <View style={styles.filterModalContainer}>
          <Text style={styles.filterModalTitle}>เรียงลำดับตาม</Text>
          
          <TouchableOpacity 
            style={[styles.filterOption, sortType === 'default' && styles.selectedFilterOption]} 
            onPress={() => handleSort('default')}
          >
            <Text style={styles.filterOptionText}>เริ่มต้น</Text>
            {sortType === 'default' && <Ionicons name="checkmark" size={20} color={macroColor || "#388E3C"} />}
          </TouchableOpacity>

          <View style={styles.filterDivider} />
          <Text style={styles.filterSectionTitle}>แคลอรี่</Text>
          
          <TouchableOpacity 
            style={[styles.filterOption, sortType === 'caloriesHigh' && styles.selectedFilterOption]} 
            onPress={() => handleSort('caloriesHigh')}
          >
            <Text style={styles.filterOptionText}>แคลอรี่ (มาก → น้อย)</Text>
            {sortType === 'caloriesHigh' && <Ionicons name="checkmark" size={20} color={macroColor || "#388E3C"} />}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterOption, sortType === 'caloriesLow' && styles.selectedFilterOption]} 
            onPress={() => handleSort('caloriesLow')}
          >
            <Text style={styles.filterOptionText}>แคลอรี่ (น้อย → มาก)</Text>
            {sortType === 'caloriesLow' && <Ionicons name="checkmark" size={20} color={macroColor || "#388E3C"} />}
          </TouchableOpacity>

          <View style={styles.filterDivider} />
          <Text style={styles.filterSectionTitle}>คาร์โบไฮเดรต</Text>
          
          <TouchableOpacity 
            style={[styles.filterOption, sortType === 'carbHigh' && styles.selectedFilterOption]} 
            onPress={() => handleSort('carbHigh')}
          >
            <Text style={styles.filterOptionText}>คาร์โบไฮเดรต (มาก → น้อย)</Text>
            {sortType === 'carbHigh' && <Ionicons name="checkmark" size={20} color={macroColor || "#388E3C"} />}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterOption, sortType === 'carbLow' && styles.selectedFilterOption]} 
            onPress={() => handleSort('carbLow')}
          >
            <Text style={styles.filterOptionText}>คาร์โบไฮเดรต (น้อย → มาก)</Text>
            {sortType === 'carbLow' && <Ionicons name="checkmark" size={20} color={macroColor || "#388E3C"} />}
          </TouchableOpacity>

          <View style={styles.filterDivider} />
          <Text style={styles.filterSectionTitle}>โปรตีน</Text>
          
          <TouchableOpacity 
            style={[styles.filterOption, sortType === 'proteinHigh' && styles.selectedFilterOption]} 
            onPress={() => handleSort('proteinHigh')}
          >
            <Text style={styles.filterOptionText}>โปรตีน (มาก → น้อย)</Text>
            {sortType === 'proteinHigh' && <Ionicons name="checkmark" size={20} color={macroColor || "#388E3C"} />}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterOption, sortType === 'proteinLow' && styles.selectedFilterOption]} 
            onPress={() => handleSort('proteinLow')}
          >
            <Text style={styles.filterOptionText}>โปรตีน (น้อย → มาก)</Text>
            {sortType === 'proteinLow' && <Ionicons name="checkmark" size={20} color={macroColor || "#388E3C"} />}
          </TouchableOpacity>

          <View style={styles.filterDivider} />
          <Text style={styles.filterSectionTitle}>ไขมัน</Text>
          
          <TouchableOpacity 
            style={[styles.filterOption, sortType === 'fatHigh' && styles.selectedFilterOption]} 
            onPress={() => handleSort('fatHigh')}
          >
            <Text style={styles.filterOptionText}>ไขมัน (มาก → น้อย)</Text>
            {sortType === 'fatHigh' && <Ionicons name="checkmark" size={20} color={macroColor || "#388E3C"} />}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterOption, sortType === 'fatLow' && styles.selectedFilterOption]} 
            onPress={() => handleSort('fatLow')}
          >
            <Text style={styles.filterOptionText}>ไขมัน (น้อย → มาก)</Text>
            {sortType === 'fatLow' && <Ionicons name="checkmark" size={20} color={macroColor || "#388E3C"} />}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // แสดงหน้าจอ loading
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={macroColor || "#388E3C"} />
        <Text style={styles.loadingText}>{loadingMessage}</Text>
      </View>
    );
  }

  // แสดงหน้าจอ error
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color={macroColor || "#388E3C"} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={[styles.retryButton, { backgroundColor: macroColor || "#388E3C" }]} onPress={fetchFoods}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!disableSearch && (
        <SearchBox 
          placeholder="ค้นหาอาหาร..."
          value={searchText}
          onChangeText={setSearchText}
          onClear={clearSearch}
          onPressFilter={toggleFilterModal}
        />
      )}

      {filteredFoods.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="nutrition-outline" size={60} color="#BDBDBD" />
          <Text style={styles.emptyText}>
            {searchText.length > 0 ? 'ไม่พบอาหารที่ตรงกับคำค้นหา' : emptyMessage}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFoods}
          renderItem={renderFoodItem}
          keyExtractor={item => item._id || Math.random().toString()}
          contentContainerStyle={styles.foodList}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}

      {renderFilterModal()}

      <FoodDetailsModal
        visible={modalVisible}
        food={selectedFood}
        onClose={closeModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    width: '100%',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingLeft: 8,
    paddingRight: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'normal',
    height: 40,
    textAlignVertical: 'center',
    includeFontPadding: false,
    padding: 0,
    margin: 0,
  },
  searchIcon: {
    marginRight: 5,
  },
  clearButton: {
    padding: 5,
  },
  clearIcon: {
    marginLeft: 5,
  },
  filterButton: {
    padding: 5,
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
  },
  foodList: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  foodCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 100,
  },
  foodImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  calorieOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 5,
  },
  calorieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  flameIcon: {
    marginRight: 2,
  },
  calorieValue: {
    color: '#FF6F00',
    fontSize: 14,
    fontWeight: 'bold',
  },
  foodInfo: {
    padding: 10,
    paddingBottom: 0,
  },
  foodTitle: {
    color: '#212121',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  foodDescription: {
    color: '#616161',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
    height: 32,
  },
  macroContainer: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    marginTop: 5,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  macroLabel: {
    fontSize: 10,
    color: '#757575',
  },
  // Styles สำหรับ Filter Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterModalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 5,
  },
  filterOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedFilterOption: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  filterDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: 'white',
    marginTop: 15,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
}); 