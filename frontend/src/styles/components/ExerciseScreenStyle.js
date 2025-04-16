import { StyleSheet } from "react-native"
import { colors, sizes } from "../style";


const ExerciseScreenStyle = StyleSheet.create({
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.clr_white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.clr_white,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 5,
  },
  
  
  categoriesWrapper: {
    marginBottom: 15,
    marginTop: 5,
    width: '100%',
    minHeight: 90,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    marginBottom: 10,
    backgroundColor: colors.clr_white,
    minWidth: 60,
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: colors.clr_blue,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  categoryTextActive: {
    color: colors.clr_white,
  },

  // Styles for exercise list items
  sectionHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.clr_white,
    marginBottom: 5,
    marginTop: 5,
  },
  exerciseItem: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseImage: {
    width: 60,
    height: 60,
    marginRight: 15,
    borderRadius: 5,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    color: colors.clr_white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseCategory: {
    color: '#aaa',
    fontSize: 14,
  },
  infoButton: {
    padding: 5,
  },
  loadingText: {
    color: colors.clr_white,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
})


export default ExerciseScreenStyle;