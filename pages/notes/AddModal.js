import React, { useState } from 'react';
import dynamic from "next/dynamic";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea
} from "@chakra-ui/react";
import { useMutation } from "@/hooks/useMutation";
const LayoutComponent = dynamic(() => import("@/layout"))

const AddModal = ({ isOpen, onClose, onAddNoteSuccess }) => {
  const [notes, setNotes] = useState(
    {
      title: "",
      description: "",
    }
  );

  const { mutate } = useMutation();

  const handleSave = async () => {
    try {
      const response = await mutate({ url: '/api/notes/add', payload: notes });
      if (response?.success) {
        onAddNoteSuccess();
        // onSuccess(notes);
        // router.push("/notes")
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Judul</FormLabel>
            <Input type='text' onChange={(event) => setNotes({ ...notes, title: event.target.value })} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Deskripsi</FormLabel>
            <Textarea onChange={(event) => setNotes({ ...notes, description: event.target.value })} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddModal;