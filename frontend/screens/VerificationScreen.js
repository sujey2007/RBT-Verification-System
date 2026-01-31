import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';

// The base URL now points to your live Render server
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://rbt-verification-system.onrender.com";

const VerificationScreen = ({ type, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const today = new Date().toLocaleString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true 
  }) + " IST";

  const pickDocument = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleVerify = async () => {
    if (!selectedFile) {
      alert("Please upload a question paper first!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('ia_type', type);

    try {
      // Updated to use the live Render URL
      const response = await axios.post(`${API_BASE_URL}/verify`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
    } catch (error) {
      // Detailed error message to help with debugging
      console.error("Verification Error:", error);
      alert("Verification Failed: Backend is unreachable. Please check Render logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleAIFix = async (index, originalText, currentLevel) => {
    const targetLevel = currentLevel === 'L1' ? 'L2' : 'L3';
    try {
      // Updated to use the live Render URL
      const res = await axios.post(`${API_BASE_URL}/fix-questions`, {
        text: originalText,
        current_level: currentLevel,
        target_level: targetLevel
      });
      
      const updatedData = [...result.data];
      updatedData[index].text = res.data.corrected_text;
      updatedData[index].level = targetLevel;
      updatedData[index].needsFix = false; 

      const stillHasErrors = updatedData.some(q => q.needsFix === true);
      
      setResult({
        ...result, 
        data: updatedData,
        status: stillHasErrors ? 'Rejected' : 'Accepted',
        errors: stillHasErrors ? result.errors : []
      });
    } catch (e) {
      alert("AI Fix failed.");
    }
  };

  return (
    <View style={styles.container}>
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} accept=".html" />

      <View style={styles.navbar}>
        <Text style={styles.navTitle}>RBT VERIFICATION SYSTEM</Text>
        <View style={styles.navRight}>
          <Text style={styles.dateTime}>{today}</Text>
          <Image 
            source={{ uri: 'https://dial4college.blr1.cdn.digitaloceanspaces.com/pro/1199/logo/1703922672.jpeg' }} 
            style={styles.logo} resizeMode="contain"
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageHeader}>{type} - ASSESSMENT VERIFICATION</Text>
        
        <TouchableOpacity style={styles.uploadArea} onPress={pickDocument}>
          <Text style={styles.uploadText}>
            {selectedFile ? `📄 ${selectedFile.name}` : "CLICK TO UPLOAD QUESTION PAPER"}
          </Text>
        </TouchableOpacity>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleVerify} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>VERIFY NOW</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={onBack}>
            <Text style={styles.btnText}>BACK</Text>
          </TouchableOpacity>
        </View>

        {result && (
          <View style={[styles.resultCard, { borderColor: result.status === 'Accepted' ? '#10B981' : '#EF4444' }]}>
            <Text style={[styles.statusHeader, { color: result.status === 'Accepted' ? '#059669' : '#DC2626' }]}>
              STATUS: {String(result.status).toUpperCase()}
            </Text>

            {result.errors && result.errors.length > 0 && result.status === 'Rejected' && (
              <View style={styles.errorContainer}>
                {result.errors.map((err, i) => (
                  <Text key={i} style={styles.errorText}>• {String(err)}</Text>
                ))}
              </View>
            )}
            
            <View style={styles.table}>
              {result.data && result.data.map((q, idx) => (
                <View key={idx} style={[styles.tableRow, q.needsFix ? styles.errorRow : null]}>
                  <Text style={{ flex: 0.5, color: '#475467' }}>{String(q.id)}</Text>
                  <Text style={{ flex: 3.5, color: '#101828' }}>{String(q.text)}</Text>
                  <Text style={{ flex: 1, fontWeight: 'bold', color: '#1A237E' }}>{String(q.level)}</Text>
                  
                  <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
                    {q.needsFix ? (
                      <TouchableOpacity style={styles.aiBtn} onPress={() => handleAIFix(idx, q.text, q.level)}>
                        <Text style={styles.aiBtnText}>✨ Fix with AI</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>✓ Correct</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  navbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 40, paddingVertical: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EAECF0' },
  navTitle: { fontSize: 20, fontWeight: '800', color: '#1A237E' },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  dateTime: { fontSize: 13, color: '#667085' },
  logo: { width: 120, height: 45 },
  content: { padding: 40, alignItems: 'center' },
  pageHeader: { fontSize: 26, fontWeight: '700', color: '#101828', marginBottom: 20 },
  uploadArea: { width: '100%', maxWidth: 700, height: 120, borderStyle: 'dashed', borderWidth: 2, borderColor: '#3B82F6', borderRadius: 16, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EFF6FF', marginBottom: 30 },
  uploadText: { color: '#2563EB', fontWeight: '600' },
  buttonRow: { flexDirection: 'row', gap: 15, marginBottom: 40 },
  primaryBtn: { backgroundColor: '#1E3A8A', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 10 },
  secondaryBtn: { backgroundColor: '#64748B', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 10 },
  btnText: { color: '#fff', fontWeight: '700' },
  resultCard: { width: '100%', maxWidth: 1000, backgroundColor: '#fff', borderRadius: 20, padding: 30, borderWidth: 1.5 },
  statusHeader: { fontSize: 22, fontWeight: '900', marginBottom: 15 },
  errorContainer: { backgroundColor: '#FFFBFA', padding: 15, borderRadius: 10, marginBottom: 20, borderWidth: 1, borderColor: '#FDA29B' },
  errorText: { color: '#B42318', fontSize: 13, fontWeight: '600' },
  table: { width: '100%' },
  tableRow: { flexDirection: 'row', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F2F4F7', alignItems: 'center' },
  errorRow: { backgroundColor: '#FFFBFA' },
  aiBtn: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1E9FF', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  aiBtnText: { color: '#1570EF', fontSize: 13, fontWeight: '700' },
  verifiedBadge: { backgroundColor: '#ECFDF3', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  verifiedText: { color: '#027A48', fontSize: 13, fontWeight: '700' }
});

export default VerificationScreen;