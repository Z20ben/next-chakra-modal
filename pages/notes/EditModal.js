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

const EditModal = ({ isOpen, onClose, editingNote, onEditNoteSuccess }) => {
  const [editedNote, setEditedNote] = useState({});
  // const { data: editedNote } = useQueries({ prefixUrl: `/api/notes/${editingNote.id}` });


  useEffect(() => {
    setEditedNote(editingNote);
  }, [editingNote]);

  // const { data: listNotesQueries } = useQueries({ prefixUrl: editedNote.id ? `/api/notes/${editedNote.id}` : `` }, {
  //   onSuccess: (result) => {
  //     if (result) {
  //       setNotes(result?.data)
  //     }
  //   }
  // })

  const handleSave = async () => {
    // try {
    const response = await mutate({ url: `/api/notes/edit/${editedNote.id}`, method: "PATCH", payload: editedNote });
    console.log(" ini response ", response)
    // console.log("editedNote.id => ", editedNote)
    if (response?.success) {
      onEditNoteSuccess();
    }
    // else {
    // }
    // } catch (error) {
    //   console.log("error yang sdg terjadi => ", error)
    // }
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
              value={editedNote?.title}
              onChange={(event) => setEditedNote({ ...editedNote, title: event.target.value })}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={editedNote?.description}
              onChange={(event) => setEditedNote({ ...editedNote, description: event.target.value })}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
