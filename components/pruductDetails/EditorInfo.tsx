import { Text, StyleSheet } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { Warehouseman } from '~/types';

type EditorInfoProps = {
  editor: Warehouseman;
  editDate: string;
};

export function EditorInfo({ editor, editDate }: EditorInfoProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Animated.View entering={FadeInLeft.delay(500)} style={styles.editorInfo}>
      <Text style={styles.editorTitle}>Last Edited by:</Text>
      <Text style={styles.editorName}>{editor.name}</Text>
      <Text style={styles.editorDate}>{formatDate(editDate)}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  editorInfo: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  editorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  editorName: {
    fontSize: 15,
    marginTop: 5,
    color: '#3A3A3C',
  },
  editorDate: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
});
