import { FileToLoad } from "../Type/FileToLoad";

export function loadImage({file, setImage, setOpen}: FileToLoad) {
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") {
      setImage(reader.result);
    }
  };
  reader.readAsDataURL(file);
  setOpen(true);
}


export default loadImage;
