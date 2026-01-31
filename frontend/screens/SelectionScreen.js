import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';

const SelectionScreen = ({ onSelect }) => {
  const today = new Date().toLocaleString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true 
  }) + " IST";

  return (
    <SafeAreaView style={styles.container}>
      {/* --- TOP NAVIGATION BAR --- */}
      <View style={styles.navbar}>
        <Text style={styles.navTitle}>RBT VERIFICATION SYSTEM</Text>
        <View style={styles.navRight}>
          <Text style={styles.dateTime}>{today}</Text>
          <Image 
            source={{ uri: 'https://dial4college.blr1.cdn.digitaloceanspaces.com/pro/1199/logo/1703922672.jpeg' }} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* --- MAIN DASHBOARD CONTENT --- */}
      <View style={styles.content}>
        <Text style={styles.welcomeHeading}>Welcome, Faculty</Text>
        <Text style={styles.subHeading}>Select an assessment type to begin the Bloom's Taxonomy level verification.</Text>
        
        {/* IA Cards Row */}
        <View style={styles.cardRow}>
          {['IA 1', 'IA 2', 'IA 3 / MODEL'].map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.card} 
              onPress={() => onSelect(item.replace(/\s/g, ''))}
            >
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{index === 2 ? '100 Marks' : '50 Marks'}</Text>
              </View>
              <Text style={styles.cardTitle}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* --- QUICK STATS SECTION --- */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Quick Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>📄</Text>
              <Text style={styles.statText}>Total Papers: <Text style={styles.boldBlue}>150</Text></Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>📝</Text>
              <Text style={styles.statText}>Pending: <Text style={styles.boldBlue}>30</Text></Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={styles.statText}>Verified: <Text style={styles.boldBlue}>120</Text></Text>
            </View>
          </View>
        </View>
      </View>

      {/* --- FOOTER --- */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 Chennai Institute of Technology | Quality Assurance Cell</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FA' },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8EF',
  },
  navTitle: { fontSize: 20, fontWeight: '800', color: '#1A237E', letterSpacing: 0.5 },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  dateTime: { fontSize: 13, color: '#546E7A', fontWeight: '500' },
  logo: { width: 120, height: 50 },
  
  content: { flex: 1, paddingHorizontal: 100, paddingTop: 60, alignItems: 'center' },
  welcomeHeading: { fontSize: 34, fontWeight: '700', color: '#101828', marginBottom: 10 },
  subHeading: { fontSize: 16, color: '#667085', marginBottom: 50, textAlign: 'center' },
  
  cardRow: { flexDirection: 'row', gap: 25, marginBottom: 60 },
  card: {
    backgroundColor: '#FFFFFF',
    width: 240,
    height: 180,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F2F4F7',
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  badge: {
    backgroundColor: '#EFF8FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
    marginBottom: 15,
  },
  badgeText: { color: '#175CD3', fontSize: 12, fontWeight: '600' },
  cardTitle: { fontSize: 24, fontWeight: '800', color: '#1D2939' },

  statsSection: { width: '100%', maxWidth: 800, alignSelf: 'center' },
  statsTitle: { fontSize: 18, fontWeight: '700', color: '#101828', marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 40 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statIcon: { fontSize: 18 },
  statText: { fontSize: 14, color: '#475467' },
  boldBlue: { fontWeight: '700', color: '#175CD3' },

  footer: { paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#F2F4F7', alignItems: 'center' },
  footerText: { fontSize: 12, color: '#98A2B3' }
});

export default SelectionScreen;