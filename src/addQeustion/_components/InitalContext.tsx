import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type genericFetchData = {
  id: number;
  attributes: {
    name: string;
    slug: string;
    title?: string;
  };
};

type InitDataContextType = {
  subjectTagData: genericFetchData[];
  topicTagData: genericFetchData[];
  examCategoryData: genericFetchData[];
  tExamsData: genericFetchData[];
};

const fetchDataFunc = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer 396dcb5c356426f8c3ce8303bcdc6feb5ecb1fd4aa4aaa59e42e1c7f82b6385cf4107d023cc58cfd61294adb023993a8e58e0aad8759fbf44fc020c1ac02f492c9d42d1f7dc12fc05c8144fbe80f06850c79d4b823241c83c5e153b03d1f8d0316fb9dec1a531c0df061e1f242bab549f17f715b900ba9546f6a6351fdd7dfa8",
    },
  });
  const data = await response.json();
  return data;
};

const InitialDataContext = createContext({} as InitDataContextType);

export function InitialDataContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [data, setData] = useState({} as InitDataContextType);
  useEffect(() => {
    async function dummy() {
      const subjectData = await fetchDataFunc(
        `${import.meta.env.VITE_BASE_URL}test-series-subjects?[fields][0]=name&[fields][1]=slug`
      );
      const topicData = await fetchDataFunc(
        `${import.meta.env.VITE_BASE_URL}t-topics?[fields][0]=name&[fields][1]=slug`
      );
      const examCategoryData = await fetchDataFunc(
        `${import.meta.env.VITE_BASE_URL}t-categories?populate=*`
      );
      const tExamsData = await fetchDataFunc(
        `${import.meta.env.VITE_BASE_URL}t-exams?populate=*`
      );
      setData({
        subjectTagData: subjectData.data,
        topicTagData: topicData.data,
        examCategoryData: examCategoryData.data,
        tExamsData: tExamsData.data,
      });
    }
    dummy();
  }, []);
  return (
    <InitialDataContext.Provider value={data}>
      {children}
    </InitialDataContext.Provider>
  );
}

const useInitialDataContext = () => useContext(InitialDataContext);
export default useInitialDataContext;
