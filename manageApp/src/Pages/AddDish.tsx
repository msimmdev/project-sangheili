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
import ImageUpload, { ImageUploadData } from "../Shared/ImageUpload";

type FormData = Dish & { mainImageFile: ImageUploadData };

async function uploadImage(fileData: ImageUploadData): Promise<void> {
  const loadedImage = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = fileData.imageURL;
  });
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (ctx === null) {
    return;
  }

  canvas.width = loadedImage.width;
  canvas.height = loadedImage.height;
  ctx.drawImage(loadedImage, 0, 0);

  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    return;
  }

  croppedCanvas.width = fileData.cropArea.width;
  croppedCanvas.height = fileData.cropArea.height;

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    canvas,
    fileData.cropArea.x,
    fileData.cropArea.y,
    fileData.cropArea.width,
    fileData.cropArea.height,
    0,
    0,
    fileData.cropArea.width,
    fileData.cropArea.height
  );

  const buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
    croppedCanvas.toBlob((file) => {
      if (file !== null) {
        file.arrayBuffer().then((buf) => resolve(buf));
      } else {
        reject();
      }
    }, "image/jpeg");
  });

  console.log(buffer);
}

export default () => {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    uploadImage(data.mainImageFile);
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
          <ImageUpload
            registerProps={register("mainImageFile")}
            error={errors.mainImage?.url}
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
