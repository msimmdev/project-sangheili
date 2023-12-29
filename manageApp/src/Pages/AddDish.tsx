import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  SimpleGrid,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useToast,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "react-oidc-context";
import { Dish } from "@msimmdev/project-sangheili-types";
import ImageUploadControl, {
  ImageUploadData,
  uploadImage,
} from "../Shared/ImageUploadControl";
import { Link, useNavigate } from "react-router-dom";

const api_url = import.meta.env.VITE_CRUD_API_URL;

type FormData = Dish & { mainImageFile: ImageUploadData };

export default () => {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const navigate = useNavigate();
  const toast = useToast();

  const { user } = useAuth();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (typeof user !== "undefined" && user !== null) {
      const uploadData = await uploadImage(data.mainImageFile, user);

      const dishData: Dish = {
        name: data.name,
        description: data.description,
        mainImage: uploadData,
      };

      const addResponse = await fetch(`${api_url}/dish`, {
        method: "POST",
        body: JSON.stringify(dishData),
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!addResponse.ok) {
        console.error(addResponse);
        throw new Error(`Invalid add dish response: ${addResponse.status}}`);
      }

      const addedData = await addResponse.json();

      toast({
        title: "Dish Created",
        description: `Your dish ${addedData["name"]} has been created.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      return navigate(`/dish/${addedData["id"]}`);
    }
  };

  return (
    <>
      <Breadcrumb padding="0.375rem">
        <BreadcrumbItem color="almond.600">
          <BreadcrumbLink as={Link} to="/dishes">
            Browse Dishes
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage color="copper.600" fontWeight="bold">
          <BreadcrumbLink>Add New Dish</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
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
              <FormControl
                isInvalid={typeof errors.description !== "undefined"}
              >
                <FormLabel htmlFor="name">Dish Description</FormLabel>
                <Textarea
                  id="description"
                  placeholder="Enter a description for the dish"
                  rows={5}
                  {...register("description", { required: true })}
                />
              </FormControl>
            </Box>
            <ImageUploadControl
              registerProps={register("mainImageFile")}
              error={errors.mainImageFile?.imageFile}
              setError={(e) => setError("mainImageFile.imageFile", e)}
              setValue={(v) => setValue("mainImageFile", v)}
              minImageWidth={1200}
              minImageHeight={800}
              aspect={1.5}
            />
          </SimpleGrid>
          <Button type="submit" variant="solid" colorScheme="almond">
            Add Dish
          </Button>
        </form>
      </Box>
    </>
  );
};
