import { Box, Button, Flex, Grid, GridItem, Card, CardBody, CardHeader, CardFooter, Heading, Text, Spinner } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useState } from "react"; // Menghapus impor yang tidak digunakan
import { useRouter } from "next/router";
import { useMutation } from "@/hooks/useMutation";
import AddModal from "./AddModal";
import EditModal from "./EditModal";

const LayoutComponent = dynamic(() => import("@/layout"))

export default function Notes({ initialNotes }) {
  const { mutate } = useMutation();
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to control the edit modal visibility
  const [editingNote, setEditingNote] = useState(null);

  const handleAddButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditButtonClick = (item) => {
    setEditingNote(item);
    console.log("item yang dikirim => ", item)
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false); // Close the edit modal
  };

  const HandleDelete = async (id, title, description) => {
    try {
      const isConfirmed = window.confirm(`Apakah Anda yakin ingin menghapus catatan "${title}" dengan deskripsi "${description}"?`);
      if (isConfirmed) {
        const result = await mutate({ url: `/api/notes/delete/${id}`, payload: notes });
        if (result?.success) {

          // setNotes(result);
        }
      }
    } catch (error) { }
  };

  const handleAddNoteSuccess = async (newNote) => {
    try {
      // Panggil API untuk mengambil data terbaru
      const res = await mutate({ url: `/api/notes`, payload: notes });
      // const updatedNotes = await res.json();
      setNotes(res); // Perbarui state notes dengan data terbaru
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleEditNoteSuccess = async () => {
    try {
      const res = await fetch("https://paace-f178cafcae7b.nevacloud.io/api/notes");
      const updatedNotes = await res.json();
      setNotes(updatedNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  return (
    <>
      <LayoutComponent metaTitle="Notes" metaDescription="Semua informasi catatan" >
        <Box padding='5'>
          <Flex justifyContent='end'>
            <Button colorScheme="blue" onClick={handleAddButtonClick}>Add Note</Button>
            <AddModal isOpen={isModalOpen} onClose={handleCloseModal} onAddNoteSuccess={handleAddNoteSuccess} />
          </Flex>
          <Flex>
            <Grid templateColumns='repeat(3, 1fr)' gap={5}>
              {notes && notes.data.map((item) => ( // Pastikan Anda menggunakan properti notes yang diteruskan dari props
                <GridItem key={item.id}>
                  <Card>
                    <CardHeader>
                      <Heading>{item.title}</Heading>
                    </CardHeader>
                    <CardBody>
                      <Text>{item.description}</Text>
                    </CardBody>
                    <CardFooter
                      justify='space-between'
                      flexWrap='wrap'
                    >
                      {/* jika ingin mengunakan pindah halaman atau route */}
                      {/* <Button onClick={() => router.push(`/notes/edit/${item.id}`)} flex='1' colorScheme='orange'> */}
                      <Button onClick={() => handleEditButtonClick(item)} flex='1' colorScheme='orange'>
                        Edit
                      </Button>
                      <EditModal
                        isOpen={isEditModalOpen}
                        onClose={handleCloseEditModal}
                        editingNote={editingNote}
                        onEditNoteSuccess={handleEditNoteSuccess}
                      />
                      <Button onClick={() => HandleDelete(item.id, item.title, item.description)} flex='1' colorScheme='red' >
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                </GridItem>
              ))}
            </Grid>
          </Flex>
        </Box>
      </LayoutComponent>
    </>
  )
}

// Dengan menggunakan getServerSideProps, Anda tidak perlu menambahkan props di komponen Notes
export async function getServerSideProps() {
  try {
    const res = await fetch("https://paace-f178cafcae7b.nevacloud.io/api/notes");
    const initialNotes = await res.json();
    // console.log("ini notes array => ", notes)
    return { props: { initialNotes } };
  } catch (error) {
    console.error("Error fetching notes:", error);
    return { props: { initialNotes: [] } }; // Mengembalikan array kosong jika terjadi kesalahan saat mengambil data
  }
}
