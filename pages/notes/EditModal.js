import { useEffect, useState } from 'react';
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
import { mutate } from 'swr';
import { useQueries } from '@/hooks/useQueries';
import { useMutation } from '@/hooks/useMutation';

const EditModal = ({ isOpen, onClose, editingNote, onEditNoteSuccess }) => {
  const [notes, setNotes] = useState({});

  useEffect(() => {
    setNotes(editingNote);
  }, [editingNote]);

  const { mutate } = useMutation();

  const handleSave = async () => {
    try {
      const response = await mutate({ url: `/api/notes/edit/${notes.id}`, method: "PATCH", payload: notes });
      console.log(" ini response ", response)
      // console.log("editedNote.id => ", editedNote)
      if (response?.success) {
        onEditNoteSuccess();
      }
    } catch (error) {
      console.log("Error Update note => ", error)
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Note</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              type='text'
              value={notes?.title || ''}
              onChange={(event) => setNotes({ ...notes, title: event.target.value })}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={notes?.description || ''}
              onChange={(event) => setNotes({ ...notes, description: event.target.value })}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Update
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
