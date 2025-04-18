import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBox({ 
  placeholder = "ค้นหา",
  value, 
  onChangeText,
  onClear,
  onPressFilter,
  containerStyle,
  inputStyle,
  iconColor = "gray"
}) {
  return (
    <View style={[styles.searchSection, containerStyle]}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={iconColor} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          clearButtonMode="while-editing"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="default"
          returnKeyType="search"
        />
        {value && value.length > 0 ? (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="gray" style={styles.clearIcon} />
          </TouchableOpacity>
        ) : onPressFilter ? (
          <TouchableOpacity onPress={onPressFilter} style={styles.filterButton}>
            <Ionicons name="filter" size={20} color="#1976D2" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  }
}); 