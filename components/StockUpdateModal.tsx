
import { useState } from "react"
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"

interface StockUpdateModalProps {
  visible: boolean
  onClose: () => void
  onUpdate: (quantity: number) => void
  onRemove: (quantity: number) => void
  currentQuantity: number
}

export default function StockUpdateModal({
  visible,
  onClose,
  onUpdate,
  onRemove,
  currentQuantity,
}: StockUpdateModalProps) {
  const [quantity, setQuantity] = useState(currentQuantity.toString())

  const handleUpdate = () => {
    const newQuantity = Number.parseInt(quantity)
    if (!isNaN(newQuantity)) {
      onUpdate(newQuantity)
    }
  }

  const handleRemove = () => {
    const removeQuantity = Number.parseInt(quantity)
    if (!isNaN(removeQuantity) && removeQuantity <= currentQuantity) {
      onRemove(removeQuantity)
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Update Stock</Text>
          <Text style={styles.currentQuantity}>Current Quantity: {currentQuantity}</Text>
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.updateButton]} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.removeButton]} onPress={handleRemove}>
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  currentQuantity: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: "30%",
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
  },
  updateButton: {
    backgroundColor: "#4CD964",
  },
  removeButton: {
    backgroundColor: "#FF9500",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
})

