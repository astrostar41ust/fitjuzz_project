import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

export default function FoodCategoryScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { category, title, foods: initialFoods } = route.params || {};
  
  const [foods, setFoods] = useState(initialFoods || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // add variable for pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    // if there is no initial data, fetch data from API
    resetAndFetch();
  }, [category]);

  // reset pagination and fetch new data
  const resetAndFetch = () => {
    setPage(1);
    setFoods([]);
    setHasMore(true);
    fetchFoodsByCategory(1);
  };

  const fetchFoodsByCategory = async (pageNum = page) => {
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      let response;
      
      if (category) {
        // fetch data by category
        response = await axios.get(
          `${process.env.EXPO_PUBLIC_ENDPOINT_API}/api/user/foods/category/${category}?page=${pageNum}&limit=${limit}`
        );
      } else {
        // fetch all data
        response = await axios.get(
          `${process.env.EXPO_PUBLIC_ENDPOINT_API}/api/user/foods?page=${pageNum}&limit=${limit}`
        );
      }
      
      const { foods: newFoods, pagination } = response.data;
      
      if (pageNum === 1) {
        setFoods(newFoods);
      } else {
        setFoods(prevFoods => [...prevFoods, ...newFoods]);
      }
      
      setTotalPages(pagination.totalPages);
      setHasMore(pagination.currentPage < pagination.totalPages);
      setError(null);
    } catch (err) {
      console.error(`Error fetching foods:`, err);
      setError(`can't fetch food data${title ? ` category ${title}` : ''}`);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreFoods = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchFoodsByCategory(nextPage);
    }
  };

  const handleFoodSelect = (food) => {
    navigation.navigate('FoodDetail', { food });
  };

  const getCategoryColor = () => {
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

  const categoryColor = getCategoryColor();

  const renderFoodItem = ({ item }) => (
    <TouchableOpacity
      style={styles.foodCard}
      onPress={() => handleFoodSelect(item)}
    >
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/300x200/CCCCCC/888888?text=No+Image' }}
        style={styles.foodImage}
      />
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.servingSize}>{item.name === 'ขนมปังแผ่น' ? '1 แผ่น' : (item.servingSize || '100 กรัม')}</Text>
        
        <View style={styles.macroContainer}>
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: '#D32F2F' }]}>
              {item.nutritionPer100g?.protein || 0}g
            </Text>
            <Text style={styles.macroLabel}>โปรตีน</Text>
          </View>
          
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: '#388E3C' }]}>
              {item.nutritionPer100g?.carbohydrates || 0}g
            </Text>
            <Text style={styles.macroLabel}>คาร์บ</Text>
          </View>
          
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: '#1976D2' }]}>
              {item.nutritionPer100g?.fat || 0}g
            </Text>
            <Text style={styles.macroLabel}>ไขมัน</Text>
          </View>
          
          <View style={styles.calorieItem}>
            <Text style={styles.calorieValue}>
              {item.nutritionPer100g?.calories || 0}
            </Text>
            <Text style={styles.calorieLabel}>แคล</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="small" color={categoryColor} />
        <Text style={styles.loadingMoreText}>กำลังโหลดเพิ่มเติม...</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={categoryColor} />
        <Text style={styles.loadingText}>กำลังโหลดข้อมูลอาหาร...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: categoryColor }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title || 'อาหารทั้งหมด'}</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      {/* Content */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: categoryColor }]}
            onPress={resetAndFetch}
          >
            <Text style={styles.retryButtonText}>ลองใหม่</Text>
          </TouchableOpacity>
        </View>
      ) : foods.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="nutrition-outline" size={60} color="#BDBDBD" />
          <Text style={styles.emptyText}>ไม่พบข้อมูลอาหาร{title ? ` ประเภท ${title}` : ''}</Text>
        </View>
      ) : (
        <FlatList
          data={foods}
          renderItem={renderFoodItem}
          keyExtractor={(item) => item._id || item.id || Math.random().toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreFoods}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  rightPlaceholder: {
    width: 40,
  },
  listContent: {
    padding: 15,
  },
  foodCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foodImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  foodInfo: {
    padding: 15,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  servingSize: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
  },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  macroLabel: {
    fontSize: 12,
    color: '#757575',
  },
  calorieItem: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#EEEEEE',
    borderRadius: 4,
    paddingVertical: 4,
  },
  calorieValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  calorieLabel: {
    fontSize: 12,
    color: '#757575',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#757575',
  },
  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingMoreText: {
    marginTop: 5,
    fontSize: 14,
    color: '#757575',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginTop: 10,
  },
}); 