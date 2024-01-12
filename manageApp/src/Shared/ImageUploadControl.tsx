import { useEffect, useState } from "react";
import {
  Flex,
  Center,
  Text,
  FormControl,
  AspectRatio,
  Alert,
  Button,
  Box,
} from "@chakra-ui/react";
import Cropper from "react-easy-crop";
import { useDropzone } from "react-dropzone";
import {
  UseFormRegisterReturn,
  FieldError,
  ErrorOption,
} from "react-hook-form";
import { ImageUploadData } from "./UploadImage";

const ImageUploadControl = ({
  registerProps,
  error,
  setError,
  setValue,
  minImageWidth,
  minImageHeight,
  aspect,
}: {
  registerProps: UseFormRegisterReturn;
  error: FieldError | undefined;
  setError: (e: ErrorOption) => void;
  setValue: (e: ImageUploadData) => void;
  minImageWidth: number;
  minImageHeight: number;
  aspect: number;
}) => {
  const [activeImage, setActiveImage] = useState<File>();
  const [activeImageUrl, setActiveImageUrl] = useState<string>();

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [maxZoom, setMaxZoom] = useState(3);

  useEffect(() => {
    if (typeof activeImage === "undefined") {
      if (typeof activeImageUrl !== "undefined") {
        URL.revokeObjectURL(activeImageUrl);
      }
      setActiveImageUrl(undefined);
    } else {
      setActiveImageUrl(URL.createObjectURL(activeImage));
    }
  }, [activeImage]);

  useEffect(() => {
    return () => {
      if (typeof activeImageUrl !== "undefined") {
        URL.revokeObjectURL(activeImageUrl);
      }
    };
  }, [activeImageUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        setError({
          type: "custom",
          message: rejectedFiles[0].errors[0].message,
        });
      } else {
        setActiveImage(acceptedFiles[0]);
      }
    },
    multiple: false,
    accept: { "image/*": [".png", ".gif", ".jpeg", ".jpg"] },
    disabled: typeof activeImage !== "undefined",
  });

  const errorDisplay = error ? (
    <Alert status="error">{error.message}</Alert>
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

  const resetDisplay = (
    <Button
      type="button"
      variant="outline"
      onClick={() => setActiveImage(undefined)}
      leftIcon={<span className="material-symbols-outlined">hide_image</span>}
    >
      Change Image
    </Button>
  );

  return (
    <Box>
      <AspectRatio ratio={1.5} margin="10px">
        <FormControl
          isInvalid={typeof error !== "undefined"}
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
              onCropComplete={(_croppedArea, croppedAreaPixels) => {
                if (typeof activeImage !== "undefined") {
                  setValue({
                    imageFile: activeImage,
                    imageURL: activeImageUrl,
                    cropArea: croppedAreaPixels,
                  });
                }
              }}
              onMediaLoaded={(size) => {
                if (
                  size.naturalWidth < minImageWidth ||
                  size.naturalHeight < minImageHeight
                ) {
                  setError({
                    type: "custom",
                    message: `Image must be at least ${minImageWidth}x${minImageHeight} in size`,
                  });
                  setActiveImage(undefined);
                } else if (size.naturalWidth > minImageWidth) {
                  setMaxZoom(size.naturalWidth / minImageWidth);
                }
              }}
            />
          )}
        </FormControl>
      </AspectRatio>
      {typeof activeImage === "undefined" ? <></> : resetDisplay}
    </Box>
  );
};

export default ImageUploadControl;
