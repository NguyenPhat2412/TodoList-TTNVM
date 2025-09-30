import CustomText from 'components/CustomText';
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

export default function PrivacyPolicyScreen() {
  return (
    <CustomText>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Privacy Policy — TodoList</Text>
          <Text style={styles.meta}>Last updated: September 21, 2025</Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>TodoList</Text> is committed to protecting your privacy. This
            policy explains what data we collect, how it is used, how it is stored, and the rights
            you have regarding your personal data.
          </Text>

          <Text style={styles.heading}>1. Data We Collect</Text>
          <Text style={styles.listItem}>• Account information: email, username.</Text>
          <Text style={styles.listItem}>
            • Task data: title, description, category, priority, status, startDate, dueDate, index.
          </Text>
          <Text style={styles.listItem}>• System logs for debugging (no passwords stored).</Text>

          <Text style={styles.heading}>2. Purpose of Collection</Text>
          <Text style={styles.paragraph}>
            We use your data to provide core task management features, synchronize across devices,
            send reminders, and secure accounts using JWT/OAuth.
          </Text>

          <Text style={styles.heading}>3. Sharing & Security</Text>
          <Text style={styles.paragraph}>
            We <Text style={styles.bold}>do not sell</Text> your data. Information may be shared
            only with trusted infrastructure providers or when legally required. All communication
            uses HTTPS and passwords are hashed.
          </Text>

          <Text style={styles.heading}>4. User Rights</Text>
          <Text style={styles.paragraph}>
            You may request access, correction, or deletion of your data at any time.
          </Text>

          <Text style={styles.heading}>5. Development Team</Text>
          <View style={styles.teamBox}>
            <Text style={styles.teamTitle}>TodoList — Group 6</Text>
            <Text style={styles.teamItem}>• Nguyễn Thị Thanh Nhàn — Leader — ID: 23110207</Text>
            <Text style={styles.teamItem}>• Nguyễn Xuân Phát — Member — ID: 23110209</Text>
            <Text style={styles.teamItem}>• Hà Lê Ngọc Thắng — Member — ID: 23110220</Text>
          </View>

          <Text style={styles.paragraph}>
            Contact email: <Text style={styles.code}>group6-todolist@gmail.com</Text>
          </Text>
        </View>
      </ScrollView>
    </CustomText>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f7',
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#2a003f', marginBottom: 6 },
  meta: { color: '#666', marginBottom: 14 },
  heading: { fontSize: 18, fontWeight: '700', marginTop: 16, marginBottom: 6, color: '#4b0082' },
  paragraph: { marginTop: 4, color: '#222', lineHeight: 20 },
  listItem: { marginLeft: 12, marginTop: 4, color: '#333' },
  bold: { fontWeight: '700' },
  code: { fontFamily: 'monospace', backgroundColor: '#f1f1f1', paddingHorizontal: 4 },
  teamBox: { marginTop: 10, padding: 12, backgroundColor: '#faf6ff', borderRadius: 8 },
  teamTitle: { fontWeight: '700', marginBottom: 6, color: '#4b0082' },
  teamItem: { marginTop: 4, color: '#222' },
});
