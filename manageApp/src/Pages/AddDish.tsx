import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  SimpleGrid,
  AspectRatio,
  Flex,
  Center,
  Image,
  Text,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Dish } from "@msimmdev/project-sangheili-types";
import { useDropzone } from "react-dropzone";
import { useState } from "react";

export default () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Dish>();

  const [activeImage, setActiveImage] = useState<string>();

  const reader = new FileReader();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      reader.readAsDataURL(acceptedFiles[0]);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setActiveImage(reader.result);
        }
      };
    },
    multiple: false,
    accept: { "image/*": [".png", ".gif", ".jpeg", ".jpg"] },
  });

  const onSubmit: SubmitHandler<Dish> = (data) => console.log(data);

  const uploadDisplay = (
    <Flex flexDirection="column" padding="10px">
      <Center>
        <span className="material-symbols-outlined icon-lg">
          add_photo_alternate
        </span>
      </Center>
      {isDragActive ? (
        <Text textAlign="center">Drop the image here ...</Text>
      ) : (
        <Text textAlign="center">
          Drag 'n' drop an image here, or click to browse.
        </Text>
      )}
    </Flex>
  );

  return (
    <Box className="full-page-content">
      <Heading>Add a New Dish</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={{ sm: 1, md: 2 }}>
          <Box>
            <FormControl isInvalid={typeof errors.name !== "undefined"}>
              <FormLabel htmlFor="name">Dish Name</FormLabel>
              <Input
                id="name"
                placeholder="name"
                {...register("name", { required: true })}
              />
            </FormControl>
            <FormControl isInvalid={typeof errors.description !== "undefined"}>
              <FormLabel htmlFor="name">Dish Description</FormLabel>
              <Textarea
                id="description"
                placeholder="description"
                {...register("description", { required: true })}
              />
            </FormControl>
          </Box>
          <AspectRatio ratio={1.5} margin="10px">
            <FormControl
              isInvalid={typeof errors.mainImage?.url !== "undefined"}
              {...getRootProps({ className: "dropzone" })}
            >
              <input
                {...getInputProps({ refKey: "ref" })}
                {...register("mainImage.url")}
              />
              {activeImage === undefined ? (
                uploadDisplay
              ) : (
                <Image src={activeImage} />
              )}
            </FormControl>
          </AspectRatio>
        </SimpleGrid>
        <Button type="submit">Add Dish</Button>
      </form>
    </Box>
  );
};
