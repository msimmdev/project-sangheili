enum MediaType {
  Image,
  YouTube,
}

type Media = {
  url: string;
  type: MediaType;
};

export { MediaType };
export default Media;
