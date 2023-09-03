import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Dish } from "@msimmdev/project-sangheili-types";
import { useDropzone } from "react-dropzone";

export default () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Dish>();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => console.log(acceptedFiles),
  });

  const onSubmit: SubmitHandler<Dish> = (data) => console.log(data);

  return (
    <Box className="full-page-content">
      <Heading>Add a New Dish</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <FormControl isInvalid={typeof errors.mainImage?.url !== "undefined"}>
          <div {...getRootProps({ className: "dropzone" })}>
            <input
              {...getInputProps({ refKey: "ref" })}
              {...register("mainImage.url", { required: true })}
            />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
          </div>
        </FormControl>
        <Button type="submit">Add Dish</Button>
      </form>
    </Box>
  );
};
