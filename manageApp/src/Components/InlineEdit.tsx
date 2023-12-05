import {
  Text,
  Textarea,
  useBoolean,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default ({
  defaultValue,
  onSubmit,
}: {
  defaultValue?: string;
  onSubmit: (nextValue: string) => Promise<void>;
}) => {
  const [currentValue, setCurrentValue] = useState(defaultValue ?? "");
  const [textValue, setTextValue] = useState("");
  const [isEditing, setIsEditing] = useBoolean(false);

  useEffect(() => {
    if (isEditing) {
      setTextValue(currentValue);
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <>
        <Textarea
          value={textValue}
          width="100%"
          rows={5}
          onChange={(event) => setTextValue(event.target.value)}
        />
        <ButtonGroup justifyContent="end" size="sm" w="full" spacing={2} mt={2}>
          <IconButton
            icon={<span className="material-symbols-outlined">done</span>}
            aria-label="Save"
            onClick={() => {
              onSubmit(textValue).then(() => {
                setCurrentValue(textValue);
                setIsEditing.off();
              });
            }}
          />
          <IconButton
            icon={<span className="material-symbols-outlined">close</span>}
            aria-label="Cancel"
            onClick={() => setIsEditing.off()}
          />
        </ButtonGroup>
      </>
    );
  } else {
    return <Text onClick={() => setIsEditing.on()}>{currentValue}</Text>;
  }
};
