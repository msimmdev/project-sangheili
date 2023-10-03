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
import { useAuth } from "react-oidc-context";
import { Dish, ImageUpload } from "@msimmdev/project-sangheili-types";
import ImageUploadControl, {
  ImageUploadData,
} from "../Shared/ImageUploadControl";
import { User } from "oidc-client-ts";
import { BlockBlobClient } from "@azure/storage-blob";
import { redirect } from "react-router-dom";

const api_url = "http://localhost:3100";

type FormData = Dish & { mainImageFile: ImageUploadData };

async function uploadImage(
  fileData: ImageUploadData,
  user: User
): Promise<ImageUpload> {
  const sessionResponse = await fetch(`${api_url}/upload-session`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${user.access_token}`,
    },
  });

  if (!sessionResponse.ok) {
    console.log(sessionResponse);
    throw new Error(`Invalid file upload response: ${sessionResponse.status}}`);
  }
  const result = await sessionResponse.json();

  const blobClient = new BlockBlobClient(result["uploadUrl"]);
  await blobClient.uploadData(fileData.imageFile, {
    blobHTTPHeaders: {
      blobContentType: fileData.imageFile.type,
    },
    onProgress: (ev) => {
      console.log(`Uploaded ${ev.loadedBytes} of ${fileData.imageFile.size}`);
    },
  });

  return {
    uploadKey: result["uploadKey"],
    crop: fileData.cropArea,
  };
}

export default () => {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

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
        console.log(addResponse);
        throw new Error(`Invalid add dish response: ${addResponse.status}}`);
      }

      redirect("/");
    }
    console.log(data);
  };

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
          <ImageUploadControl
            registerProps={register("mainImageFile")}
            error={errors.mainImageFile?.imageURL}
            setError={(e) => setError("mainImageFile", e)}
            setValue={(v) => setValue("mainImageFile", v)}
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
