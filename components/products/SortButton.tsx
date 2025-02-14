import { TouchableOpacity, Text, StyleSheet } from "react-native"

interface SortButtonProps {
  title: string
  onPress: () => void
  active: boolean
}

export default function SortButton({ title, onPress, active }: SortButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, active && styles.activeButton]} onPress={onPress}>
      <Text style={[styles.text, active && styles.activeText]}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  activeButton: {
    backgroundColor: "#007AFF",
  },
  text: {
    color: "#007AFF",
  },
  activeText: {
    color: "white",
  },
})

