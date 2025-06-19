import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Select,
  Switch,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Restaurant } from "./RestaurantTable";

interface AddRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (restaurant: Omit<Restaurant, "id">) => void;
  onEdit?: (restaurant: Omit<Restaurant, "id">) => void;
  mode?: "add" | "edit";
  initialValues?: Omit<Restaurant, "id">;
}

export default function AddRestaurantModal({
  isOpen,
  onClose,
  onAdd,
  onEdit,
  mode = "add",
  initialValues,
}: AddRestaurantModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    priceRange: "$",
    isHalal: false,
    googleUrl: "",
  });

  useEffect(() => {
    if (isOpen && initialValues) {
      setFormData({
        name: initialValues.name,
        cuisine: initialValues.cuisine,
        priceRange: initialValues.priceRange,
        isHalal: initialValues.isHalal,
        googleUrl: initialValues.googleUrl || "",
      });
    } else if (isOpen && mode === "add") {
      setFormData({
        name: "",
        cuisine: "",
        priceRange: "$",
        isHalal: false,
        googleUrl: "",
      });
    }
  }, [isOpen, initialValues, mode]);

  const handleSubmit = () => {
    if (formData.name && formData.cuisine) {
      const submitData = {
        ...formData,
        googleUrl: formData.googleUrl || undefined, // Only include if not empty
      };

      if (mode === "edit" && onEdit) {
        onEdit(submitData);
      } else if (mode === "add" && onAdd) {
        onAdd(submitData);
      }
      setFormData({
        name: "",
        cuisine: "",
        priceRange: "$",
        isHalal: false,
        googleUrl: "",
      });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {mode === "edit" ? "Edit Restaurant" : "Add Restaurant"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Restaurant Name</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter restaurant name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Cuisine</FormLabel>
              <Input
                value={formData.cuisine}
                onChange={(e) =>
                  setFormData({ ...formData, cuisine: e.target.value })
                }
                placeholder="Enter cuisine type"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Price Range</FormLabel>
              <Select
                value={formData.priceRange}
                onChange={(e) =>
                  setFormData({ ...formData, priceRange: e.target.value })
                }
              >
                <option value="$">$ (Budget)</option>
                <option value="$$">$$ (Moderate)</option>
                <option value="$$$">$$$ (Expensive)</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Google Maps URL</FormLabel>
              <Input
                value={formData.googleUrl}
                onChange={(e) =>
                  setFormData({ ...formData, googleUrl: e.target.value })
                }
                placeholder="Enter Google Maps URL (optional)"
              />
              <FormHelperText>
                Optional: Add a link to the restaurant on Google Maps
              </FormHelperText>
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Halal Certified</FormLabel>
              <Switch
                isChecked={formData.isHalal}
                onChange={(e) =>
                  setFormData({ ...formData, isHalal: e.target.checked })
                }
                colorScheme="green"
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="orange" onClick={handleSubmit}>
            {mode === "edit" ? "Update" : "Create"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
