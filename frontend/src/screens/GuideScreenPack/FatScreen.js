import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, KeyboardAvoidingView, Text, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import GuideScreenStyle from '../../styles/components/GuideScreenStyle';
import { useNavigation } from '@react-navigation/native';
import FoodCategoryList from '../../components/FoodCategoryList';
import axios from 'axios';

export default function FatScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortType, setSortType] = useState('default'); // default, carbHigh, carbLow, proteinHigh, proteinLow, fatHigh, fatLow, caloriesHigh, caloriesLow

  useEffect(() => {
    if (searchQuery.trim()) {
      searchFoods();
    } else {
      setSearching(false);
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchFoods = async () => {
    if (searchQuery.trim().length < 2) return;
    
    setLoading(true);
    setSearching(true);
    
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_ENDPOINT_API}/api/user/foods/search?query=${encodeURIComponent(searchQuery)}&minFat=10`
      );
      
      if (response.data && response.data.foods) {
        setSearchResults(response.data.foods);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Error searching foods:', err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setSearching(false);
    setSearchResults([]);
  };

  const toggleFilterModal = () => {
    setFilterModalVisible(!filterModalVisible);
  };

  const handleSort = (newSortType) => {
    setSortType(newSortType);
    setFilterModalVisible(false);
    // หากมีผลการค้นหาอยู่แล้ว ให้เรียงลำดับตัวนั้น
    if (searching && searchResults.length > 0) {
      const sortedResults = sortFoods([...searchResults], newSortType);
      setSearchResults(sortedResults);
    }
  };

  const sortFoods = (foodsToSort, type) => {
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

  return (
    <KeyboardAvoidingView 
      style={GuideScreenStyle.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <Header />
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="ค้นหาไขมัน..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={clearSearch}>
                <Ionicons name="close-circle" size={20} color="gray" style={styles.searchIcon} />
              </TouchableOpacity>
            ) : (
              <>
                <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
                <TouchableOpacity onPress={toggleFilterModal} style={styles.filterButton}>
                  <Ionicons name="filter" size={20} color="#1976D2" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        {searching ? (
          <FoodCategoryList
            categoryName="ผลการค้นหา"
            apiPath="/mock-path" // ไม่ได้ใช้เพราะเราส่งข้อมูลโดยตรง
            initialFoods={searchResults}
            macroColor="#FF6D00"
            emptyMessage="ไม่พบข้อมูลอาหารที่ตรงกับคำค้นหา"
            errorMessage="ไม่สามารถค้นหาอาหารได้"
            loading={loading}
            navigation={navigation}
            disableSearch={true}
            sortType={sortType}
          />
        ) : (
          <FoodCategoryList
            categoryName="ไขมัน"
            apiPath="/api/user/foodsdirect/fat"
            macroColor="#FF6D00"
            emptyMessage="ไม่พบข้อมูลอาหารประเภทไขมัน"
            errorMessage="ไม่สามารถโหลดข้อมูลอาหารประเภทไขมันได้"
            navigation={navigation}
            disableSearch={true}
            sortType={sortType}
          />
        )}
      </View>

      {/* Filter Modal */}
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
              {sortType === 'default' && <Ionicons name="checkmark" size={20} color="#1976D2" />}
            </TouchableOpacity>

            <View style={styles.filterDivider} />
            <Text style={styles.filterSectionTitle}>แคลอรี่</Text>
            
            <TouchableOpacity 
              style={[styles.filterOption, sortType === 'caloriesHigh' && styles.selectedFilterOption]} 
              onPress={() => handleSort('caloriesHigh')}
            >
              <Text style={styles.filterOptionText}>แคลอรี่ (มาก → น้อย)</Text>
              {sortType === 'caloriesHigh' && <Ionicons name="checkmark" size={20} color="#1976D2" />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterOption, sortType === 'caloriesLow' && styles.selectedFilterOption]} 
              onPress={() => handleSort('caloriesLow')}
            >
              <Text style={styles.filterOptionText}>แคลอรี่ (น้อย → มาก)</Text>
              {sortType === 'caloriesLow' && <Ionicons name="checkmark" size={20} color="#1976D2" />}
            </TouchableOpacity>

            <View style={styles.filterDivider} />
            <Text style={styles.filterSectionTitle}>คาร์โบไฮเดรต</Text>
            
            <TouchableOpacity 
              style={[styles.filterOption, sortType === 'carbHigh' && styles.selectedFilterOption]} 
              onPress={() => handleSort('carbHigh')}
            >
              <Text style={styles.filterOptionText}>คาร์โบไฮเดรต (มาก → น้อย)</Text>
              {sortType === 'carbHigh' && <Ionicons name="checkmark" size={20} color="#1976D2" />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterOption, sortType === 'carbLow' && styles.selectedFilterOption]} 
              onPress={() => handleSort('carbLow')}
            >
              <Text style={styles.filterOptionText}>คาร์โบไฮเดรต (น้อย → มาก)</Text>
              {sortType === 'carbLow' && <Ionicons name="checkmark" size={20} color="#1976D2" />}
            </TouchableOpacity>

            <View style={styles.filterDivider} />
            <Text style={styles.filterSectionTitle}>โปรตีน</Text>
            
            <TouchableOpacity 
              style={[styles.filterOption, sortType === 'proteinHigh' && styles.selectedFilterOption]} 
              onPress={() => handleSort('proteinHigh')}
            >
              <Text style={styles.filterOptionText}>โปรตีน (มาก → น้อย)</Text>
              {sortType === 'proteinHigh' && <Ionicons name="checkmark" size={20} color="#1976D2" />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterOption, sortType === 'proteinLow' && styles.selectedFilterOption]} 
              onPress={() => handleSort('proteinLow')}
            >
              <Text style={styles.filterOptionText}>โปรตีน (น้อย → มาก)</Text>
              {sortType === 'proteinLow' && <Ionicons name="checkmark" size={20} color="#1976D2" />}
            </TouchableOpacity>

            <View style={styles.filterDivider} />
            <Text style={styles.filterSectionTitle}>ไขมัน</Text>
            
            <TouchableOpacity 
              style={[styles.filterOption, sortType === 'fatHigh' && styles.selectedFilterOption]} 
              onPress={() => handleSort('fatHigh')}
            >
              <Text style={styles.filterOptionText}>ไขมัน (มาก → น้อย)</Text>
              {sortType === 'fatHigh' && <Ionicons name="checkmark" size={20} color="#1976D2" />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterOption, sortType === 'fatLow' && styles.selectedFilterOption]} 
              onPress={() => handleSort('fatLow')}
            >
              <Text style={styles.filterOptionText}>ไขมัน (น้อย → มาก)</Text>
              {sortType === 'fatLow' && <Ionicons name="checkmark" size={20} color="#1976D2" />}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
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
  searchContainer: {
    paddingHorizontal: 15,
    marginTop: 40,
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
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
  },
  searchIcon: {
    marginLeft: 5,
  },
  filterButton: {
    marginLeft: 10,
    padding: 5,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  // Filter Modal Styles
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
}); 