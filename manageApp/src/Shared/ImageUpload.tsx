import { useState } from "react";
import {
  Flex,
  Center,
  Text,
  FormControl,
  AspectRatio,
  Alert,
} from "@chakra-ui/react";
import Cropper from "react-easy-crop";
import { useDropzone } from "react-dropzone";
import {
  UseFormRegisterReturn,
  UseFormSetError,
  FieldErrors,
} from "react-hook-form";
import { Dish } from "@msimmdev/project-sangheili-types";

export default ({
  registerProps,
  errors,
  setError,
  minImageWidth,
  minImageHeight,
  aspect,
}: {
  registerProps: UseFormRegisterReturn;
  errors: FieldErrors<Dish>;
  setError: UseFormSetError<Dish>;
  minImageWidth: number;
  minImageHeight: number;
  aspect: number;
}) => {
  const [activeImage, setActiveImage] = useState<File>();
  const [activeImageUrl, setActiveImageUrl] = useState<string>();

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [maxZoom, setMaxZoom] = useState(3);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        setError("mainImage.url", {
          type: "custom",
          message: rejectedFiles[0].errors[0].message,
        });
      } else {
        setActiveImage(acceptedFiles[0]);
        setActiveImageUrl(URL.createObjectURL(acceptedFiles[0]));
      }
    },
    multiple: false,
    accept: { "image/*": [".png", ".gif", ".jpeg", ".jpg"] },
    disabled: typeof activeImage !== "undefined",
  });

  const errorDisplay = errors.mainImage?.url ? (
    <Alert status="error">{errors.mainImage.url.message}</Alert>
  ) : (
    <></>
  );

  const uploadDisplay = (
    <Flex flexDirection="column" padding="10px">
      {errorDisplay}
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
    <AspectRatio ratio={1.5} margin="10px">
      <FormControl
        isInvalid={typeof errors.mainImage?.url !== "undefined"}
        {...getRootProps({ className: "dropzone" })}
      >
        <input {...getInputProps({ refKey: "ref" })} {...registerProps} />
        {activeImageUrl === undefined ? (
          uploadDisplay
        ) : (
          <Cropper
            image={activeImageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            maxZoom={maxZoom}
            onMediaLoaded={(size) => {
              console.log(size);
              if (
                size.naturalWidth < minImageWidth ||
                size.naturalHeight < minImageHeight
              ) {
                setError("mainImage.url", {
                  type: "custom",
                  message: `Image must be at least ${minImageWidth}x${minImageHeight} in size`,
                });
                setActiveImage(undefined);
                setActiveImageUrl(undefined);
              } else if (size.naturalWidth > minImageWidth) {
                setMaxZoom(size.naturalWidth / minImageWidth);
              }
              URL.revokeObjectURL(activeImageUrl);
            }}
          />
        )}
      </FormControl>
    </AspectRatio>
  );
};
