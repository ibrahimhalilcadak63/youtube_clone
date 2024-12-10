import { createContext, useEffect, useState } from "react";
import api from "../pages/utils/api";
import { categories } from "../constants";

//* 1) Context temelini oluşturur.
export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  useEffect(() => {
    //* seçilen type belirle
    const type = selectedCategory.type;
    //* seçilen kategorinin type ı "menü" ise fonksiyonu durdurur.
    if (type === "menu") return;
    //* yüklemeyi trueya çek
    setIsLoading(true);
    //* İstek atacağımız url'i belirler
    const url =
      type === "home"
        ? "/home"
        : type === "trending"
        ? "/trending"
        : type === "category"
        ? `/search?query=${selectedCategory.name} `
        : "";
    //* api'ya istek at ve durumu bildir.
    api
      .get(url)
      .then((res) => setVideos(res.data?.data))
      .catch((error) => setError(error.message))
      .finally(() => setIsLoading(false));
  }, [selectedCategory]);
  //api'ye yeniden istek at
  return (
    <VideoContext.Provider
      value={{
        videos,
        error,
        isLoading,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};