import { Box, Button, Flex, Grid, GridItem, Card, Heading, Text, Textarea, Input } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@/hooks/useMutation";

const LayoutComponent = dynamic(() => import("@/layout"))
export default function AddNotes({ }) {
  const { mutate } = useMutation();
  const router = useRouter();
  const [notes, setNotes] = useState(
    {
      title: "",
      description: "",
    }
  );

  const handleSubmit = async () => {
    try {
      const response = await mutate({ url: '/api/notes/add', payload: notes });
      if (response?.success) {
        router.push("/notes")
      }
    } catch (error) {

    }
  }

  return (
    <>
      <LayoutComponent metaTitle="Notes" metaDescription="Semua informasi catatan" >
        <Card margin='5' padding='5'>
          <Heading>Add Notes</Heading>
          <Grid gap='5'>
            <GridItem>
              <Text>Title</Text>
              <Input type="text" onChange={(event) => setNotes({ ...notes, title: event.target.value })}></Input>
            </GridItem>
            <GridItem>
              <Text >Description</Text>
              <Textarea onChange={(event) => setNotes({ ...notes, description: event.target.value })} />
            </GridItem>
            <GridItem>
              <Button flex='1' colorScheme='blue' onClick={() => handleSubmit()}>
                Submit
              </Button>
            </GridItem>
          </Grid>
        </Card>
      </LayoutComponent>

    </>
  )
}

// export async function getStaticProps() {
//   const res = await fetch('https://paace-f178cafcae7b.nevacloud.io/api/notes')
//   const notes = await res.json()
//   return { props: { notes }, revalidate: 10 }
// }