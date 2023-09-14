import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  SimpleGrid,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Dish } from "@msimmdev/project-sangheili-types";
import ImageUpload from "../Shared/ImageUpload";

export default () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Dish>();

  const onSubmit: SubmitHandler<Dish> = (data) => console.log(data);

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
                placeholder="Enter a name for the dish"
                {...register("name", { required: true })}
              />
            </FormControl>
            <FormControl isInvalid={typeof errors.description !== "undefined"}>
              <FormLabel htmlFor="name">Dish Description</FormLabel>
              <Textarea
                id="description"
                placeholder="Enter a description for the dish"
                rows={5}
                {...register("description", { required: true })}
              />
            </FormControl>
          </Box>
          <ImageUpload
            registerProps={register("mainImage.url")}
            errors={errors}
            setError={setError}
            minImageWidth={1200}
            minImageHeight={800}
            aspect={1.5}
          />
        </SimpleGrid>
        <Button type="submit" variant="solid">
          Add Dish
        </Button>
      </form>
    </Box>
  );
};
