import { 
  View, Text, StyleSheet, Image, Pressable, Modal, 
  ActivityIndicator, Alert
} from 'react-native';
import { useContext, useLayoutEffect } from 'react';
import { ExpensesContext } from '../../store/expenses-context';
import { GlobalStyles } from '../../constants/styles';
import IconButton from '../../components/ui/IconButton';
import {useState} from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

function ExpenseDetails({ route, navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const expenseCtx = useContext(ExpensesContext);
  const expenseId = route.params.expenseId;
  const selectedExpense = expenseCtx.expenses.find(exp => exp.id === expenseId);
  
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Expense Details',
      headerRight: ({ tintColor }) => (
        <IconButton
          icon="create"
          size={24}
          color={tintColor}
          onPress={() => navigation.navigate('ManageExpense', { expenseId: expenseId })}
        />
      ),
    });
  }, [navigation, expenseId]);

    if (!selectedExpense) {
      return null;
    }

const isPdf = typeof selectedExpense.attachment === 'string' && 
              (selectedExpense.attachment.includes('application/pdf') || 
               selectedExpense.attachment.toLowerCase().endsWith('.pdf'));

const isDocx = typeof selectedExpense.attachment === 'string' && 
               (selectedExpense.attachment.includes('wordprocessingml') || // Standard .docx MIME
                selectedExpense.attachment.toLowerCase().endsWith('.docx') ||
                selectedExpense.attachment.toLowerCase().endsWith('.doc'));
 const images = selectedExpense.attachment && !isPdf ? [{
  url: selectedExpense.attachment,
  props: { key: selectedExpense.id ? selectedExpense.id.toString() : 'temp-key' } 
 }] : [];

const [isLoading, setIsLoading] = useState(false);

  async function openAttachmentHandler() {
    if (isLoading) return; 
    
    console.log("Attachment clicked!");
    setIsLoading(true);

    if (isPdf || isDocx) {
      try {
        const isAvailable = await Sharing.isAvailableAsync();
        if (!isAvailable) {
          Alert.alert("Error", "Sharing is not available on this device");
          setIsLoading(false);
          return;
        }

        const extension = isPdf ? '.pdf' : '.docx';
        const tempPath = FileSystem.cacheDirectory + `receipt_temp${extension}`;

        const attachment = selectedExpense.attachment;

        if (attachment.startsWith('data:')) {
          const base64Data = attachment.split('base64,')[1];
          await FileSystem.writeAsStringAsync(tempPath, base64Data, {
            encoding: FileSystem.EncodingType.Base64,
          });
        } 
        else if (attachment.startsWith('file://') || attachment.startsWith('content://')) {
          await FileSystem.copyAsync({
            from: attachment,
            to: tempPath,
          });
        } 
        else if (attachment.startsWith('http')) {
          await FileSystem.downloadAsync(attachment, tempPath);
        }

        await Sharing.shareAsync(tempPath);
        
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Could not open document. The file might be corrupted or missing.");
      }
    } else {
      setIsModalVisible(true);
    }
    
    setIsLoading(false);
  }

return (
  <View style={styles.container}>
   {!isPdf && selectedExpense.attachment && (
    <Modal visible={isModalVisible} transparent={true} onRequestClose={() => setIsModalVisible(false)}>
     <ImageViewer 
      imageUrls={images}
      onCancel={() => setIsModalVisible(false)}
      enableSwipeDown={true}
      renderHeader={() => (
       <Pressable style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
        <Text style={styles.closeText}>Close Preview</Text>
       </Pressable>
      )}
     />
    </Modal>
   )}

   <View style={styles.card}>
    <Text style={styles.label}>Description</Text>
    <Text style={styles.value}>{selectedExpense.description}</Text>
    
    <Text style={styles.label}>Amount</Text>
    <Text style={styles.amount}>RM {selectedExpense.amount.toFixed(2)}</Text>
    
    <Text style={styles.label}>Date</Text>
    <Text style={styles.value}>
     {selectedExpense.date instanceof Date 
      ? selectedExpense.date.toISOString().slice(0, 10) 
      : selectedExpense.date}
    </Text>

    <Text style={styles.label}>Receipt (Tap to view)</Text>
      <View style={styles.previewContainer}>
    {selectedExpense.attachment ? (
      <Pressable 
        onPress={openAttachmentHandler} 
        style={({pressed}) => [
          (pressed || isLoading) && styles.pressed,
          isLoading && { opacity: 0.5 }
        ]}
        disabled={isLoading}
      >
        {isPdf || isDocx ? (
          <View style={{ alignItems: 'center', padding: 10 }}>
            {isLoading ? (
              <ActivityIndicator size="large" color={GlobalStyles.colors.primary500} style={{ margin: 15 }} />
            ) : (
              <Ionicons 
                name={isPdf ? "document-text" : "file-tray-full"} 
                size={64} 
                color={GlobalStyles.colors.primary500} 
              />
            )}
            <Text style={{color: GlobalStyles.colors.primary500, fontWeight: 'bold'}}>
              {isLoading ? 'Preparing Document...' : (isPdf ? 'View PDF Receipt' : 'View Word Document')}
            </Text>
          </View>
        ) : (
          <Image 
            source={{ uri: selectedExpense.attachment }} 
            style={styles.previewImage}
          />
        )}
      </Pressable>
    ) : (
      <View style={styles.noImageContainer}>
        <Text style={styles.placeholderText}>No attachment available</Text>
      </View>
    )}
  </View>
  </View>
  </View>
);
}


export default ExpenseDetails;


const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24, 
    backgroundColor: GlobalStyles.colors.primary50 
  },
  card: { 
    backgroundColor: 'white', 
    padding: 20, 
    borderRadius: 10, 
    elevation: 3,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: { 
    fontSize: 12, 
    color: GlobalStyles.colors.primary500, 
    marginTop: 16,
    textTransform: 'uppercase',
    fontWeight: 'bold'
  },
  value: { 
    fontSize: 18, 
    color: GlobalStyles.colors.primary800 
  },
  amount: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: GlobalStyles.colors.primary800 
  },
  filePlaceholder: { 
    marginTop: 8, 
    padding: 20, 
    backgroundColor: GlobalStyles.colors.primary100, 
    borderRadius: 5, 
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: GlobalStyles.colors.primary500
  },
  placeholderText: {
    color: GlobalStyles.colors.primary500
  },
  previewContainer: {
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: GlobalStyles.colors.primary100,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.primary200,
    alignItems: 'center',
    padding: 10, 
  },
imageWrapper: {
  alignItems: 'center',
},
closeButton: {
  position: 'absolute',
  top: 50,
  right: 20,
  padding: 10,
  backgroundColor: GlobalStyles.colors.primary500,
  borderRadius: 5,
  zIndex: 999,
},
previewImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
pathText: {
  fontSize: 10,
  color: GlobalStyles.colors.primary500,
  padding: 5,
},
noImageContainer: {
  padding: 40,
  alignItems: 'center',
},
modalContainer: {
  flex: 1,
  backgroundColor: 'black',
},
scrollWrapper: {
  flexGrow: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
fullImage: {
  width: '100%',
  height: '100%',
},
closeButton: {
  position: 'absolute',
  top: 50,
  right: 20,
  padding: 10,
  backgroundColor: GlobalStyles.colors.primary500,
  borderRadius: 5,
  zIndex: 100,
},
closeText: {
  color: 'white',
  fontWeight: 'bold',
},
pressed: {
  opacity: 0.7,
},

});